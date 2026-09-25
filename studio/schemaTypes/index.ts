import { defineType, type SchemaTypeDefinition } from "sanity";
import { mediaTypeForField } from "../media-fields";

// Keep content editable without allowing script URLs in links, images, or files.
export function safeLink(value: unknown, options: { relative?: boolean; email?: boolean } = {}) {
  if (value === undefined || value === null || value === "") return true;
  if (typeof value !== "string" || /[\u0000-\u0020\\]/.test(value)) return "Enter a valid link without spaces or backslashes.";
  if (options.relative && (/^\/(?!\/)/.test(value) || /^#[a-zA-Z][\w-]*$/.test(value))) return true;
  if (options.email && /^(mailto:[^\s@]+@[^\s@]+|tel:\+?[\d().-]+)$/i.test(value)) return true;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password
      ? true
      : "Use an http(s) URL, a site path, or a section link.";
  } catch {
    return "Use a complete http(s) URL, a site path, or a section link.";
  }
}

// The same item type is used inside every object array so the migration can
// generate `_type: "item"` and stable `_key` values without duplicated models.
type Field = { name: string; type: string } & Record<string, any>;
const text = (name: string, title: string, options: { long?: boolean; optional?: boolean; description?: string } = {}): Field => ({
  name, title, type: options.long ? "text" : "string",
  ...(options.long ? { rows: 3 } : {}),
  ...(options.description ? { description: options.description } : {}),
  ...(!options.optional ? { validation: (Rule: any) => Rule.required() } : {})
});
const link = (name: string, title: string, options: { optional?: boolean; relative?: boolean; email?: boolean } = {}): Field => ({
  name, title, type: "string",
  validation: (Rule: any) => (options.optional ? Rule : Rule.required()).custom((value: unknown) => safeLink(value, options))
});
const media = (name: string, title: string, optional = false): Field => ({
  name, title, type: mediaTypeForField(name)!,
  ...(!optional ? { validation: (Rule: any) => Rule.required() } : {})
});
const object = (name: string, title: string, fields: Field[], group?: string): Field => ({
  name, title, type: "object", fields,
  ...(group ? { group } : {}),
  validation: (Rule: any) => Rule.required(),
  options: { collapsible: true, collapsed: false }
});
const strings = (name: string, title: string, min = 0): Field => ({
  name, title, type: "array", of: [{ type: "string", validation: (Rule: any) => Rule.required() }],
  validation: (Rule: any) => min > 0 ? Rule.required().min(min) : Rule,
  options: { sortable: true }
});
const list = (name: string, title: string, fields: Field[], options: { group?: string; min?: number; preview?: string; description?: string; validate?: (value: any[]) => true | string } = {}): Field => ({
  name, title, type: "array", group: options.group, description: options.description,
  options: { sortable: true },
  of: [{
    name: "item", type: "object", title: title.replace(/s$/, ""), fields,
    preview: { select: { title: options.preview || "title" } }
  }],
  validation: (Rule: any) => {
    let rule = options.min ? Rule.required().min(options.min) : Rule;
    if (options.validate) rule = rule.custom((value: any[] | undefined) => value ? options.validate!(value) : true);
    return rule;
  }
});
const choice = (name: string, title: string, values: string[], optional = false): Field => ({
  name, title, type: "string", options: { list: values },
  validation: (Rule: any) => optional ? Rule : Rule.required()
});
const number = (name: string, title: string, options: { min?: number; max?: number; integer?: boolean; optional?: boolean } = {}): Field => ({
  name, title, type: "number",
  validation: (Rule: any) => {
    let rule = options.optional ? Rule : Rule.required();
    if (options.min !== undefined) rule = rule.min(options.min);
    if (options.max !== undefined) rule = rule.max(options.max);
    return options.integer ? rule.integer() : rule;
  }
});
const unique = (field: string) => (items: Record<string, unknown>[]) => {
  const values = items.map((item) => item[field]);
  return new Set(values).size === values.length || `${field} must be unique for each entry.`;
};

function mediaSchema(name: "siteImage" | "siteFile" | "siteMedia", title: string): SchemaTypeDefinition {
  const image = name !== "siteFile";
  const file = name !== "siteImage";
  return defineType({
    name, title, type: "object",
    description: "Upload a replacement or retain the existing path below. An upload takes priority over the path. Clear the upload to use the path again.",
    fields: [
      ...(image ? [{ name: "image", title: "Upload image", type: "image", options: { hotspot: true, accept: "image/*" } }] : []),
      ...(file ? [{ name: "file", title: name === "siteMedia" ? "Upload video" : "Upload file", type: "file", options: { accept: name === "siteMedia" ? "video/mp4,video/webm,video/quicktime" : ".pdf" } }] : []),
      {
        name: "path", title: "Existing path or URL", type: "string",
        description: name === "siteFile"
          ? "Use an existing /path/to/file.pdf or a complete http(s) URL. An uploaded file takes priority."
          : "Use an existing /assets/photo.jpg, /demos/video.mp4, or https://cdn.sanity.io/ asset URL. Upload images from other websites using the field above.",
        validation: (Rule: any) => Rule.custom((value: unknown) => {
          if (value === undefined || value === null || value === "") return true;
          const validLink = safeLink(value, { relative: true });
          if (validLink !== true) return validLink;
          if (typeof value !== "string" || value.startsWith("#")) return "Use a file path or URL, not a section link.";
          if (value.startsWith("/") || name === "siteFile") return true;
          const url = new URL(value);
          const allowedCdn = url.protocol === "https:" && url.hostname === "cdn.sanity.io" && (name === "siteImage" ? /^\/images\// : /^\/(images|files)\//).test(url.pathname);
          if (!allowedCdn) return "Use a site path or Sanity CDN URL, or upload this asset above.";
          if (name === "siteMedia" && url.pathname.startsWith("/files/") && !/\.(mp4|webm|mov)$/i.test(url.pathname)) return "Video URLs must end in .mp4, .webm, or .mov. Upload images in the image field.";
          return true;
        })
      }
    ],
    validation: (Rule) => Rule.custom((value: any) => {
      if (!value) return true;
      if (value.image?.asset && value.file?.asset) return "Choose an image OR a video, then remove the other upload.";
      if (name === "siteMedia" && value.file?.asset?._ref && !/-(mp4|webm|mov)$/i.test(value.file.asset._ref)) return "Upload an MP4, WebM, or MOV video. Use the image upload for images.";
      if (!value.image?.asset && !value.file?.asset && !value.path) return "Upload an asset or enter an existing path.";
      return true;
    }),
    preview: {
      select: { path: "path", image: "image", file: "file.asset.originalFilename" },
      prepare: ({ path, image: previewImage, file: filename }: any) => ({ title: previewImage ? "Uploaded image" : filename || path || title, media: previewImage })
    }
  });
}

const metricFields = [
  number("value", "Value", { min: 0 }),
  text("label", "Label"),
  text("prefix", "Prefix", { optional: true }),
  text("suffix", "Suffix", { optional: true }),
  number("decimals", "Decimal places", { min: 0, max: 5, integer: true, optional: true }),
  text("detail", "Supporting detail", { optional: true })
];
const metricSource = { ...choice("source", "Value source", ["manual", "followers"], true), description: "Choose followers for the live audience total; manual uses the value above. This follows the card when reordered." };
const heading = (name: string, title: string, hasTitle = true, hasNote = true) => object(name, title, [
  text("eyebrow", "Small heading"),
  ...(hasTitle ? [text("title", "Main heading")] : []),
  ...(hasNote ? [text("note", "Supporting copy", { long: true })] : [])
]);

export const siteContent = defineType({
  name: "siteContent",
  title: "Website content",
  type: "document",
  groups: [
    { name: "general", title: "Home & navigation", default: true },
    { name: "about", title: "About" },
    { name: "projects", title: "Projects" },
    { name: "experience", title: "Experience & skills" },
    { name: "community", title: "Community" },
    { name: "media", title: "Reels & LinkedIn" },
    { name: "creative", title: "AI creative" },
    { name: "contact", title: "Contact & résumé" },
    { name: "headings", title: "Section headings" }
  ],
  fields: [
    object("branding", "Name & footer", [
      text("name", "Display name"), text("shortName", "First name"),
      text("footerName", "Footer name"), text("location", "Footer location")
    ], "general"),
    list("navItems", "Navigation links", [
      text("label", "Label"), link("href", "Destination", { relative: true })
    ], { group: "general", preview: "label", validate: unique("href") }),
    object("hero", "Homepage introduction", [
      text("eyebrow", "Small heading"), text("availability", "Availability"),
      text("headline", "Headline", { long: true }), text("subheadline", "Introduction", { long: true }),
      text("locationLine", "Location line"), text("originLabel", "Globe origin label"), text("networkLabel", "Globe network label")
    ], "general"),
    list("impactMetrics", "Homepage statistics", [...metricFields, metricSource], { group: "general", preview: "label" }),
    list("cities", "Globe locations", [
      text("name", "Location name"), number("lat", "Latitude", { min: -90, max: 90 }),
      number("lng", "Longitude", { min: -180, max: 180 }),
      { name: "home", title: "Origin location", type: "boolean", description: "Select this for the location where routes begin. Keep exactly one origin." },
      choice("marker", "Marker style", ["origin", "work", "purpose", "inspired", "network"]),
      object("label", "Label placement", [choice("side", "Label side", ["left", "right"]), number("offsetY", "Vertical offset", { optional: true })]),
      object("story", "Location story", [
        text("eyebrow", "Small heading"), text("title", "Title"), text("metric", "Evidence"),
        text("detail", "Description", { long: true }), link("href", "Destination", { relative: true })
      ])
    ], { group: "general", min: 1, preview: "name", validate: (items) => unique("name")(items) !== true ? "Location names must be unique." : items.filter((item) => item.home).length === 1 || "Choose exactly one origin location." }),
    object("about", "About you", [
      strings("lines", "Introduction paragraphs", 1),
      list("pillars", "Strengths", [text("word", "Heading"), text("line", "Description", { long: true }), text("proof", "Evidence"), text("signal", "Supporting detail")], { preview: "word" }),
      media("portrait", "Portrait"), text("portraitAlt", "Portrait description for accessibility"), text("portraitCaption", "Portrait caption")
    ], "about"),
    list("projects", "Projects", [
      { ...text("slug", "Unique project ID", { description: "Use lowercase words separated by hyphens. Keep this stable when changing a title." }), validation: (Rule: any) => Rule.required().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { name: "lowercase-hyphenated-id" }) },
      text("title", "Title"), text("description", "Short description", { long: true }), text("summary", "Expanded description", { long: true }),
      media("media", "Demo image or video", true), media("poster", "Video poster", true),
      media("contextImage", "Context image", true), text("contextAlt", "Context image description", { optional: true }), text("contextCaption", "Context image caption", { optional: true }),
      strings("tags", "Technology tags"),
      { name: "disciplines", title: "Project categories", type: "array", of: [{ type: "string" }], options: { list: ["ai", "automation", "creative"] }, validation: (Rule: any) => Rule.required().min(1).unique() },
      text("proof", "Evidence label"), text("outcome", "Outcome", { long: true }),
      list("stack", "System layers", [text("label", "Layer"), text("tool", "Tools"), text("responsibility", "Responsibility", { long: true })], { preview: "label" }),
      text("decision", "Engineering decision", { long: true }), text("next", "Next step", { long: true }),
      link("link", "Demo, repository, or case study URL", { optional: true, relative: true }), text("linkLabel", "Link label", { optional: true })
    ], { group: "projects", min: 1, validate: unique("slug"), description: "Drag entries to set display order. A blank demo keeps the existing demo-on-request placeholder." }),
    list("projectFocusOptions", "Project filters", [
      choice("value", "Filter", ["all", "ai", "automation", "creative"]), text("label", "Label"),
      text("summary", "Description", { long: true }), strings("signals", "Highlights")
    ], { group: "projects", min: 1, preview: "label", validate: (items) => unique("value")(items) !== true ? "Each filter may appear only once." : items.some((item) => item.value === "all") || "Keep an All Work filter." }),
    list("experiences", "Experience", [
      text("company", "Company"), text("role", "Role"), text("dates", "Dates"),
      text("summary", "Summary", { long: true }), strings("details", "Responsibilities and achievements", 1)
    ], { group: "experience", preview: "company" }),
    list("skillGroups", "Skill groups", [text("title", "Category"), strings("skills", "Skills", 1)], { group: "experience" }),
    object("education", "Education", [text("summary", "Education summary", { long: true }), text("coursework", "Relevant coursework", { long: true, optional: true })], "experience"),
    object("certificate", "Featured certificate", [
      media("image", "Certificate image"), text("imageAlt", "Image description"), media("file", "Certificate PDF"),
      text("eyebrow", "Issuer and date"), text("title", "Certificate title"), text("description", "Description", { long: true }),
      link("verificationUrl", "Verification URL")
    ], "experience"),
    object("community", "Community & award", [
      text("title", "Community name"), text("role", "Your role"), text("copy", "Description", { long: true }),
      media("crest", "Community logo"), media("watermark", "Background watermark"), strings("built", "What you built"),
      media("photo", "Community photo"), text("photoAlt", "Photo description"), text("photoCaption", "Photo caption"), text("photoLabel", "Photo label"),
      text("award", "Award or recognition"), text("awardOrganization", "Award organization"),
      list("links", "Community links", [text("label", "Label"), link("url", "URL")], { preview: "label" }),
      object("campaign", "Campaign highlight", [
        text("eyebrow", "Small heading"), text("title", "Campaign name"), text("copy", "Description", { long: true }),
        media("photo", "Campaign photo or TV still", true), text("photoAlt", "Photo description", { optional: true }), text("photoCaption", "Photo caption", { optional: true }),
        list("stats", "Campaign facts", [text("value", "Value"), text("label", "Label")], { preview: "label" })
      ])
    ], "community"),
    list("communityMetrics", "Community statistics", [...metricFields, metricSource], {
      group: "community", preview: "label", min: 1,
      description: "Choose the followers value source for the live audience counter. Manual cards show the values entered here. Cards can be renamed and reordered."
    }),
    list("reels", "Featured reels", [
      text("id", "Unique reel ID"), link("url", "Reel URL"), text("title", "Title"), text("platform", "Platform"),
      number("views", "Views", { min: 0, integer: true }), media("thumbnail", "Thumbnail")
    ], { group: "media", validate: unique("id") }),
    object("linkedIn", "LinkedIn highlights", [
      text("intro", "Introduction", { long: true }), text("description", "Description", { long: true }),
      link("outsidePerspectiveUrl", "Outside perspective URL"), text("outsidePerspectiveLabel", "Outside perspective label"),
      list("posts", "Embedded posts", [
        text("label", "Label"), text("title", "Accessible iframe title"), link("href", "Open post URL"),
        { name: "src", title: "LinkedIn embed URL", type: "string", description: "Paste the https://www.linkedin.com/embed/feed/update/... URL from LinkedIn's Embed this post option.", validation: (Rule: any) => Rule.required().custom((value: unknown) => {
          if (typeof value !== "string") return "Enter a LinkedIn embed URL.";
          try { const url = new URL(value); return url.protocol === "https:" && url.hostname === "www.linkedin.com" && url.pathname.startsWith("/embed/feed/update/") || "Use a LinkedIn embed URL beginning https://www.linkedin.com/embed/feed/update/."; }
          catch { return "Enter a LinkedIn embed URL."; }
        }) }
      ], { preview: "label", validate: unique("src") })
    ], "media"),
    object("creative", "AI creative work", [
      text("intro", "Introduction", { long: true }),
      list("capabilities", "Capabilities", [choice("icon", "Icon", ["sparkles", "layers", "clapperboard"]), text("top", "First line"), text("bottom", "Second line")], { preview: "top" }),
      text("storyEyebrow", "Story small heading"), text("storyTitle", "Story title"), text("storyDescription", "Story description", { long: true }),
      list("storyFrames", "Story frames", [media("image", "Image"), text("alt", "Image description"), text("label", "Label")], { preview: "label" }),
      text("workflowEyebrow", "Workflow small heading"), text("workflowTitle", "Workflow title"), text("workflowDescription", "Workflow description", { long: true }),
      strings("tools", "Creative tools"),
      list("workflow", "Workflow steps", [text("number", "Step number"), text("title", "Title"), text("copy", "Description", { long: true })]),
      text("kitEyebrow", "Design small heading"), text("kitTitle", "Design title"), text("kitDescription", "Design description", { long: true }),
      text("kitCaption", "Design image caption"), text("kitOutcome", "Design outcome"),
      list("kitViews", "Design images", [media("image", "Image"), text("alt", "Image description"), text("label", "View label"), text("stage", "Stage (e.g. AI concept, Produced)", { optional: true })], { min: 1, preview: "label" }),
      list("kitStats", "Design results", [text("value", "Value"), text("label", "Label")], { preview: "label" })
    ], "creative"),
    object("contact", "Contact details & résumé", [
      text("line", "Invitation", { long: true }),
      { name: "email", title: "Email address", type: "string", validation: (Rule: any) => Rule.required().email() },
      text("location", "Location"), link("linkedin", "LinkedIn URL"), link("github", "GitHub URL"), link("instagram", "Instagram URL"),
      media("resume", "Résumé PDF")
    ], "contact"),
    list("socialLinks", "Header and footer social links", [
      text("label", "Accessible label"), link("href", "URL", { email: true }),
      choice("network", "Icon", ["instagram", "facebook", "linkedin", "github"])
    ], { group: "contact", preview: "label", validate: unique("href") }),
    object("sectionHeadings", "Section headings", [
      heading("about", "About", false, false), heading("work", "Projects"), heading("experience", "Experience"),
      heading("community", "Community", false, false), heading("linkedIn", "LinkedIn"), heading("reels", "Reels"),
      heading("creative", "AI creative"), heading("contact", "Contact", true, false)
    ], "headings")
  ] as any,
  preview: { prepare: () => ({ title: "Website content", subtitle: "Edit, review, and publish your portfolio" }) }
});

export const schemaTypes: SchemaTypeDefinition[] = [
  mediaSchema("siteImage", "Image"), mediaSchema("siteFile", "File"), mediaSchema("siteMedia", "Image or video"), siteContent
];

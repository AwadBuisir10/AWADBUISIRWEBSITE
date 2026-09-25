import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

if (!projectId || !/^[a-z0-9-]+$/.test(projectId)) {
  throw new Error("Set SANITY_STUDIO_PROJECT_ID in studio/.env.local to your Sanity project ID. See docs/SANITY.md for setup.");
}

export default defineConfig({
  name: "portfolio",
  title: "Awad Buisir · Website",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) => S.list()
        .title("Website content")
        .items([
          S.listItem()
            .title("Edit website")
            .id("siteContent")
            .child(S.document().schemaType("siteContent").documentId("siteContent").title("Website content"))
        ])
    })
  ],
  schema: {
    types: schemaTypes,
    // Only the fixed document above may be created. New-document menus cannot
    // create duplicates that the website would never read.
    templates: (templates) => templates.filter((template) => template.schemaType !== "siteContent")
  },
  document: {
    newDocumentOptions: (options) => options.filter((option) => option.templateId !== "siteContent"),
    // Keep publishing and draft discard. Prevent accidental deletion,
    // duplication, or unpublishing of the website's only content document.
    actions: (actions, context) => context.schemaType === "siteContent"
      ? actions.filter((action) => action.action !== "delete" && action.action !== "duplicate" && action.action !== "unpublish")
      : actions,
    productionUrl: async () => process.env.SANITY_STUDIO_SITE_URL || "https://awadbuisir.com"
  }
});

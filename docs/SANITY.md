# Manage the portfolio with Sanity

Sanity stores the website's editable content. The Next.js website keeps its
existing layout, animations, and components; the separate Studio is the editing
dashboard. One **Edit website** document contains all of the site's content so
you can update several sections and publish them together.

The online CMS is connected and the current portfolio has been imported.

- **Live website:** https://awadbuisir.com
- **Editing dashboard:** https://awad-buisir-portfolio.sanity.studio/
- **Project:** Awad Buisir Portfolio (`b9m3jasj`)
- **Dataset:** `production` (public)
- **Workspace:** Awad Buisir (`okgln15h1`)
- **Studio application:** `p6fbqcqvwrdrvrh1bsz60oql`

The Vercel project `ab-11/awadbuisirwebsite` has the public Sanity project ID
and dataset configured for Production, Preview, and Development.

The import created the published website document and uploaded 25 images/files.
Demo videos retain their existing website paths. Sanity starts this project on a
$0 trial that automatically becomes Free; no paid upgrade was selected.

The setup steps below remain useful when configuring another computer.

## First-time setup

Use Node.js 24 LTS (or another version supported by Sanity, at least 22.12). Commands below run from the
website repository's root folder. The Studio has its own dependencies and
configuration in `studio/`.

### 1. Create the content project

1. Sign in at [Sanity's project manager](https://www.sanity.io/manage) and create
   a project, for example **Awad Buisir Portfolio**.
2. Create a dataset named **production** with **public** visibility. It holds
   content intended to appear on the public portfolio. Published content in a
   public dataset can be read without an API token; writes still require
   authorization. See [dataset visibility](https://www.sanity.io/docs/content-lake/datasets).
3. Copy the project's **Project ID**. This is a public identifier, not a password.

The Studio is already built in this repository, so you do not need to generate a
second Studio with a starter template.

### 2. Connect the website and Studio

Create local configuration files from the provided examples:

```bash
cp .env.example .env.local
cp studio/.env.example studio/.env.local
```

In the root `.env.local`, set:

```dotenv
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
```

In `studio/.env.local`, set the same project and dataset:

```dotenv
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_SITE_URL=https://awadbuisir.com
```

The optional site URL controls Studio's **Open preview** link. For local
checking, you can use `http://localhost:3000` instead. This link opens the
published website; it does not preview unpublished drafts.

In the project's API settings, check that `http://localhost:3333` is an allowed
CORS origin with **Allow credentials** enabled. Add that exact origin if needed.
The website reads content on its server, so its public domain does not need a
browser CORS entry for this integration. See [Sanity's CORS guide](https://www.sanity.io/docs/content-lake/cors).

### 3. Import the current portfolio

Install the website dependencies and inspect the local export first:

```bash
npm install
npm run cms:export
```

The export writes `work/sanity/site-content.ndjson`. It makes no changes to
Sanity and works without a project ID or token. The file contains the existing
text, ordered lists, and local media paths, ready for the import process.

You can import using an existing Sanity CLI login without creating or storing a
separate write token:

```bash
cd studio
npx sanity login
cd ..
npm run cms:seed:login
```

The login-based command passes authentication to the importer only in memory.
This website has already been imported, so it will safely report that the
content exists and leave your edits unchanged.

Alternatively, in your Sanity project's API settings, create an API token with **Editor**
permission for the one-time import. Add it to the root `.env.local`:

```dotenv
SANITY_API_WRITE_TOKEN=your_editor_token
```

Then run:

```bash
npm run cms:seed
```

The import uploads local images and PDFs, preserves local demo-video URLs,
and creates the published `siteContent` document from the current portfolio.
Run it before opening a blank document in Studio. It uses `createIfNotExists`,
and stops if a published document or draft already exists, so running it again
does not overwrite edits. It checks referenced local files before uploading.

To upload the existing videos as well, use `npm run cms:seed -- --upload-videos`
on the first import. The default keeps these larger files on the website host.

Keep `.env.local` files out of Git. Never put a write or read token in a variable
starting with `SANITY_STUDIO_` or `NEXT_PUBLIC_`: those prefixes expose values to
the browser. Remove the import token from your local file when finished; it is
not required for everyday editing or the public website. Sanity documents token
handling in its [authentication guide](https://www.sanity.io/docs/content-lake/http-auth).

### 4. Open the dashboard and website

```bash
npm run studio:install
npm run studio
```

Open [Studio on localhost:3333](http://localhost:3333), sign in with the Sanity
account that owns the project, and select **Edit website**. In another terminal,
run `npm run dev` and open [the website on localhost:3000](http://localhost:3000).

## Edit and publish

1. Open Studio and choose **Edit website**.
2. Open the relevant section, edit text or upload replacement media, and use the
   list controls to add, remove, or reorder items.
3. Fix any validation errors shown by Studio. Check links and image descriptions.
4. Select **Publish** to update the live content.
5. Open the website to review it. The server cache revalidates after 60 seconds
   when the page receives a request. A first request can still show the cached
   version while it refreshes; wait briefly and reload again if needed.

Studio saves edits as a draft while you work. The website requests published
content only, so saving an edit does not make it live. Publishing applies the
whole website document, including any other pending edits in it. To abandon
unpublished edits, use Studio's discard-changes action.

Content updates do not require rebuilding or redeploying the website. A webhook
is not required for this cache-based setup. This implementation does not include
live visual editing or draft preview.

### What can be edited

Use these tabs in **Edit website**:

| Studio tab | Content |
| --- | --- |
| Home & navigation | Display name and footer, menu links, availability, headline, introduction, impact statistics, globe cities and stories |
| About | About copy, supporting pillars, portrait and caption |
| Projects | Project summaries, tags, filters, evidence, stack layers, links, demo media |
| Experience & skills | Employers, roles, dates, bullet points, skill groups, education, certificate image and PDF |
| Community | LibyanClub copy, logos, photo, award, links, milestones |
| Reels & LinkedIn | Featured reels, cover images, view counts, LinkedIn posts and supporting copy |
| AI creative | Gallery images, captions, tools, process steps, kit images |
| Contact & résumé | Email, location, profiles, social links, resume |
| Section headings | Section titles, introductory labels, and notes |

Lists follow the order set in Studio. A few fields connect to the site's existing
interactions:

- Keep existing section anchor links such as `#work` and `#contact` when changing
  their labels.
- Give each project a unique lowercase ID with hyphens, such as
  `new-project-name`, and keep it stable when changing its title. Choose project
  categories from the available options and retain the **All Work** filter.
- Keep exactly one globe location marked as the origin.
- LinkedIn embeds require a URL beginning
  `https://www.linkedin.com/embed/feed/update/`. Use the URL from LinkedIn's
  embed option, not the regular post page URL; the regular URL has its own field.
- The Community statistic with **Value source → followers** displays the live
  audience counter, even if you rename or reorder it. Use **manual** for campaign
  milestones.

Live follower counts still come from the site's existing public-profile scraper.
Editing a campaign milestone does not change the live follower total. Scraper
profile identities, fallback counts, and polling settings remain in
`data/socialCounts.ts`; see the main [README](../README.md#public-follower-counts).

### Images, videos, and resume

- Upload replacement images directly in Studio and provide useful alt text where
  a description field is available. A selected upload takes precedence over the
  preserved local path.
- Local paths refer to files in the website's `public/` folder. For example,
  `/assets/example.jpg` refers to `public/assets/example.jpg`. Changing the text
  of a path does not upload a file.
- For images, use Studio uploads or existing local paths. Arbitrary external
  image hosts are not enabled in the website's image configuration.
- Existing MP4 demos remain served by the website after the initial import.
  A project can use an uploaded image or file as replacement media. Include a
  poster image for videos so the first frame remains useful before playback.
- Upload a new PDF in the contact resume field to replace the download. The
  original bundled PDF remains the fallback until an upload is selected.

## Connect the deployed website

Add these environment variables to the website's hosting project, using the same
values as your local setup:

```dotenv
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
```

Redeploy the website once after adding or changing environment variables. Future
published content changes use the cache refresh and do not need a deployment.
Do not add the migration write token to the website host.

The recommended public dataset does not need a read token. If you deliberately
choose a private dataset instead, create a read-only token and add
`SANITY_API_READ_TOKEN` to the website's local and hosted environment. Keep it
server-side. Private dataset behavior and access are described in
[Sanity's dataset documentation](https://www.sanity.io/docs/content-lake/datasets).

## Make Studio available from any computer

The Studio can run locally, or you can host it at a chosen `*.sanity.studio`
address. To use Sanity hosting:

```bash
npm run studio:build
npm run studio:deploy
```

Sign in when prompted and choose an available hostname, such as
`awad-buisir-portfolio.sanity.studio`. The hostname is only an example until you
register it. Sanity handles the hosted Studio's origin configuration. If the
deploy command gives you an app ID, store it as `SANITY_STUDIO_APP_ID` in
`studio/.env.local` for later deployments. See the official
[Studio hosting guide](https://www.sanity.io/docs/studio/deployment).

Use the deployed Studio URL for daily editing. Redeploy Studio when its fields or
configuration change; ordinary content publishing does not need a Studio deploy.

## Troubleshooting and recovery

| Symptom | Check |
| --- | --- |
| Website still shows the original content | Confirm the hosted project ID and dataset, redeploy after environment changes, and verify `siteContent` has a published version. |
| A published edit has not appeared yet | Give the cache at least 60 seconds, request the page, and reload after the refresh. Confirm Studio and website use the same project and dataset. |
| Studio reports a missing project ID | Set `SANITY_STUDIO_PROJECT_ID` in `studio/.env.local`, then restart Studio. |
| Studio cannot sign in or save | Check project membership and the exact Studio CORS origin with credentials allowed. |
| Import is unauthorized | Check the root project ID, dataset, and `SANITY_API_WRITE_TOKEN` with Editor permission. |
| Import says the document already exists | It found published content or a draft and deliberately left it unchanged. Continue editing that document in Studio. |
| Private dataset content does not load | Check the server-only `SANITY_API_READ_TOKEN` and its access to the dataset. |
| An image is missing | Upload it in Studio or confirm its local path exists under `public/`; unsupported external image hosts are not enabled. |

The website retains the bundled content as a fallback when Sanity is
unconfigured, the content document is missing, or an initial fetch fails. During
a failed cache refresh, Next.js can continue serving the last successful read.
Keep the
original `data/` files and public assets in the repository. Removing an upload
reveals its preserved local path. To remove optional media entirely, remove the
whole optional field. Required media must have an upload or a valid path.

The Studio intentionally hides delete, duplicate, and unpublish actions for the
single website document. Use draft edits and Publish for routine changes. Do not
delete the dataset to reset a section.

## Verify the integration

After installing website and Studio dependencies:

```bash
npm test
npm run typecheck
npm run cms:validate
npm run build
npm --prefix studio run typecheck
npm run studio:build
```

`cms:validate` checks the full exported portfolio against the actual Studio
schema without making network requests. The tests cover preserving existing
content, uploaded media, adding and removing entries, empty sections, and the
existing follower-count behavior. Studio needs its project ID to run; its code
can be built and structurally checked before the online project is connected.

## Source control after activation

The live website was deployed from the current local repository. Existing local
edits and the CMS implementation remain uncommitted; the GitHub branch was not
changed. Before a future Git-triggered deployment, commit and push the reviewed
website changes together so that deployment includes the Sanity integration.
Everyday content edits in Studio do not require a Git commit or deployment.

## Push local content changes to Sanity

`cms:seed` only creates the document once. After editing `data/*.ts`, sync the
differences into the published document instead:

```bash
npm run cms:sync                                 # dry run: lists every field that would change
npm run cms:sync:login -- --apply                # publish, using your `sanity login`
npm run cms:sync:login -- --apply --resume       # also upload public/Awad_Buisir_Resume.pdf
```

Local text, numbers, and lists win. Images already uploaded to Sanity are kept
when their path is unchanged; new images are uploaded from `public/` (videos
keep their site URLs). The sync refuses to run while Studio has an unpublished
draft, and refuses to write if the document changed after it was read. Sanity
keeps every previous revision in the document history.

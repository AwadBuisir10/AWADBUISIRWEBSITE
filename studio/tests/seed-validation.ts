/**
 * Validate the exported migration with the same built-in and custom validators
 * as Studio. Every network method throws, so this is safe before project setup.
 * Run `npm run cms:export` in the website, then `npm --prefix studio run validate:seed`.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createSchema, type SanityDocument } from "sanity";
import { validateDocument, type ValidationClient } from "@sanity/validation";
import { schemaTypes } from "../schemaTypes";

const networkDisabled = () => { throw new Error("Network access is disabled during seed validation."); };
const offlineClient = {
  fetch: networkDisabled,
  getDataUrl: () => "https://invalid.invalid",
  observable: { fetch: networkDisabled, request: networkDisabled },
  withConfig() { return this; }
} as unknown as ValidationClient;
const schema = createSchema({ name: "portfolio-migration-check", types: schemaTypes });

async function validate(seed: Record<string, any>) {
  return validateDocument({
    document: seed as SanityDocument,
    schema,
    client: offlineClient,
    customValidation: true,
    // The dry-run migration deliberately uses existing paths and has no asset
    // references. Checking an unexpected reference must not silently succeed.
    getDocumentExists: async () => { throw new Error("Unexpected remote reference in the path-only export."); }
  });
}

async function main() {
  const filename = path.resolve(__dirname, "../../work/sanity/site-content.ndjson");
  const source = await readFile(filename, "utf8");
  const documents = source.trim().split("\n").map((line) => JSON.parse(line));
  assert.equal(documents.length, 1, "Expected exactly one siteContent document");
  const seed = documents[0];
  assert.equal(seed._id, "siteContent");
  const result = await validate(seed);
  assert.equal(result.status, "passed", JSON.stringify(result.markers, null, 2));
  assert.deepEqual(result.markers, []);

  // Verify validation actually runs: missing required content, an unsafe link,
  // and a repeated project ID must each stop publication.
  const invalid = structuredClone(seed);
  delete invalid.hero.headline;
  invalid.projects[0].link = "javascript:alert(1)";
  invalid.projects.push({ ...structuredClone(seed.projects[0]), _key: "duplicate-slug-test" });
  const rejected = await validate(invalid);
  assert.equal(rejected.status, "failed");
  assert.equal(rejected.markers.length, 3, JSON.stringify(rejected.markers, null, 2));
  assert(rejected.markers.some((marker) => marker.code === "value.required"));
  assert(rejected.markers.some((marker) => marker.message.includes("must be unique")));
  assert(rejected.markers.some((marker) => marker.message.includes("http(s)")));

  const unsupportedVideo = structuredClone(seed);
  unsupportedVideo.projects[0].media.path = "https://cdn.sanity.io/files/localcheck/production/example.pdf";
  const videoResult = await validate(unsupportedVideo);
  assert.equal(videoResult.status, "failed");
  assert(videoResult.markers.some((marker) => marker.message.includes("Video URLs")));

  console.log("Seed passes Studio validation, including required fields, URLs, media paths, unique IDs, and custom rules. Invalid fixtures are rejected. No network requests were made.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

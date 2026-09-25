import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { getCliClient } from 'sanity/cli';

const { projectId, dataset, token } = getCliClient({ apiVersion: '2026-09-01' }).config();
if (!token) throw new Error('Run sanity login, then run this command with --with-user-token.');
const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
// Pass the existing login only in this child process's environment. It is never
// written to a file or exposed to the Studio/public website bundles.
const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/seed-sanity.ts', ...process.argv.slice(2)], {
  cwd: repository,
  env: { ...process.env, SANITY_PROJECT_ID: projectId, SANITY_DATASET: dataset, SANITY_API_WRITE_TOKEN: token },
  stdio: 'inherit',
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;

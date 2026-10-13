/**
 * Checks every external project link (the "Visit website" and "Open app"
 * buttons) against the live site. Run before each release:
 *
 *   npm run check:links
 *
 * Exits with status 1 if any published project link does not return a
 * successful response, so a broken or login-protected link cannot ship silently.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { execFileSync } from 'node:child_process';

const DIR = 'src/content/projects';
const UA = 'Mozilla/5.0 (compatible; link-check/1.0)';

const entries = [];
for (const file of readdirSync(DIR)) {
  if (!file.endsWith('.yaml') || file.startsWith('_')) continue;
  const data = yaml.load(readFileSync(join(DIR, file), 'utf8'));
  if (data.status !== 'published') continue;
  for (const link of data.links ?? []) entries.push({ project: file.replace(/\.yaml$/, ''), ...link });
}

let failures = 0;
for (const { project, label, url } of entries) {
  // curl is used so the check follows the same proxy settings as the rest of the environment.
  let status = '---';
  try {
    status = execFileSync('curl', ['-sS', '-L', '-o', '/dev/null', '-w', '%{http_code}', '-A', UA, '-m', '25', url], { encoding: 'utf8' }).trim();
  } catch (e) {
    status = '---';
  }
  const ok = /^2\d\d$/.test(status);
  if (!ok) failures++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${status}  ${project} · ${label} · ${url}`);
}

if (entries.length === 0) console.log('No published project links to check.');
process.exit(failures ? 1 : 0);

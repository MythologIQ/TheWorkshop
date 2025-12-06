import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'public', 'assets', 'manifest.csv');

if (!fs.existsSync(manifestPath)) {
  console.error('Missing manifest:', manifestPath);
  process.exit(1);
}

const raw = fs.readFileSync(manifestPath, 'utf8');
const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);

if (lines.length <= 1) {
  console.log('Asset manifest is empty or has only headers. Nothing to check.');
  process.exit(0);
}

const headers = lines[0].split(',').map((header) => header.trim().toLowerCase());
const fileIndex = headers.findIndex((header) => header === 'file' || header === 'file_name');

if (fileIndex === -1) {
  console.error('Manifest is missing a "file" or "file_name" column.');
  process.exit(1);
}

const problems = [];

for (const rawLine of lines.slice(1)) {
  const columns = rawLine.split(',').map((col) => col.trim());
  const fileEntry = columns[fileIndex];
  if (!fileEntry) {
    problems.push({ reason: 'Empty file column', line: rawLine });
    continue;
  }
  const filePath = path.join(root, 'public', 'assets', fileEntry);
  if (!fs.existsSync(filePath)) {
    problems.push({
      reason: `Missing asset file ${fileEntry}`,
      path: path.relative(root, filePath),
    });
  }
}

if (problems.length > 0) {
  console.error('Asset check failed:');
  for (const problem of problems) {
    console.error(`- ${problem.reason} (${problem.path ?? 'unknown'})`);
  }
  process.exit(1);
}

console.log('Asset manifest check passed. All referenced files exist.');

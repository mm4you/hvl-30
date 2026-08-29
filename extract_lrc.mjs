import fs from 'node:fs';
import path from 'node:path';

const bundlePath = 'C:/Users/ungnh/.gemini/antigravity/brain/9ef6ca66-b0ef-40e4-bc5b-e2fd5f0eae53/.system_generated/steps/1055/content.md';
const content = fs.readFileSync(bundlePath, 'utf8');

// Find all track-xx definitions with LRC strings
console.log("Bundle length:", content.length);

// Extract LRC definitions
const matches = content.matchAll(/"(track-\d{2})":\s*(\[[^\]]+\]|`[^`]+`|\w+)/g);
for (const m of matches) {
  console.log("Found:", m[1]);
}
import fs from 'node:fs';

const bundlePath = 'C:/Users/ungnh/.gemini/antigravity/brain/9ef6ca66-b0ef-40e4-bc5b-e2fd5f0eae53/.system_generated/steps/1055/content.md';
const content = fs.readFileSync(bundlePath, 'utf8');

// Look at track-04 LRC content
const idx = content.indexOf('track-04');
console.log("Snippet around track-04:", content.slice(idx - 100, idx + 400));
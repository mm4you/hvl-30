import fs from 'node:fs';
import path from 'node:path';

const bundlePath = 'C:/Users/ungnh/.gemini/antigravity/brain/9ef6ca66-b0ef-40e4-bc5b-e2fd5f0eae53/.system_generated/steps/1055/content.md';
const content = fs.readFileSync(bundlePath, 'utf8');

// The bundle defines objects like:
// {trackId:`track-02`,title:`IDK`,...}
// Let's find all `{trackId:`track-XX`...}` blocks!

for (let i = 2; i <= 30; i++) {
  const trackId = `track-${String(i).padStart(2, '0')}`;
  const searchPattern = `trackId:\`${trackId}\``;
  const startIdx = content.indexOf(searchPattern);
  if (startIdx === -1) {
    console.log(`Could not find ${trackId}`);
    continue;
  }

  // Find the start of the object `{`
  let objStart = content.lastIndexOf('{', startIdx);
  // Find matching closing `}`
  let depth = 0;
  let objEnd = -1;
  for (let j = objStart; j < content.length; j++) {
    if (content[j] === '{') depth++;
    else if (content[j] === '}') {
      depth--;
      if (depth === 0) {
        objEnd = j + 1;
        break;
      }
    }
  }

  if (objEnd !== -1) {
    const rawObjCode = content.slice(objStart, objEnd);
    // Evaluate in a sandbox
    try {
      const obj = eval(`(${rawObjCode})`);
      console.log(`Successfully extracted ${trackId}: ${obj.title} (synced: ${obj.syncedLyrics?.length || 0}, lrc: ${Boolean(obj.lrc)})`);

      // Write out to data/lyrics/track-XX.ts
      const tsCode = `import type { TrackLyrics } from "./types";\n\nexport const ${trackId.replace("-", "")}Lyrics: TrackLyrics = ${JSON.stringify(obj, null, 2)};\n`;
      fs.writeFileSync(`D:/hvl-30/data/lyrics/${trackId}.ts`, tsCode, 'utf8');
    } catch (e) {
      console.error(`Error evaluating ${trackId}:`, e.message);
    }
  }
}
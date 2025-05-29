import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import { Base64 } from "https://deno.land/x/bb64@1.1.0/mod.ts";

// Load environment variables from .env.local
const env = await load({ envPath: ".env.local" });
const GOOGLE_API_KEY = env["GOOGLE_API_KEY"] || Deno.env.get("GOOGLE_API_KEY");

if (!GOOGLE_API_KEY) {
  console.error("Error: GOOGLE_API_KEY not found in .env.local file or environment variables");
  Deno.exit(1);
}

export async function getkeywords(image: string): Promise<string[]> {
  const body = {
    "contents": [{
      "parts": [
        {
          "text": "Analyze this image and provide descriptive keywords that could be used for a filename. Return only a comma-separated list of relevant keywords (no JSON, just keywords). Focus on the main subjects, objects, colors, and setting."
        },
        {
          "inline_data": {
            "mime_type": "image/jpeg",
            "data": image
          }
        }
      ]
    }],
    "generationConfig": {
      "temperature": 0.4,
      "topK": 32,
      "topP": 1,
      "maxOutputTokens": 100
    }
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      console.log(`Error: ${response.status}: ${response.statusText}`);
      const errorText = await response.text();
      console.log(`Error details: ${errorText}`);
      return [];
    }

    const json = await response.json();
    
    if (json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts[0]) {
      const keywordsText = json.candidates[0].content.parts[0].text;
      // Split by comma and clean up the keywords
      const keywords = keywordsText
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(k => k.length > 0 && k.length < 20); // Filter out empty or very long keywords
      return keywords;
    }
    
    return [];
  } catch (error) {
    console.error(`Error calling Gemini API: ${error}`);
    return [];
  }
}

export function createFileName(keywords: string[], fileext: string): string {
  let newfilename = "";
  if (keywords.length > 0) {
    const fileparts = keywords.map(k => k.replace(/ /g, "_"));
    let cl = 0
    const filteredWords = fileparts.filter(w => {
      cl = cl + w.length + 1;
      return cl <= 230
    })
    newfilename = filteredWords.join("-") + "." + fileext;
  }
  return newfilename;
}

if (import.meta.main) {
  console.log("AI Image Renamer - Using Google Gemini API");
  console.log("Processing images in current directory...\n");

  const currentpath = Deno.cwd();
  let processedCount = 0;
  let skippedCount = 0;

  for (const file of Deno.readDirSync(".")) {
    if (file.name.endsWith(".jpg") || file.name.endsWith(".jpeg") || file.name.endsWith(".png")) {
      console.log(`Processing: ${file.name}`);
      
      try {
        const b64 = Base64.fromFile(`${currentpath}/${file.name}`).toString();
        const keywords = await getkeywords(b64);
        
        if (keywords.length > 0) {
          const newfilename = createFileName(keywords, file.name.split(".").pop()!);
          
          if (newfilename && newfilename !== file.name) {
            // Check if target file already exists
            try {
              await Deno.stat(`${currentpath}/${newfilename}`);
              console.log(`  ⚠️  Target file ${newfilename} already exists, skipping...`);
              skippedCount++;
            } catch {
              // File doesn't exist, safe to copy
              Deno.copyFileSync(`${currentpath}/${file.name}`, `${currentpath}/${newfilename}`);
              console.log(`  ✅ Copied to: ${newfilename}`);
              processedCount++;
            }
          } else {
            console.log(`  ⚠️  Could not generate valid filename, skipping...`);
            skippedCount++;
          }
        } else {
          console.log(`  ⚠️  No keywords generated, skipping...`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`  ❌ Error processing ${file.name}: ${error}`);
        skippedCount++;
      }
      
      // Add a small delay to avoid hitting API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log(`Skipping: ${file.name} (not an image)`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`  Processed: ${processedCount} images`);
  console.log(`  Skipped: ${skippedCount} files`);
}


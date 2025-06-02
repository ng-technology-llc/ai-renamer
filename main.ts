import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";

// Load environment variables from .env.local
const env = await load({ envPath: ".env.local" });
const GOOGLE_API_KEY = env["GOOGLE_API_KEY"] || Deno.env.get("GOOGLE_API_KEY");

if (!GOOGLE_API_KEY) {
  console.error("Error: GOOGLE_API_KEY not found in .env.local file or environment variables");
  Deno.exit(1);
}

// Function to determine MIME type based on file extension
function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg'; // fallback
  }
}

// Function to read file and convert to base64
async function fileToBase64(filePath: string): Promise<string> {
  const fileData = await Deno.readFile(filePath);
  return encodeBase64(fileData);
}

// Function to create output directory if it doesn't exist
async function ensureOutputDirectory(outputDir: string): Promise<void> {
  try {
    await Deno.stat(outputDir);
  } catch {
    // Directory doesn't exist, create it
    await Deno.mkdir(outputDir, { recursive: true });
    console.log(`📁 Created output directory: ${outputDir}`);
  }
}

export async function getkeywords(image: string, filename: string): Promise<string[]> {
  const mimeType = getMimeType(filename);
  
  const body = {
    "contents": [{
      "parts": [
        {
          "text": "Analyze this image and provide descriptive keywords that could be used for a filename. Return only a comma-separated list of relevant keywords (no JSON, just keywords). Focus on the main subjects, objects, colors, and setting."
        },
        {
          "inline_data": {
            "mime_type": mimeType,
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

  // Retry logic with exponential backoff for rate limiting
  const maxRetries = 3;
  let baseDelay = 5000; // Start with 5 seconds

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 429) {
        // Rate limited - check retry delay from response
        const errorText = await response.text();
        let retryDelay = baseDelay * Math.pow(2, attempt); // Exponential backoff
        
        try {
          const errorData = JSON.parse(errorText);
          // Try to extract retry delay from the error response
          if (errorData.error?.details) {
            for (const detail of errorData.error.details) {
              if (detail["@type"] === "type.googleapis.com/google.rpc.RetryInfo" && detail.retryDelay) {
                const delaySeconds = parseInt(detail.retryDelay.replace('s', ''));
                if (!isNaN(delaySeconds)) {
                  retryDelay = delaySeconds * 1000; // Convert to milliseconds
                }
              }
            }
          }
        } catch (parseError) {
          // If we can't parse the error, use exponential backoff
        }

        if (attempt < maxRetries) {
          console.log(`⏳ Rate limited. Waiting ${Math.round(retryDelay / 1000)} seconds before retry ${attempt + 1}/${maxRetries}...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        } else {
          console.log(`❌ Max retries reached for ${filename}. Rate limit exceeded.`);
          return [];
        }
      }

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
          .map((k: string) => k.trim().toLowerCase())
          .filter((k: string) => k.length > 0 && k.length < 20); // Filter out empty or very long keywords
        return keywords;
      }
      
      return [];
    } catch (error) {
      if (attempt < maxRetries) {
        console.log(`⚠️ API error for ${filename}, retrying... (${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
        continue;
      } else {
        console.error(`❌ Error calling Gemini API for ${filename}: ${error}`);
        return [];
      }
    }
  }

  return [];
}

export function createFileName(keywords: string[], fileext: string): string {
  let newfilename = "";
  if (keywords.length > 0) {
    // Clean keywords to remove invalid filename characters
    const cleanedKeywords = keywords.map(k => k.replace(/[<>:"/\\|?*]/g, "").replace(/ /g, "_"));
    let cl = 0
    const filteredWords = cleanedKeywords.filter(w => {
      cl = cl + w.length + 1;
      return cl <= 230 && w.length > 0; // Also filter out empty strings
    })
    newfilename = filteredWords.join("-") + "." + fileext;
  }
  return newfilename;
}

// Check if file is a supported image format
function isImageFile(filename: string): boolean {
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = filename.toLowerCase();
  return supportedExtensions.some(extension => ext.endsWith(extension));
}

if (import.meta.main) {
  console.log("AI Image Renamer - Using Google Gemini API");
  console.log("Processing images in current directory...\n");

  const currentpath = Deno.cwd();
  const outputDir = `${currentpath}/ai-renamed-images`;
  let processedCount = 0;
  let skippedCount = 0;

  // Create output directory
  await ensureOutputDirectory(outputDir);

  for (const file of Deno.readDirSync(".")) {
    if (isImageFile(file.name)) {
      console.log(`Processing: ${file.name}`);
      
      try {
        // Check if file is readable and not empty
        const fileInfo = await Deno.stat(`${currentpath}/${file.name}`);
        if (fileInfo.size === 0) {
          console.log(`  ⚠️  File ${file.name} is empty, skipping...`);
          skippedCount++;
          continue;
        }

        const b64 = await fileToBase64(`${currentpath}/${file.name}`);
        
        // Validate base64 data
        if (!b64 || b64.length === 0) {
          console.log(`  ⚠️  Could not read image data from ${file.name}, skipping...`);
          skippedCount++;
          continue;
        }

        const keywords = await getkeywords(b64, file.name);
        
        if (keywords.length > 0) {
          const newfilename = createFileName(keywords, file.name.split(".").pop()!);
          
          if (newfilename && newfilename !== file.name && newfilename.length > 0) {
            const outputPath = `${outputDir}/${newfilename}`;
            
            // Check if target file already exists in output directory
            try {
              await Deno.stat(outputPath);
              console.log(`  ⚠️  Target file ${newfilename} already exists in output directory, skipping...`);
              skippedCount++;
            } catch {
              // File doesn't exist, safe to copy
              try {
                Deno.copyFileSync(`${currentpath}/${file.name}`, outputPath);
                console.log(`  ✅ Copied to: ai-renamed-images/${newfilename}`);
                processedCount++;
              } catch (copyError) {
                console.error(`  ❌ Failed to copy ${file.name}: ${copyError}`);
                skippedCount++;
              }
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
      await new Promise(resolve => setTimeout(resolve, 2000)); // Increased to 2 seconds
    } else {
      console.log(`Skipping: ${file.name} (not a supported image format)`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`  Processed: ${processedCount} images`);
  console.log(`  Skipped: ${skippedCount} files`);
  console.log(`  Output directory: ai-renamed-images/`);
}
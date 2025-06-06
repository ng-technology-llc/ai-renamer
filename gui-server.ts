import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";
import { serveFile } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { isAbsolute, resolve } from "https://deno.land/std@0.224.0/path/mod.ts";
import { createFileName, getkeywords } from "./main.ts";

// Load environment variables
const env = await load({ envPath: ".env.local" });
const GOOGLE_API_KEY = env["GOOGLE_API_KEY"] || Deno.env.get("GOOGLE_API_KEY");

if (!GOOGLE_API_KEY) {
  console.error("Error: GOOGLE_API_KEY not found in .env.local file or environment variables");
  Deno.exit(1);
}

// Function to resolve path to absolute path
function resolveToAbsolutePath(inputPath: string): string {
  if (isAbsolute(inputPath)) {
    return inputPath;
  }
  
  // Resolve relative paths to absolute paths
  const absolutePath = resolve(Deno.cwd(), inputPath);
  console.log(`🔍 Resolved "${inputPath}" to absolute path: "${absolutePath}"`);
  return absolutePath;
}

// Function to determine if file is an image
function isImageFile(filename: string): boolean {
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = filename.toLowerCase();
  return supportedExtensions.some(extension => ext.endsWith(extension));
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
    await Deno.mkdir(outputDir, { recursive: true });
  }
}

async function processImages(sourcePath: string, outputPath: string): Promise<{
  processedCount: number;
  skippedCount: number;
  errors: string[];
  progress: Array<{ filename: string; newFilename: string; status: string }>;
}> {
  const results = {
    processedCount: 0,
    skippedCount: 0,
    errors: [] as string[],
    progress: [] as Array<{ filename: string; newFilename: string; status: string }>
  };

  try {
    // Resolve paths to absolute paths
    const absoluteSourcePath = resolveToAbsolutePath(sourcePath);
    const absoluteOutputPath = resolveToAbsolutePath(outputPath);
    const deletedPath = `${absoluteSourcePath}/deleted`;
    
    console.log(`🔍 Processing images from: ${absoluteSourcePath}`);
    console.log(`📤 Output directory: ${absoluteOutputPath}`);
    console.log(`🗑️  Deleted directory: ${deletedPath}`);
    
    // Verify source directory exists and is accessible
    try {
      const sourceInfo = await Deno.stat(absoluteSourcePath);
      if (!sourceInfo.isDirectory) {
        throw new Error(`Source path is not a directory: ${absoluteSourcePath}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Cannot access source directory: ${absoluteSourcePath}. ${errorMessage}`);
    }
    
    // Create output directory
    await ensureOutputDirectory(absoluteOutputPath);
    console.log(`✅ Output directory ready: ${absoluteOutputPath}`);

    // Create deleted directory
    await ensureOutputDirectory(deletedPath);
    console.log(`✅ Deleted directory ready: ${deletedPath}`);

    // Get all files in source directory
    const files: string[] = [];
    console.log(`📁 Reading source directory: ${absoluteSourcePath}`);
    
    for (const file of Deno.readDirSync(absoluteSourcePath)) {
      if (file.isFile && isImageFile(file.name)) {
        files.push(file.name);
      }
    }
    
    console.log(`🖼️  Found ${files.length} image files to process`);

    for (const filename of files) {
      try {
        console.log(`🔄 Processing: ${filename}`);
        const filePath = `${absoluteSourcePath}/${filename}`;
        
        // Check if file is readable and not empty
        const fileInfo = await Deno.stat(filePath);
        if (fileInfo.size === 0) {
          console.log(`⚠️  File ${filename} is empty, skipping`);
          results.skippedCount++;
          results.progress.push({
            filename,
            newFilename: '',
            status: 'Skipped: File is empty'
          });
          continue;
        }

        console.log(`📊 File ${filename} size: ${fileInfo.size} bytes`);
        
        const b64 = await fileToBase64(filePath);
        
        if (!b64 || b64.length === 0) {
          console.log(`❌ Could not read image data from ${filename}`);
          results.skippedCount++;
          results.progress.push({
            filename,
            newFilename: '',
            status: 'Skipped: Could not read image data'
          });
          continue;
        }

        console.log(`🔗 Calling AI API for ${filename}...`);
        const keywords = await getkeywords(b64, filename);
        console.log(`🏷️  Keywords for ${filename}:`, keywords);
        
        if (keywords.length > 0) {
          const newFilename = createFileName(keywords, filename.split(".").pop()!);
          console.log(`📝 Generated filename: ${newFilename}`);
          
          if (newFilename && newFilename !== filename && newFilename.length > 0) {
            const outputFilePath = `${absoluteOutputPath}/${newFilename}`;
            
            // Check if target file already exists
            try {
              await Deno.stat(outputFilePath);
              console.log(`⚠️  Target file ${newFilename} already exists`);
              results.skippedCount++;
              results.progress.push({
                filename,
                newFilename,
                status: 'Skipped: Target file already exists'
              });
            } catch {
              // File doesn't exist, safe to copy
              try {
                await Deno.copyFile(filePath, outputFilePath);
                console.log(`✅ Successfully copied ${filename} → ${newFilename}`);
                
                // Move original file to deleted folder
                const deletedFilePath = `${deletedPath}/${filename}`;
                try {
                  await Deno.rename(filePath, deletedFilePath);
                  console.log(`🗑️  Moved original file ${filename} to deleted folder`);
                  results.processedCount++;
                  results.progress.push({
                    filename,
                    newFilename,
                    status: 'Success: Copied with new name, original moved to deleted folder'
                  });
                } catch (moveError) {
                  console.error(`⚠️  Warning: Could not move ${filename} to deleted folder:`, moveError);
                  results.processedCount++;
                  results.progress.push({
                    filename,
                    newFilename,
                    status: 'Success: Copied with new name (original file remains in source)'
                  });
                }
              } catch (copyError) {
                console.error(`❌ Failed to copy ${filename}:`, copyError);
                results.skippedCount++;
                results.errors.push(`Failed to copy ${filename}: ${copyError}`);
                results.progress.push({
                  filename,
                  newFilename: '',
                  status: `Error: ${copyError}`
                });
              }
            }
          } else {
            console.log(`⚠️  Could not generate valid filename for ${filename}`);
            results.skippedCount++;
            results.progress.push({
              filename,
              newFilename: '',
              status: 'Skipped: Could not generate valid filename'
            });
          }
        } else {
          console.log(`⚠️  No keywords generated for ${filename}`);
          results.skippedCount++;
          results.progress.push({
            filename,
            newFilename: '',
            status: 'Skipped: No keywords generated'
          });
        }
        
        // Add longer delay to respect API limits (increased from 1 second to 3 seconds)
        console.log(`⏳ Waiting 3 seconds before next image...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Error processing ${filename}:`, error);
        results.skippedCount++;
        results.errors.push(`Error processing ${filename}: ${errorMessage}`);
        results.progress.push({
          filename,
          newFilename: '',
          status: `Error: ${errorMessage}`
        });
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error accessing directory:`, error);
    results.errors.push(`Error accessing directory: ${errorMessage}`);
  }

  console.log(`📊 Processing complete! Processed: ${results.processedCount}, Skipped: ${results.skippedCount}, Errors: ${results.errors.length}`);
  return results;
}

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  
  // Handle CORS for API requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // API endpoint to process images
  if (url.pathname === "/api/process" && request.method === "POST") {
    try {
      const { sourcePath, outputPath } = await request.json();
      
      if (!sourcePath || !outputPath) {
        return new Response(JSON.stringify({ error: "Source path and output path are required" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      const results = await processImages(sourcePath, outputPath);
      
      return new Response(JSON.stringify(results), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }

  // Serve static files
  if (url.pathname === "/" || url.pathname === "/index.html") {
    return await serveFile(request, "./gui/index.html");
  }
  
  if (url.pathname === "/style.css") {
    return await serveFile(request, "./gui/style.css");
  }
  
  if (url.pathname === "/app.js") {
    return await serveFile(request, "./gui/app.js");
  }

  return new Response("Not Found", { status: 404 });
};

console.log("🚀 AI Image Renamer GUI Server starting...");

// Try different ports if one is already in use
const possiblePorts = [9000, 8080, 8000, 3000, 3001, 5000];
let serverStarted = false;

for (const port of possiblePorts) {
  try {
    console.log(`📱 Attempting to start server on port ${port}...`);
    console.log(`📱 Open your browser to: http://localhost:${port}`);
    console.log("⏹️  Press Ctrl+C to stop the server");
    
    await serve(handler, { port });
    serverStarted = true;
    break;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("Address already in use")) {
      console.log(`⚠️  Port ${port} is already in use, trying next port...`);
      continue;
    } else {
      console.error(`❌ Failed to start server on port ${port}:`, error);
      break;
    }
  }
}

if (!serverStarted) {
  console.error("❌ Could not start server on any available port");
  console.log("💡 Try manually stopping any running deno processes: killall deno");
  Deno.exit(1);
} 
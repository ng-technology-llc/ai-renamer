# 🖼️ AI Image File Renamer

[![let the ai rename your images](https://img.youtube.com/vi/W4Bn73JHPZs/0.jpg)](https://www.youtube.com/watch?v=W4Bn73JHPZs)

A powerful and intelligent tool that automatically renames image files based on their visual content using **Google Gemini AI Vision**. No more `IMG_001.jpg` or `DSC_1234.png` - get descriptive filenames like `sunset-beach-ocean-waves.jpg` or `golden-retriever-playing-park.png`.

## 🌟 Features

- **🤖 AI-Powered Analysis**: Uses Google Gemini Vision API to understand image content
- **📁 Batch Processing**: Processes all images in a directory automatically
- **🔒 Safe Operation**: Creates copies with new names, never modifies originals
- **🚫 Collision Prevention**: Automatically skips if target filename already exists
- **📊 Detailed Reporting**: Shows progress and provides summary statistics
- **⚡ Rate Limiting**: Built-in delays to respect API limits
- **🎯 Smart Filtering**: Generates clean, filesystem-friendly filenames
- **🔧 Multiple Formats**: Supports JPG, JPEG, PNG, and WebP files

## 📋 Prerequisites

Before you begin, make sure you have:

1. **Deno Runtime** (v1.28.0 or higher)
2. **Google Gemini API Key** (free tier available)
3. **Internet Connection** (for API calls)
4. **Image Files** to process (JPG, JPEG, PNG, WebP)

## 🚀 Quick Start

### Step 1: Install Deno

If you don't have Deno installed:

**macOS/Linux:**
```bash
curl -fsSL https://deno.land/install.sh | sh
```

**Windows (PowerShell):**
```powershell
irm https://deno.land/install.ps1 | iex
```

**Alternative (using package managers):**
```bash
# macOS with Homebrew
brew install deno

# Windows with Chocolatey
choco install deno

# Linux with Snap
snap install deno
```

### Step 2: Get Google Gemini API Key

1. **Visit Google AI Studio**: Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. **Sign in** with your Google account
3. **Create API Key**: Click "Create API Key"
4. **Copy the key**: Save it securely - you'll need it in the next step

> 💡 **Tip**: The Gemini API offers a generous free tier with 15 requests per minute and 1,500 requests per day.

### Step 3: Set Up the Project

1. **Clone or download** this repository:
```bash
git clone https://github.com/your-username/ai-renamer.git
cd ai-renamer
```

2. **Create environment file**:
```bash
# Create .env.local file
echo "GOOGLE_API_KEY=your_actual_api_key_here" > .env.local
```

**Important**: Replace `your_actual_api_key_here` with your real API key from Step 2.

### Step 4: Test the Installation

```bash
# Test if everything is working
deno run --allow-read --allow-net --allow-write --allow-env main.ts
```

You should see:
```
AI Image Renamer - Using Google Gemini API
Processing images in current directory...
```

## 📖 Detailed Usage Guide

### Basic Usage

1. **Navigate to your image folder**:
```bash
cd /path/to/your/images
```

2. **Run the AI renamer**:
```bash
deno run --allow-read --allow-net --allow-write --allow-env /path/to/ai-renamer/main.ts
```

Or if you're in the project directory:
```bash
deno task dev
```

### Command Line Permissions Explained

The tool requires several permissions:
- `--allow-read`: Read image files and configuration
- `--allow-net`: Make API calls to Google Gemini
- `--allow-write`: Create renamed copies of images
- `--allow-env`: Read environment variables (.env.local)

### Example Session

```bash
$ deno task dev

AI Image Renamer - Using Google Gemini API
Processing images in current directory...

Processing: IMG_001.jpg
  ✅ Copied to: sunset-beach-golden-hour-waves-peaceful.jpg
Processing: photo.png
  ✅ Copied to: tabby-cat-sleeping-couch-indoor-cute.png
Processing: DSC_1234.jpeg
  ✅ Copied to: mountain-landscape-snow-peaks-valley-hiking.jpeg
Skipping: document.pdf (not an image)
Processing: selfie.jpg
  ⚠️  Target file portrait-woman-smiling-outdoors-sunlight.jpg already exists, skipping...

📊 Summary:
  Processed: 3 images
  Skipped: 1 files
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the project directory:

```env
# Required: Your Google Gemini API Key
GOOGLE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Custom settings (future features)
# MAX_FILENAME_LENGTH=230
# RATE_LIMIT_DELAY=1000
```

### Supported File Types

- **JPEG**: `.jpg`, `.jpeg`
- **PNG**: `.png`
- **WebP**: `.webp`

> 📝 **Note**: Other formats (GIF, TIFF, etc.) are not currently supported but can be added easily.

## 📂 File Naming Logic

### How Filenames Are Generated

1. **AI Analysis**: Gemini analyzes the image content
2. **Keyword Extraction**: Extracts relevant descriptive keywords
3. **Cleaning**: Converts to lowercase, removes special characters
4. **Filtering**: Removes very long keywords (>20 chars)
5. **Assembly**: Joins keywords with hyphens
6. **Length Limit**: Keeps total filename under 230 characters

### Example Transformations

| Original | AI Analysis | New Filename |
|----------|-------------|--------------|
| `IMG_001.jpg` | Sunset, beach, ocean, golden hour | `sunset-beach-ocean-golden-hour.jpg` |
| `photo.png` | Cat, tabby, sleeping, couch | `cat-tabby-sleeping-couch.png` |
| `image.webp` | Mountain, landscape, snow, valley | `mountain-landscape-snow-valley.webp` |
| `selfie.jpg` | Portrait, woman, smiling, outdoors | `portrait-woman-smiling-outdoors.jpg` |

## 🛠️ Building Executable

Create a standalone executable:

```bash
# Build for your current platform
deno task buildapp

# This creates an 'airenamer' executable
./airenamer
```

The executable will be created without file extension on Unix systems, or with `.exe` on Windows.

## ⚠️ Important Notes

### Safety Features

- **Non-destructive**: Original files are never modified or deleted
- **Copy operation**: Creates new files with descriptive names
- **Collision detection**: Won't overwrite existing files
- **Backup recommended**: Always backup your images before processing

### API Limits

Google Gemini API has usage limits:
- **Free Tier**: 15 requests/minute, 1,500 requests/day
- **Rate Limiting**: Built-in 1-second delay between requests
- **Error Handling**: Graceful handling of API errors

### File Size Considerations

- **Large images**: May take longer to process
- **Base64 encoding**: Images are encoded for API transmission
- **Memory usage**: Keep available RAM in mind for very large images

## 🔍 Troubleshooting

### Common Issues

#### "GOOGLE_API_KEY not found"
```
Error: GOOGLE_API_KEY not found in .env.local file or environment variables
```
**Solution**: Create `.env.local` file with your API key:
```bash
echo "GOOGLE_API_KEY=your_actual_api_key" > .env.local
```

#### "Error: 403: Forbidden"
**Possible causes**:
- Invalid API key
- API key not enabled for Gemini
- Exceeded quota

**Solution**: 
1. Verify your API key at [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Check your usage quotas
3. Ensure Gemini API is enabled

#### "Permission denied" errors
**Solution**: Make sure you're running with all required permissions:
```bash
deno run --allow-read --allow-net --allow-write --allow-env main.ts
```

#### No keywords generated
**Possible causes**:·
- Poor image quality
- Unsupported image content
- API response issues

**Solution**: 
- Try with clearer, higher-quality images
- Check console for detailed error messages

### Debug Mode

For troubleshooting, you can modify the code to add more verbose logging:

```typescript
// Add this line in getkeywords function for debugging
console.log("API Response:", JSON.stringify(json, null, 2));
```

## 🏗️ Project Structure

```
ai-renamer/
├── main.ts              # Main application file
├── package.json         # Deno tasks and metadata
├── deno.json           # Deno configuration
├── deno.lock           # Dependency lock file
├── .env.local          # Your API key (create this)
├── readme.md           # This file
├── CHANGELOG.md        # Version history
└── LICENSE             # MIT license
```

## 🔄 Version History

- **v0.0.8**: Migrated from Ollama to Google Gemini API
- **Previous**: Used local Ollama installation

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 💡 Tips for Best Results

1. **Image Quality**: Higher quality images produce better keyword extraction
2. **Clear Subjects**: Images with clear, identifiable subjects work best
3. **Good Lighting**: Well-lit images are analyzed more accurately
4. **Batch Processing**: Process similar images together for consistency
5. **Manual Review**: Review generated filenames and adjust as needed

## 🆘 Support

If you encounter issues:

1. **Check this README** for common solutions
2. **Review console output** for specific error messages
3. **Verify API key** and permissions
4. **Test with a single image** first
5. **Create an issue** on GitHub with details

---

**Happy renaming! 🎉** Transform your chaotic image library into an organized, searchable collection with AI-powered descriptive filenames.

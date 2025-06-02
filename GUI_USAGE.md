# 🖼️ AI Image Renamer GUI Usage Guide

## Quick Start

1. **Start the GUI Server**:
   ```bash
   deno task gui
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:9000
   ```

3. **Use the interface** to rename your images with AI-generated descriptive filenames.

## How to Use the GUI

### Step 1: Set Source Folder
- Enter the full path to the folder containing images you want to rename
- Example: `/Users/your-name/Pictures/vacation-photos`
- Supported formats: JPG, JPEG, PNG, WebP

### Step 2: Set Output Folder
- Enter the full path where renamed copies will be saved
- Example: `/Users/your-name/Pictures/ai-renamed-images`
- **Important**: This must be different from the source folder

### Step 3: Start Processing
- Click the "🚀 Start Renaming Process" button
- Watch the progress in real-time
- View detailed results and logs

## Features

### ✅ What the GUI Provides
- **Path Validation**: Visual feedback for valid/invalid paths
- **Real-time Progress**: Live updates during processing
- **Detailed Results**: Summary statistics and per-file results
- **Process Log**: Timestamped log entries with status indicators
- **Safe Operation**: Original files are never modified
- **Stop Control**: Ability to stop processing mid-way

### 🎯 Auto-suggestions
- **Current Dir**: Quickly fill in common directory paths
- **Auto Output**: Automatically suggest output directory based on source

### 📊 Results Display
- **Summary Stats**: Processed, skipped, and error counts
- **File Details**: Original filename → New filename mappings
- **Status Indicators**: Success, skipped, and error status for each file
- **Color Coding**: Green for success, yellow for skipped, red for errors

## Requirements

### Prerequisites
1. **Deno Runtime** (v1.28.0 or higher)
2. **Google Gemini API Key** configured in `.env.local`
3. **Image Files** to process
4. **Write Permissions** for the output directory

### API Configuration
Create a `.env.local` file in the project root:
```env
GOOGLE_API_KEY=your_actual_api_key_here
```

## Troubleshooting

### Common Issues

#### Server Won't Start
```
Error: Address already in use
```
**Solution**: Another service is using the port. Check what's running on port 9000:
```bash
lsof -i :9000
```

#### Permission Denied
**Solution**: Ensure you have:
- Read permissions for source directory
- Write permissions for output directory
- Valid paths (directories exist)

#### API Errors
```
Error: 403: Forbidden
```
**Solution**: 
- Verify your Google Gemini API key is correct
- Check your API usage quotas
- Ensure the Gemini API is enabled for your project

#### No Images Found
**Solution**:
- Verify the source path contains supported image files
- Check file extensions: `.jpg`, `.jpeg`, `.png`, `.webp`
- Ensure files are not empty or corrupted

### Debug Tips

1. **Check Console**: Open browser developer tools to see detailed error messages
2. **Process Log**: Review the real-time log for specific error details
3. **File Paths**: Use absolute paths (starting with `/` on Unix/Mac)
4. **API Limits**: Respect the 1-second delay between API calls

## Advanced Usage

### Batch Processing
- Process multiple folders by running separate sessions
- Each session maintains its own progress and results

### Results Review
- Results remain visible until you refresh the page
- Copy new filenames for reference
- Review skipped files to understand why they weren't processed

### Performance Tips
- **Smaller Batches**: Process 10-50 images at a time for better responsiveness
- **Good Internet**: Stable connection required for API calls
- **Sufficient RAM**: Large images require more memory for processing

## Safety Features

### File Protection
- ✅ **Non-destructive**: Original files are never modified
- ✅ **Copy Operation**: Creates new files with AI-generated names
- ✅ **Collision Detection**: Won't overwrite existing files
- ✅ **Error Handling**: Graceful handling of API and file system errors

### Backup Recommendation
Always backup your images before processing, even though the operation is non-destructive.

---

**Enjoy using AI-powered image renaming! 🎉**

For issues or feature requests, please check the main README.md or create an issue on GitHub. 
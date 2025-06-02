# 📂 Browse Button Feature Guide

## New Directory Selection Feature

The AI Image Renamer GUI now includes **Browse** buttons for easy directory selection, making it much more user-friendly to select source and output folders.

## How to Use

### 1. Source Folder Selection
- **📂 Browse Button**: Click the "Browse" button next to the Source Folder Path field
- **Directory Picker**: Your browser will open a directory selection dialog
- **Auto-Fill**: The selected directory path will automatically populate the input field

### 2. Output Folder Selection
- **📂 Browse Button**: Click the "Browse" button next to the Output Folder Path field
- **✨ Auto Button**: Click "Auto" to automatically generate an output path based on your source folder

## Features

### Easy Directory Navigation
- **No Typing Required**: Click Browse instead of manually typing long directory paths
- **Visual Selection**: Use your system's native directory picker
- **Error Prevention**: Reduces typos and invalid path errors

### Smart Path Handling
- **Relative Paths**: Browser limitations mean paths will be shown as relative (e.g., `./folder-name`)
- **Helpful Feedback**: Log messages guide you if adjustments are needed
- **Cross-Platform**: Works on Mac, Windows, and Linux

### Auto-Generate Output
- **Smart Suggestions**: Auto button creates `ai-renamed-images` folder in your source directory's parent
- **Safe Defaults**: Prevents accidentally overwriting source files
- **One-Click Setup**: No need to manually create output directories

## Browser Limitations & Solutions

### Security Restrictions
**Issue**: Browsers don't provide full absolute paths for security reasons
**Solution**: The app shows relative paths (e.g., `./Pictures/vacation-photos`)

### Path Adjustment
If you see a relative path like `./selected-folder`:
1. **For Local Processing**: Relative paths often work fine
2. **For Absolute Paths**: You can manually edit to full path (e.g., `/Users/username/Pictures/vacation-photos`)
3. **Check Logs**: The processing log will show helpful feedback

## Example Workflow

### Step 1: Select Source Directory
```
1. Click "📂 Browse" next to Source Folder Path
2. Navigate to your photos folder
3. Select the folder containing images to rename
4. Path appears as: "./vacation-photos-2024"
```

### Step 2: Set Output Directory  
```
Option A - Browse:
1. Click "📂 Browse" next to Output Folder Path
2. Select where you want renamed copies saved

Option B - Auto-Generate:
1. Click "✨ Auto" button
2. Automatically creates: "./ai-renamed-images"
```

### Step 3: Process Images
```
1. Verify both paths are set and different
2. Click "🚀 Start Renaming Process"
3. Monitor progress in real-time
```

## Troubleshooting

### Path Issues
**Problem**: Relative path doesn't work
**Solution**: Edit the path to be absolute:
- Mac/Linux: `/Users/username/Pictures/photos`
- Windows: `C:\Users\username\Pictures\photos`

### Directory Not Found
**Problem**: Server can't find the selected directory
**Solution**: 
1. Check the log for specific error messages
2. Try using an absolute path
3. Ensure the directory contains image files

### Browser Compatibility
**Feature Requirements**: 
- Modern browsers (Chrome, Firefox, Safari, Edge)
- `webkitdirectory` support (standard in all modern browsers)
- JavaScript enabled

## Advanced Tips

### Keyboard Shortcuts
- **Tab**: Navigate between input fields
- **Enter**: Trigger directory selection when focused on Browse button

### Path Validation
- **Green Border**: Valid path format
- **Red Border**: Path conflicts (source = output)
- **Gray Border**: Needs input

### Log Monitoring
Watch the processing log for:
- ✅ Successful directory selections
- ⚠️ Path adjustment suggestions  
- ❌ Error messages and solutions

## Benefits Over Manual Path Entry

| Manual Typing | Browse Button |
|---------------|---------------|
| ❌ Prone to typos | ✅ Error-free selection |
| ❌ Need to remember paths | ✅ Visual navigation |
| ❌ No path validation | ✅ Automatic validation |
| ❌ Hard on mobile | ✅ Touch-friendly |

## Compatibility

### Supported Browsers
- ✅ Chrome 21+
- ✅ Firefox 50+  
- ✅ Safari 11.1+
- ✅ Edge 79+

### Operating Systems
- ✅ macOS (all versions)
- ✅ Windows 10/11
- ✅ Linux distributions
- ✅ Mobile browsers (limited)

The Browse button feature makes the AI Image Renamer much more accessible and user-friendly, especially for users who prefer visual directory selection over typing file paths! 
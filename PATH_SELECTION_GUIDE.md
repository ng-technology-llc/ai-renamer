# 📂 Directory Path Selection Guide

## Why Does the Path Show as `./test-images` Instead of `/Users/nick/test-images`?

This is due to **browser security restrictions**. Web browsers don't allow websites to access or display full absolute paths from your file system for security reasons.

## What You're Seeing

### When You Select: `/Users/nick/test-images`
### Browser Shows: `./test-images`

This is normal and expected behavior in all modern browsers (Chrome, Firefox, Safari, Edge).

## Solutions

### Option 1: Try the Relative Path First (Recommended)
1. **Leave it as is**: `./test-images`
2. **Click "Start Renaming Process"**
3. **If it works**: Great! The server was able to resolve the relative path
4. **If it fails**: Try Option 2 below

### Option 2: Edit to Full Absolute Path
1. **Click in the input field**
2. **Edit the path manually** to: `/Users/nick/test-images`
3. **Click "Start Renaming Process"**

### Option 3: Use Current Directory
1. **Place your images** in the same directory as the AI Renamer
2. **Use relative paths** like: `./test-images`
3. **This often works reliably**

## Visual Guide

```
🔍 What You Selected:
/Users/nick/test-images

🔒 What Browser Security Shows:
./test-images

✅ What You Can Edit It To:
/Users/nick/test-images

🚀 Either Path May Work:
• Try ./test-images first
• Edit to full path if needed
```

## When to Use Each Format

### Relative Paths (./folder-name)
✅ **Use When:**
- Running the server from your home directory
- Images are in a subdirectory of where you started the server
- You want to keep paths simple

❌ **May Not Work When:**
- Server is running from a different directory
- You need to access files outside the server's working directory

### Absolute Paths (/Users/username/folder)
✅ **Use When:**
- Relative paths don't work
- You want to be absolutely sure of the path
- Accessing files from anywhere on your system

❌ **Considerations:**
- Must type/edit manually
- Platform-specific (different on Windows/Mac/Linux)

## Platform-Specific Examples

### macOS:
```
Absolute: /Users/nick/Pictures/vacation-photos
Relative: ./vacation-photos
```

### Windows:
```
Absolute: C:\Users\nick\Pictures\vacation-photos
Relative: .\vacation-photos
```

### Linux:
```
Absolute: /home/nick/Pictures/vacation-photos
Relative: ./vacation-photos
```

## Troubleshooting Steps

### If Processing Fails with Path Error:

1. **Check the Log Messages**
   - Look for specific error details
   - Note what path the server is trying to access

2. **Try Full Absolute Path**
   - Edit the path to the complete absolute path
   - Make sure spelling and capitalization are correct

3. **Verify Directory Exists**
   - Open Terminal/Command Prompt
   - Navigate to the directory: `cd /Users/nick/test-images`
   - List files: `ls` (Mac/Linux) or `dir` (Windows)

4. **Check Permissions**
   - Ensure you have read access to source directory
   - Ensure you have write access to output directory

## Pro Tips

### 🎯 Best Practice
1. **Start with Browse button** - gets you close to the right path
2. **Check the log feedback** - tells you exactly what to do
3. **Edit to absolute path if needed** - most reliable method

### 🚀 Quick Test
- Put a few test images in `./test-images` relative to where you run the server
- This often works without path editing

### 📝 Remember
- The Browse button gets you 90% there
- Manual editing the last 10% ensures it works
- Both approaches are valid and supported

## Example Workflow

```
1. Click "📂 Browse"
2. Select: /Users/nick/test-images
3. See: ./test-images (this is normal!)
4. Try processing with relative path first
5. If it fails, edit to: /Users/nick/test-images
6. Process successfully! 🎉
```

The AI Image Renamer is designed to work with both relative and absolute paths, so you have flexibility in how you specify your directories! 
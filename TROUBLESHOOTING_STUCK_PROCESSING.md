# 🔧 Troubleshooting: Processing Stuck Guide

## Current Issue: Processing Stuck at "Starting image processing..."

You're experiencing a common issue where the AI Image Renamer gets stuck during processing. Here's how to diagnose and fix it:

## ✅ What We've Verified

1. **✅ Images Exist**: Your `/Users/nick/test-images` folder contains 47+ JPG files
2. **✅ Server Running**: GUI server is active on http://localhost:9000
3. **✅ API Key Configured**: Google Gemini API key is present in `.env.local`
4. **✅ Enhanced Logging**: Added detailed console logging to track progress

## 🔍 Immediate Diagnosis Steps

### Step 1: Check Server Console Logs
Look at your terminal where `deno task gui` is running. You should see detailed logs like:
```
🔍 Processing images from: /Users/nick/test-images
📤 Output directory: /Users/nick/ai-renamed-images
✅ Output directory ready: /Users/nick/ai-renamed-images
📁 Reading source directory: /Users/nick/test-images
🖼️  Found 47 image files to process
🔄 Processing: 08ec89713cf52684e232c97c45190209.JPG
📊 File 08ec89713cf52684e232c97c45190209.JPG size: 136507 bytes
🔗 Calling AI API for 08ec89713cf52684e232c97c45190209.JPG...
```

### Step 2: Identify Where It Stops
The logs will show exactly where processing halts:

#### If it stops after "🔗 Calling AI API..."
**Problem**: API rate limiting or API error
**Solution**: Check for 429 errors, wait a minute, try again

#### If it stops after "📁 Reading source directory..."
**Problem**: Path or permission issue
**Solution**: Use absolute path `/Users/nick/test-images`

#### If it stops after "📤 Output directory..."
**Problem**: Can't create output directory
**Solution**: Check write permissions

## 🚀 Quick Fixes to Try

### Fix 1: Use Absolute Paths
Instead of relative paths, use full absolute paths:
- **Source**: `/Users/nick/test-images`
- **Output**: `/Users/nick/ai-renamed-images`

### Fix 2: Simplify Output Path
Use a simple output directory name:
- **Output**: `/Users/nick/test-output`

### Fix 3: Test with Fewer Images
Create a test folder with just 2-3 images:
```bash
mkdir /Users/nick/test-small
cp /Users/nick/test-images/*.JPG /Users/nick/test-small/ | head -3
```

### Fix 4: Restart Everything
```bash
# Stop the server (Ctrl+C in the terminal)
# Wait 10 seconds
# Restart server
deno task gui
```

## 🐛 Common Error Patterns

### API Rate Limiting (429 Errors)
```
Error: 429: Too Many Requests
```
**Solution**: Wait 1-2 minutes, try again with fewer images

### Path Not Found
```
❌ Error accessing directory: No such file or directory
```
**Solution**: Use absolute path `/Users/nick/test-images`

### Permission Denied
```
❌ Error accessing directory: Permission denied
```
**Solution**: Check directory permissions, use `chmod 755`

### API Key Issues
```
Error: 403: Forbidden
```
**Solution**: Verify API key in `.env.local`, check quotas

## 📊 What the Enhanced Logging Shows

With the new logging, you'll see:
1. **🔍 Source path being processed**
2. **📁 Files being discovered**
3. **🔄 Each individual file being processed**
4. **🔗 API calls being made**
5. **🏷️ Keywords being generated**
6. **✅ Successful file copies**

## 🎯 Recommended Testing Strategy

### Test 1: Single Image Test
1. Create folder: `/Users/nick/single-test`
2. Copy one image: `cp /Users/nick/test-images/08ec89713cf52684e232c97c45190209.JPG /Users/nick/single-test/`
3. Process single image to isolate issues

### Test 2: Check Server Logs
1. Open browser to http://localhost:9000
2. Set paths to absolute paths
3. Start processing
4. **IMMEDIATELY** check terminal for detailed logs
5. Note exactly where it stops

### Test 3: Path Verification
```bash
# Verify source exists and is readable
ls -la /Users/nick/test-images/*.JPG | head -5

# Verify you can create output directory
mkdir -p /Users/nick/test-output-new
ls -la /Users/nick/test-output-new
```

## 💡 Pro Tips

### Monitor in Real-Time
Keep two windows open:
1. **Browser**: GUI interface
2. **Terminal**: Server logs showing detailed progress

### Gradual Testing
1. Start with 1 image
2. Then try 3 images  
3. Then try 10 images
4. Scale up gradually

### API Quota Management
- Free tier: 15 requests/minute
- Wait 5 minutes between large batches
- Monitor usage at https://aistudio.google.com/app/apikey

## 🆘 If Still Stuck

1. **Check terminal logs** - this is your #1 debugging tool
2. **Try absolute paths** - most reliable approach
3. **Test with 1 image first** - isolates the problem
4. **Wait for API cooldown** - if you hit rate limits

The enhanced logging will tell you exactly what's happening! 🔍 
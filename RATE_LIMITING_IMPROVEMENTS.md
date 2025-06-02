# Rate Limiting Improvements for AI Image Renamer

## Issues Addressed

### 1. Google Gemini API Rate Limiting (Error 429)
**Problem**: The free tier of Google Gemini API has strict limits:
- 15 requests per minute
- 1,500 requests per day

**Previous Behavior**: The application would fail repeatedly when hitting rate limits, showing continuous 429 errors.

### 2. Port Conflicts for GUI Server
**Problem**: The GUI server couldn't start when ports were already in use.

**Previous Behavior**: Server would crash with "Address already in use" error.

## Improvements Made

### 1. Enhanced Rate Limiting in `main.ts`

#### Exponential Backoff Retry Logic
- **Smart Retry**: Automatically retries failed requests up to 3 times
- **Exponential Backoff**: Waits longer between each retry (5s, 10s, 20s)
- **API Response Parsing**: Reads the actual retry delay suggested by Google's API
- **Graceful Degradation**: Skips images that can't be processed after max retries

#### Increased Base Delay
- **Previous**: 1 second between requests
- **New**: 2 seconds between requests for command-line usage

#### Better Error Messages
```
⏳ Rate limited. Waiting 17 seconds before retry 1/3...
❌ Max retries reached for IMG_001.jpg. Rate limit exceeded.
```

### 2. Enhanced Rate Limiting in `gui-server.ts`

#### Conservative Processing
- **Previous**: 1 second delay between API calls
- **New**: 3 seconds delay between API calls (more conservative for batch processing)

#### Improved Error Handling
- Better logging of rate limit situations
- Graceful handling of failed images
- Detailed progress reporting to the UI

### 3. Smart Port Selection for GUI Server

#### Multiple Port Attempts
The server now tries these ports in order:
1. 9000 (preferred)
2. 8080
3. 8000
4. 3000
5. 3001
6. 5000

#### Better Error Messages
```
📱 Attempting to start server on port 9000...
⚠️  Port 9000 is already in use, trying next port...
📱 Attempting to start server on port 8080...
📱 Open your browser to: http://localhost:8080
```

## Usage Recommendations

### For Heavy Processing (Many Images)

1. **Use Command Line**: For processing large batches, use the command line version:
   ```bash
   deno run --allow-read --allow-net --allow-write --allow-env main.ts
   ```

2. **Process in Smaller Batches**: 
   - Process 10-15 images at a time
   - Wait 5-10 minutes between batches to reset rate limits

3. **Monitor Progress**: Watch for rate limiting messages and let the retry logic work

### For GUI Usage

1. **Conservative Processing**: The GUI now uses 3-second delays, making it more suitable for smaller batches

2. **Real-time Monitoring**: The GUI shows detailed progress and retry attempts

3. **Error Recovery**: Failed images are clearly marked with reasons

## Troubleshooting Commands

### Check for Running Deno Processes
```bash
lsof -i :9000 -i :8080 -i :3000
```

### Kill Existing Deno Processes
```bash
killall deno
```

### Check API Usage
Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to monitor your quota usage.

### Verify Server Status
```bash
curl -s http://localhost:9000 | head -5
```

## Rate Limit Best Practices

### 1. Respect the Limits
- **Free Tier**: 15 requests/minute = 1 request every 4 seconds minimum
- **Our Setting**: 3 seconds between requests provides safety margin

### 2. Monitor Your Usage
- Track daily usage (1,500 requests/day limit)
- Consider upgrading to paid tier for heavy usage

### 3. Optimize Image Selection
- Process only high-quality, clear images
- Skip corrupted or very small images
- Use descriptive source filenames to help with organization

## Error Code Reference

### 429: Too Many Requests
**Meaning**: You've hit the rate limit
**Action**: The application now automatically waits and retries
**Manual Action**: Wait 1 minute before trying again

### 403: Forbidden
**Meaning**: API key issue or quota exceeded
**Action**: Check your API key and billing settings

### 500: Internal Server Error
**Meaning**: Temporary API issue
**Action**: The application will retry automatically

## Performance Monitoring

### Success Indicators
```
✅ Copied to: sunset-beach-golden-hour.jpg
⏳ Rate limited. Waiting 17 seconds before retry 1/3...
✅ Copied to: mountain-landscape-snow-peaks.jpg
```

### Warning Signs
```
❌ Max retries reached for IMG_001.jpg. Rate limit exceeded.
⚠️ No keywords generated, skipping...
```

## Future Improvements

1. **Queue System**: Implement a queue for processing large batches
2. **Progress Persistence**: Save progress and resume interrupted sessions
3. **Batch Optimization**: Intelligent batching based on current quota usage
4. **Alternative Models**: Support for other vision APIs as fallbacks

## Contact & Support

If you continue experiencing issues:
1. Check the console output for specific error messages
2. Verify your `.env.local` file contains a valid API key
3. Monitor your API usage at Google AI Studio
4. Consider processing smaller batches during peak usage times 
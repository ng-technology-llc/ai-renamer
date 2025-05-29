# AI Image File Renamer

[![let the ai rename your images](https://img.youtube.com/vi/W4Bn73JHPZs/0.jpg)](https://www.youtube.com/watch?v=W4Bn73JHPZs)

A simple executable that renames image files based on keywords that describe the image. The keywords are generated using **Google Gemini API**.

## Setup

### 1. Get Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key for Gemini
3. Copy the API key

### 2. Configure Environment
Create a `.env.local` file in the project directory with your API key:

```
GOOGLE_API_KEY=your_actual_api_key_here
```

### 3. Installation

1. Make sure you have [Deno](https://deno.land/) installed
2. Clone this repository
3. Set up your `.env.local` file with your Google API key

## Usage

Navigate to a folder with some images in it and run:

```bash
deno run --allow-read --allow-net --allow-write --allow-env main.ts
```

Or use the npm script:

```bash
deno task dev
```

**Make sure you have a backup first.** The tool copies the original files with new names, but I'm not responsible for any data loss.

## Features

- Processes `.jpg`, `.jpeg`, and `.png` files
- Uses Google Gemini AI to analyze image content
- Generates descriptive filenames based on image keywords
- Avoids overwriting existing files
- Provides detailed progress reporting
- Rate limiting to respect API limits

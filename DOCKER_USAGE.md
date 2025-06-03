# AI Renamer - Docker Usage Guide

This guide shows you how to run AI Renamer using Docker for easy deployment and consistent environments.

## Prerequisites

- Docker and Docker Compose installed
- Your Google API key in `.env.local` file
- Images to process in a local directory

## Quick Start

### 1. Setup Environment

Create a `.env.local` file in the project root:
```bash
GOOGLE_API_KEY=your_google_api_key_here
```

### 2. Prepare Your Images

Create an `images` directory and put your photos there:
```bash
mkdir images
# Copy your images to the images/ directory
```

### 3. Run the GUI Version (Recommended)

```bash
# Start the web interface
docker-compose up airenamer-gui

# Access the GUI at http://localhost:8000
```

### 4. Run CLI Version (Batch Processing)

```bash
# Process all images in the images/ directory
docker-compose --profile cli up airenamer-cli
```

## Usage Modes

### 🌐 GUI Mode (Web Interface)

**Best for:** Interactive use, selecting specific folders, real-time progress

```bash
# Start GUI server
docker-compose up airenamer-gui

# Or run in background
docker-compose up -d airenamer-gui
```

Access at: http://localhost:8000

Features:
- Select custom input/output directories
- Real-time processing progress
- Browse and manage renamed files
- Easy to use web interface

### 💻 CLI Mode (Batch Processing)

**Best for:** Automated processing, scripts, large batches

```bash
# Process images once and exit
docker-compose --profile cli up airenamer-cli

# Or run with custom image directory
docker run --rm \
  -v $(pwd)/my-photos:/app/input:ro \
  -v $(pwd)/ai-renamed-images:/app/ai-renamed-images \
  -v $(pwd)/.env.local:/app/.env.local:ro \
  airenamer:latest
```

### 🔧 Development Mode

**Best for:** Developers, live code changes

```bash
# Start with live reload
docker-compose --profile dev up airenamer-dev

# Access at http://localhost:8001
```

## Directory Structure

```
your-project/
├── images/                 # Put your images here
├── ai-renamed-images/      # Renamed images appear here
├── .env.local             # Your Google API key
├── docker-compose.yml     # Docker configuration
└── Dockerfile            # Docker image definition
```

## Advanced Usage

### Custom Image Directory

```bash
# Use a different image directory
docker-compose up airenamer-gui \
  -v /path/to/your/photos:/app/input:ro
```

### Environment Variables

```bash
# Override environment in docker-compose
GOOGLE_API_KEY=your_key docker-compose up airenamer-gui
```

### Build Your Own Image

```bash
# Build the Docker image
docker build -t airenamer:latest .

# Run directly
docker run --rm \
  -p 8000:8000 \
  -v $(pwd)/images:/app/input:ro \
  -v $(pwd)/ai-renamed-images:/app/ai-renamed-images \
  -v $(pwd)/.env.local:/app/.env.local:ro \
  airenamer:latest \
  deno run --allow-read --allow-net --allow-write --allow-env gui-server.ts
```

## Troubleshooting

### Permission Issues

```bash
# Fix ownership of output directory
sudo chown -R $(id -u):$(id -g) ai-renamed-images/
```

### API Key Not Found

Make sure your `.env.local` file exists and contains:
```
GOOGLE_API_KEY=your_actual_api_key
```

### Port Already in Use

```bash
# Use different port
docker-compose up airenamer-gui -p 8080:8000
```

### Volume Mount Issues

```bash
# Ensure directories exist
mkdir -p images ai-renamed-images

# Check absolute paths
docker-compose config
```

## Production Deployment

### Using Docker Hub

```bash
# Tag and push your image
docker tag airenamer:latest yourusername/airenamer:latest
docker push yourusername/airenamer:latest
```

### Using Docker Swarm

```bash
# Deploy as a service
docker service create \
  --name airenamer-gui \
  --publish 8000:8000 \
  --mount type=bind,source=$(pwd)/images,target=/app/input,readonly \
  --mount type=bind,source=$(pwd)/ai-renamed-images,target=/app/ai-renamed-images \
  --env-file .env.local \
  airenamer:latest
```

### Kubernetes Deployment

See `k8s/` directory for Kubernetes manifests (if available).

## Performance Tips

1. **Use bind mounts** instead of volumes for better performance
2. **Process images in batches** to avoid API rate limits
3. **Use SSD storage** for faster file operations
4. **Monitor memory usage** for large image files

## Security Notes

- API keys are mounted read-only
- Container runs as non-root user
- Input directory is mounted read-only
- No sensitive data stored in image

## Backup & Recovery

```bash
# Backup your renamed images
tar -czf ai-renamed-backup-$(date +%Y%m%d).tar.gz ai-renamed-images/

# Restore from backup
tar -xzf ai-renamed-backup-20241201.tar.gz
``` 
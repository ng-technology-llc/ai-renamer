# Use official Deno runtime as base image (newer version for lockfile compatibility)
FROM denoland/deno:1.45.5

# Set working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY deno.json ./

# Copy source code
COPY main.ts gui-server.ts main_test.ts ./
COPY gui/ ./gui/
COPY test/ ./test/

# Create directories for input/output
RUN mkdir -p /app/input /app/output /app/ai-renamed-images

# Cache dependencies (without lockfile to avoid version conflicts)
RUN deno cache main.ts gui-server.ts

# Create a non-root user for security
RUN groupadd -r airenamer && useradd -r -g airenamer airenamer
RUN chown -R airenamer:airenamer /app

# Switch to non-root user
USER airenamer

# Expose port for GUI version
EXPOSE 8000

# Default command (can be overridden)
CMD ["deno", "run", "--allow-read", "--allow-net", "--allow-write", "--allow-env", "main.ts"] 
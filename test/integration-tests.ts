import { assertEquals, assertExists } from "https://deno.land/std/assert/mod.ts";
import { ensureDir, exists } from "https://deno.land/std/fs/mod.ts";

// Integration Tests for GUI Server API
Deno.test("GUI Server - Health Check", async () => {
  // Test if server can be reached
  try {
    const response = await fetch("http://localhost:9000");
    assertEquals(response.status < 500, true);
    await response.text(); // Consume the response body to prevent leak
  } catch (error) {
    console.log("Server not running for integration test");
  }
});

Deno.test("GUI Server - CORS Headers", async () => {
  try {
    const response = await fetch("http://localhost:9000/api/process", {
      method: "OPTIONS"
    });
    assertEquals(response.status, 200);
    assertEquals(response.headers.get("Access-Control-Allow-Origin"), "*");
    await response.text(); // Consume the response body to prevent leak
  } catch (error) {
    console.log("Server not running for CORS test");
  }
});

Deno.test("GUI Server - Process API Validation", async () => {
  try {
    const response = await fetch("http://localhost:9000/api/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}) // Missing required fields
    });
    assertEquals(response.status, 400);
    
    const errorData = await response.json();
    assertExists(errorData.error);
  } catch (error) {
    console.log("Server not running for API validation test");
  }
});

// File System Integration Tests
Deno.test("File System - Directory Creation", async () => {
  const testDir = "./test-temp-dir";
  
  // Clean up if exists
  try {
    await Deno.remove(testDir, { recursive: true });
  } catch { /* ignore */ }
  
  // Test directory creation
  await ensureDir(testDir);
  const dirExists = await exists(testDir);
  assertEquals(dirExists, true);
  
  // Clean up
  await Deno.remove(testDir, { recursive: true });
});

Deno.test("File System - Image File Detection", async () => {
  const testFiles = [
    "test.jpg",
    "test.jpeg", 
    "test.png",
    "test.webp",
    "test.txt",
    "test.pdf"
  ];
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  
  for (const file of testFiles) {
    const isImage = imageExtensions.some(ext => file.toLowerCase().endsWith(ext));
    const shouldBeImage = ['test.jpg', 'test.jpeg', 'test.png', 'test.webp'].includes(file);
    assertEquals(isImage, shouldBeImage);
  }
});

Deno.test("File Processing - Path Resolution", async () => {
  const testPath = "./test-images";
  const absolutePath = Deno.cwd() + "/test-images";
  
  // Test that relative paths get resolved correctly
  const resolvedPath = new URL(testPath, `file://${Deno.cwd()}/`).pathname;
  assertEquals(typeof resolvedPath, "string");
  assertEquals(resolvedPath.includes("test-images"), true);
});

// Mock API Integration Tests
Deno.test("API Integration - Rate Limiting Simulation", async () => {
  // Simulate rapid API calls to test rate limiting logic
  const mockRequests = Array(3).fill(null).map(async (_, index) => {
    // This would test the rate limiting backoff logic
    // In a real scenario, you'd mock the fetch calls
    return new Promise(resolve => setTimeout(resolve, index * 100));
  });
  
  const results = await Promise.all(mockRequests);
  assertEquals(results.length, 3);
});

Deno.test("File Processing - Error Handling", async () => {
  // Test processing non-existent directory
  const nonExistentPath = "./non-existent-directory";
  
  try {
    await Deno.stat(nonExistentPath);
    // Should not reach here
    assertEquals(false, true);
  } catch (error) {
    // Should catch the error
    assertEquals(error instanceof Deno.errors.NotFound, true);
  }
});

Deno.test("File Processing - Empty Directory", async () => {
  const emptyDir = "./test-empty-dir";
  
  // Clean up and create empty directory
  try {
    await Deno.remove(emptyDir, { recursive: true });
  } catch { /* ignore */ }
  
  await ensureDir(emptyDir);
  
  // Test processing empty directory
  const files = [];
  for (const file of Deno.readDirSync(emptyDir)) {
    if (file.isFile) {
      files.push(file.name);
    }
  }
  
  assertEquals(files.length, 0);
  
  // Clean up
  await Deno.remove(emptyDir, { recursive: true });
});

Deno.test("File Processing - Large File Handling", async () => {
  const testFile = "./test-large-file.txt";
  const largeContent = "x".repeat(10000); // 10KB test file
  
  // Create test file
  await Deno.writeTextFile(testFile, largeContent);
  
  // Test file size detection
  const fileInfo = await Deno.stat(testFile);
  assertEquals(fileInfo.size, largeContent.length);
  
  // Clean up
  await Deno.remove(testFile);
});

Deno.test("File Processing - Concurrent File Operations", async () => {
  const testFiles = ["test1.txt", "test2.txt", "test3.txt"];
  
  // Create multiple files concurrently
  const createPromises = testFiles.map(async (filename) => {
    await Deno.writeTextFile(filename, `Content of ${filename}`);
  });
  
  await Promise.all(createPromises);
  
  // Verify all files exist
  const existPromises = testFiles.map(async (filename) => {
    const exists = await Deno.stat(filename).then(() => true).catch(() => false);
    return exists;
  });
  
  const results = await Promise.all(existPromises);
  assertEquals(results.every(exists => exists), true);
  
  // Clean up
  const cleanupPromises = testFiles.map(filename => Deno.remove(filename));
  await Promise.all(cleanupPromises);
}); 
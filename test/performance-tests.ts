import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts";

// Performance Tests for AI Image Renamer
Deno.test("Performance - File Processing Speed", async () => {
  const startTime = performance.now();
  
  // Create multiple test files to simulate batch processing
  const testFiles = Array.from({ length: 10 }, (_, i) => `test-perf-${i}.txt`);
  
  // Create files concurrently
  const createPromises = testFiles.map(async (filename) => {
    await Deno.writeTextFile(filename, `Test content for ${filename}`);
  });
  
  await Promise.all(createPromises);
  
  const createTime = performance.now() - startTime;
  console.log(`✅ Created ${testFiles.length} files in ${createTime.toFixed(2)}ms`);
  
  // Test concurrent file operations
  const processStartTime = performance.now();
  
  const readPromises = testFiles.map(async (filename) => {
    const content = await Deno.readTextFile(filename);
    return content.length;
  });
  
  const results = await Promise.all(readPromises);
  const processTime = performance.now() - processStartTime;
  
  console.log(`✅ Processed ${testFiles.length} files in ${processTime.toFixed(2)}ms`);
  
  // Verify all files were processed
  assertEquals(results.length, testFiles.length);
  assert(processTime < 1000, "File processing should complete within 1 second");
  
  // Clean up
  const cleanupPromises = testFiles.map(filename => Deno.remove(filename));
  await Promise.all(cleanupPromises);
});

Deno.test("Performance - Memory Usage with Large Files", async () => {
  const testFile = "./test-large-performance.txt";
  const largeContent = "x".repeat(1024 * 1024); // 1MB content
  
  const startTime = performance.now();
  
  // Create large file
  await Deno.writeTextFile(testFile, largeContent);
  
  // Read and process large file
  const fileData = await Deno.readTextFile(testFile);
  const fileSize = new Blob([fileData]).size;
  
  const endTime = performance.now();
  const processTime = endTime - startTime;
  
  console.log(`✅ Processed ${(fileSize / 1024 / 1024).toFixed(2)}MB file in ${processTime.toFixed(2)}ms`);
  
  assertEquals(fileData.length, largeContent.length);
  assert(processTime < 5000, "Large file processing should complete within 5 seconds");
  
  // Clean up
  await Deno.remove(testFile);
});

Deno.test("Performance - Concurrent API Simulation", async () => {
  const concurrentRequests = 5;
  const startTime = performance.now();
  
  // Simulate concurrent processing tasks
  const tasks = Array.from({ length: concurrentRequests }, async (_, index) => {
    const taskStart = performance.now();
    
    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    const taskEnd = performance.now();
    return {
      taskIndex: index,
      duration: taskEnd - taskStart
    };
  });
  
  const results = await Promise.all(tasks);
  const totalTime = performance.now() - startTime;
  
  console.log(`✅ Completed ${concurrentRequests} concurrent tasks in ${totalTime.toFixed(2)}ms`);
  
  assertEquals(results.length, concurrentRequests);
  assert(totalTime < 1000, "Concurrent tasks should complete within 1 second");
  
  // Verify all tasks completed
  results.forEach((result, index) => {
    assertEquals(result.taskIndex, index);
    assert(result.duration > 0, "Each task should have a positive duration");
  });
});

Deno.test("Performance - Filename Generation Speed", async () => {
  const { createFileName } = await import("../main.ts");
  
  const testCases = [
    { keywords: ["cat", "dog", "bird"], extension: "jpg" },
    { keywords: ["sunset", "beach", "ocean", "waves"], extension: "png" },
    { keywords: Array(20).fill("keyword"), extension: "webp" },
    { keywords: ["very", "long", "list", "of", "descriptive", "keywords", "for", "testing"], extension: "jpeg" }
  ];
  
  const startTime = performance.now();
  
  const results = testCases.map(testCase => {
    const filename = createFileName(testCase.keywords, testCase.extension);
    return filename;
  });
  
  const endTime = performance.now();
  const processTime = endTime - startTime;
  
  console.log(`✅ Generated ${testCases.length} filenames in ${processTime.toFixed(2)}ms`);
  
  assertEquals(results.length, testCases.length);
  assert(processTime < 100, "Filename generation should be very fast (< 100ms)");
  
  // Verify all filenames were generated
  results.forEach(filename => {
    assert(filename.length > 0, "Generated filename should not be empty");
    assert(filename.includes("."), "Generated filename should include file extension");
  });
});

Deno.test("Performance - Directory Scanning Speed", async () => {
  const testDir = "./test-performance-dir";
  const fileCount = 50;
  
  // Create test directory with many files
  await Deno.mkdir(testDir, { recursive: true });
  
  const fileCreationPromises = Array.from({ length: fileCount }, async (_, i) => {
    const filename = `${testDir}/test-file-${i}.jpg`;
    await Deno.writeTextFile(filename, `Test image ${i}`);
  });
  
  await Promise.all(fileCreationPromises);
  
  // Test directory scanning performance
  const scanStart = performance.now();
  
  const files = [];
  for (const entry of Deno.readDirSync(testDir)) {
    if (entry.isFile && entry.name.endsWith('.jpg')) {
      files.push(entry.name);
    }
  }
  
  const scanEnd = performance.now();
  const scanTime = scanEnd - scanStart;
  
  console.log(`✅ Scanned directory with ${fileCount} files in ${scanTime.toFixed(2)}ms`);
  
  assertEquals(files.length, fileCount);
  assert(scanTime < 500, "Directory scanning should be fast (< 500ms)");
  
  // Clean up
  await Deno.remove(testDir, { recursive: true });
});

Deno.test("Performance - Base64 Encoding Speed", async () => {
  const { encodeBase64 } = await import("https://deno.land/std@0.224.0/encoding/base64.ts");
  
  // Create test image data (simulated)
  const testImageData = new Uint8Array(1024 * 100); // 100KB of test data
  testImageData.fill(255); // Fill with dummy data
  
  const encodingStart = performance.now();
  
  const base64String = encodeBase64(testImageData);
  
  const encodingEnd = performance.now();
  const encodingTime = encodingEnd - encodingStart;
  
  console.log(`✅ Encoded ${(testImageData.length / 1024).toFixed(2)}KB to base64 in ${encodingTime.toFixed(2)}ms`);
  
  assert(base64String.length > 0, "Base64 string should not be empty");
  assert(encodingTime < 1000, "Base64 encoding should be fast (< 1 second)");
  
  // Verify encoding is valid base64
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  assert(base64Regex.test(base64String), "Generated string should be valid base64");
});

Deno.test("Performance - Error Handling Overhead", async () => {
  const iterations = 100;
  
  // Test performance with error handling
  const startTime = performance.now();
  
  const results = [];
  for (let i = 0; i < iterations; i++) {
    try {
      // Simulate operation that might fail
      if (Math.random() < 0.1) { // 10% failure rate
        throw new Error(`Simulated error ${i}`);
      }
      results.push(`Success ${i}`);
    } catch (error) {
      results.push(`Error ${i}`);
    }
  }
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  
  console.log(`✅ Handled ${iterations} operations with error handling in ${totalTime.toFixed(2)}ms`);
  
  assertEquals(results.length, iterations);
  assert(totalTime < 100, "Error handling should have minimal overhead");
  
  const successCount = results.filter(r => r.startsWith('Success')).length;
  const errorCount = results.filter(r => r.startsWith('Error')).length;
  
  console.log(`   Success: ${successCount}, Errors: ${errorCount}`);
  assert(successCount > 0, "Should have some successful operations");
}); 
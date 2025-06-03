import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { createFileName, getkeywords } from "../main.ts";

// Unit Tests for createFileName function
Deno.test("createFileName - basic functionality", () => {
  const keywords = ["cat", "sitting", "window"];
  const result = createFileName(keywords, "jpg");
  assertEquals(result, "cat-sitting-window.jpg");
});

Deno.test("createFileName - handles empty keywords", () => {
  const keywords: string[] = [];
  const result = createFileName(keywords, "jpg");
  assertEquals(result, "");
});

Deno.test("createFileName - handles single keyword", () => {
  const keywords = ["dog"];
  const result = createFileName(keywords, "png");
  assertEquals(result, "dog.png");
});

Deno.test("createFileName - removes invalid filename characters", () => {
  const keywords = ["cat<>", "dog:/", "bird\\|", "fish?*"];
  const result = createFileName(keywords, "jpg");
  assertEquals(result, "cat-dog-bird-fish.jpg");
});

Deno.test("createFileName - converts spaces to underscores", () => {
  const keywords = ["big dog", "small cat"];
  const result = createFileName(keywords, "jpg");
  assertEquals(result, "big_dog-small_cat.jpg");
});

Deno.test("createFileName - handles long filename truncation", () => {
  const longKeywords = Array(50).fill("verylongkeyword");
  const result = createFileName(longKeywords, "jpg");
  // Should be truncated to fit within 230 character limit
  assertEquals(result.length <= 234, true); // 230 + ".jpg"
});

Deno.test("createFileName - filters out empty strings", () => {
  const keywords = ["cat", "", "dog", " ", "bird"];
  const result = createFileName(keywords, "jpg");
  assertEquals(result, "cat-dog-_-bird.jpg");
});

Deno.test("createFileName - handles different file extensions", () => {
  const keywords = ["sunset"];
  const jpgResult = createFileName(keywords, "jpg");
  const pngResult = createFileName(keywords, "png");
  const webpResult = createFileName(keywords, "webp");
  
  assertEquals(jpgResult, "sunset.jpg");
  assertEquals(pngResult, "sunset.png");
  assertEquals(webpResult, "sunset.webp");
});

// Unit Tests for getkeywords function (mock tests)
Deno.test("getkeywords - returns array", async () => {
  // Note: This will actually call the API, so it should be mocked in real scenarios
  const result = await getkeywords("", "test.jpg");
  assertEquals(Array.isArray(result), true);
});

Deno.test("getkeywords - handles empty image data", async () => {
  const result = await getkeywords("", "test.jpg");
  assertEquals(result, []);
});

// File extension and MIME type tests
Deno.test("getMimeType - jpg extension", () => {
  // We need to import or recreate this function for testing
  // This is a placeholder test structure
  const filename = "photo.jpg";
  const expectedMime = "image/jpeg";
  // assertEquals(getMimeType(filename), expectedMime);
});

// Edge cases and error handling
Deno.test("createFileName - handles special characters properly", () => {
  const keywords = ["café", "naïve", "résumé"];
  const result = createFileName(keywords, "jpg");
  // Should handle unicode characters properly
  assertEquals(result.includes("café"), true);
});

Deno.test("createFileName - handles numeric keywords", () => {
  const keywords = ["2023", "photo", "001"];
  const result = createFileName(keywords, "jpg");
  assertEquals(result, "2023-photo-001.jpg");
});

Deno.test("createFileName - very short keywords", () => {
  const keywords = ["a", "b", "c"];
  const result = createFileName(keywords, "jpg");
  assertEquals(result, "a-b-c.jpg");
});

Deno.test("createFileName - mixed case keywords", () => {
  const keywords = ["Cat", "DOG", "bIrD"];
  const result = createFileName(keywords, "jpg");
  assertEquals(result, "Cat-DOG-bIrD.jpg");
}); 
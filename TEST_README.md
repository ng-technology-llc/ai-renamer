# 🧪 AI Image Renamer - QA Testing Suite

This directory contains comprehensive test scripts and quality assurance tools for the AI Image Renamer application.

## 📁 Test Structure

```
test/
├── unit-tests.ts           # Unit tests for core functions
├── integration-tests.ts    # API and file system integration tests
├── performance-tests.ts    # Performance benchmarks and load tests
├── security-tests.ts       # Security vulnerability tests
├── e2e-tests.ts           # End-to-end workflow tests
├── test-runner.ts         # Comprehensive test runner with reporting
└── README.md              # This file

scripts/
└── qa-scripts.ts          # QA automation utilities

main_test.ts               # Original test file
```

## 🚀 Quick Start

### Run All Tests
```bash
# Run comprehensive test suite with detailed reporting
deno run --allow-all test/test-runner.ts

# Run with verbose output
deno run --allow-all test/test-runner.ts --verbose
```

### Run Individual Test Suites
```bash
# Unit tests
deno test --allow-all test/unit-tests.ts

# Integration tests
deno test --allow-all test/integration-tests.ts

# Performance tests
deno test --allow-all test/performance-tests.ts

# Security tests
deno test --allow-all test/security-tests.ts

# End-to-end tests
deno test --allow-all test/e2e-tests.ts
```

## 🔧 QA Automation Scripts

The `scripts/qa-scripts.ts` provides automated QA workflows:

### Generate Test Data
```bash
# Generate 5 test images (default)
deno run --allow-all scripts/qa-scripts.ts generate-test-data

# Generate 20 test images
deno run --allow-all scripts/qa-scripts.ts generate-test-data 20
```

### Run Quick Tests (Development)
```bash
# Run fast unit tests for development feedback
deno run --allow-all scripts/qa-scripts.ts run-quick-tests
```

### Code Quality Checks
```bash
# Run formatting, linting, and type checks
deno run --allow-all scripts/qa-scripts.ts check-code-quality
```

### Security Audit
```bash
# Run security vulnerability tests
deno run --allow-all scripts/qa-scripts.ts security-audit
```

### Performance Benchmarks
```bash
# Run performance tests and generate report
deno run --allow-all scripts/qa-scripts.ts benchmark-performance
```

### Test Coverage
```bash
# Generate test coverage report
deno run --allow-all scripts/qa-scripts.ts generate-coverage
```

### Full CI/CD Pipeline
```bash
# Run complete quality assurance pipeline
deno run --allow-all scripts/qa-scripts.ts ci-pipeline
```

### Cleanup
```bash
# Clean up all test files and directories
deno run --allow-all scripts/qa-scripts.ts cleanup-test-data
```

## 📊 Test Categories

### 1. Unit Tests (`test/unit-tests.ts`)
Tests individual functions in isolation:
- `createFileName()` function with various inputs
- Input validation and sanitization
- Edge cases and error handling
- Unicode and special character support

**Example:**
```typescript
Deno.test("createFileName - basic functionality", () => {
  const keywords = ["cat", "sitting", "window"];
  const result = createFileName(keywords, "jpg");
  assertEquals(result, "cat-sitting-window.jpg");
});
```

### 2. Integration Tests (`test/integration-tests.ts`)
Tests component interactions:
- GUI server API endpoints
- File system operations
- CORS handling
- Error responses
- Concurrent operations

**Key Areas:**
- API validation
- Directory creation and management
- File processing workflows
- Server health checks

### 3. Performance Tests (`test/performance-tests.ts`)
Benchmarks and performance validation:
- File processing speed
- Memory usage with large files
- Concurrent request handling
- Directory scanning performance
- Base64 encoding speed

**Metrics Tracked:**
- Processing time per file
- Memory consumption
- Concurrent operation throughput
- API response times

### 4. Security Tests (`test/security-tests.ts`)
Security vulnerability assessments:
- Path traversal prevention
- Input sanitization
- File extension validation
- Unicode handling
- Script injection prevention
- Resource limit testing

**Security Checks:**
- Malicious path inputs
- Invalid filename characters
- Long input handling
- Environment variable safety

### 5. End-to-End Tests (`test/e2e-tests.ts`)
Complete workflow testing:
- Full image processing pipeline
- GUI server integration
- Multiple file scenarios
- Error recovery
- File system operations

**Scenarios:**
- Happy path workflows
- Error conditions
- Large dataset processing
- Static file serving

## 📋 Test Reports

### Test Runner Report
The test runner generates comprehensive reports:

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "summary": {
    "total": 45,
    "passed": 42,
    "failed": 2,
    "skipped": 1,
    "passRate": "93.3",
    "totalTime": "1234.56"
  },
  "qualityMetrics": {
    "reliability": 95,
    "security": 100,
    "performance": 88
  }
}
```

### Quality Metrics
- **Pass Rate**: Percentage of tests passing
- **Reliability Score**: Based on integration/e2e tests
- **Security Score**: Based on security test results
- **Performance Score**: Based on performance benchmarks

## 🎯 Quality Standards

### Code Quality Criteria
- ✅ All unit tests pass
- ✅ Integration tests pass
- ✅ No security vulnerabilities
- ✅ Performance within benchmarks
- ✅ Code formatting consistent
- ✅ No linting errors
- ✅ Type safety maintained

### Performance Benchmarks
- File processing: < 1 second for 10 files
- Memory usage: < 100MB peak
- API response: < 500ms
- Directory scanning: < 200ms for 50 files

### Security Requirements
- ❌ No path traversal vulnerabilities
- ❌ No script injection possible
- ❌ No sensitive data exposure
- ✅ Input sanitization working
- ✅ File permissions respected

## 🔄 Continuous Integration

### Pre-commit Checks
```bash
# Quick validation before committing
deno run --allow-all scripts/qa-scripts.ts run-quick-tests
```

### Full CI Pipeline
```bash
# Complete validation pipeline
deno run --allow-all scripts/qa-scripts.ts ci-pipeline
```

The CI pipeline includes:
1. **Code Quality Check** - Formatting, linting, types
2. **Security Audit** - Vulnerability scanning
3. **Full Test Suite** - All test categories
4. **Performance Benchmarks** - Speed and memory tests
5. **Coverage Report** - Test coverage analysis

## 🛠️ Development Workflow

### Adding New Tests
1. Choose appropriate test category
2. Follow existing naming conventions
3. Include both positive and negative test cases
4. Add documentation comments
5. Update this README if needed

### Test Naming Convention
```typescript
// Format: "Category - Specific Test Case"
Deno.test("createFileName - handles empty keywords", () => {
  // Test implementation
});
```

### Best Practices
- Keep tests focused and atomic
- Use descriptive test names
- Include edge cases
- Mock external dependencies
- Clean up test artifacts
- Validate error conditions

## 📈 Monitoring and Reporting

### Automated Reports
- Test execution results
- Performance benchmarks
- Security scan results
- Code coverage metrics
- Quality trend analysis

### Manual Verification
- Visual inspection of processed images
- User interface testing
- Browser compatibility
- Error message clarity

## 🐛 Troubleshooting

### Common Issues

**Server Not Running**
```bash
# Start the GUI server first
deno run --allow-all gui-server.ts
```

**Permission Errors**
```bash
# Ensure proper permissions
chmod +x scripts/qa-scripts.ts
```

**Test Data Issues**
```bash
# Clean and regenerate test data
deno run --allow-all scripts/qa-scripts.ts cleanup-test-data
deno run --allow-all scripts/qa-scripts.ts generate-test-data
```

### Environment Setup
```bash
# Verify Deno installation
deno --version

# Check required permissions
deno run --allow-all --help
```

## 📚 Additional Resources

- [Deno Testing Documentation](https://deno.land/manual/testing)
- [Test-Driven Development Best Practices](https://deno.land/manual/testing/assertions)
- [Security Testing Guidelines](https://owasp.org/www-project-web-security-testing-guide/)
- [Performance Testing Strategies](https://deno.land/manual/testing/performance)

## 🤝 Contributing

When adding new tests or features:

1. **Write tests first** (TDD approach)
2. **Run the full test suite** before submitting
3. **Update documentation** for new test cases
4. **Follow security best practices**
5. **Ensure performance standards** are met

### Code Review Checklist
- [ ] All tests pass
- [ ] Security tests included
- [ ] Performance impact assessed
- [ ] Documentation updated
- [ ] Error handling tested
- [ ] Edge cases covered

---

**💡 Pro Tip**: Use the `--verbose` flag with test runner for detailed output during development and debugging.

**🔒 Security Note**: Always run security tests when modifying file handling or user input processing code.

**⚡ Performance Tip**: Use quick tests during development, full suite before commits. 
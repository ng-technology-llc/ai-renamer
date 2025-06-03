#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env

/**
 * Comprehensive Test Runner for AI Image Renamer
 * 
 * This script runs all test suites and generates detailed reports
 * Usage: deno run --allow-read --allow-write --allow-net --allow-env test/test-runner.ts
 */

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  duration: number;
  error?: string;
}

interface TestSuite {
  name: string;
  file: string;
  results: TestResult[];
  totalTime: number;
  passed: number;
  failed: number;
  skipped: number;
}

class TestRunner {
  private suites: TestSuite[] = [];
  private startTime: number = 0;
  private verbose: boolean = false;

  constructor(verbose = false) {
    this.verbose = verbose;
  }

  async runAllTests(): Promise<void> {
    console.log("🧪 AI Image Renamer - Comprehensive Test Suite");
    console.log("=" .repeat(60));
    
    this.startTime = performance.now();

    const testFiles = [
      { name: "Unit Tests", file: "./test/unit-tests.ts" },
      { name: "Integration Tests", file: "./test/integration-tests.ts" },
      { name: "Performance Tests", file: "./test/performance-tests.ts" },
      { name: "Security Tests", file: "./test/security-tests.ts" },
      { name: "End-to-End Tests", file: "./test/e2e-tests.ts" },
      { name: "Original Tests", file: "./main_test.ts" }
    ];

    for (const testFile of testFiles) {
      await this.runTestSuite(testFile.name, testFile.file);
    }

    this.generateReport();
  }

  private async runTestSuite(suiteName: string, testFile: string): Promise<void> {
    console.log(`\n📋 Running ${suiteName}...`);
    console.log("-".repeat(40));

    const suite: TestSuite = {
      name: suiteName,
      file: testFile,
      results: [],
      totalTime: 0,
      passed: 0,
      failed: 0,
      skipped: 0
    };

    const suiteStartTime = performance.now();

    try {
      // Check if test file exists
      try {
        await Deno.stat(testFile);
      } catch {
        console.log(`⚠️  Test file not found: ${testFile}`);
        suite.results.push({
          name: "File Check",
          status: 'SKIP',
          duration: 0,
          error: `Test file not found: ${testFile}`
        });
        suite.skipped++;
        this.suites.push(suite);
        return;
      }

      // Run the test file
      const process = new Deno.Command("deno", {
        args: [
          "test",
          "--allow-all",
          testFile
        ],
        stdout: "piped",
        stderr: "piped"
      });

      const { stdout, stderr, success } = await process.output();
      const output = new TextDecoder().decode(stdout);
      const errorOutput = new TextDecoder().decode(stderr);

      // Parse test results from output
      this.parseTestResults(output, suite);

      if (!success && errorOutput) {
        console.log(`❌ Test suite failed: ${suiteName}`);
        if (this.verbose) {
          console.log(`Error output: ${errorOutput}`);
        }
      }

    } catch (error) {
      console.log(`❌ Error running test suite ${suiteName}: ${error.message}`);
      suite.results.push({
        name: "Suite Execution",
        status: 'FAIL',
        duration: 0,
        error: error.message
      });
      suite.failed++;
    }

    suite.totalTime = performance.now() - suiteStartTime;
    this.suites.push(suite);

    // Display immediate results
    const total = suite.passed + suite.failed + suite.skipped;
    console.log(`✅ Passed: ${suite.passed}`);
    console.log(`❌ Failed: ${suite.failed}`);
    console.log(`⏭️  Skipped: ${suite.skipped}`);
    console.log(`⏱️  Time: ${suite.totalTime.toFixed(2)}ms`);
  }

  private parseTestResults(output: string, suite: TestSuite): void {
    const lines = output.split('\n');
    let currentTest = '';
    
    for (const line of lines) {
      // Parse test results from Deno test output
      if (line.includes('test ')) {
        // Extract test name and result
        const testMatch = line.match(/test (.+?) \.\.\. (.+?) \((.+?)\)/);
        if (testMatch) {
          const [, testName, status, duration] = testMatch;
          const durationMs = this.parseDuration(duration);
          
          const result: TestResult = {
            name: testName,
            status: this.mapStatus(status),
            duration: durationMs
          };

          if (result.status === 'FAIL') {
            result.error = `Test failed: ${testName}`;
          }

          suite.results.push(result);
          
          switch (result.status) {
            case 'PASS':
              suite.passed++;
              break;
            case 'FAIL':
              suite.failed++;
              break;
            case 'SKIP':
              suite.skipped++;
              break;
          }
        }
      }
    }

    // If no results parsed, assume suite ran but had no output
    if (suite.results.length === 0) {
      suite.results.push({
        name: "Suite Output",
        status: 'SKIP',
        duration: 0,
        error: "No test results could be parsed from output"
      });
      suite.skipped++;
    }
  }

  private parseDuration(durationStr: string): number {
    const match = durationStr.match(/(\d+(?:\.\d+)?)(ms|s|μs)/);
    if (!match) return 0;

    const [, value, unit] = match;
    const numValue = parseFloat(value);

    switch (unit) {
      case 's': return numValue * 1000;
      case 'ms': return numValue;
      case 'μs': return numValue / 1000;
      default: return numValue;
    }
  }

  private mapStatus(status: string): 'PASS' | 'FAIL' | 'SKIP' {
    switch (status.toLowerCase()) {
      case 'ok':
      case 'passed':
        return 'PASS';
      case 'failed':
      case 'error':
        return 'FAIL';
      case 'ignored':
      case 'skipped':
        return 'SKIP';
      default:
        return 'FAIL';
    }
  }

  private generateReport(): void {
    const totalTime = performance.now() - this.startTime;
    
    console.log("\n" + "=".repeat(60));
    console.log("📊 TEST SUMMARY REPORT");
    console.log("=".repeat(60));

    let totalPassed = 0;
    let totalFailed = 0;
    let totalSkipped = 0;
    let totalTests = 0;

    // Suite-by-suite breakdown
    for (const suite of this.suites) {
      console.log(`\n📋 ${suite.name}`);
      console.log(`   File: ${suite.file}`);
      console.log(`   ✅ Passed: ${suite.passed}`);
      console.log(`   ❌ Failed: ${suite.failed}`);
      console.log(`   ⏭️  Skipped: ${suite.skipped}`);
      console.log(`   ⏱️  Time: ${suite.totalTime.toFixed(2)}ms`);

      totalPassed += suite.passed;
      totalFailed += suite.failed;
      totalSkipped += suite.skipped;
      totalTests += suite.passed + suite.failed + suite.skipped;

      // Show failed tests
      if (suite.failed > 0 && this.verbose) {
        console.log(`   📋 Failed Tests:`);
        for (const result of suite.results) {
          if (result.status === 'FAIL') {
            console.log(`      - ${result.name}: ${result.error || 'Unknown error'}`);
          }
        }
      }
    }

    // Overall summary
    console.log("\n" + "=".repeat(60));
    console.log("🎯 OVERALL RESULTS");
    console.log("=".repeat(60));
    console.log(`📊 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${totalPassed} (${((totalPassed / totalTests) * 100).toFixed(1)}%)`);
    console.log(`❌ Failed: ${totalFailed} (${((totalFailed / totalTests) * 100).toFixed(1)}%)`);
    console.log(`⏭️  Skipped: ${totalSkipped} (${((totalSkipped / totalTests) * 100).toFixed(1)}%)`);
    console.log(`⏱️  Total Time: ${totalTime.toFixed(2)}ms`);

    // Generate quality metrics
    this.generateQualityMetrics(totalPassed, totalFailed, totalSkipped);

    // Save detailed report
    this.saveDetailedReport(totalPassed, totalFailed, totalSkipped, totalTime);
  }

  private generateQualityMetrics(passed: number, failed: number, skipped: number): void {
    const total = passed + failed + skipped;
    const passRate = total > 0 ? (passed / total) * 100 : 0;
    
    console.log("\n🔍 QUALITY METRICS");
    console.log("-".repeat(40));
    
    if (passRate >= 95) {
      console.log("🏆 EXCELLENT - Test coverage and quality is excellent!");
    } else if (passRate >= 80) {
      console.log("👍 GOOD - Test coverage is good, minor issues detected");
    } else if (passRate >= 60) {
      console.log("⚠️  NEEDS IMPROVEMENT - Several test failures detected");
    } else {
      console.log("🚨 CRITICAL - Significant test failures, immediate attention required");
    }

    console.log(`📈 Pass Rate: ${passRate.toFixed(1)}%`);
    console.log(`🎯 Reliability Score: ${this.calculateReliabilityScore()}%`);
    console.log(`🔒 Security Score: ${this.calculateSecurityScore()}%`);
    console.log(`⚡ Performance Score: ${this.calculatePerformanceScore()}%`);
  }

  private calculateReliabilityScore(): number {
    // Based on integration and e2e test results
    const reliabilitySuites = this.suites.filter(s => 
      s.name.includes('Integration') || s.name.includes('End-to-End')
    );
    
    if (reliabilitySuites.length === 0) return 0;
    
    const totalTests = reliabilitySuites.reduce((sum, s) => sum + s.passed + s.failed, 0);
    const passedTests = reliabilitySuites.reduce((sum, s) => sum + s.passed, 0);
    
    return totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  }

  private calculateSecurityScore(): number {
    // Based on security test results
    const securitySuites = this.suites.filter(s => s.name.includes('Security'));
    
    if (securitySuites.length === 0) return 0;
    
    const totalTests = securitySuites.reduce((sum, s) => sum + s.passed + s.failed, 0);
    const passedTests = securitySuites.reduce((sum, s) => sum + s.passed, 0);
    
    return totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  }

  private calculatePerformanceScore(): number {
    // Based on performance test results
    const performanceSuites = this.suites.filter(s => s.name.includes('Performance'));
    
    if (performanceSuites.length === 0) return 0;
    
    const totalTests = performanceSuites.reduce((sum, s) => sum + s.passed + s.failed, 0);
    const passedTests = performanceSuites.reduce((sum, s) => sum + s.passed, 0);
    
    return totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  }

  private async saveDetailedReport(passed: number, failed: number, skipped: number, totalTime: number): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: passed + failed + skipped,
        passed,
        failed,
        skipped,
        passRate: ((passed / (passed + failed + skipped)) * 100).toFixed(1),
        totalTime: totalTime.toFixed(2)
      },
      suites: this.suites.map(suite => ({
        name: suite.name,
        file: suite.file,
        passed: suite.passed,
        failed: suite.failed,
        skipped: suite.skipped,
        totalTime: suite.totalTime.toFixed(2),
        tests: suite.results
      })),
      qualityMetrics: {
        reliability: this.calculateReliabilityScore(),
        security: this.calculateSecurityScore(),
        performance: this.calculatePerformanceScore()
      }
    };

    try {
      await Deno.writeTextFile("test-report.json", JSON.stringify(report, null, 2));
      console.log("\n💾 Detailed report saved to: test-report.json");
    } catch (error) {
      console.log(`⚠️  Could not save detailed report: ${error.message}`);
    }
  }
}

// Main execution
if (import.meta.main) {
  const verbose = Deno.args.includes('--verbose') || Deno.args.includes('-v');
  const runner = new TestRunner(verbose);
  
  try {
    await runner.runAllTests();
  } catch (error) {
    console.error(`❌ Test runner failed: ${error.message}`);
    Deno.exit(1);
  }
} 
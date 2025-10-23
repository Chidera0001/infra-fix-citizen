#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the system test results JSON file
const resultsPath = path.join(__dirname, '..', 'system-test-results.json');

if (!fs.existsSync(resultsPath)) {
  console.log(
    '❌ No system test results found. Please run system tests first with: npm run test:system:run'
  );
  process.exit(1);
}

try {
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

  // Extract test summary
  const totalTests = results.numTotalTests;
  const passedTests = results.numPassedTests;
  const failedTests = results.numFailedTests;
  const passRate = ((passedTests / totalTests) * 100).toFixed(1);

  // Extract file results
  const testFiles = results.testResults.map(file => {
    const fileName = file.name
      .split('/')
      .pop()
      .replace('.system.test.tsx', '')
      .replace('.system.test.ts', '');

    const passed = file.assertionResults.filter(
      test => test.status === 'passed'
    ).length;
    const total = file.assertionResults.length;
    const failed = file.assertionResults.filter(
      test => test.status === 'failed'
    ).length;

    return {
      name: fileName,
      passed: passed,
      total: total,
      status: failed === 0 ? '✅' : '❌',
    };
  });

  // Create a clean summary table
  console.log('\n🌐 SYSTEM TESTING RESULTS SUMMARY 🌐\n');
  console.log('═'.repeat(60));
  console.log('📊 OVERALL RESULTS:');
  console.log('─'.repeat(60));
  console.log(`Total Tests:     ${totalTests}`);
  console.log(`Passed:         ${passedTests} ✅`);
  console.log(`Failed:         ${failedTests} ❌`);
  console.log(`Pass Rate:      ${passRate}% 🎯`);
  console.log('═'.repeat(60));
  console.log('📁 SYSTEM TEST FILES STATUS:');
  console.log('─'.repeat(60));

  testFiles.forEach(file => {
    const status = file.status;
    const name = file.name;
    const result = `${file.passed}/${file.total}`;
    console.log(`${status} ${name.padEnd(50)} ${result}`);
  });

  console.log('═'.repeat(60));
  console.log('🎯 SUMMARY:');
  console.log('─'.repeat(60));
  console.log(
    `✅ ${testFiles.filter(f => f.status === '✅').length} files passed completely`
  );
  console.log(
    `❌ ${testFiles.filter(f => f.status === '❌').length} files had failures`
  );
  console.log(`🏆 Overall Success Rate: ${passRate}%`);
  console.log('═'.repeat(60));
  console.log('🌐 SYSTEM TESTS COVERED:');
  console.log('─'.repeat(60));

  // Extract and display major system test cases
  const majorTests = [];
  results.testResults.forEach(file => {
    const fileName = file.name
      .split('/')
      .pop()
      .replace('.system.test.tsx', '')
      .replace('.system.test.ts', '');

    file.assertionResults.forEach(test => {
      if (test.status === 'passed') {
        majorTests.push({
          file: fileName,
          test: test.title,
          duration: test.duration,
        });
      }
    });
  });

  // Sort by duration (longest first) and take top 15
  const topTests = majorTests
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 15);

  topTests.forEach((test, index) => {
    const duration = test.duration ? `${test.duration.toFixed(0)}ms` : 'N/A';
    console.log(`${index + 1}. [${test.file}] ${test.test} (${duration})`);
  });

  console.log('═'.repeat(60));

  if (passRate === '100.0') {
    console.log('🎉 PERFECT SYSTEM! All tests passed! 🎉');
  } else if (passRate >= '90.0') {
    console.log('🌟 EXCELLENT! Almost perfect system! 🌟');
  } else if (passRate >= '80.0') {
    console.log('👍 GOOD! Solid system coverage! 👍');
  } else {
    console.log('⚠️  NEEDS IMPROVEMENT! Some system tests failed! ⚠️');
  }

  console.log('═'.repeat(60));
  console.log('\n📸 Perfect for screenshots! 📸\n');
} catch (error) {
  console.error('❌ Error reading system test results:', error.message);
  process.exit(1);
}

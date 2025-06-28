#!/usr/bin/env node

/**
 * Test runner script for OCR testing suite
 * 
 * Usage:
 *   node tests/run-tests.js [suite] [options]
 * 
 * Suites:
 *   unit        - Run unit tests only
 *   integration - Run integration tests only
 *   performance - Run performance benchmarks
 *   accuracy    - Run accuracy tests
 *   all         - Run all test suites (default)
 * 
 * Options:
 *   --watch     - Run in watch mode
 *   --coverage  - Generate coverage report
 *   --ui        - Run with UI
 *   --reporter  - Specify reporter (json, verbose, etc.)
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const testConfig = {
  unit: {
    command: 'vitest',
    args: ['run', 'tests/unit'],
    description: 'Unit tests for individual components'
  },
  integration: {
    command: 'vitest',
    args: ['run', '--config', 'vitest.ocr.config.ts', 'tests/integration'],
    description: 'End-to-end integration tests'
  },
  performance: {
    command: 'vitest',
    args: ['run', '--config', 'vitest.ocr.config.ts', 'tests/performance'],
    description: 'Performance benchmarks and timing tests'
  },
  accuracy: {
    command: 'vitest',
    args: ['run', '--config', 'vitest.ocr.config.ts', 'tests/accuracy'],
    description: 'OCR accuracy and quality measurements'
  },
  all: {
    command: 'vitest',
    args: ['run'],
    description: 'All test suites'
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const suite = args[0] || 'all';
const options = args.slice(1);

// Validate suite
if (!testConfig[suite]) {
  console.error(`❌ Unknown test suite: ${suite}`);
  console.log('\n📋 Available test suites:');
  Object.entries(testConfig).forEach(([name, config]) => {
    console.log(`  ${name.padEnd(12)} - ${config.description}`);
  });
  process.exit(1);
}

// Prepare command and arguments
const config = testConfig[suite];
let command = config.command;
let commandArgs = [...config.args];

// Process options
if (options.includes('--watch')) {
  commandArgs = commandArgs.filter(arg => arg !== 'run');
  commandArgs.push('--watch');
}

if (options.includes('--coverage')) {
  commandArgs.push('--coverage');
}

if (options.includes('--ui')) {
  commandArgs.push('--ui');
}

const reporterIndex = options.indexOf('--reporter');
if (reporterIndex !== -1 && reporterIndex + 1 < options.length) {
  commandArgs.push('--reporter', options[reporterIndex + 1]);
}

// Ensure test results directory exists
const testResultsDir = path.join(process.cwd(), 'test-results');
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

// Display test information
console.log(`🧪 Running OCR Tests: ${suite}`);
console.log(`📝 Description: ${config.description}`);
console.log(`🔧 Command: ${command} ${commandArgs.join(' ')}`);
console.log('');

// Run tests
const testProcess = spawn(command, commandArgs, {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

testProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Tests completed successfully!');
    
    // Show additional information based on suite
    if (suite === 'performance' || suite === 'all') {
      console.log('\n📊 Performance results saved to test-results/');
    }
    
    if (suite === 'accuracy' || suite === 'all') {
      console.log('🎯 Accuracy metrics calculated and logged');
    }
    
    if (options.includes('--coverage')) {
      console.log('📈 Coverage report generated in coverage/');
    }
    
  } else {
    console.error(`\n❌ Tests failed with exit code ${code}`);
    
    // Provide helpful debugging information
    console.log('\n🔧 Debugging tips:');
    console.log('- Check that all dependencies are installed: npm install');
    console.log('- Verify test setup is correct: npm run test:unit first');
    console.log('- For OCR-specific tests, ensure workers can be initialized');
    console.log('- Check browser console for additional error details');
  }
  
  process.exit(code);
});

testProcess.on('error', (error) => {
  console.error(`❌ Failed to start test process: ${error.message}`);
  process.exit(1);
});

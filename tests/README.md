# OCR Testing Framework

This comprehensive testing framework is designed to validate the OCR service functionality across different document types, languages, and quality levels.

## 🏗️ Test Architecture

```
tests/
├── unit/              # Unit tests for individual components
├── integration/       # End-to-end pipeline tests
├── performance/       # Performance benchmarks
├── accuracy/          # OCR accuracy measurements
├── fixtures/          # Test documents and data
├── helpers/           # Test utilities and helpers
└── setup.ts          # Global test configuration
```

## 🧪 Test Categories

### 1. Unit Tests (`tests/unit/`)
- Test individual OCR service methods
- Mock external dependencies (Tesseract.js, opencc-js)
- Fast execution, focused on logic validation
- **Purpose**: Ensure core functionality works correctly in isolation

### 2. Integration Tests (`tests/integration/`)
- Test complete OCR pipeline from image to text
- Use real test documents and images
- Validate end-to-end workflows
- **Purpose**: Ensure all components work together correctly

### 3. Performance Tests (`tests/performance/`)
- Measure processing times and throughput
- Test memory usage and resource management
- Benchmark worker initialization and reuse
- **Purpose**: Identify performance bottlenecks and regressions

### 4. Accuracy Tests (`tests/accuracy/`)
- Measure OCR text recognition quality
- Character-level and word-level accuracy
- Language detection precision/recall
- **Purpose**: Ensure OCR quality meets requirements

## 🚀 Running Tests

### Quick Start

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:unit
npm run test:integration
npm run test:performance
npm run test:accuracy

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

### Advanced Usage

```bash
# Run specific test suite with custom options
node tests/run-tests.js performance --reporter json

# Watch mode for development
npm run test:unit --watch

# OCR-specific tests (long-running)
npm run test:ocr
```

## 📋 Test Scripts

| Script | Description | Duration |
|--------|-------------|----------|
| `npm test` | All test suites | ~5-10 min |
| `npm run test:unit` | Unit tests only | ~30 sec |
| `npm run test:integration` | Integration tests | ~2-5 min |
| `npm run test:performance` | Performance benchmarks | ~3-7 min |
| `npm run test:accuracy` | Accuracy measurements | ~2-5 min |
| `npm run test:ocr` | All OCR-specific tests | ~5-10 min |

## 🔧 Test Configuration

### Vitest Configuration
- **Main**: `vitest.config.ts` - Standard tests
- **OCR**: `vitest.ocr.config.ts` - Long-running OCR tests

### Test Environment
- **Environment**: JSDOM for browser APIs
- **Timeout**: 30s for standard tests, 120s for OCR tests
- **Concurrency**: Disabled for OCR tests to prevent worker conflicts
- **Mocks**: Canvas API, FileReader, Image, Blob, URL

## 📊 Test Documents

The framework includes a comprehensive set of test documents:

### Document Types
- **Contracts**: Legal agreements in multiple languages
- **Invoices**: Business documents with tables
- **Letters**: Simple text documents
- **Technical**: Manuals and specifications
- **Forms**: Mixed handwritten and printed text

### Languages Covered
- **English**: High-quality standard documents
- **Chinese (Simplified)**: Modern Chinese text
- **Chinese (Traditional)**: Traditional Chinese characters
- **Multi-language**: Documents with multiple languages

### Quality Levels
- **High**: Clean, high-resolution scans
- **Medium**: Some compression artifacts
- **Low**: Poor quality, noisy images

### Difficulty Levels
- **Easy**: Clear text, simple layouts
- **Medium**: Some complexity in layout or text
- **Hard**: Complex layouts, poor quality, or handwritten text

## 🎯 Accuracy Metrics

### Character-Level Accuracy
```typescript
accuracy = (total_chars - edit_distance) / total_chars
```

### Word-Level Accuracy
```typescript
accuracy = correct_words / total_words
```

### Language Detection Metrics
- **Precision**: `true_positives / (true_positives + false_positives)`
- **Recall**: `true_positives / (true_positives + false_negatives)`
- **F1 Score**: `2 * (precision * recall) / (precision + recall)`

## 📈 Performance Metrics

### Timing Measurements
- Language detection time
- Text extraction time
- Worker initialization time
- End-to-end processing time

### Resource Usage
- Memory consumption
- Worker resource usage
- Cache hit/miss rates

### Benchmarks
- Single-language documents: < 20s average
- Multi-language documents: < 60s average
- Language detection: < 15s average
- Worker initialization: < 30s

## 🔍 Test Utilities

### Helper Functions
- `calculateCharacterAccuracy()` - Character-level OCR accuracy
- `calculateWordAccuracy()` - Word-level OCR accuracy
- `validateLanguageDetection()` - Language detection metrics
- `PerformanceTracker` - Performance measurement
- `TestReporter` - Test result collection

### Mock Data
- Sample test images (base64 encoded)
- Expected text outputs
- Language detection expectations
- Test document factory functions

## 🛠️ Adding New Tests

### 1. Unit Tests
```typescript
// tests/unit/NewFeature.test.ts
import { describe, it, expect } from 'vitest';
import { OCRService } from '@/utils/OCRService';

describe('New Feature', () => {
  it('should work correctly', async () => {
    // Test implementation
  });
});
```

### 2. Test Documents
```typescript
// tests/fixtures/test-documents.ts
export const NEW_TEST_DOCUMENT: TestDocument = {
  id: 'new-001',
  name: 'New Test Document',
  description: 'Description of the test',
  imageData: 'data:image/png;base64,...',
  expectedText: 'Expected OCR output',
  expectedLanguages: ['eng'],
  difficulty: 'medium',
  documentType: 'contract',
  quality: 'high'
};
```

### 3. Performance Tests
```typescript
// tests/performance/new-feature.test.ts
import { PerformanceTracker } from '@tests/helpers/test-utils';

it('should perform efficiently', async () => {
  const tracker = new PerformanceTracker();
  tracker.start();
  
  // Test operation
  
  const duration = tracker.end('test-operation');
  expect(duration).toBeLessThan(5000); // 5 seconds
});
```

## 🎯 Testing Best Practices

### 1. Test Isolation
- Each test should be independent
- Clean up resources after each test
- Use proper beforeEach/afterEach hooks

### 2. Meaningful Assertions
- Test actual functionality, not just existence
- Use appropriate assertion methods
- Include helpful error messages

### 3. Performance Considerations
- Group long-running tests appropriately
- Use timeouts for async operations
- Monitor memory usage in long tests

### 4. Maintainability
- Use descriptive test names
- Keep tests focused and simple
- Document complex test scenarios

## 🔧 Troubleshooting

### Common Issues

#### Tests Timeout
- Increase timeout in test configuration
- Check for proper async/await usage
- Verify worker cleanup

#### Mock-Related Errors
- Ensure proper mocking setup
- Check mock return values
- Verify mock implementations match real APIs

#### OCR-Specific Issues
- Check Tesseract.js worker initialization
- Verify language model availability
- Test with simpler documents first

### Debugging Tips

1. **Run tests individually**: Isolate failing tests
2. **Check console output**: Look for detailed error messages
3. **Use test UI**: `npm run test:ui` for interactive debugging
4. **Verify setup**: Ensure all dependencies are installed
5. **Check file paths**: Verify test file and fixture paths

## 📖 Integration with CI/CD

### GitHub Actions Example
```yaml
name: OCR Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:coverage
```

### Performance Monitoring
- Track test execution times
- Monitor accuracy regressions
- Set up alerts for performance degradation

## 🚧 Future Enhancements

### Planned Improvements
1. **Real Image Testing**: Replace mock images with actual scanned documents
2. **Visual Regression**: Add screenshot comparison tests
3. **Load Testing**: Test with high concurrent usage
4. **Cross-browser Testing**: Verify compatibility across browsers
5. **A/B Testing**: Compare different OCR configurations

### Metrics Dashboard
- Real-time accuracy monitoring
- Performance trend analysis
- Test coverage visualization
- Error rate tracking

---

For more information about the OCR service implementation, see the main project documentation.

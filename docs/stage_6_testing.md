# Stage 6: Testing, Verification & Quality Assurance

Before launching the Agentic Web Infrastructure SaaS to production, we must implement a rigorous testing pipeline. This stage guarantees that our tokenization limits are strictly enforced, our parsers don't break on malformed HTML, and our Edge proxies remain highly available.

## 1. Unit Testing (Vitest)

We will use Vitest to write fast, isolated tests for our core backend logic, specifically targeting the scraping and tokenization modules.

### `lib/tokenizer.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { countTokens } from './tokenizer';

describe('Tokenization Engine', () => {
  it('should accurately count tokens for a standard string', () => {
    const text = "This is a simple test string for the tokenizer.";
    expect(countTokens(text)).toBeGreaterThan(5);
    expect(countTokens(text)).toBeLessThan(15);
  });

  it('should handle large markdown strings without throwing errors', () => {
    const largeText = "# Header\n\n".repeat(1000);
    expect(countTokens(largeText)).toBeGreaterThan(1000);
  });
});
```

### `lib/scraper.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { compileLlmsTxt } from './scraper';

describe('Markdown Compilation', () => {
  it('should strictly enforce the 3,000 token limit', () => {
    // Generate massive array of dummy pages
    const dummyPages = Array(500).fill({
      url: 'https://example.com/long-page',
      title: 'A Very Long Title That Takes Up Many Tokens',
      description: 'An exceptionally long description designed to bloat the token count and force the truncation logic to trigger...'
    });

    const { markdown, tokenCount } = compileLlmsTxt('example.com', dummyPages);
    
    // Assert that the function physically cuts off the generation to protect the limit
    expect(tokenCount).toBeLessThanOrEqual(3000);
    expect(markdown).toContain('Some pages were truncated');
  });
});
```

## 2. End-to-End (E2E) Testing with Playwright

We will use Playwright to simulate real user interactions in the browser, ensuring the WebMCP Form Injector and Dashboard flows work seamlessly.

### `tests/webmcp-injector.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test('WebMCP Injector correctly upgrades a raw HTML form', async ({ page }) => {
  await page.goto('/dashboard/webmcp-injector');

  // Fill out the required tool details
  await page.fill('input[placeholder="e.g., submit_lead"]', 'test_booking');
  await page.fill('input[placeholder="Describe exactly what this form does."]', 'Books a test meeting.');

  // Paste raw HTML
  const rawForm = '<form action="/api/submit"><input type="text" name="name" /></form>';
  await page.fill('textarea[placeholder*="<form"]', rawForm);

  // Click Upgrade
  await page.click('button:has-text("Upgrade Form")');

  // Verify the output contains the WebMCP declarative attributes
  const outputBox = page.locator('textarea[readonly]');
  await expect(outputBox).toBeVisible();
  
  const upgradedCode = await outputBox.inputValue();
  expect(upgradedCode).toContain('toolname="test_booking"');
  expect(upgradedCode).toContain('tooldescription="Books a test meeting."');
  expect(upgradedCode).toContain('toolparamdescription=');
});
```

## 3. Edge Worker Verification

Testing the Cloudflare Worker requires simulating a reverse proxy request locally using Wrangler to ensure it properly connects to our backend API.

### Verification Steps:
1. Initialize Wrangler locally: `npx wrangler dev public/edge-worker-template.js`
2. Send a curl request to the local worker port simulating an AI crawler:
   ```bash
   curl -I -A "ChatGPT-User/1.0" http://localhost:8787/llms.txt
   ```
3. **Assertions**:
   - Verify the HTTP status is `200 OK` (or `404` if the domain isn't registered).
   - Verify the `Content-Type` is exactly `text/plain; charset=utf-8`.
   - Verify the `Cache-Control` header exists and specifies `s-maxage` for CDN caching.

## 4. Continuous Integration (CI/CD Pipeline)

To prevent regressions, we will implement a GitHub Actions workflow that automatically runs all Unit and E2E tests on every Pull Request before allowing deployment to production (e.g., Vercel).

### `.github/workflows/test.yml`
```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:unit
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## Final Sign-Off
Once Stage 6 passes all automated checks, the SaaS is officially verified and ready for public launch.

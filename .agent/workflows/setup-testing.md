---
description: Setup testing infrastructure (Phase 1.1)
---

# Setup Testing Infrastructure

This workflow sets up Vitest and Playwright for TDD/E2E development.

## Steps

### 1. Install Testing Dependencies

// turbo
```bash
npm install -D vitest @vitest/ui @testing-library/svelte @testing-library/jest-dom @testing-library/user-event jsdom happy-dom
```

// turbo
```bash
npm install -D @playwright/test
```

// turbo
```bash
npm install -D @vitest/coverage-v8
```

### 2. Install Playwright Browsers

// turbo
```bash
npx playwright install
```

### 3. Verify Installation

// turbo
```bash
npm run test --version
```

## Expected Outcome

- ✅ Vitest installed and configured
- ✅ Playwright installed with browsers
- ✅ Coverage tools ready
- ✅ Ready to write tests

## Next Steps

After this workflow completes:
1. Create `vitest.config.ts`
2. Create `playwright.config.ts`
3. Update `package.json` scripts
4. Create test directory structure

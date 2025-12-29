# 🚀 Quick Start Guide - Nexus Portal TDD Development

Welcome to the Nexus Portal development! This guide will get you up and running with Test-Driven Development in minutes.

## 📦 What's Been Set Up

### Configuration Files Created
- ✅ `vitest.config.ts` - Unit/integration test configuration
- ✅ `playwright.config.ts` - E2E test configuration  
- ✅ `tests/setup.ts` - Global test setup with SvelteKit mocks

### Test Scripts Added to package.json
```bash
npm test              # Run unit tests in watch mode
npm run test:ui       # Open Vitest UI
npm run test:coverage # Generate coverage report
npm run test:e2e      # Run E2E tests
npm run test:e2e:ui   # Open Playwright UI
npm run test:all      # Run all tests
```

### Example Files Created
- ✅ `src/lib/types/index.ts` - Complete TypeScript type definitions
- ✅ `src/lib/stores/agents.ts` - Agents store with CRUD operations
- ✅ `src/lib/components/ui/Button.svelte` - Button component
- ✅ `tests/unit/components/Button.test.ts` - Button unit tests
- ✅ `tests/unit/stores/agents.test.ts` - Agents store tests
- ✅ `tests/e2e/dashboard.spec.ts` - Dashboard E2E tests

## 🏃 Getting Started (5 Minutes)

### Step 1: Install Dependencies

Run the `/setup-testing` workflow or manually install:

```bash
# Install testing dependencies
npm install -D vitest @vitest/ui @testing-library/svelte @testing-library/jest-dom @testing-library/user-event jsdom happy-dom @playwright/test @vitest/coverage-v8

# Install Playwright browsers
npx playwright install
```

### Step 2: Verify Installation

```bash
# Should show Vitest help
npm test -- --help

# Should show Playwright help
npm run test:e2e -- --help
```

### Step 3: Run Your First Tests

```bash
# Run unit tests (will fail until you implement components)
npm test

# Run E2E tests (will fail until you build the dashboard)
npm run test:e2e
```

## 🎯 TDD Workflow

### The Red-Green-Refactor Cycle

```
1. 🔴 RED: Write a failing test
   └─> Define what you want to build

2. 🟢 GREEN: Make it pass with minimal code
   └─> Implement just enough to pass

3. 🔵 REFACTOR: Clean up and optimize
   └─> Improve code quality
```

### Example: Building a Card Component

#### 1. Write the Test First (RED)

```typescript
// tests/unit/components/Card.test.ts
import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Card from '$lib/components/ui/Card.svelte';

describe('Card', () => {
  it('renders with title and content', () => {
    render(Card, { 
      props: { 
        title: 'Test Card',
        children: 'Card content'
      } 
    });
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });
});
```

Run test: `npm test` → ❌ FAILS (Card doesn't exist)

#### 2. Implement Minimum Code (GREEN)

```svelte
<!-- src/lib/components/ui/Card.svelte -->
<script lang="ts">
  import { type Snippet } from 'svelte';
  
  interface Props {
    title?: string;
    children: Snippet;
  }
  
  let { title, children }: Props = $props();
</script>

<div class="card">
  {#if title}
    <h3>{title}</h3>
  {/if}
  {@render children()}
</div>
```

Run test: `npm test` → ✅ PASSES

#### 3. Refactor (REFACTOR)

Add styling, variants, etc. while keeping tests green.

## 📁 Project Structure

```
spaa/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI components
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Card.svelte
│   │   │   │   └── ...
│   │   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── agents/          # Agent management components
│   │   │   └── chat/            # Chat components
│   │   ├── stores/              # Svelte stores
│   │   │   ├── agents.ts
│   │   │   ├── feed.ts
│   │   │   └── user.ts
│   │   ├── types/               # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/               # Utility functions
│   │   └── services/            # API services
│   │       ├── matrix.ts
│   │       └── livekit.ts
│   └── routes/                  # SvelteKit routes
│       └── (app)/
│           ├── +page.svelte     # Dashboard
│           ├── agents/
│           └── chat/
├── tests/
│   ├── setup.ts                 # Global test setup
│   ├── unit/
│   │   ├── components/          # Component tests
│   │   ├── stores/              # Store tests
│   │   └── utils/               # Utility tests
│   ├── integration/             # Integration tests
│   └── e2e/                     # E2E tests
│       ├── dashboard.spec.ts
│       ├── agents.spec.ts
│       └── chat.spec.ts
├── vitest.config.ts
├── playwright.config.ts
└── DEVELOPMENT_PLAN.md
```

## 🧪 Testing Best Practices

### Unit Tests

**What to test:**
- Component rendering
- Props and state changes
- User interactions
- Edge cases

**Example:**
```typescript
it('disables button when loading', () => {
  render(Button, { props: { loading: true } });
  expect(screen.getByRole('button')).toBeDisabled();
});
```

### Integration Tests

**What to test:**
- Component interactions
- Store updates
- Data flow

**Example:**
```typescript
it('updates feed when new post is created', async () => {
  render(Dashboard);
  
  await userEvent.type(screen.getByTestId('post-input'), 'New post');
  await userEvent.click(screen.getByTestId('post-submit'));
  
  expect(screen.getByText('New post')).toBeInTheDocument();
});
```

### E2E Tests

**What to test:**
- Complete user journeys
- Critical paths
- Cross-browser compatibility

**Example:**
```typescript
test('user can create and manage an agent', async ({ page }) => {
  await page.goto('/agents');
  await page.click('[data-testid="create-agent"]');
  await page.fill('[data-testid="agent-name"]', 'My Bot');
  await page.click('[data-testid="submit"]');
  
  await expect(page.locator('text=My Bot')).toBeVisible();
});
```

## 🎨 Component Development Checklist

For each new component:

- [ ] Write unit tests first
- [ ] Implement component
- [ ] Add TypeScript types
- [ ] Add accessibility attributes (`aria-label`, `role`, etc.)
- [ ] Test keyboard navigation
- [ ] Test responsive behavior
- [ ] Add to component documentation
- [ ] Verify 80%+ test coverage

## 🔍 Debugging Tests

### Vitest UI (Recommended)
```bash
npm run test:ui
```
Opens a browser UI showing:
- Test results
- Code coverage
- Test execution time
- Console logs

### Playwright UI
```bash
npm run test:e2e:ui
```
Features:
- Watch mode
- Time travel debugging
- Screenshots
- Network logs

### Debug Mode
```bash
# Debug specific test
npm test -- Button.test.ts

# Debug E2E test
npm run test:e2e:debug
```

## 📊 Coverage Goals

Run coverage report:
```bash
npm run test:coverage
```

**Targets:**
- Overall: 80%+
- Components: 85%+
- Stores: 90%+
- Utils: 95%+

View HTML report: `coverage/index.html`

## 🚦 CI/CD Integration

Tests will run automatically on:
- Every pull request
- Before deployment
- On merge to main

**Required to pass:**
- ✅ All unit tests
- ✅ All E2E tests
- ✅ 80%+ coverage
- ✅ No TypeScript errors
- ✅ No accessibility violations

## 📚 Next Steps

### Today
1. ✅ Run `/setup-testing` workflow
2. ✅ Verify tests run successfully
3. ✅ Study example tests
4. ✅ Create your first component with TDD

### This Week
1. Build core UI components (Button, Card, Avatar, Badge)
2. Create design system tokens
3. Setup mock data generators
4. Build dashboard layout

### Resources
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/)
- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - Full 8-week plan

## 💡 Tips

1. **Write tests first** - It's called Test-DRIVEN Development for a reason
2. **Keep tests simple** - One assertion per test when possible
3. **Use data-testid** - Makes tests more resilient to UI changes
4. **Mock external dependencies** - Tests should be fast and isolated
5. **Run tests often** - In watch mode during development
6. **Don't skip refactoring** - Clean code is maintainable code

## ❓ Common Issues

### "Module not found" errors
```bash
# Rebuild SvelteKit types
npm run prepare
```

### Playwright browsers not installed
```bash
npx playwright install
```

### Tests timing out
Increase timeout in test:
```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ...
});
```

## 🎉 You're Ready!

You now have a complete TDD setup for building the Nexus Portal. Start with the Button component test, make it pass, then move on to the next component.

**Remember:** Red → Green → Refactor 🔄

Happy testing! 🚀

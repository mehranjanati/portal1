import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
    test('dashboard should not have any automatically detectable accessibility issues', async ({ page }) => {
        await page.goto('/');

        // Wait for the main app structure to be visible
        await page.waitForSelector('[data-testid="left-sidebar"]', { state: 'visible', timeout: 30000 });

        const title = await page.title();
        const content = await page.content();
        console.log('Detected Page Title:', title);
        console.log('Page Content Length:', content.length);

        const hasH1 = await page.locator('h1').count();
        console.log('Number of H1 elements:', hasH1);

        const hasMain = await page.locator('main').count();
        console.log('Number of Main elements:', hasMain);

        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        if (accessibilityScanResults.violations.length > 0) {
            console.log('Accessibility Violations:', JSON.stringify(accessibilityScanResults.violations, null, 2));
        }

        expect(accessibilityScanResults.violations, `Should not have any accessibility violations. Found ${accessibilityScanResults.violations.length} violations.`).toEqual([]);
    });
});

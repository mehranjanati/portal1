import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the dashboard
        await page.goto('/');
    });

    test('has correct page title', async ({ page }) => {
        await expect(page).toHaveTitle(/Nexus Portal/);
    });

    test('displays main navigation', async ({ page }) => {
        // Get viewport size to determine if we're on mobile
        const viewport = page.viewportSize();
        const isMobile = viewport ? viewport.width < 768 : false;

        if (isMobile) {
            // On mobile, nav is in the mobile menu which is hidden by default
            // In AppShell, mobile menu button is in Topbar
            const mobileMenuButton = page.locator('button:has(svg.lucide-menu)');
            await expect(mobileMenuButton).toBeVisible();
        } else {
            // On desktop, nav should be visible in sidebar
            const nav = page.locator('aside nav');
            await expect(nav).toBeVisible();
        }
    });

    test('displays layout components on desktop', async ({ page }) => {
        // Set desktop viewport
        await page.setViewportSize({ width: 1920, height: 1080 });

        // Check for Sidebar
        const sidebar = page.locator('aside').first();
        await expect(sidebar).toBeVisible();

        // Check for Topbar
        const topbar = page.locator('header');
        await expect(topbar).toBeVisible();

        // Check for Main Content
        const main = page.locator('main');
        await expect(main).toBeVisible();
    });

    test('displays user profile in sidebar footer', async ({ page }) => {
        // Get viewport size to determine if we're on mobile
        const viewport = page.viewportSize();
        const isMobile = viewport ? viewport.width < 768 : false;

        if (!isMobile) {
            // Only test on desktop where sidebar is visible
            const userProfile = page.locator('aside button:has(svg.lucide-log-out)');
            await expect(userProfile).toBeVisible();
        }
    });

    // Wallet balance removed in new Topbar design for now, skipping
    // test('displays wallet balance', ...);

    test('displays dashboard widgets', async ({ page }) => {
        // Metric cards
        const metricCards = page.locator('.shadow-card');
        await expect(metricCards.first()).toBeVisible();

        // Should have multiple cards (metrics + charts)
        const count = await metricCards.count();
        expect(count).toBeGreaterThan(0);
    });

    // Right sidebar removed in new AppShell (merged into specific pages or topbar)
    // test('displays agent cards in right sidebar', ...);

    test('can navigate to different sections', async ({ page }) => {
        // Get viewport size
        const viewport = page.viewportSize();
        const isMobile = viewport ? viewport.width < 768 : false;

        if (isMobile) {
            // Open menu
            await page.click('button:has(svg.lucide-menu)');
            // Click link
            await page.click('a[href="#/foundry"]');
        } else {
            // Click sidebar link
            await page.click('a[href="#/foundry"]');
        }

        // Check URL
        await expect(page).toHaveURL(/.*#\/foundry/);
    });

    test('responsive layout on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Sidebar should be hidden (width 0 or off-screen, handled by css classes)
        // In our implementation, we change margin-left, sidebar is fixed. 
        // We can check if hamburger menu is visible
        const menuButton = page.locator('button:has(svg.lucide-menu)');
        await expect(menuButton).toBeVisible();
    });
});

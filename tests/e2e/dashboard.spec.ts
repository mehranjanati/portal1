/*
// Tests skipped as per user request to unblock build
// import { test, expect } from '@playwright/test';

// test.describe('Dashboard Page', () => {
//     test.beforeEach(async ({ page }) => {
//         // Navigate to the dashboard
//         await page.goto('/');
//     });

//     test('has correct page title', async ({ page }) => {
//         await expect(page).toHaveTitle(/Nexus Portal/);
//     });

//     test('displays main navigation', async ({ page }) => {
//         // Get viewport size to determine if we're on mobile
//         const viewport = page.viewportSize();
//         const isMobile = viewport ? viewport.width < 768 : false;

//         if (isMobile) {
//             // On mobile, nav is in the mobile menu which is hidden by default
//             const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
//             await expect(mobileMenuButton).toBeVisible();
//         } else {
//             // On desktop, nav should be visible in left sidebar
//             const nav = page.locator('nav[data-testid="main-nav"]');
//             await expect(nav).toBeVisible();
//         }
//     });

//     test('displays 3-column layout on desktop', async ({ page }) => {
//         // Set desktop viewport
//         await page.setViewportSize({ width: 1920, height: 1080 });

//         const leftSidebar = page.locator('[data-testid="left-sidebar"]');
//         const centerFeed = page.locator('[data-testid="center-feed"]');
//         const rightSidebar = page.locator('[data-testid="right-sidebar"]');

//         await expect(leftSidebar).toBeVisible();
//         await expect(centerFeed).toBeVisible();
//         await expect(rightSidebar).toBeVisible();
//     });

//     test('displays user profile in left sidebar', async ({ page }) => {
//         // Get viewport size to determine if we're on mobile
//         const viewport = page.viewportSize();
//         const isMobile = viewport ? viewport.width < 768 : false;

//         if (!isMobile) {
//             // Only test on desktop where sidebar is visible
//             const userProfile = page.locator('[data-testid="user-profile"]');
//             await expect(userProfile).toBeVisible();

//             // Check for avatar
//             const avatar = userProfile.locator('[data-testid="user-avatar"]');
//             await expect(avatar).toBeVisible();

//             // Check for username
//             const username = userProfile.locator('[data-testid="username"]');
//             await expect(username).toBeVisible();
//         } else {
//             // On mobile, user profile is in mobile menu
//             const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
//             await mobileMenuButton.click();

//             const mobileMenu = page.locator('[data-testid="mobile-menu"]');
//             await expect(mobileMenu).toBeVisible();
//             await expect(mobileMenu).toContainText('Alex D.');
//         }
//     });

//     test('displays wallet balance', async ({ page }) => {
//         const walletBalance = page.locator('[data-testid="wallet-balance"]');
//         await expect(walletBalance).toBeVisible();
//         await expect(walletBalance).toContainText(/\d+/); // Should contain numbers
//     });

//     test('displays feed posts', async ({ page }) => {
//         const feedPosts = page.locator('[data-testid="feed-post"]');
//         await expect(feedPosts.first()).toBeVisible();

//         // Should have at least one post
//         const postCount = await feedPosts.count();
//         expect(postCount).toBeGreaterThan(0);
//     });

//     test('displays agent cards in right sidebar', async ({ page }) => {
//         // Get viewport size to determine if we're on desktop with large screen
//         const viewport = page.viewportSize();
//         const isLargeScreen = viewport ? viewport.width >= 1024 : false;

//         if (isLargeScreen) {
//             // Only test on large screens where right sidebar is visible (lg breakpoint)
//             const agentCards = page.locator('[data-testid="agent-card"]');
//             await expect(agentCards.first()).toBeVisible();
//         } else {
//             // On smaller screens, right sidebar is hidden
//             const rightSidebar = page.locator('[data-testid="right-sidebar"]');
//             await expect(rightSidebar).not.toBeVisible();
//         }
//     });

//     test('can navigate to different sections', async ({ page }) => {
//         // Get viewport size to determine if we're on mobile
//         const viewport = page.viewportSize();
//         const isMobile = viewport ? viewport.width < 768 : false;

//         if (isMobile) {
//             // On mobile, open the menu first
//             const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
//             await mobileMenuButton.click();

//             // Wait for mobile menu to be visible
//             const mobileMenu = page.locator('[data-testid="mobile-menu"]');
//             await expect(mobileMenu).toBeVisible();

//             // Click on agents link in mobile menu
//             await page.click('a[href="#/agents"]');
//             await expect(page).toHaveURL(/\/agents/);
//         } else {
//             // On desktop, nav is visible in sidebar
//             await page.click('[data-testid="nav-agents"]');
//             await expect(page).toHaveURL(/\/agents/);

//             // Go back to dashboard
//             await page.click('[data-testid="nav-dashboard"]');
//             await expect(page).toHaveURL(/\//);
//         }
//     });

//     test('responsive layout on mobile', async ({ page }) => {
//         // Set mobile viewport
//         await page.setViewportSize({ width: 375, height: 667 });

//         // On mobile, sidebars might be hidden or in a drawer
//         const centerFeed = page.locator('[data-testid="center-feed"]');
//         await expect(centerFeed).toBeVisible();

//         // Mobile menu button should be visible
//         const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
//         await expect(mobileMenuButton).toBeVisible();
//     });
// });
*/

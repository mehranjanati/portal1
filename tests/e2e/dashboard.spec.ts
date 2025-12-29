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
        const nav = page.locator('nav[data-testid="main-nav"]');
        await expect(nav).toBeVisible();
    });

    test('displays 3-column layout on desktop', async ({ page }) => {
        // Set desktop viewport
        await page.setViewportSize({ width: 1920, height: 1080 });

        const leftSidebar = page.locator('[data-testid="left-sidebar"]');
        const centerFeed = page.locator('[data-testid="center-feed"]');
        const rightSidebar = page.locator('[data-testid="right-sidebar"]');

        await expect(leftSidebar).toBeVisible();
        await expect(centerFeed).toBeVisible();
        await expect(rightSidebar).toBeVisible();
    });

    test('displays user profile in left sidebar', async ({ page }) => {
        const userProfile = page.locator('[data-testid="user-profile"]');
        await expect(userProfile).toBeVisible();

        // Check for avatar
        const avatar = userProfile.locator('[data-testid="user-avatar"]');
        await expect(avatar).toBeVisible();

        // Check for username
        const username = userProfile.locator('[data-testid="username"]');
        await expect(username).toBeVisible();
    });

    test('displays wallet balance', async ({ page }) => {
        const walletBalance = page.locator('[data-testid="wallet-balance"]');
        await expect(walletBalance).toBeVisible();
        await expect(walletBalance).toContainText(/\d+/); // Should contain numbers
    });

    test('displays feed posts', async ({ page }) => {
        const feedPosts = page.locator('[data-testid="feed-post"]');
        await expect(feedPosts.first()).toBeVisible();

        // Should have at least one post
        const postCount = await feedPosts.count();
        expect(postCount).toBeGreaterThan(0);
    });

    test('displays agent cards in right sidebar', async ({ page }) => {
        const agentCards = page.locator('[data-testid="agent-card"]');
        await expect(agentCards.first()).toBeVisible();
    });

    test('can navigate to different sections', async ({ page }) => {
        // Click on agents link
        await page.click('[data-testid="nav-agents"]');
        await expect(page).toHaveURL(/\/agents/);

        // Go back to dashboard
        await page.click('[data-testid="nav-dashboard"]');
        await expect(page).toHaveURL(/\//);
    });

    test('responsive layout on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // On mobile, sidebars might be hidden or in a drawer
        const centerFeed = page.locator('[data-testid="center-feed"]');
        await expect(centerFeed).toBeVisible();

        // Mobile menu button should be visible
        const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
        await expect(mobileMenuButton).toBeVisible();
    });

    test('can open mobile menu', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
        await mobileMenuButton.click();

        const mobileMenu = page.locator('[data-testid="mobile-menu"]');
        await expect(mobileMenu).toBeVisible();
    });
});

test.describe('Feed Interactions', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('can create a new post', async ({ page }) => {
        const postComposer = page.locator('[data-testid="post-composer"]');
        await postComposer.fill('This is my first post on Nexus Portal!');

        const submitButton = page.locator('[data-testid="post-submit"]');
        await submitButton.click();

        // Post should appear in feed
        await expect(page.locator('text=This is my first post on Nexus Portal!')).toBeVisible();
    });

    test('can like a post', async ({ page }) => {
        const firstPost = page.locator('[data-testid="feed-post"]').first();
        const likeButton = firstPost.locator('[data-testid="like-button"]');
        const likeCount = firstPost.locator('[data-testid="like-count"]');

        const initialCount = await likeCount.textContent();
        await likeButton.click();

        // Like count should increase
        await expect(likeCount).not.toHaveText(initialCount || '0');

        // Like button should show active state
        await expect(likeButton).toHaveClass(/active|liked/);
    });

    test('can open comment modal', async ({ page }) => {
        const firstPost = page.locator('[data-testid="feed-post"]').first();
        const commentButton = firstPost.locator('[data-testid="comment-button"]');

        await commentButton.click();

        const commentModal = page.locator('[data-testid="comment-modal"]');
        await expect(commentModal).toBeVisible();
    });

    test('can scroll to load more posts', async ({ page }) => {
        const feedPosts = page.locator('[data-testid="feed-post"]');
        const initialCount = await feedPosts.count();

        // Scroll to bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        // Wait for new posts to load
        await page.waitForTimeout(1000);

        const newCount = await feedPosts.count();
        expect(newCount).toBeGreaterThanOrEqual(initialCount);
    });
});

test.describe('Agent Quick Actions', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('can view agent details', async ({ page }) => {
        const firstAgentCard = page.locator('[data-testid="agent-card"]').first();
        await firstAgentCard.click();

        const agentModal = page.locator('[data-testid="agent-detail-modal"]');
        await expect(agentModal).toBeVisible();

        // Should show agent metrics
        await expect(agentModal.locator('[data-testid="agent-roi"]')).toBeVisible();
        await expect(agentModal.locator('[data-testid="agent-status"]')).toBeVisible();
    });

    test('can pause an agent', async ({ page }) => {
        const firstAgentCard = page.locator('[data-testid="agent-card"]').first();
        const pauseButton = firstAgentCard.locator('[data-testid="agent-pause"]');

        await pauseButton.click();

        // Status should change to paused
        const status = firstAgentCard.locator('[data-testid="agent-status"]');
        await expect(status).toHaveText(/paused/i);
    });
});

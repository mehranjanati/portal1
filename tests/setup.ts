import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock SvelteKit modules
vi.mock('$app/environment', () => ({
    browser: false,
    dev: true,
    building: false,
    version: 'test',
}));

vi.mock('$app/navigation', () => ({
    goto: vi.fn(),
    invalidate: vi.fn(),
    invalidateAll: vi.fn(),
    preloadData: vi.fn(),
    preloadCode: vi.fn(),
    beforeNavigate: vi.fn(),
    afterNavigate: vi.fn(),
}));

vi.mock('$app/stores', () => ({
    page: {
        subscribe: vi.fn(),
    },
    navigating: {
        subscribe: vi.fn(),
    },
    updated: {
        subscribe: vi.fn(),
    },
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

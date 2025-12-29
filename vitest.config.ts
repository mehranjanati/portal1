import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	test: {
		// Test environment
		environment: 'jsdom',
		
		// Global test setup
		globals: true,
		
		// Setup files
		setupFiles: ['./tests/setup.ts'],
		
		// Include patterns
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		
		// Coverage configuration
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			exclude: [
				'node_modules/',
				'tests/',
				'*.config.{js,ts}',
				'**/*.d.ts',
				'**/*.spec.{js,ts}',
				'**/*.test.{js,ts}',
				'.svelte-kit/',
				'build/',
			],
			// Coverage thresholds
			lines: 80,
			functions: 80,
			branches: 80,
			statements: 80,
		},
		
		// Test timeout
		testTimeout: 10000,
		
		// Watch mode
		watch: false,
	},
	
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib'),
			$app: path.resolve('./.svelte-kit/runtime/app'),
		},
	},
});

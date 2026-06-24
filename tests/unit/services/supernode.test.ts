import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/api/client', () => ({
	getApiBaseUrl: () => 'http://localhost:3000',
}));

import { superNode } from '$lib/services/supernode';

describe('superNode.executeVoltAgentTool', () => {
	const fetchMock = vi.fn();
	const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

	beforeEach(() => {
		fetchMock.mockReset();
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('routes deploy_website to the new internal deploy endpoint', async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			statusText: 'OK',
			json: vi.fn().mockResolvedValue({
				status: 'started',
				workflow_id: 'wf-123',
				current_step: 'INIT',
				message: 'Deployment queued.',
				planning_source: 'remote_voltagent',
			}),
		});

		const result = await superNode.executeVoltAgentTool('system__deploy_website', {
			project_name: 'demo-site',
			prompt: 'A modern landing page',
			framework: 'svelte',
			theme: 'minimal',
		});

		expect(fetchMock).toHaveBeenCalledWith(
			'http://localhost:3000/internal/tools/deploy',
			expect.objectContaining({
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					project_name: 'demo-site',
					template: undefined,
					prompt: 'A modern landing page',
					theme: 'minimal',
					framework: 'svelte',
				}),
			}),
		);
		expect(result.workflowId).toBe('wf-123');
		expect(result.workflow_id).toBe('wf-123');
		expect(result.planning_source).toBe('remote_voltagent');
	});

	it('routes non-deploy tools to the internal execute endpoint', async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			statusText: 'OK',
			json: vi.fn().mockResolvedValue({
				workflow_id: 'wf-legacy',
				message: 'Legacy tool queued.',
			}),
		});

		const result = await superNode.executeVoltAgentTool('system__query_database', {
			sql: 'select 1',
		});

		expect(fetchMock).toHaveBeenCalledWith(
			'http://localhost:3000/internal/tools/execute',
			expect.objectContaining({
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					tool_id: 'system__query_database',
					args: { sql: 'select 1' },
				}),
			}),
		);
		expect(result.workflowId).toBe('wf-legacy');
		expect(result.workflow_id).toBe('wf-legacy');
	});

	it('loads the manifest from the internal manifest endpoint', async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			statusText: 'OK',
			json: vi.fn().mockResolvedValue({
				version: '1.0.0',
				tools: [{ name: 'system__deploy_website', description: 'Deploy a website' }],
			}),
		});

		const result = await superNode.getVoltAgentManifest();

		expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/internal/tools/manifest');
		expect(result.tools).toHaveLength(1);
		expect(result.tools[0].name).toBe('system__deploy_website');
	});

	it('returns a mock workflow id when backend is unavailable', async () => {
		fetchMock.mockRejectedValue(new Error('network down'));

		const result = await superNode.executeVoltAgentTool('system__deploy_website', {
			project_name: 'offline-site',
		});

		expect(result.workflowId).toMatch(/^mock-wf-/);
		expect(result.workflow_id).toBe(result.workflowId);
		expect(warnSpy).toHaveBeenCalled();
	});

	afterEach(() => {
		warnSpy.mockClear();
		logSpy.mockClear();
	});
});

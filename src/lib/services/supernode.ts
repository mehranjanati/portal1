import { getApiBaseUrl } from '$lib/api/client';

const API_URL = getApiBaseUrl();
const INTERNAL_TOOLS_BASE = `${API_URL}/internal/tools`;

export type WorkflowStep = 'INIT' | 'GEN_SCHEMA' | 'GEN_CODE' | 'BUILDING' | 'DEPLOYING' | 'DONE';

export interface WorkflowStatus {
    workflowId: string;
    status: 'RUNNING' | 'COMPLETED' | 'FAILED';
    currentStep: WorkflowStep;
    logs: string[];
    artifacts?: {
        projectId: string;
        liveUrl?: string;
        previewUrl?: string;
    };
    error?: string;
}

export interface Deployment {
    id: string;
    projectId: string;
    liveUrl: string;
    status: 'live' | 'failed' | 'deploying';
    createdAt: string;
}

export interface WorkflowExecution {
    workflowId: string;
    kind: string;
    name: string;
    status: 'RUNNING' | 'COMPLETED' | 'FAILED';
    currentStep: WorkflowStep;
    logs: string[];
    artifacts?: {
        projectId: string;
        template?: string;
        liveUrl?: string;
        message?: string;
    };
    error?: string;
    createdAt: string;
    updatedAt: string;
}

export interface WorkflowLogEntry {
    workflowId: string;
    time: string;
    level: string;
    service: string;
    message: string;
    status: string;
    currentStep: string;
}

type ToolExecutionResult = {
    workflowId: string;
    workflow_id?: string;
    status?: string;
    current_step?: string;
    message?: string;
    planning_source?: string;
    run_id?: string;
    data?: Record<string, string>;
    [key: string]: unknown;
};

class SuperNodeService {

    /**
     * Triggers a tool execution on the Super Node (VoltAgent)
     */
    async executeVoltAgentTool(toolId: string, args: any): Promise<ToolExecutionResult> {
        console.log(`[SuperNode] Executing tool ${toolId} with args:`, args);
        try {
            const res = toolId === 'system__deploy_website'
                ? await fetch(`${INTERNAL_TOOLS_BASE}/deploy`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        project_name: args?.project_name,
                        template: args?.template,
                        prompt: args?.prompt,
                        theme: args?.theme,
                        framework: args?.framework,
                    })
                })
                : await fetch(`${INTERNAL_TOOLS_BASE}/execute`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tool_id: toolId, args })
                });
            if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
            return this.normalizeToolExecutionResult(await res.json());
        } catch (err) {
            console.warn("[SuperNode] Backend unreachable, returning mock workflow ID.");
            const workflowId = `mock-wf-${Date.now()}`;
            return {
                workflowId,
                workflow_id: workflowId,
            };
        }
    }

    /**
     * Retrieves the tool manifest from the Super Node
     */
    async getVoltAgentManifest(): Promise<any> {
        try {
            const res = await fetch(`${INTERNAL_TOOLS_BASE}/manifest`);
            if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
            return await res.json();
        } catch (err) {
            // Mock manifest for demo
            return {
                version: "1.0.0",
                tools: [
                    { name: "system__deploy_website", description: "Deploy a website", parameters: {} },
                    { name: "system__query_database", description: "Query the database", parameters: {} }
                ]
            };
        }
    }

    /**
     * Polls the status of a specific workflow
     */
    async getWorkflowStatus(workflowId: string): Promise<WorkflowStatus> {
        try {
            const res = await fetch(`${API_URL}/workflows/${workflowId}`);
            if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
            return this.normalizeWorkflowStatus(await res.json(), workflowId);
        } catch (err) {
            // Mock simulation for demo purposes if backend is missing
            return this.simulateWorkflowProgress(workflowId);
        }
    }

    async listWorkflowExecutions(): Promise<WorkflowExecution[]> {
        try {
            const res = await fetch(`${API_URL}/workflows`);
            if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
            const payload = await res.json();
            if (!Array.isArray(payload)) return [];
            return payload
                .filter((item: any) => item?.workflow_id || item?.workflowId)
                .map((item: any) => this.normalizeWorkflowExecution(item));
        } catch (err) {
            console.warn('[SuperNode] Failed to load workflow executions:', err);
            return [];
        }
    }

    async listWorkflowLogs(): Promise<WorkflowLogEntry[]> {
        try {
            const res = await fetch(`${API_URL}/logs`);
            if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
            const payload = await res.json();
            if (!Array.isArray(payload)) return [];
            return payload.map((item: any) => ({
                workflowId: item?.workflow_id ?? item?.workflowId ?? 'unknown',
                time: item?.time ?? new Date().toISOString(),
                level: item?.level ?? 'INFO',
                service: item?.service ?? 'TEMPORAL_WORKFLOW',
                message: item?.message ?? '',
                status: item?.status ?? 'RUNNING',
                currentStep: item?.current_step ?? item?.currentStep ?? 'INIT',
            }));
        } catch (err) {
            console.warn('[SuperNode] Failed to load workflow logs:', err);
            return [];
        }
    }

    /**
     * Lists all deployments (Project ID, URL, Status)
     */
    async listDeployments(): Promise<Deployment[]> {
        // Mock data for now
        return [
            {
                id: 'dep-1',
                projectId: 'portfolio-dark-v1',
                liveUrl: 'https://portfolio-dark.nexus.app',
                status: 'live',
                createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 'dep-2',
                projectId: 'crypto-dashboard-alpha',
                liveUrl: 'https://crypto-dash.nexus.app',
                status: 'live',
                createdAt: new Date(Date.now() - 172800000).toISOString()
            }
        ];
    }

    // --- Internal Simulation Helper ---
    private simulateWorkflowProgress(workflowId: string): WorkflowStatus {
        // This is a deterministic simulation based on time (modulo) for demoing the UI
        const now = Date.now();
        const start = parseInt(workflowId.split('-').pop() || '0');
        const elapsed = now - start;

        let step: WorkflowStep = 'INIT';
        let logs: string[] = ['Workflow initialized.'];

        if (elapsed > 2000) { step = 'GEN_SCHEMA'; logs.push('Generating UI schema...'); }
        if (elapsed > 5000) { step = 'GEN_CODE'; logs.push('Generating Svelte components...'); }
        if (elapsed > 9000) { step = 'BUILDING'; logs.push('Building production bundle...'); }
        if (elapsed > 14000) { step = 'DEPLOYING'; logs.push('Deploying to edge...'); }
        if (elapsed > 18000) {
            step = 'DONE';
            logs.push('Deployment complete.', 'Live URL generated.');
            return {
                workflowId,
                status: 'COMPLETED',
                currentStep: 'DONE',
                logs,
                artifacts: {
                    projectId: 'generated-project-' + start,
                    liveUrl: 'https://generated-site.nexus.app',
                    previewUrl: 'https://preview.nexus.app/generated-site'
                }
            };
        }

        return {
            workflowId,
            status: 'RUNNING',
            currentStep: step,
            logs
        };
    }

    private normalizeWorkflowStatus(payload: any, workflowId: string): WorkflowStatus {
        const rawStep = payload?.currentStep ?? payload?.current_step ?? 'INIT';
        const currentStep = (rawStep === 'DONE' ? 'DONE' : rawStep) as WorkflowStep;

        return {
            workflowId: payload?.workflowId ?? payload?.workflow_id ?? workflowId,
            status: (payload?.status ?? 'RUNNING') as WorkflowStatus['status'],
            currentStep,
            logs: Array.isArray(payload?.logs) ? payload.logs : [],
            artifacts: payload?.artifacts
                ? {
                    projectId: payload.artifacts.projectId ?? payload.artifacts.project_id ?? payload.artifacts.projectName ?? payload.artifacts.project_name ?? workflowId,
                    liveUrl: payload.artifacts.liveUrl ?? payload.artifacts.live_url ?? payload.artifacts.url,
                    previewUrl: payload.artifacts.previewUrl ?? payload.artifacts.preview_url,
                }
                : undefined,
            error: payload?.error,
        };
    }

    private normalizeWorkflowExecution(payload: any): WorkflowExecution {
        const rawStep = payload?.currentStep ?? payload?.current_step ?? 'INIT';
        const currentStep = (rawStep === 'DONE' ? 'DONE' : rawStep) as WorkflowStep;

        return {
            workflowId: payload?.workflowId ?? payload?.workflow_id ?? 'unknown',
            kind: payload?.kind ?? 'workflow',
            name: payload?.name ?? payload?.workflow_id ?? 'workflow',
            status: (payload?.status ?? 'RUNNING') as WorkflowExecution['status'],
            currentStep,
            logs: Array.isArray(payload?.logs) ? payload.logs : [],
            artifacts: payload?.artifacts
                ? {
                    projectId: payload.artifacts.projectId ?? payload.artifacts.project_id ?? payload.artifacts.projectName ?? payload.artifacts.project_name ?? payload?.workflow_id ?? 'unknown',
                    template: payload.artifacts.template,
                    liveUrl: payload.artifacts.liveUrl ?? payload.artifacts.live_url ?? payload.artifacts.url,
                    message: payload.artifacts.message,
                }
                : undefined,
            error: payload?.error,
            createdAt: payload?.createdAt ?? payload?.created_at ?? new Date().toISOString(),
            updatedAt: payload?.updatedAt ?? payload?.updated_at ?? new Date().toISOString(),
        };
    }

    private normalizeToolExecutionResult(payload: any): ToolExecutionResult {
        const workflowId = payload?.workflowId ?? payload?.workflow_id;

        return {
            ...(payload ?? {}),
            workflowId: typeof workflowId === 'string' && workflowId.length > 0 ? workflowId : `mock-wf-${Date.now()}`,
            workflow_id: typeof payload?.workflow_id === 'string'
                ? payload.workflow_id
                : (typeof workflowId === 'string' ? workflowId : undefined),
        };
    }
}

export const superNode = new SuperNodeService();

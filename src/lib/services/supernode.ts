import { writable } from 'svelte/store';

const API_URL = 'http://localhost:3000';

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

class SuperNodeService {

    /**
     * Triggers a tool execution on the Super Node (VoltAgent)
     */
    async executeVoltAgentTool(toolId: string, args: any): Promise<{ workflowId: string }> {
        console.log(`[SuperNode] Executing tool ${toolId} with args:`, args);
        try {
            const res = await fetch(`${API_URL}/voltagent/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tool_id: toolId, args })
            });
            if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
            return await res.json();
        } catch (err) {
            console.warn("[SuperNode] Backend unreachable, returning mock workflow ID.");
            return { workflowId: `mock-wf-${Date.now()}` };
        }
    }

    /**
     * Retrieves the tool manifest from the Super Node
     */
    async getVoltAgentManifest(): Promise<any> {
        try {
            const res = await fetch(`${API_URL}/voltagent/manifest`);
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
            return await res.json();
        } catch (err) {
            // Mock simulation for demo purposes if backend is missing
            return this.simulateWorkflowProgress(workflowId);
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
}

export const superNode = new SuperNodeService();

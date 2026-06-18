export type McpServerType = 'ui' | 'data' | 'devops' | 'system' | 'ai' | 'server' | 'tool';

export interface McpTool {
    name: string;
    description: string;
    inputSchema: Record<string, any>;
}

export interface McpResource {
    uri: string;
    name: string;
    mimeType?: string;
}

export interface McpServer {
    id: string;
    name: string;
    description: string;
    author: string;
    version: string;
    type: McpServerType;
    icon: string; // Lucide icon name or URL
    capabilities: {
        resources?: boolean;
        prompts?: boolean;
        tools?: boolean;
        logging?: boolean;
    };
    connection: {
        type: 'stdio' | 'sse' | 'websocket';
        command?: string;
        args?: string[];
        url?: string;
        env?: Record<string, string>;
    };
    documentationUrl?: string;
    tags: string[];
    installed: boolean;
    status?: 'connected' | 'disconnected' | 'error' | 'connecting';
    downloads?: number;
}

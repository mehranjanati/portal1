import type { McpServer } from '$lib/types/mcp';

export const mcpRegistry: McpServer[] = [
    {
        id: 'shadcn-ui',
        name: 'Shadcn UI',
        description: 'Generates and modifies accessible UI components based on the shadcn-svelte library.',
        author: 'shadcn',
        version: '1.0.0',
        type: 'ui',
        icon: 'palette',
        capabilities: {
            tools: true,
            resources: true
        },
        connection: {
            type: 'stdio',
            command: 'npx',
            args: ['-y', '@shadcn/mcp']
        },
        documentationUrl: 'https://ui.shadcn.com/docs/mcp',
        tags: ['ui', 'design', 'components', 'svelte'],
        installed: false,
        status: 'disconnected'
    },
    {
        id: 'redpanda-connect',
        name: 'Redpanda Connect',
        description: 'Stream processing and data pipeline management for AI Agents.',
        author: 'Redpanda Data',
        version: '4.0.0',
        type: 'data',
        icon: 'activity',
        capabilities: {
            resources: true,
            tools: true,
            logging: true
        },
        connection: {
            type: 'stdio',
            command: 'rpk',
            args: ['connect', 'mcp']
        },
        documentationUrl: 'https://docs.redpanda.com/redpanda-connect/ai-agents/mcp-server/overview/',
        tags: ['streaming', 'kafka', 'data', 'pipelines'],
        installed: false,
        status: 'disconnected'
    },
    {
        id: 'postgres',
        name: 'PostgreSQL',
        description: 'Read and write access to PostgreSQL databases with schema inspection.',
        author: 'Community',
        version: '1.2.0',
        type: 'data',
        icon: 'database',
        capabilities: {
            tools: true,
            resources: true
        },
        connection: {
            type: 'stdio',
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-postgres']
        },
        tags: ['database', 'sql', 'storage'],
        installed: false,
        status: 'disconnected'
    },
    {
        id: 'filesystem',
        name: 'File System',
        description: 'Secure access to read and write files in the local workspace.',
        author: 'Model Context Protocol',
        version: '1.0.0',
        type: 'system',
        icon: 'folder',
        capabilities: {
            tools: true,
            resources: true
        },
        connection: {
            type: 'stdio',
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-filesystem']
        },
        tags: ['files', 'fs', 'workspace'],
        installed: true, // Core system module often pre-installed
        status: 'connected'
    },
    {
        id: 'github',
        name: 'GitHub',
        description: 'Integration with GitHub API for repository management and issues.',
        author: 'Model Context Protocol',
        version: '0.6.0',
        type: 'devops',
        icon: 'github',
        capabilities: {
            tools: true,
            resources: false
        },
        connection: {
            type: 'stdio',
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-github']
        },
        tags: ['git', 'version-control', 'collaboration'],
        installed: false,
        status: 'disconnected'
    }
];

import { writable, derived, get } from 'svelte/store';
import type { Agent, AgentsState, AgentStatus, AgentType } from '$lib/types';

/**
 * Agents Store
 * Manages the state of user's agents and provides CRUD operations
 */

function createAgentsStore() {
    const initialState: AgentsState = {
        agents: [],
        selectedAgent: null,
        isLoading: false,
        error: null,
        filters: {}
    };

    const { subscribe, set, update } = writable<AgentsState>(initialState);

    return {
        subscribe,

        /**
         * Load all agents for the current user
         */
        async loadAgents() {
            update((state) => ({ ...state, isLoading: true, error: null }));

            try {
                // TODO: Replace with actual API call
                // const response = await fetch('/api/agents');
                // const agents = await response.json();

                // Mock data for now
                await new Promise((resolve) => setTimeout(resolve, 500));
                const mockAgents: Agent[] = []; // Will be populated by mock generator

                update((state) => ({
                    ...state,
                    agents: mockAgents,
                    isLoading: false
                }));
            } catch (error) {
                update((state) => ({
                    ...state,
                    error: error instanceof Error ? error.message : 'Failed to load agents',
                    isLoading: false
                }));
            }
        },

        /**
         * Add a new agent
         */
        async addAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) {
            update((state) => ({ ...state, isLoading: true, error: null }));

            try {
                // TODO: Replace with actual API call
                // const response = await fetch('/api/agents', {
                //   method: 'POST',
                //   body: JSON.stringify(agent)
                // });
                // const newAgent = await response.json();

                // Mock implementation
                await new Promise((resolve) => setTimeout(resolve, 300));
                const newAgent: Agent = {
                    ...agent,
                    id: `agent-${Date.now()}`,
                    createdAt: new Date(),
                    updatedAt: new Date()
                } as Agent;

                update((state) => ({
                    ...state,
                    agents: [...state.agents, newAgent],
                    isLoading: false
                }));

                return newAgent;
            } catch (error) {
                update((state) => ({
                    ...state,
                    error: error instanceof Error ? error.message : 'Failed to create agent',
                    isLoading: false
                }));
                throw error;
            }
        },

        /**
         * Update an existing agent
         */
        async updateAgent(id: string, updates: Partial<Agent>) {
            update((state) => ({ ...state, isLoading: true, error: null }));

            try {
                // TODO: Replace with actual API call
                await new Promise((resolve) => setTimeout(resolve, 300));

                update((state) => ({
                    ...state,
                    agents: state.agents.map((agent) =>
                        agent.id === id
                            ? { ...agent, ...updates, updatedAt: new Date() }
                            : agent
                    ),
                    isLoading: false
                }));
            } catch (error) {
                update((state) => ({
                    ...state,
                    error: error instanceof Error ? error.message : 'Failed to update agent',
                    isLoading: false
                }));
                throw error;
            }
        },

        /**
         * Delete an agent
         */
        async deleteAgent(id: string) {
            update((state) => ({ ...state, isLoading: true, error: null }));

            try {
                // TODO: Replace with actual API call
                await new Promise((resolve) => setTimeout(resolve, 300));

                update((state) => ({
                    ...state,
                    agents: state.agents.filter((agent) => agent.id !== id),
                    selectedAgent: state.selectedAgent?.id === id ? null : state.selectedAgent,
                    isLoading: false
                }));
            } catch (error) {
                update((state) => ({
                    ...state,
                    error: error instanceof Error ? error.message : 'Failed to delete agent',
                    isLoading: false
                }));
                throw error;
            }
        },

        /**
         * Select an agent
         */
        selectAgent(id: string | null) {
            update((state) => {
                const selectedAgent = id ? state.agents.find((a) => a.id === id) || null : null;
                return { ...state, selectedAgent };
            });
        },

        /**
         * Set filters
         */
        setFilters(filters: { status?: AgentStatus; type?: AgentType }) {
            update((state) => ({ ...state, filters }));
        },

        /**
         * Clear filters
         */
        clearFilters() {
            update((state) => ({ ...state, filters: {} }));
        },

        /**
         * Pause an agent
         */
        async pauseAgent(id: string) {
            return this.updateAgent(id, { status: 'paused' });
        },

        /**
         * Resume an agent
         */
        async resumeAgent(id: string) {
            return this.updateAgent(id, { status: 'active' });
        },

        /**
         * Reset the store to initial state
         */
        reset() {
            set(initialState);
        }
    };
}

export const agentsStore = createAgentsStore();

/**
 * Derived store: Filtered agents based on current filters
 */
export const filteredAgents = derived(agentsStore, ($store) => {
    let filtered = $store.agents;

    if ($store.filters.status) {
        filtered = filtered.filter((agent) => agent.status === $store.filters.status);
    }

    if ($store.filters.type) {
        filtered = filtered.filter((agent) => agent.type === $store.filters.type);
    }

    return filtered;
});

/**
 * Derived store: Active agents count
 */
export const activeAgentsCount = derived(agentsStore, ($store) => {
    return $store.agents.filter((agent) => agent.status === 'active').length;
});

/**
 * Derived store: Agent statistics
 */
export const agentStats = derived(agentsStore, ($store) => {
    const agents = $store.agents;

    return {
        total: agents.length,
        active: agents.filter((a) => a.status === 'active').length,
        paused: agents.filter((a) => a.status === 'paused').length,
        error: agents.filter((a) => a.status === 'error').length,
        avgRoi:
            agents.reduce((sum, a) => sum + a.performance.roi, 0) / (agents.length || 1),
        totalTrades: agents.reduce((sum, a) => sum + a.performance.trades, 0)
    };
});

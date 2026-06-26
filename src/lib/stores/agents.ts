import { writable, derived } from 'svelte/store';
import type { Agent, AgentsState, AgentStatus, AgentType } from '$lib/types';

/**
 * Agents Store
 * Manages the state of user's agents and provides CRUD operations
 */

const AGENTS_STORAGE_KEY = 'nexus_agents_store_v1';

function canUseStorage() {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function reviveAgent(raw: any): Agent {
    return {
        ...raw,
        createdAt: raw?.createdAt ? new Date(raw.createdAt) : new Date(),
        updatedAt: raw?.updatedAt ? new Date(raw.updatedAt) : new Date(),
        performance: {
            roi: Number(raw?.performance?.roi ?? 0),
            trades: Number(raw?.performance?.trades ?? 0),
            uptime: Number(raw?.performance?.uptime ?? 0),
            successRate: Number(raw?.performance?.successRate ?? 0),
            lastActive: raw?.performance?.lastActive
                ? new Date(raw.performance.lastActive)
                : new Date()
        }
    } as Agent;
}

function readPersistedAgents(): Agent[] {
    if (!canUseStorage()) {
        return [];
    }

    try {
        const raw = localStorage.getItem(AGENTS_STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.map(reviveAgent);
    } catch (error) {
        console.error('Failed to read persisted agents:', error);
        return [];
    }
}

function persistAgents(agents: Agent[]) {
    if (!canUseStorage()) {
        return;
    }

    try {
        localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents));
    } catch (error) {
        console.error('Failed to persist agents:', error);
    }
}

function clearPersistedAgents() {
    if (!canUseStorage()) {
        return;
    }

    localStorage.removeItem(AGENTS_STORAGE_KEY);
}

function createAgentsStore() {
    function createInitialState(): AgentsState {
        return {
            agents: readPersistedAgents(),
            selectedAgent: null,
            isLoading: false,
            error: null,
            filters: {}
        };
    }

    const initialState = createInitialState();

    const { subscribe, set, update } = writable<AgentsState>(initialState);

    return {
        subscribe,

        /**
         * Load all agents for the current user
         */
        async loadAgents() {
            update((state) => ({ ...state, isLoading: true, error: null }));

            try {
                const agents = readPersistedAgents();

                update((state) => ({
                    ...state,
                    agents,
                    selectedAgent: state.selectedAgent
                        ? agents.find((agent) => agent.id === state.selectedAgent?.id) ?? null
                        : null,
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
                const newAgent: Agent = {
                    ...agent,
                    id: `agent-${Date.now()}`,
                    createdAt: new Date(),
                    updatedAt: new Date()
                } as Agent;

                persistAgents([...readPersistedAgents(), newAgent]);

                update((state) => ({
                    ...state,
                    agents: [...state.agents, newAgent],
                    selectedAgent: newAgent,
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
                let nextAgents: Agent[] = [];

                update((state) => ({
                    ...(function () {
                        nextAgents = state.agents.map((agent) =>
                            agent.id === id
                                ? {
                                      ...agent,
                                      ...updates,
                                      updatedAt: new Date()
                                  }
                                : agent
                        );

                        const selectedAgent = state.selectedAgent
                            ? nextAgents.find((agent) => agent.id === state.selectedAgent?.id) ?? null
                            : null;

                        return {
                            ...state,
                            agents: nextAgents,
                            selectedAgent,
                            isLoading: false
                        };
                    })()
                }));

                persistAgents(nextAgents);
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
                let nextAgents: Agent[] = [];

                update((state) => ({
                    ...(function () {
                        nextAgents = state.agents.filter((agent) => agent.id !== id);
                        return {
                            ...state,
                            agents: nextAgents,
                            selectedAgent: state.selectedAgent?.id === id ? null : state.selectedAgent,
                            isLoading: false
                        };
                    })()
                }));

                persistAgents(nextAgents);
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
            clearPersistedAgents();
            set(createInitialState());
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

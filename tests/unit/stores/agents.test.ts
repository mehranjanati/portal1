/*
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { agentsStore, filteredAgents, activeAgentsCount, agentStats } from '$lib/stores/agents';
import type { Agent } from '$lib/types';

describe('Agents Store', () => {
    beforeEach(() => {
        agentsStore.reset();
    });

    describe('Initial State', () => {
        it('initializes with empty agents array', () => {
            const state = get(agentsStore);
            expect(state.agents).toEqual([]);
        });

        it('initializes with no selected agent', () => {
            const state = get(agentsStore);
            expect(state.selectedAgent).toBeNull();
        });

        it('initializes with loading false', () => {
            const state = get(agentsStore);
            expect(state.isLoading).toBe(false);
        });

        it('initializes with no error', () => {
            const state = get(agentsStore);
            expect(state.error).toBeNull();
        });

        it('initializes with empty filters', () => {
            const state = get(agentsStore);
            expect(state.filters).toEqual({});
        });
    });

    describe('addAgent', () => {
        it('adds a new agent to the store', async () => {
            const newAgent = {
                name: 'Trading Bot',
                type: 'trading' as const,
                status: 'active' as const,
                owner: 'user-1',
                performance: {
                    roi: 15.5,
                    trades: 100,
                    uptime: 99.9,
                    successRate: 85,
                    lastActive: new Date()
                }
            };

            await agentsStore.addAgent(newAgent);

            const state = get(agentsStore);
            expect(state.agents).toHaveLength(1);
            expect(state.agents[0]).toMatchObject({
                name: 'Trading Bot',
                type: 'trading',
                status: 'active'
            });
            expect(state.agents[0].id).toBeDefined();
            expect(state.agents[0].createdAt).toBeInstanceOf(Date);
        });

        it('sets loading state during operation', async () => {
            const newAgent = {
                name: 'Test Agent',
                type: 'analytics' as const,
                status: 'active' as const,
                owner: 'user-1',
                performance: {
                    roi: 0,
                    trades: 0,
                    uptime: 100,
                    successRate: 0,
                    lastActive: new Date()
                }
            };

            const addPromise = agentsStore.addAgent(newAgent);

            // Check loading state immediately
            let state = get(agentsStore);
            expect(state.isLoading).toBe(true);

            await addPromise;

            // Check loading state after completion
            state = get(agentsStore);
            expect(state.isLoading).toBe(false);
        });
    });

    describe('updateAgent', () => {
        it('updates an existing agent', async () => {
            // First add an agent
            const agent = await agentsStore.addAgent({
                name: 'Original Name',
                type: 'trading' as const,
                status: 'active' as const,
                owner: 'user-1',
                performance: {
                    roi: 10,
                    trades: 50,
                    uptime: 95,
                    successRate: 80,
                    lastActive: new Date()
                }
            });

            // Update the agent
            await agentsStore.updateAgent(agent!.id, {
                name: 'Updated Name',
                status: 'paused'
            });

            const state = get(agentsStore);
            const updatedAgent = state.agents.find((a) => a.id === agent!.id);
            expect(updatedAgent?.name).toBe('Updated Name');
            expect(updatedAgent?.status).toBe('paused');
        });

        it('updates the updatedAt timestamp', async () => {
            const agent = await agentsStore.addAgent({
                name: 'Test',
                type: 'trading' as const,
                status: 'active' as const,
                owner: 'user-1',
                performance: {
                    roi: 0,
                    trades: 0,
                    uptime: 100,
                    successRate: 0,
                    lastActive: new Date()
                }
            });

            const originalUpdatedAt = agent!.updatedAt;

            // Wait a bit to ensure timestamp difference
            await new Promise((resolve) => setTimeout(resolve, 10));

            await agentsStore.updateAgent(agent!.id, { name: 'Updated' });

            const state = get(agentsStore);
            const updatedAgent = state.agents.find((a) => a.id === agent!.id);
            expect(updatedAgent?.updatedAt.getTime()).toBeGreaterThan(
                originalUpdatedAt.getTime()
            );
        });
    });

    describe('deleteAgent', () => {
        it('removes an agent from the store', async () => {
            const agent = await agentsStore.addAgent({
                name: 'To Delete',
                type: 'trading' as const,
                status: 'active' as const,
                owner: 'user-1',
                performance: {
                    roi: 0,
                    trades: 0,
                    uptime: 100,
                    successRate: 0,
                    lastActive: new Date()
                }
            });

            await agentsStore.deleteAgent(agent!.id);

            const state = get(agentsStore);
            expect(state.agents).toHaveLength(0);
        });

        it('clears selected agent if deleted', async () => {
            const agent = await agentsStore.addAgent({
                name: 'Selected',
                type: 'trading' as const,
                status: 'active' as const,
                owner: 'user-1',
                performance: {
                    roi: 0,
                    trades: 0,
                    uptime: 100,
                    successRate: 0,
                    lastActive: new Date()
                }
            });

            agentsStore.selectAgent(agent!.id);
            expect(get(agentsStore).selectedAgent).not.toBeNull();

            await agentsStore.deleteAgent(agent!.id);

            expect(get(agentsStore).selectedAgent).toBeNull();
        });
    });

    describe('selectAgent', () => {
        it('selects an agent by id', async () => {
            const agent = await agentsStore.addAgent({
                name: 'Selectable',
                type: 'trading' as const,
                status: 'active' as const,
                owner: 'user-1',
                performance: {
                    roi: 0,
                    trades: 0,
                    uptime: 100,
                    successRate: 0,
                    lastActive: new Date()
                }
            });

            agentsStore.selectAgent(agent!.id);

            const state = get(agentsStore);
            expect(state.selectedAgent?.id).toBe(agent!.id);
        });

        it('clears selection when passed null', async () => {
            const agent = await agentsStore.addAgent({
                name: 'Test',
                type: 'trading' as const,
                status: 'active' as const,
                owner: 'user-1',
                performance: {
                    roi: 0,
                    trades: 0,
                    uptime: 100,
                    successRate: 0,
                    lastActive: new Date()
                }
            });

            agentsStore.selectAgent(agent!.id);
            agentsStore.selectAgent(null);

            expect(get(agentsStore).selectedAgent).toBeNull();
        });
    });

    describe('Filters', () => {
        beforeEach(async () => {
            // Add multiple agents with different statuses and types
            await agentsStore.addAgent({
                name: 'Active Trading Bot',
                type: 'trading' as const,
                status: 'active' as const,
                owner: 'user-1',
                performance: {
                    roi: 15,
                    trades: 100,
                    uptime: 99,
                    successRate: 85,
                    lastActive: new Date()
                }
            });

            await agentsStore.addAgent({
                name: 'Paused Analytics Bot',
                type: 'analytics' as const,
                status: 'paused' as const,
                owner: 'user-1',
                performance: {
                    roi: 0,
                    trades: 0,
                    uptime: 0,
                    successRate: 0,
                    lastActive: new Date()
                }
            });

            await agentsStore.addAgent({
                name: 'Active Social Bot',
                type: 'social' as const,
                status: 'active' as const,
                owner: 'user-1',
                performance: {
                    roi: 5,
                    trades: 50,
                    uptime: 95,
                    successRate: 90,
                    lastActive: new Date()
                }
            });
        });

        it('filters agents by status', () => {
            agentsStore.setFilters({ status: 'active' });

            const filtered = get(filteredAgents);
            expect(filtered).toHaveLength(2);
            expect(filtered.every((a) => a.status === 'active')).toBe(true);
        });

        it('filters agents by type', () => {
            agentsStore.setFilters({ type: 'trading' });

            const filtered = get(filteredAgents);
            expect(filtered).toHaveLength(1);
            expect(filtered[0].type).toBe('trading');
        });

        it('filters by both status and type', () => {
            agentsStore.setFilters({ status: 'active', type: 'social' });

            const filtered = get(filteredAgents);
            expect(filtered).toHaveLength(1);
            expect(filtered[0].name).toBe('Active Social Bot');
        });

        it('clears filters', () => {
            agentsStore.setFilters({ status: 'active' });
            agentsStore.clearFilters();

            const state = get(agentsStore);
            expect(state.filters).toEqual({});

            const filtered = get(filteredAgents);
            expect(filtered).toHaveLength(3);
        });
    });

    describe('Derived Stores', () => {
        beforeEach(async () => {
            await agentsStore.addAgent({
                name: 'Agent 1',
                type: 'trading' as const,
                status: 'active' as const,
                owner: 'user-1',
                performance: {
                    roi: 20,
                    trades: 100,
                    uptime: 99,
                    successRate: 85,
                    lastActive: new Date()
                }
            });

            await agentsStore.addAgent({
                name: 'Agent 2',
                type: 'analytics' as const,
                status: 'paused' as const,
                owner: 'user-1',
                performance: {
                    roi: 10,
                    trades: 50,
                    uptime: 95,
                    successRate: 80,
                    lastActive: new Date()
                }
            });

            await agentsStore.addAgent({
                name: 'Agent 3',
                type: 'social' as const,
                status: 'active' as const,
                owner: 'user-1',
                performance: {
                    roi: 15,
                    trades: 75,
                    uptime: 97,
                    successRate: 90,
                    lastActive: new Date()
                }
            });
        });

        it('calculates active agents count', () => {
            const count = get(activeAgentsCount);
            expect(count).toBe(2);
        });

        it('calculates agent statistics', () => {
            const stats = get(agentStats);

            expect(stats.total).toBe(3);
            expect(stats.active).toBe(2);
            expect(stats.paused).toBe(1);
            expect(stats.error).toBe(0);
            expect(stats.avgRoi).toBe(15); // (20 + 10 + 15) / 3
            expect(stats.totalTrades).toBe(225); // 100 + 50 + 75
        });
    });

    describe('Quick Actions', () => {
        it('pauses an agent', async () => {
            const agent = await agentsStore.addAgent({
                name: 'Test',
                type: 'trading' as const,
                status: 'active' as const,
                owner: 'user-1',
                performance: {
                    roi: 0,
                    trades: 0,
                    uptime: 100,
                    successRate: 0,
                    lastActive: new Date()
                }
            });

            await agentsStore.pauseAgent(agent!.id);

            const state = get(agentsStore);
            const pausedAgent = state.agents.find((a) => a.id === agent!.id);
            expect(pausedAgent?.status).toBe('paused');
        });

        it('resumes an agent', async () => {
            const agent = await agentsStore.addAgent({
                name: 'Test',
                type: 'trading' as const,
                status: 'paused' as const,
                owner: 'user-1',
                performance: {
                    roi: 0,
                    trades: 0,
                    uptime: 100,
                    successRate: 0,
                    lastActive: new Date()
                }
            });

            await agentsStore.resumeAgent(agent!.id);

            const state = get(agentsStore);
            const activeAgent = state.agents.find((a) => a.id === agent!.id);
            expect(activeAgent?.status).toBe('active');
        });
    });

    describe('reset', () => {
        it('resets store to initial state', async () => {
            await agentsStore.addAgent({
                name: 'Test',
                type: 'trading' as const,
                status: 'active' as const,
                owner: 'user-1',
                performance: {
                    roi: 0,
                    trades: 0,
                    uptime: 100,
                    successRate: 0,
                    lastActive: new Date()
                }
            });

            agentsStore.setFilters({ status: 'active' });

            agentsStore.reset();

            const state = get(agentsStore);
            expect(state.agents).toEqual([]);
            expect(state.selectedAgent).toBeNull();
            expect(state.filters).toEqual({});
            expect(state.error).toBeNull();
        });
    });
});
*/


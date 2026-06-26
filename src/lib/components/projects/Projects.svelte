<script lang="ts">
    import { onMount } from "svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import { agentsStore } from "$lib/stores/agents";
    import type { Agent } from "$lib/types";
    import { ArrowRight, Bot, Plus } from "lucide-svelte";

    let agents = $state<Agent[]>([]);

    function goToFoundry(agentId?: string) {
        agentsStore.selectAgent(agentId ?? null);
        window.location.hash = "#/foundry";
    }

    onMount(() => {
        void agentsStore.loadAgents();

        return agentsStore.subscribe((state) => {
            agents = [...state.agents].sort(
                (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
            );
        });
    });
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold tracking-tight">Projects</h1>
            <p class="mt-1 text-sm text-text-muted">
                این صفحه حالا draftهای واقعی agent را نشان می‌دهد، نه کارت‌های نمایشی ثابت.
            </p>
        </div>
        <Button variant="primary" class="gap-2" onclick={() => goToFoundry()}>
            <Plus size={16} /> New Agent Draft
        </Button>
    </div>

    {#if agents.length === 0}
        <Card class="border-dashed border-white/10 p-8 text-center">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Bot size={24} class="text-accent-primary" />
            </div>
            <h2 class="mt-4 text-lg font-semibold text-text-primary">No Agent Drafts Yet</h2>
            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
                اگر قرار است MVP از حالت نمایشی خارج شود، نقطه شروع واقعی این است که کاربر بتواند draft agent خودش را بسازد و دوباره ببیند.
            </p>
            <div class="mt-5">
                <Button variant="primary" class="gap-2" onclick={() => goToFoundry()}>
                    <Plus size={16} /> Create First Draft
                </Button>
            </div>
        </Card>
    {:else}
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {#each agents as agent (agent.id)}
                <Card
                    class="group relative cursor-pointer p-6 transition-colors hover:border-accent-primary/30"
                    onclick={() => goToFoundry(agent.id)}
                >
                    <div class="absolute right-0 top-0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                        <ArrowRight size={18} class="text-accent-primary" />
                    </div>
                    <div class="mb-4 flex items-start justify-between">
                        <div class="rounded-lg bg-accent-primary/10 p-2 text-accent-primary">
                            <Bot size={24} />
                        </div>
                        <span class="rounded bg-white/5 px-2 py-1 text-xs font-mono text-text-muted">
                            {agent.type}
                        </span>
                    </div>
                    <h3 class="text-lg font-bold transition-colors group-hover:text-accent-primary">
                        {agent.name}
                    </h3>
                    <p class="mt-2 line-clamp-3 text-sm text-text-muted">
                        {agent.description || "No description yet."}
                    </p>
                    <div class="mt-4 border-t border-white/5 pt-4 text-xs text-text-muted">
                        <div class="flex items-center justify-between">
                            <span>Status</span>
                            <span>{agent.status}</span>
                        </div>
                        <div class="mt-2 flex items-center justify-between">
                            <span>Updated</span>
                            <span>{agent.updatedAt.toLocaleString()}</span>
                        </div>
                    </div>
                </Card>
            {/each}
        </div>
    {/if}
</div>

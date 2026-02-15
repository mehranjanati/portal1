<script lang="ts">
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import { Plus, Folder, ArrowRight } from "lucide-svelte";
    import ProjectBuilder from "./ProjectBuilder.svelte";

    let isCreating = $state(false);
</script>

<div class="space-y-6">
    {#if isCreating}
        <div class="flex items-center gap-2 mb-4">
            <button
                onclick={() => (isCreating = false)}
                class="text-xs text-text-muted hover:text-accent-primary transition-colors flex items-center gap-1"
            >
                <Folder size={12} /> Projects
            </button>
            <span class="text-white/10">/</span>
            <span class="text-xs text-text-primary">New Project</span>
        </div>
        <ProjectBuilder onComplete={() => (isCreating = false)} />
    {:else}
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold tracking-tight">Projects</h1>
                <p class="text-sm text-text-muted mt-1">
                    Manage and build your Super Node applications.
                </p>
            </div>
            <Button
                variant="primary"
                class="gap-2"
                onclick={() => (isCreating = true)}
            >
                <Plus size={16} /> New Project
            </Button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Placeholder Project Card -->
            <Card
                class="p-6 hover:border-accent-primary/50 transition-colors cursor-pointer group relative overflow-hidden"
            >
                <div
                    class="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ArrowRight size={18} class="text-accent-primary" />
                </div>
                <div class="flex items-start justify-between mb-4">
                    <div
                        class="p-2 rounded-lg bg-accent-primary/10 text-accent-primary"
                    >
                        <Folder size={24} />
                    </div>
                    <span
                        class="text-xs font-mono text-text-muted bg-white/5 px-2 py-1 rounded"
                        >SPA</span
                    >
                </div>
                <h3
                    class="font-bold text-lg group-hover:text-accent-primary transition-colors"
                >
                    Alpha Storefront
                </h3>
                <p class="text-sm text-text-muted mt-2 line-clamp-2">
                    E-commerce PWA with performant product listing and crypto
                    checkout.
                </p>
                <div
                    class="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-text-muted"
                >
                    <span>Updated 2h ago</span>
                    <span class="flex items-center gap-1">
                        <div
                            class="w-1.5 h-1.5 rounded-full bg-status-success"
                        ></div>
                         Live
                    </span>
                </div>
            </Card>
        </div>
    {/if}
</div>

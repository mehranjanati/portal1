<script lang="ts">
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import {
        Search,
        Filter,
        History,
        Trash2,
        Rocket,
        ExternalLink,
        RefreshCw,
    } from "lucide-svelte";
    import { cn } from "$lib/utils";

    let selectedDeployment = $state(null);

    const deployments = [
        {
            project: "Nexus API",
            status: "success",
            branch: "main",
            buildTime: "1m 42s",
            deployedAt: "2h ago",
            sha: "8f3a9e1",
        },
        {
            project: "Foundry UI",
            status: "building",
            branch: "feat/foundry",
            buildTime: "---",
            deployedAt: "---",
            sha: "2c4e1b5",
        },
        {
            project: "Agent-X Runtime",
            status: "failed",
            branch: "main",
            buildTime: "45s",
            deployedAt: "1d ago",
            sha: "9d2f8a1",
        },
        {
            project: "Metrics Service",
            status: "success",
            branch: "stable",
            buildTime: "2m 10s",
            deployedAt: "3d ago",
            sha: "6b1c7d3",
        },
    ];
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold tracking-tight">Deployments</h1>
            <p class="text-sm text-text-muted mt-1">
                Manage and track WASM module deployments.
            </p>
        </div>
        <Button variant="primary" class="gap-2">
            <Rocket size={16} />
            Quick Deploy
        </Button>
    </div>

    <Card class="overflow-hidden">
        <div
            class="p-4 border-b border-white/5 flex items-center gap-4 bg-bg-secondary/30"
        >
            <div class="relative flex-1">
                <Search
                    class="absolute left-3 top-2.5 h-4 w-4 text-text-muted"
                />
                <input
                    placeholder="Filter deployments..."
                    class="w-full bg-bg-primary/50 border border-white/5 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-accent-primary/50"
                />
            </div>
            <Button variant="ghost" size="icon" class="text-text-muted"
                ><Filter size={18} /></Button
            >
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr
                        class="bg-white/5 text-xs uppercase font-bold text-text-muted"
                    >
                        <th class="px-6 py-3">Project</th>
                        <th class="px-6 py-3">Status</th>
                        <th class="px-6 py-3">Branch</th>
                        <th class="px-6 py-3">Build Time</th>
                        <th class="px-6 py-3">Deployed At</th>
                        <th class="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                    {#each deployments as dep}
                        <tr
                            class="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                            onclick={() => (selectedDeployment = dep)}
                        >
                            <td class="px-6 py-4 font-medium text-text-primary"
                                >{dep.project}</td
                            >
                            <td class="px-6 py-4">
                                <span
                                    class={cn(
                                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                        dep.status === "success"
                                            ? "bg-status-success/10 text-status-success"
                                            : dep.status === "building"
                                              ? "bg-status-warning/10 text-status-warning animate-pulse"
                                              : "bg-status-danger/10 text-status-danger",
                                    )}
                                >
                                    {dep.status}
                                </span>
                            </td>
                            <td
                                class="px-6 py-4 font-mono text-xs text-text-muted"
                                >{dep.branch}</td
                            >
                            <td class="px-6 py-4 text-text-muted"
                                >{dep.buildTime}</td
                            >
                            <td class="px-6 py-4 text-text-muted"
                                >{dep.deployedAt}</td
                            >
                            <td class="px-6 py-4 text-right">
                                <div
                                    class="flex items-center justify-end gap-2"
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        class="h-8 w-8"
                                        ><History size={14} /></Button
                                    >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        class="h-8 w-8 text-status-danger hover:bg-status-danger/10"
                                        ><Trash2 size={14} /></Button
                                    >
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </Card>
</div>

{#if selectedDeployment}
    <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-end"
        onclick={() => (selectedDeployment = null)}
    >
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="w-full max-w-md bg-bg-secondary h-full border-l border-white/10 shadow-2xl p-6 overflow-y-auto"
            onclick={(e) => e.stopPropagation()}
        >
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-bold">Deployment Detail</h2>
                <button
                    onclick={() => (selectedDeployment = null)}
                    class="text-text-muted hover:text-white">Esc</button
                >
            </div>

            <div class="space-y-8">
                <section class="space-y-4">
                    <h3
                        class="text-xs uppercase font-bold text-text-muted tracking-wider"
                    >
                        Summary
                    </h3>
                    <div
                        class="bg-bg-primary/50 border border-white/5 rounded-lg p-4 space-y-3"
                    >
                        <div class="flex justify-between">
                            <span class="text-text-muted text-sm"
                                >Commit SHA</span
                            >
                            <span
                                class="font-mono text-sm text-accent-secondary"
                                >{selectedDeployment.sha}</span
                            >
                        </div>
                        <div class="flex justify-between">
                            <span class="text-text-muted text-sm">Duration</span
                            >
                            <span class="text-sm"
                                >{selectedDeployment.buildTime}</span
                            >
                        </div>
                    </div>
                </section>

                <section class="space-y-4">
                    <h3
                        class="text-xs uppercase font-bold text-text-muted tracking-wider"
                    >
                        Artifacts
                    </h3>
                    <div class="space-y-2">
                        <div
                            class="flex items-center justify-between p-3 bg-white/5 rounded-md border border-white/5 hover:bg-white/10 transition-colors"
                        >
                            <span class="text-sm">agent_runtime.wasm</span>
                            <ExternalLink size={14} class="text-text-muted" />
                        </div>
                        <div
                            class="flex items-center justify-between p-3 bg-white/5 rounded-md border border-white/5 hover:bg-white/10 transition-colors"
                        >
                            <span class="text-sm">site_v2.tar.gz</span>
                            <ExternalLink size={14} class="text-text-muted" />
                        </div>
                    </div>
                </section>

                <div class="pt-8 grid grid-cols-2 gap-3">
                    <Button variant="primary" class="gap-2">
                        <RefreshCw size={14} />
                        Redeploy
                    </Button>
                    <Button variant="outline">Download</Button>
                </div>
            </div>
        </div>
    </div>
{/if}

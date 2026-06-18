<script lang="ts">
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import {
        Play,
        RotateCcw,
        StopCircle,
        Filter,
        Search,
        MoreHorizontal,
    } from "lucide-svelte";
    import { cn } from "$lib/utils";

    const workflows = [
        {
            id: "wf-7128",
            title: "Agent Onboarding",
            status: "Running",
            steps: "3/5",
            duration: "12m",
            priority: "High",
        },
        {
            id: "wf-7129",
            title: "State Sync",
            status: "Completed",
            steps: "12/12",
            duration: "1m 14s",
            priority: "Normal",
        },
        {
            id: "wf-7130",
            title: "Daily Rebalance",
            status: "Queued",
            steps: "0/8",
            duration: "---",
            priority: "Critical",
        },
        {
            id: "wf-7131",
            title: "Health Check",
            status: "Failed",
            steps: "2/10",
            duration: "4s",
            priority: "Low",
        },
    ];

    const columns = ["Queued", "Running", "Completed", "Failed"];
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold tracking-tight">
                Temporal Workflows
            </h1>
            <p class="text-sm text-text-muted mt-1">
                Orchestrate multi-step agent behaviors with durability.
            </p>
        </div>
        <div class="flex gap-2">
            <Button variant="outline" size="sm" class="gap-2"
                ><RotateCcw size={14} /> Reset View</Button
            >
            <Button variant="primary" size="sm" class="gap-2"
                ><Play size={14} /> Run New</Button
            >
        </div>
    </div>

    <!-- Kanban View -->
    <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[500px]"
    >
        {#each columns as column}
            <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between px-2">
                    <span
                        class="text-xs uppercase font-bold text-text-muted tracking-widest"
                        >{column}</span
                    >
                    <span
                        class="text-xs bg-bg-secondary px-2 py-0.5 rounded-full border border-white/5"
                    >
                        {workflows.filter((w) => w.status === column).length}
                    </span>
                </div>

                <div
                    class="flex-1 space-y-3 p-1 rounded-xl bg-white/[0.01] border border-dashed border-white/5"
                >
                    {#each workflows.filter((w) => w.status === column) as wf}
                        <Card
                            class="p-4 space-y-4 hover:border-accent-primary/30 transition-all group"
                        >
                            <div class="flex items-start justify-between">
                                <div>
                                    <span
                                        class="text-[10px] font-mono text-text-muted"
                                        >#{wf.id}</span
                                    >
                                    <h3
                                        class="text-sm font-semibold text-text-primary mt-1"
                                    >
                                        {wf.title}
                                    </h3>
                                </div>
                                <button
                                    class="text-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreHorizontal size={14} />
                                </button>
                            </div>

                            <div
                                class="flex items-center justify-between text-xs"
                            >
                                <span class="text-text-muted"
                                    >Steps: <span class="text-text-primary"
                                        >{wf.steps}</span
                                    ></span
                                >
                                <span
                                    class={cn(
                                        "px-1.5 py-0.5 rounded text-[10px] font-medium",
                                        wf.priority === "Critical"
                                            ? "bg-status-danger/10 text-status-danger"
                                            : wf.priority === "High"
                                              ? "bg-status-warning/10 text-status-warning"
                                              : "bg-bg-tertiary text-text-muted",
                                    )}>{wf.priority}</span
                                >
                            </div>

                            <div
                                class="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-text-muted"
                            >
                                <span class="flex items-center gap-1"
                                    ><Play size={10} /> {wf.duration}</span
                                >
                                <div class="flex gap-1">
                                    <button
                                        class="p-1 hover:text-accent-primary transition-colors"
                                        ><RotateCcw size={12} /></button
                                    >
                                    <button
                                        class="p-1 hover:text-status-danger transition-colors"
                                        ><StopCircle size={12} /></button
                                    >
                                </div>
                            </div>
                        </Card>
                    {/each}
                </div>
            </div>
        {/each}
    </div>

    <!-- Timeline/Gantt Skeleton -->
    <Card class="p-6">
        <h3 class="text-sm font-semibold mb-4">Workflow Execution Timeline</h3>
        <div
            class="h-48 bg-bg-primary/50 border border-white/5 rounded-lg flex items-center justify-center border-dashed"
        >
            <div class="text-center text-text-muted space-y-2">
                <RotateCcw class="mx-auto opacity-20" size={32} />
                <p class="text-xs uppercase tracking-widest font-bold">
                    Gantt View Initializing...
                </p>
            </div>
        </div>
    </Card>
</div>

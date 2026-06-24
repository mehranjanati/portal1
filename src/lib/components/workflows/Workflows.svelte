<script lang="ts">
    import { onMount } from "svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import { Play, RotateCcw, StopCircle, MoreHorizontal } from "lucide-svelte";
    import { cn } from "$lib/utils";
    import {
        superNode,
        type WorkflowExecution,
        type WorkflowStep,
    } from "$lib/services/supernode";

    type BoardColumn = "Running" | "Completed" | "Failed";

    let workflows = $state<WorkflowExecution[]>([]);
    let isLoading = $state(true);
    let errorMessage = $state("");

    const columns: BoardColumn[] = ["Running", "Completed", "Failed"];

    onMount(() => {
        void loadWorkflows();
    });

    async function loadWorkflows() {
        isLoading = true;
        errorMessage = "";

        try {
            workflows = await superNode.listWorkflowExecutions();
        } catch (error) {
            errorMessage =
                error instanceof Error ? error.message : "Failed to load workflows.";
            workflows = [];
        } finally {
            isLoading = false;
        }
    }

    function workflowsForColumn(column: BoardColumn) {
        return workflows.filter((workflow) => workflowStatusLabel(workflow.status) === column);
    }

    function workflowStatusLabel(status: WorkflowExecution["status"]): BoardColumn {
        switch (status) {
            case "COMPLETED":
                return "Completed";
            case "FAILED":
                return "Failed";
            default:
                return "Running";
        }
    }

    function summarizeSteps(step: WorkflowStep): string {
        const steps: WorkflowStep[] = [
            "INIT",
            "GEN_SCHEMA",
            "GEN_CODE",
            "BUILDING",
            "DEPLOYING",
            "DONE",
        ];
        const currentIndex = Math.max(steps.indexOf(step), 0) + 1;
        return `${currentIndex}/${steps.length}`;
    }

    function priorityFor(workflow: WorkflowExecution): "Critical" | "High" | "Normal" {
        if (workflow.status === "FAILED") return "Critical";
        if (workflow.currentStep === "DEPLOYING" || workflow.currentStep === "BUILDING") {
            return "High";
        }
        return "Normal";
    }

    function updatedLabel(value: string): string {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "---";
        return new Intl.DateTimeFormat("en-GB", {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    }

    function lastLog(workflow: WorkflowExecution): string {
        return workflow.logs[workflow.logs.length - 1] ?? "No log yet.";
    }
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
            <Button variant="outline" size="sm" class="gap-2" onclick={loadWorkflows}
                ><RotateCcw size={14} /> Reset View</Button
            >
            <Button variant="primary" size="sm" class="gap-2" disabled
                ><Play size={14} /> Run New</Button
            >
        </div>
    </div>

    {#if errorMessage}
        <Card class="p-4 text-sm text-status-danger border border-status-danger/20">
            {errorMessage}
        </Card>
    {/if}

    {#if isLoading}
        <Card class="p-6 text-sm text-text-muted">Loading workflow executions...</Card>
    {:else if workflows.length === 0}
        <Card class="p-6 text-sm text-text-muted">
            No persisted workflow executions yet. Trigger a deployment from chat to populate this board.
        </Card>
    {/if}

    <!-- Kanban View -->
    <div
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 min-h-[500px]"
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
                        {workflowsForColumn(column).length}
                    </span>
                </div>

                <div
                    class="flex-1 space-y-3 p-1 rounded-xl bg-white/[0.01] border border-dashed border-white/5"
                >
                    {#each workflowsForColumn(column) as wf}
                        <Card
                            class="p-4 space-y-4 hover:border-accent-primary/30 transition-all group"
                        >
                            <div class="flex items-start justify-between">
                                <div>
                                    <span
                                        class="text-[10px] font-mono text-text-muted"
                                        >#{wf.workflowId}</span
                                    >
                                    <h3
                                        class="text-sm font-semibold text-text-primary mt-1"
                                    >
                                        {wf.name}
                                    </h3>
                                    <p class="mt-1 text-xs text-text-muted line-clamp-2">
                                        {lastLog(wf)}
                                    </p>
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
                                        >{summarizeSteps(wf.currentStep)}</span
                                    ></span
                                >
                                <span
                                    class={cn(
                                        "px-1.5 py-0.5 rounded text-[10px] font-medium",
                                        priorityFor(wf) === "Critical"
                                            ? "bg-status-danger/10 text-status-danger"
                                            : priorityFor(wf) === "High"
                                              ? "bg-status-warning/10 text-status-warning"
                                              : "bg-bg-tertiary text-text-muted",
                                    )}>{priorityFor(wf)}</span
                                >
                            </div>

                            <div
                                class="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-text-muted"
                            >
                                <span class="flex items-center gap-1"
                                    ><Play size={10} /> {updatedLabel(wf.updatedAt)}</span
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

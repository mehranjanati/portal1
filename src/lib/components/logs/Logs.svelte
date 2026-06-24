<script lang="ts">
    import { onMount } from "svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import { Search, Copy, Pin, Download, ChevronDown } from "lucide-svelte";
    import { cn } from "$lib/utils";
    import { superNode, type WorkflowLogEntry } from "$lib/services/supernode";

    let logs = $state<WorkflowLogEntry[]>([]);
    let searchTerm = $state("");
    let isLoading = $state(true);
    let errorMessage = $state("");

    onMount(() => {
        void loadLogs();
    });

    async function loadLogs() {
        isLoading = true;
        errorMessage = "";

        try {
            logs = await superNode.listWorkflowLogs();
        } catch (error) {
            errorMessage =
                error instanceof Error ? error.message : "Failed to load logs.";
            logs = [];
        } finally {
            isLoading = false;
        }
    }

    const filteredLogs = $derived.by(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return logs;

        return logs.filter((log) =>
            [log.message, log.service, log.workflowId, log.level]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query)),
        );
    });

    function formatTime(value: string): string {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(date);
    }

    async function copyText(value: string) {
        if (!value || !navigator?.clipboard) return;
        await navigator.clipboard.writeText(value);
    }
</script>

<div class="space-y-6 h-full flex flex-col">
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
            <div>
                <h1 class="text-2xl font-bold tracking-tight">Unified Logs</h1>
                <p class="text-sm text-text-muted mt-1">
                    Cross-cluster observability and event tracing.
                </p>
            </div>
        </div>
        <div class="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                class="gap-2 border-white/5 bg-white/5"
                onclick={loadLogs}
            >
                <Download size={14} /> Export CSV
            </Button>
            <Button
                variant="primary"
                size="sm"
                class="gap-2 shadow-[0_0_15px_rgba(0,255,157,0.1)]"
            >
                <div
                    class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"
                ></div>
                Live Tail
            </Button>
        </div>
    </div>

    <Card class="flex-1 flex flex-col bg-bg-secondary/20 overflow-hidden">
        <div
            class="p-4 border-b border-white/5 bg-bg-secondary/40 flex flex-wrap gap-4"
        >
            <div class="relative flex-1 min-w-[300px]">
                <Search
                    class="absolute left-3 top-2.5 h-4 w-4 text-text-muted"
                />
                <input
                    placeholder="Search logs by message, service or ID..."
                    class="w-full bg-bg-primary/50 border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-accent-primary/40"
                    bind:value={searchTerm}
                />
            </div>
            <div class="flex gap-2">
                <Button
                    variant="ghost"
                    class="gap-2 border border-white/5 text-xs"
                    >Service: All <ChevronDown size={12} /></Button
                >
                <Button
                    variant="ghost"
                    class="gap-2 border border-white/5 text-xs"
                    >Level: All <ChevronDown size={12} /></Button
                >
                <Button
                    variant="ghost"
                    class="gap-2 border border-white/5 text-xs"
                    >Time: Last 1h <ChevronDown size={12} /></Button
                >
            </div>
        </div>

        <div class="flex-1 overflow-y-auto font-mono text-[12px] p-2 space-y-1">
            {#if errorMessage}
                <div class="p-3 text-sm text-status-danger">{errorMessage}</div>
            {:else if isLoading}
                <div class="p-3 text-sm text-text-muted">Loading workflow logs...</div>
            {:else if filteredLogs.length === 0}
                <div class="p-3 text-sm text-text-muted">
                    No workflow logs yet. Start a workflow from chat to populate this stream.
                </div>
            {:else}
                {#each filteredLogs as log}
                    <div
                        class="grid grid-cols-[180px_80px_160px_1fr_140px] gap-4 p-2 rounded hover:bg-white/5 group border border-transparent hover:border-white/5 transition-all"
                    >
                        <span class="text-text-muted">{formatTime(log.time)}</span>
                        <span
                            class={cn(
                                "font-bold",
                                log.level === "ERROR"
                                    ? "text-status-danger"
                                    : log.level === "WARN"
                                      ? "text-status-warning"
                                      : log.level === "INFO"
                                        ? "text-accent-secondary"
                                        : "text-text-muted opacity-50",
                            )}>{log.level}</span
                        >
                        <span class="text-accent-primary/70">{log.service}</span>
                        <span
                            class="text-text-primary whitespace-nowrap overflow-hidden text-ellipsis"
                            >{log.message}</span
                        >
                        <div
                            class="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <button
                                class="text-text-muted hover:text-white"
                                onclick={() => copyText(log.message)}
                            >
                                <Copy size={12} />
                            </button>
                            <button
                                class="text-text-muted hover:text-white"
                                onclick={() => copyText(log.workflowId)}
                            >
                                <Pin size={12} />
                            </button>
                            <span class="text-[10px] text-text-muted">{log.workflowId}</span>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </Card>
</div>

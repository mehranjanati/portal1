<script lang="ts">
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import {
        Search,
        Filter,
        Copy,
        Pin,
        Download,
        Terminal,
        ChevronDown,
    } from "lucide-svelte";
    import { cn } from "$lib/utils";

    const logs = [
        {
            time: "2026-02-15 14:02:01",
            level: "INFO",
            service: "AGENT_FOUNDRY",
            message: "Build initialized for project 'alpha-v1'",
            correlationId: "req-9218",
        },
        {
            time: "2026-02-15 14:02:44",
            level: "WARN",
            service: "BENTHOS_BRIDGE",
            message: "Retrying connection to Kafka cluster A (Attempt 2/5)",
            correlationId: "req-9219",
        },
        {
            time: "2026-02-15 14:03:12",
            level: "ERROR",
            service: "WASM_RUNTIME",
            message:
                "Memory access out of bounds in module 'finance_processor'",
            correlationId: "req-9220",
        },
        {
            time: "2026-02-15 14:03:15",
            level: "INFO",
            service: "SYSTEM_CORE",
            message: "Autoscaling: Triggered scale-down for cluster 'beta'",
            correlationId: "req-9221",
        },
        {
            time: "2026-02-15 14:03:22",
            level: "DEBUG",
            service: "API_GATEWAY",
            message: "GET /v1/status - Handled in 4.2ms",
            correlationId: "req-9222",
        },
    ];
</script>

<div class="space-y-6 h-full flex flex-col">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold tracking-tight">Unified Logs</h1>
            <p class="text-sm text-text-muted mt-1">
                Cross-cluster observability and event tracing.
            </p>
        </div>
        <div class="flex gap-2">
            <Button variant="outline" size="sm" class="gap-2"
                ><Download size={14} /> Export</Button
            >
            <Button variant="primary" size="sm" class="gap-2"
                ><Terminal size={14} /> Live Tail</Button
            >
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
            {#each logs as log}
                <div
                    class="grid grid-cols-[180px_80px_140px_1fr_120px] gap-4 p-2 rounded hover:bg-white/5 group border border-transparent hover:border-white/5 transition-all"
                >
                    <span class="text-text-muted">{log.time}</span>
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
                        class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <button class="text-text-muted hover:text-white"
                            ><Copy size={12} /></button
                        >
                        <button class="text-text-muted hover:text-white"
                            ><Pin size={12} /></button
                        >
                    </div>
                </div>
            {/each}
        </div>
    </Card>
</div>

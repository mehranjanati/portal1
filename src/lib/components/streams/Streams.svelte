<script lang="ts">
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import {
        Search,
        Filter,
        Play,
        StopCircle,
        RefreshCcw,
        Activity,
        ShieldCircle,
        Database,
        Network,
    } from "lucide-svelte";
    import { cn } from "$lib/utils";

    let selectedNode = $state({
        id: "agent-alpha",
        type: "Agent",
        status: "Active",
        version: "1.2.0",
        memory: "124MB",
        cpu: "12%",
    });
    let activeTab = $state("details");
</script>

<div class="flex h-[calc(100vh-140px)] gap-6">
    <!-- LEFT: Canvas -->
    <div
        class="flex-1 relative bg-bg-primary/50 border border-white/5 rounded-card overflow-hidden group"
    >
        <!-- Grid Background -->
        <div
            class="absolute inset-0 bg-grid-white/[0.02] bg-[length:24px_24px] pointer-events-none"
        ></div>

        <!-- Controls -->
        <div class="absolute top-4 left-4 flex gap-2 z-10">
            <div
                class="flex p-1 bg-bg-secondary/80 backdrop-blur-md border border-white/10 rounded-lg"
            >
                <Button variant="ghost" size="icon" class="h-8 w-8"
                    ><Search size={14} /></Button
                >
                <Button variant="ghost" size="icon" class="h-8 w-8"
                    ><Filter size={14} /></Button
                >
            </div>
            <div
                class="flex p-1 bg-bg-secondary/80 backdrop-blur-md border border-white/10 rounded-lg"
            >
                <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 text-status-success"
                    ><Play size={14} /></Button
                >
                <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 text-status-danger"
                    ><StopCircle size={14} /></Button
                >
            </div>
        </div>

        <!-- MOCK GRAPH ELEMENTS -->
        <div class="absolute inset-0 flex items-center justify-center">
            <div
                class="relative w-full h-full flex items-center justify-center"
            >
                <!-- Agent Node -->
                <Card
                    class="absolute top-1/4 left-1/4 p-3 border-accent-primary animate-pulse w-40 cursor-move"
                >
                    <div class="flex items-center gap-2 mb-2">
                        <ShieldCircle size={16} class="text-accent-primary" />
                        <span class="text-xs font-bold font-mono">AGENT_01</span
                        >
                    </div>
                    <div
                        class="h-1 w-full bg-white/5 rounded-full overflow-hidden"
                    >
                        <div class="h-full bg-accent-primary w-2/3"></div>
                    </div>
                </Card>

                <!-- Kafka Topic (Edge Container) -->
                <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 text-text-muted opacity-50"
                >
                    <Database size={16} />
                    <span
                        class="text-[10px] font-mono border-b border-dashed border-text-muted"
                        >TX_STREAM_MAIN</span
                    >
                </div>

                <!-- WASM Module Node -->
                <Card
                    class="absolute bottom-1/4 right-1/4 p-3 border-accent-secondary w-40 cursor-move"
                >
                    <div class="flex items-center gap-2 mb-2">
                        <Activity size={16} class="text-accent-secondary" />
                        <span class="text-xs font-bold font-mono"
                            >WASM_PROCESSOR</span
                        >
                    </div>
                    <div
                        class="h-1 w-full bg-white/5 rounded-full overflow-hidden"
                    >
                        <div class="h-full bg-accent-secondary w-1/3"></div>
                    </div>
                </Card>

                <!-- SVG Connections -->
                <svg
                    class="absolute inset-0 w-full h-full pointer-events-none opacity-20"
                >
                    <path
                        d="M 300 150 Q 500 300 700 450"
                        stroke="#00ff9d"
                        stroke-width="2"
                        fill="none"
                        stroke-dasharray="8 4"
                    />
                    <path
                        d="M 700 450 Q 500 600 300 750"
                        stroke="#00b3ff"
                        stroke-width="2"
                        fill="none"
                        stroke-dasharray="8 4"
                    />
                </svg>
            </div>
        </div>

        <!-- Instructions Overlay -->
        <div
            class="absolute bottom-4 left-4 text-[10px] font-mono text-text-muted flex items-center gap-4"
        >
            <span class="flex items-center gap-1"
                ><Network size={10} /> Drag to arrange</span
            >
            <span class="flex items-center gap-1"
                ><RefreshCcw size={10} /> Scroll to zoom</span
            >
        </div>
    </div>

    <!-- RIGHT: Inspector -->
    <Card class="w-80 h-full flex flex-col bg-bg-secondary/40 backdrop-blur-sm">
        <div class="flex border-b border-white/5">
            <button
                onclick={() => (activeTab = "details")}
                class={cn(
                    "flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors",
                    activeTab === "details"
                        ? "text-accent-primary bg-white/5 border-b border-accent-primary"
                        : "text-text-muted",
                )}>Details</button
            >
            <button
                onclick={() => (activeTab = "logs")}
                class={cn(
                    "flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors",
                    activeTab === "logs"
                        ? "text-accent-primary bg-white/5 border-b border-accent-primary"
                        : "text-text-muted",
                )}>Logs</button
            >
            <button
                onclick={() => (activeTab = "metrics")}
                class={cn(
                    "flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors",
                    activeTab === "metrics"
                        ? "text-accent-primary bg-white/5 border-b border-accent-primary"
                        : "text-text-muted",
                )}>Metrics</button
            >
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-6">
            {#if activeTab === "details"}
                <div class="space-y-4">
                    <div
                        class="p-3 bg-white/5 rounded-lg border border-white/5"
                    >
                        <span
                            class="text-[10px] text-text-muted uppercase font-bold"
                            >Node Identity</span
                        >
                        <div class="flex items-center justify-between mt-1">
                            <span class="font-mono text-sm text-text-primary"
                                >{selectedNode.id}</span
                            >
                            <span
                                class="text-[10px] bg-accent-primary/10 text-accent-primary px-1 rounded"
                                >{selectedNode.status}</span
                            >
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div
                            class="p-3 bg-white/5 rounded-lg border border-white/5"
                        >
                            <span
                                class="text-[10px] text-text-muted uppercase font-bold"
                                >Memory</span
                            >
                            <p class="text-sm font-medium mt-1">
                                {selectedNode.memory}
                            </p>
                        </div>
                        <div
                            class="p-3 bg-white/5 rounded-lg border border-white/5"
                        >
                            <span
                                class="text-[10px] text-text-muted uppercase font-bold"
                                >CPU</span
                            >
                            <p class="text-sm font-medium mt-1">
                                {selectedNode.cpu}
                            </p>
                        </div>
                    </div>

                    <div
                        class="p-3 bg-white/5 rounded-lg border border-white/5"
                    >
                        <span
                            class="text-[10px] text-text-muted uppercase font-bold"
                            >Version</span
                        >
                        <p class="text-sm font-medium mt-1">
                            {selectedNode.version}
                        </p>
                    </div>
                </div>
            {:else if activeTab === "logs"}
                <div class="space-y-2 font-mono text-[10px]">
                    <div class="flex gap-2 text-text-muted">
                        <span class="opacity-50">14:02:11</span>
                        <span class="text-accent-primary">[OK]</span>
                        <span>Stream Handshake</span>
                    </div>
                    <div class="flex gap-2 text-text-muted">
                        <span class="opacity-50">14:02:15</span>
                        <span class="text-status-warning">[WRN]</span>
                        <span>Latency spike detected</span>
                    </div>
                    <div class="flex gap-2 text-text-muted">
                        <span class="opacity-50">14:02:16</span>
                        <span class="text-accent-primary">[OK]</span>
                        <span>Buffering successful</span>
                    </div>
                </div>
            {/if}
        </div>

        <div class="p-4 border-t border-white/5 space-y-2">
            <Button
                variant="outline"
                class="w-full text-status-warning hover:bg-status-warning/10 border-status-warning/30"
                >Restart Agent</Button
            >
            <Button
                variant="outline"
                class="w-full text-status-danger hover:bg-status-danger/10 border-status-danger/30"
                >Disable Agent</Button
            >
        </div>
    </Card>
</div>

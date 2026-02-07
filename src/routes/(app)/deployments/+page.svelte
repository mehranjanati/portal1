<script lang="ts">
    import { onMount } from "svelte";
    import { superNode, type Deployment } from "$lib/services/supernode";
    import {
        ExternalLink,
        RefreshCw,
        Eye,
        Terminal,
        Globe,
        Clock,
        CheckCircle2,
        XCircle,
        Loader2,
    } from "lucide-svelte";

    let deployments: Deployment[] = [];
    let isLoading = true;
    let previewUrl: string | null = null;

    async function loadDeployments() {
        isLoading = true;
        try {
            deployments = await superNode.listDeployments();
        } finally {
            isLoading = false;
        }
    }

    onMount(loadDeployments);

    function handlePreview(url: string) {
        previewUrl = url;
    }

    function closePreview() {
        previewUrl = null;
    }
</script>

<div class="p-6 space-y-6 animate-in fade-in duration-500">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1
                class="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
            >
                Deployments
            </h1>
            <p class="text-sm text-[#a1a1aa] mt-1">
                Manage your VoltAgent generated sites.
            </p>
        </div>
        <button
            on:click={loadDeployments}
            class="p-2 rounded-lg bg-[#1f1f1f] border border-[#333] hover:bg-[#333] transition-colors text-[#a1a1aa] hover:text-white"
            title="Refresh"
        >
            <RefreshCw size={18} class={isLoading ? "animate-spin" : ""} />
        </button>
    </div>

    <!-- Deployment Grid -->
    {#if isLoading && deployments.length === 0}
        <div class="flex items-center justify-center h-64">
            <Loader2 class="animate-spin text-[#a1a1aa]" />
        </div>
    {:else if deployments.length === 0}
        <div
            class="flex flex-col items-center justify-center h-64 border border-dashed border-[#1f1f1f] rounded-xl text-[#52525b]"
        >
            <Globe size={48} class="mb-4 opacity-50" />
            <p>No deployments found.</p>
            <a
                href="/chat"
                class="mt-4 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >Generate your first site →</a
            >
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each deployments as deploy}
                <div
                    class="group relative bg-[#111] border border-[#1f1f1f] rounded-xl overflow-hidden hover:border-[#333] transition-all duration-300"
                >
                    <!-- Status Badge -->
                    <div
                        class="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0a0a0a50] backdrop-blur border border-white/5
                        {deploy.status === 'live'
                            ? 'text-emerald-500 border-emerald-500/20'
                            : deploy.status === 'failed'
                              ? 'text-red-500 border-red-500/20'
                              : 'text-amber-500 border-amber-500/20'}"
                    >
                        {#if deploy.status === "live"}
                            <CheckCircle2 size={10} />
                        {:else if deploy.status === "failed"}
                            <XCircle size={10} />
                        {:else}
                            <Loader2 size={10} class="animate-spin" />
                        {/if}
                        {deploy.status}
                    </div>

                    <!-- Preview / Thumbnail Area -->
                    <div
                        class="h-32 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center relative group-hover:from-[#222] transition-colors"
                    >
                        <Terminal
                            size={32}
                            class="text-[#333] group-hover:text-[#444] transition-colors"
                        />

                        <!-- Hover Actions -->
                        <div
                            class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm"
                        >
                            <button
                                on:click={() => handlePreview(deploy.liveUrl)}
                                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs hover:scale-105 transition-transform"
                            >
                                <Eye size={12} /> Preview
                            </button>
                            <a
                                href={deploy.liveUrl}
                                target="_blank"
                                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#333] text-white border border-[#444] font-bold text-xs hover:scale-105 transition-transform"
                            >
                                <ExternalLink size={12} /> Visit
                            </a>
                        </div>
                    </div>

                    <!-- Details -->
                    <div class="p-4">
                        <h3 class="font-bold text-sm text-[#e4e4e7] truncate">
                            {deploy.projectId}
                        </h3>
                        <a
                            href={deploy.liveUrl}
                            target="_blank"
                            class="text-xs text-[#a1a1aa] hover:text-indigo-400 transition-colors truncate block mt-1"
                        >
                            {deploy.liveUrl.replace("https://", "")}
                        </a>

                        <div
                            class="mt-4 pt-4 border-t border-[#1f1f1f] flex items-center justify-between text-[10px] text-[#52525b]"
                        >
                            <div class="flex items-center gap-1.5">
                                <Clock size={10} />
                                {new Date(
                                    deploy.createdAt,
                                ).toLocaleDateString()}
                            </div>
                            <span class="font-mono"
                                >ID: {deploy.id.slice(0, 6)}</span
                            >
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    <!-- Live Preview Modal -->
    {#if previewUrl}
        <div
            class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-200"
        >
            <div
                class="bg-[#0a0a0a] w-full h-full max-w-6xl rounded-2xl border border-[#333] flex flex-col shadow-2xl overflow-hidden relative"
            >
                <!-- Toolbar -->
                <div
                    class="h-12 border-b border-[#1f1f1f] bg-[#111] flex items-center justify-between px-4 shrink-0"
                >
                    <div class="flex items-center gap-4">
                        <div class="flex gap-1.5">
                            <div
                                class="w-2.5 h-2.5 rounded-full bg-red-500/50"
                            ></div>
                            <div
                                class="w-2.5 h-2.5 rounded-full bg-amber-500/50"
                            ></div>
                            <div
                                class="w-2.5 h-2.5 rounded-full bg-emerald-500/50"
                            ></div>
                        </div>
                        <div
                            class="h-6 px-3 bg-[#0a0a0a] rounded flex items-center text-xs text-[#a1a1aa] w-64 border border-[#1f1f1f]"
                        >
                            {previewUrl}
                        </div>
                    </div>
                    <button
                        on:click={closePreview}
                        class="p-1.5 hover:bg-[#222] rounded text-[#a1a1aa] hover:text-white transition-colors"
                    >
                        <XCircle size={18} />
                    </button>
                </div>

                <!-- Iframe -->
                <iframe
                    src={previewUrl}
                    title="Live Preview"
                    class="flex-1 w-full bg-white"
                ></iframe>
            </div>
        </div>
    {/if}
</div>

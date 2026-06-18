<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { Chat } from "@ai-sdk/svelte";
    import {
        superNode,
        type WorkflowStatus,
        type WorkflowStep,
    } from "$lib/services/supernode";
    import {
        Send,
        Bot,
        User,
        Loader2,
        CheckCircle2,
        Globe,
        ArrowRight,
    } from "lucide-svelte";

    // Initialize Vercel AI SDK chat
    const chat = new Chat({
        api: 'http://localhost:3000/api/chat', // Use Go Backend directly or keep it '/api/chat' if proxy is set. Wait, the user mentioned it's an SPA and +server.ts is wrong. I will point it to local BFF directly if it's SPA.
        initialMessages: [
            {
                id: "1",
                role: "assistant",
                content: 'Hello! I am your Nexus Agent. I can help you deploy websites. Try saying "Generate a personal portfolio".',
            }
        ]
    });

    let input = "";

    function handleSubmit(e: Event) {
        e.preventDefault();
        if (!input.trim() || chat.status === 'streaming' || chat.status === 'submitted') return;
        chat.sendMessage({ text: input });
        input = "";
    }

    // Workflow Tracking State
    let activeWorkflowId: string | null = null;
    let workflowStatus: WorkflowStatus | null = null;
    let pollingTimer: any;

    // Scroll ref
    let chatContainer: HTMLElement;

    // Scroll to bottom when messages change
    $: chat.messages, scrollToBottom();

    // Monitor AI tool calls to extract workflowId and start polling
    $: {
        const lastMsg = chat.messages[chat.messages.length - 1];
        if (lastMsg?.role === 'assistant' && lastMsg.toolInvocations) {
            for (const tool of lastMsg.toolInvocations) {
                if (tool.toolName === 'system__deploy_website' && tool.state === 'result') {
                    const result = tool.result as any;
                    if (result?.workflowId && result.workflowId !== activeWorkflowId) {
                        activeWorkflowId = result.workflowId;
                        startPolling(result.workflowId);
                    }
                }
            }
        }
    }

    function startPolling(id: string) {
        if (pollingTimer) clearInterval(pollingTimer);
        
        // Reset status
        workflowStatus = {
            workflowId: id,
            status: 'RUNNING',
            currentStep: 'INIT',
            logs: []
        };

        pollingTimer = setInterval(async () => {
            const status = await superNode.getWorkflowStatus(id);
            workflowStatus = status;

            if (status.status === "COMPLETED" || status.status === "FAILED") {
                clearInterval(pollingTimer);
                // Keep the status for UI, but stop polling
            }
        }, 1000);
    }

    function scrollToBottom() {
        setTimeout(() => {
            if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 50);
    }

    onDestroy(() => {
        if (pollingTimer) clearInterval(pollingTimer);
    });

    // Helper for stepper
    function getStepStatus(
        current: WorkflowStep,
        step: WorkflowStep,
    ): "pending" | "loading" | "done" {
        const order: WorkflowStep[] = [
            "INIT",
            "GEN_SCHEMA",
            "GEN_CODE",
            "BUILDING",
            "DEPLOYING",
            "DONE",
        ];
        const msgIndex = order.indexOf(current);
        const stepIndex = order.indexOf(step);

        if (msgIndex > stepIndex) return "done";
        if (msgIndex === stepIndex) return "loading";
        return "pending";
    }
</script>

<div class="flex h-full flex-col bg-[#0a0a0a] text-white">
    <!-- Header -->
    <header class="h-[60px] border-b border-[#1f1f1f] flex items-center px-6 justify-between shrink-0">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                <Bot size={16} />
            </div>
            <div>
                <h1 class="font-semibold text-sm">VoltAgent</h1>
                <p class="text-[10px] text-[#a1a1aa]">Deployment Specialist</p>
            </div>
        </div>
        <div class="flex gap-2">
            <!-- Actions -->
        </div>
    </header>

    <!-- Chat Area -->
    <div bind:this={chatContainer} class="flex-1 overflow-y-auto p-6 space-y-6">
        {#each chat.messages as msg}
            <div class="flex gap-4 {msg.role === 'user' ? 'justify-end' : ''}">
                {#if msg.role === "assistant" || msg.role === "system"}
                    <div class="w-8 h-8 rounded-full bg-[#1f1f1f] border border-[#333] flex items-center justify-center shrink-0">
                        <Bot size={14} class="text-[#a1a1aa]" />
                    </div>
                {/if}

                <div class="max-w-[80%] space-y-2">
                    <div class="flex items-baseline gap-2 {msg.role === 'user' ? 'flex-row-reverse' : ''}">
                        <span class="text-xs font-bold text-[#e4e4e7]">{msg.role === "user" ? "You" : "VoltAgent"}</span>
                    </div>

                    <!-- Message Bubble -->
                    {#if msg.content}
                        <div class="p-4 rounded-2xl text-sm leading-relaxed border
                            {msg.role === 'user'
                                ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-100 rounded-tr-none'
                                : 'bg-[#111] border-[#1f1f1f] text-[#d4d4d8] rounded-tl-none'}">
                            {msg.content}
                        </div>
                    {/if}

                    <!-- Tool Calls / Workflow Tracker -->
                    {#if msg.toolInvocations}
                        {#each msg.toolInvocations as tool}
                            {#if tool.toolName === 'system__deploy_website'}
                                <div class="mt-2 p-4 rounded-xl bg-[#0f0f0f] border border-[#1f1f1f] w-[400px]">
                                    <div class="flex items-center justify-between mb-4">
                                        <span class="text-xs font-medium text-[#a1a1aa]">Deployment Progress</span>
                                        <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            {workflowStatus?.status || (tool.state === 'result' ? 'RUNNING' : 'STARTING')}
                                        </span>
                                    </div>

                                    {#if tool.state === 'call'}
                                        <div class="flex items-center gap-2 text-sm text-[#a1a1aa] py-2">
                                            <Loader2 size={14} class="animate-spin" />
                                            <span>Preparing deployment workflow...</span>
                                        </div>
                                    {:else if tool.state === 'result' && workflowStatus}
                                        <!-- Steps -->
                                        <div class="space-y-3 relative">
                                            <!-- Connecting Line -->
                                            <div class="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#1f1f1f]"></div>

                                            {#each [{ id: "GEN_SCHEMA", label: "Generating UI Schema" }, { id: "GEN_CODE", label: "Generating Components" }, { id: "BUILDING", label: "Building Bundle" }, { id: "DEPLOYING", label: "Deploying to Edge" }] as step}
                                                {@const stepStatus = getStepStatus(workflowStatus.currentStep, step.id as WorkflowStep)}
                                                <div class="relative flex items-center gap-3">
                                                    <div class="w-6 h-6 rounded-full border flex items-center justify-center z-10
                                                        {stepStatus === 'done'
                                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                                            : stepStatus === 'loading'
                                                              ? 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                                              : 'bg-[#0a0a0a] border-[#333] text-[#333]'}">
                                                        {#if stepStatus === "done"}
                                                            <CheckCircle2 size={12} />
                                                        {:else if stepStatus === "loading"}
                                                            <Loader2 size={12} class="animate-spin" />
                                                        {:else}
                                                            <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
                                                        {/if}
                                                    </div>
                                                    <span class="text-xs {stepStatus === 'pending' ? 'text-[#a1a1aa]' : 'text-[#e4e4e7]'}">
                                                        {step.label}
                                                    </span>
                                                </div>
                                            {/each}
                                        </div>

                                        <!-- Artifacts / Result -->
                                        {#if workflowStatus.status === "COMPLETED" && workflowStatus.artifacts}
                                            <div class="mt-4 pt-4 border-t border-[#1f1f1f]">
                                                <div class="flex gap-2">
                                                    <a href={workflowStatus.artifacts.liveUrl} target="_blank"
                                                        class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors text-xs font-medium">
                                                        <Globe size={14} /> View Live
                                                    </a>
                                                    <a href="/deployments"
                                                        class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1f1f1f] text-[#a1a1aa] hover:bg-[#27272a] border border-[#333] transition-colors text-xs font-medium">
                                                        Manage <ArrowRight size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                        {/if}
                                    {/if}
                                </div>
                            {/if}
                        {/each}
                    {/if}
                </div>

                {#if msg.role === "user"}
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                        <User size={14} class="text-white" />
                    </div>
                {/if}
            </div>
        {/each}

        {#if chat.status === 'submitted' || chat.status === 'streaming'}
            <!-- If we are generating but haven't streamed a message/tool yet -->
            <div class="flex gap-4">
                <div class="w-8 h-8 rounded-full bg-[#1f1f1f] border border-[#333] flex items-center justify-center shrink-0">
                    <Bot size={14} class="text-[#a1a1aa]" />
                </div>
                <div class="p-4 rounded-2xl bg-[#111] border border-[#1f1f1f] rounded-tl-none flex items-center gap-1">
                    <div class="w-1.5 h-1.5 bg-[#a1a1aa] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div class="w-1.5 h-1.5 bg-[#a1a1aa] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div class="w-1.5 h-1.5 bg-[#a1a1aa] rounded-full animate-bounce"></div>
                </div>
            </div>
        {/if}
    </div>

    <!-- Input Area -->
    <div class="p-6 pt-0">
        <form class="relative" on:submit={handleSubmit}>
            <input
                bind:value={input}
                type="text"
                placeholder="Describe a website to generate..."
                class="w-full bg-[#111] border border-[#1f1f1f] text-white text-sm rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-[#a1a1aa]"
            />
            <button
                type="submit"
                disabled={!input.trim() || chat.status === 'streaming' || chat.status === 'submitted'}
                class="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Send size={16} />
            </button>
        </form>
        <p class="text-[10px] text-center text-[#a1a1aa] mt-3">
            Powered by VoltAgent & Vercel AI SDK. Commands: "Generate website", "Deploy app".
        </p>
    </div>
</div>

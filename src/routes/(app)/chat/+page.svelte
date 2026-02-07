<script lang="ts">
    import { onMount, onDestroy } from "svelte";
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

    // Types
    interface Message {
        id: string;
        role: "user" | "assistant";
        content: string;
        timestamp: Date;
        workflowId?: string; // If this message tracks a workflow
    }

    // State
    let messages: Message[] = [
        {
            id: "1",
            role: "assistant",
            content:
                'Hello! I am your Nexus Agent. I can help you deploy websites. Try saying "Generate a personal portfolio".',
            timestamp: new Date(),
        },
    ];
    let inputValue = "";
    let isTyping = false;
    let activeWorkflowId: string | null = null;
    let workflowStatus: WorkflowStatus | null = null;
    let pollingTimer: any;

    // Scroll ref
    let chatContainer: HTMLElement;

    // --- Logic ---

    async function handleSend() {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date(),
        };

        messages = [...messages, userMsg];
        const prompt = inputValue;
        inputValue = "";
        setTimeout(scrollToBottom, 50);

        // Detect Intent
        if (
            prompt.toLowerCase().includes("generate") ||
            prompt.toLowerCase().includes("deploy")
        ) {
            await startGenerationFlow(prompt);
        } else {
            // Standard Chat Mock
            isTyping = true;
            setTimeout(() => {
                isTyping = false;
                messages = [
                    ...messages,
                    {
                        id: Date.now().toString(),
                        role: "assistant",
                        content:
                            "I'm focused on deployment tasks right now. Please ask me to generate a website!",
                        timestamp: new Date(),
                    },
                ];
                setTimeout(scrollToBottom, 50);
            }, 1000);
        }
    }

    async function startGenerationFlow(prompt: string) {
        isTyping = true;

        // 1. Call Backend
        const result = await superNode.executeVoltAgentTool(
            "system__deploy_website",
            {
                project_name: "generated-project",
                prompt: prompt,
                theme: "dark", // Defaulting for now
            },
        );

        isTyping = false;

        // 2. Add Workflow Message
        activeWorkflowId = result.workflowId;
        messages = [
            ...messages,
            {
                id: Date.now().toString(),
                role: "assistant",
                content: "Starting deployment workflow...",
                timestamp: new Date(),
                workflowId: result.workflowId,
            },
        ];

        // 3. Start Polling
        startPolling(result.workflowId);
    }

    function startPolling(id: string) {
        if (pollingTimer) clearInterval(pollingTimer);

        pollingTimer = setInterval(async () => {
            const status = await superNode.getWorkflowStatus(id);
            workflowStatus = status;

            // Update the message content dynamically or just rely on the reactive UI below
            if (status.status === "COMPLETED" || status.status === "FAILED") {
                clearInterval(pollingTimer);
                activeWorkflowId = null; // Workflow done, stop tracking as "active" for polling purposes (but keep UI)
            }
        }, 1000);
    }

    function scrollToBottom() {
        if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
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
    <header
        class="h-[60px] border-b border-[#1f1f1f] flex items-center px-6 justify-between shrink-0"
    >
        <div class="flex items-center gap-3">
            <div
                class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center"
            >
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
        {#each messages as msg}
            <div class="flex gap-4 {msg.role === 'user' ? 'justify-end' : ''}">
                {#if msg.role === "assistant"}
                    <div
                        class="w-8 h-8 rounded-full bg-[#1f1f1f] border border-[#333] flex items-center justify-center shrink-0"
                    >
                        <Bot size={14} class="text-[#a1a1aa]" />
                    </div>
                {/if}

                <div class="max-w-[80%] space-y-2">
                    <div
                        class="flex items-baseline gap-2 {msg.role === 'user'
                            ? 'flex-row-reverse'
                            : ''}"
                    >
                        <span class="text-xs font-bold text-[#e4e4e7]"
                            >{msg.role === "user" ? "You" : "VoltAgent"}</span
                        >
                        <span class="text-[10px] text-[#52525b]"
                            >{msg.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}</span
                        >
                    </div>

                    <!-- Message Bubble -->
                    <div
                        class="p-4 rounded-2xl text-sm leading-relaxed border
                        {msg.role === 'user'
                            ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-100 rounded-tr-none'
                            : 'bg-[#111] border-[#1f1f1f] text-[#d4d4d8] rounded-tl-none'}"
                    >
                        {msg.content}
                    </div>

                    <!-- Workflow Tracker (If attached to message) -->
                    {#if msg.workflowId && workflowStatus && workflowStatus.workflowId === msg.workflowId}
                        <div
                            class="mt-2 p-4 rounded-xl bg-[#0f0f0f] border border-[#1f1f1f] w-[400px]"
                        >
                            <div class="flex items-center justify-between mb-4">
                                <span class="text-xs font-medium text-[#a1a1aa]"
                                    >Deployment Progress</span
                                >
                                <span
                                    class="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                >
                                    {workflowStatus.status}
                                </span>
                            </div>

                            <!-- Steps -->
                            <div class="space-y-3 relative">
                                <!-- Connecting Line -->
                                <div
                                    class="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#1f1f1f]"
                                ></div>

                                {#each [{ id: "GEN_SCHEMA", label: "Generating UI Schema" }, { id: "GEN_CODE", label: "Generating Components" }, { id: "BUILDING", label: "Building Bundle" }, { id: "DEPLOYING", label: "Deploying to Edge" }] as step}
                                    {@const status = getStepStatus(
                                        workflowStatus.currentStep,
                                        step.id as WorkflowStep,
                                    )}
                                    <div
                                        class="relative flex items-center gap-3"
                                    >
                                        <div
                                            class="w-6 h-6 rounded-full border flex items-center justify-center z-10
                                            {status === 'done'
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                                : status === 'loading'
                                                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                                  : 'bg-[#0a0a0a] border-[#333] text-[#333]'}"
                                        >
                                            {#if status === "done"}
                                                <CheckCircle2 size={12} />
                                            {:else if status === "loading"}
                                                <Loader2
                                                    size={12}
                                                    class="animate-spin"
                                                />
                                            {:else}
                                                <div
                                                    class="w-1.5 h-1.5 rounded-full bg-current"
                                                ></div>
                                            {/if}
                                        </div>
                                        <span
                                            class="text-xs {status === 'pending'
                                                ? 'text-[#52525b]'
                                                : 'text-[#e4e4e7]'}"
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                {/each}
                            </div>

                            <!-- Artifacts / Result -->
                            {#if workflowStatus.status === "COMPLETED" && workflowStatus.artifacts}
                                <div
                                    class="mt-4 pt-4 border-t border-[#1f1f1f]"
                                >
                                    <div class="flex gap-2">
                                        <a
                                            href={workflowStatus.artifacts
                                                .liveUrl}
                                            target="_blank"
                                            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors text-xs font-medium"
                                        >
                                            <Globe size={14} /> View Live
                                        </a>
                                        <a
                                            href="/deployments"
                                            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1f1f1f] text-[#a1a1aa] hover:bg-[#27272a] border border-[#333] transition-colors text-xs font-medium"
                                        >
                                            Manage <ArrowRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>

                {#if msg.role === "user"}
                    <div
                        class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0"
                    >
                        <User size={14} class="text-white" />
                    </div>
                {/if}
            </div>
        {/each}

        {#if isTyping}
            <div class="flex gap-4">
                <div
                    class="w-8 h-8 rounded-full bg-[#1f1f1f] border border-[#333] flex items-center justify-center shrink-0"
                >
                    <Bot size={14} class="text-[#a1a1aa]" />
                </div>
                <div
                    class="p-4 rounded-2xl bg-[#111] border border-[#1f1f1f] rounded-tl-none flex items-center gap-1"
                >
                    <div
                        class="w-1.5 h-1.5 bg-[#52525b] rounded-full animate-bounce [animation-delay:-0.3s]"
                    ></div>
                    <div
                        class="w-1.5 h-1.5 bg-[#52525b] rounded-full animate-bounce [animation-delay:-0.15s]"
                    ></div>
                    <div
                        class="w-1.5 h-1.5 bg-[#52525b] rounded-full animate-bounce"
                    ></div>
                </div>
            </div>
        {/if}
    </div>

    <!-- Input Area -->
    <div class="p-6 pt-0">
        <div class="relative">
            <input
                bind:value={inputValue}
                on:keydown={(e) => e.key === "Enter" && handleSend()}
                type="text"
                placeholder="Describe a website to generate..."
                class="w-full bg-[#111] border border-[#1f1f1f] text-white text-sm rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-[#52525b]"
            />
            <button
                on:click={handleSend}
                disabled={!inputValue.trim()}
                class="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Send size={16} />
            </button>
        </div>
        <p class="text-[10px] text-center text-[#52525b] mt-3">
            Powered by VoltAgent & Temporal. Commands: "Generate website",
            "Deploy app".
        </p>
    </div>
</div>

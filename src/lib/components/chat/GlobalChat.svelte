<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  import { DefaultChatTransport } from 'ai';
  import { page } from '$app/stores';
  import { onDestroy } from 'svelte';
  import { superNode, type WorkflowStatus } from '$lib/services/supernode';
  import { Bot, Loader2, Send, X, MessageSquare, Maximize2, Minimize2 } from 'lucide-svelte';

  let isOpen = $state(false);
  let isExpanded = $state(false);
  let chatContainer = $state<HTMLElement | null>(null);
  let messageInput = $state("");
  let workflowStatuses = $state<Record<string, WorkflowStatus>>({});

  const trackedWorkflowIds = new Set<string>();
  const workflowPollers = new Map<string, ReturnType<typeof setTimeout>>();

  const chatApi = import.meta.env.DEV
    ? '/api/chat'
    : (import.meta.env.VITE_CHAT_API_URL || 'http://localhost:3001/api/chat');

  function getMessageParts(message: any) {
    return (message?.parts ?? []) as any[];
  }

  function getMessageText(message: any) {
    return getMessageParts(message)
      .filter((part) => part.type === 'text')
      .map((part) => part.text ?? '')
      .join('');
  }

  function isUserMessage(message: any) {
    return message?.role === 'user';
  }

  function isToolInvocationPart(part: any) {
    return part?.type === 'tool-invocation';
  }

  function extractWorkflowId(result: unknown) {
    if (!result || typeof result !== 'object') return null;

    const record = result as Record<string, unknown>;
    if (typeof record.workflow_id === 'string') return record.workflow_id;
    if (typeof record.workflowId === 'string') return record.workflowId;
    return null;
  }

  function getWorkflowStatusTone(status: WorkflowStatus['status'] | undefined) {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-300 border-green-500/30 bg-green-500/10';
      case 'FAILED':
        return 'text-red-300 border-red-500/30 bg-red-500/10';
      default:
        return 'text-amber-200 border-amber-500/30 bg-amber-500/10';
    }
  }

  function clearWorkflowPoller(workflowId: string) {
    const timer = workflowPollers.get(workflowId);
    if (timer) {
      clearTimeout(timer);
      workflowPollers.delete(workflowId);
    }
  }

  async function pollWorkflowStatus(workflowId: string) {
    try {
      const status = await superNode.getWorkflowStatus(workflowId);
      workflowStatuses = {
        ...workflowStatuses,
        [workflowId]: status
      };

      clearWorkflowPoller(workflowId);
      if (status.status === 'RUNNING') {
        workflowPollers.set(
          workflowId,
          setTimeout(() => {
            void pollWorkflowStatus(workflowId);
          }, 1500)
        );
      }
    } catch (error) {
      workflowStatuses = {
        ...workflowStatuses,
        [workflowId]: {
          workflowId,
          status: 'FAILED',
          currentStep: 'INIT',
          logs: ['Unable to retrieve workflow status from backend.'],
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
      clearWorkflowPoller(workflowId);
    }
  }

  function trackWorkflow(result: unknown) {
    const workflowId = extractWorkflowId(result);
    if (!workflowId || trackedWorkflowIds.has(workflowId)) return;

    trackedWorkflowIds.add(workflowId);

    const record = (result && typeof result === 'object') ? result as Record<string, unknown> : {};
    const initialMessage = typeof record.message === 'string' ? record.message : 'Workflow queued.';
    const initialStep = typeof record.current_step === 'string' ? record.current_step : 'INIT';

    workflowStatuses = {
      ...workflowStatuses,
      [workflowId]: {
        workflowId,
        status: 'RUNNING',
        currentStep: initialStep as WorkflowStatus['currentStep'],
        logs: [initialMessage]
      }
    };

    void pollWorkflowStatus(workflowId);
  }

  // AI SDK Chat Integration
  const chat = new Chat({
    transport: new DefaultChatTransport({
      api: chatApi,
    }),
    messages: [
      {
        id: "1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Welcome to the Nexus Communication Hub! How can I assist you today?",
          }
        ],
      }
    ],
  });

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      scrollToBottom();
    }
  }

  function toggleExpand() {
    isExpanded = !isExpanded;
  }

  function handleSend(e?: Event) {
    e?.preventDefault();
    if (!messageInput.trim() || chat.status === 'streaming' || chat.status === 'submitted') return;
    
    const currentPath = $page.url.pathname;
    
    chat.sendMessage({
      text: messageInput
    }, {
      body: { data: { currentPath } }
    });
    
    messageInput = "";
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 50);
  }

  // Auto-scroll to bottom when messages update
  $effect(() => {
    if (chat.messages && chatContainer) {
      scrollToBottom();
    }
  });

  $effect(() => {
    for (const message of (chat.messages ?? []) as any[]) {
      for (const part of getMessageParts(message)) {
        if (isToolInvocationPart(part) && part.toolInvocation.state === 'result') {
          trackWorkflow(part.toolInvocation.result);
        }
      }
    }
  });

  onDestroy(() => {
    for (const timer of workflowPollers.values()) {
      clearTimeout(timer);
    }
    workflowPollers.clear();
  });
</script>

<div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
  
  <!-- Chat Window -->
  {#if isOpen}
    <div 
      class="bg-gray-950 border border-white/10 shadow-2xl rounded-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300 ease-in-out {isExpanded ? 'w-[80vw] h-[80vh] max-w-5xl max-h-[800px]' : 'w-[380px] h-[600px] max-h-[70vh]'}"
    >
      <!-- Header -->
      <header class="p-4 border-b border-white/10 flex items-center justify-between bg-black/20 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <Bot size={16} class="text-white" />
          </div>
          <div>
            <h2 class="font-bold text-sm text-white">VoltAgent</h2>
            <p class="text-[10px] text-white/50">Current Page: {$page.url.pathname}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 text-white/50">
          <button onclick={toggleExpand} class="hover:text-white transition-colors p-1 rounded-md hover:bg-white/10">
            {#if isExpanded}
              <Minimize2 size={16} />
            {:else}
              <Maximize2 size={16} />
            {/if}
          </button>
          <button onclick={toggleChat} class="hover:text-white transition-colors p-1 rounded-md hover:bg-white/10">
            <X size={18} />
          </button>
        </div>
      </header>

      <!-- Message Area -->
      <div class="flex-1 p-4 overflow-y-auto space-y-4" bind:this={chatContainer}>
        {#each chat.messages as message}
          <div class="flex gap-3 {isUserMessage(message) ? 'justify-end' : ''}">
            {#if !isUserMessage(message)}
              <div class="w-8 h-8 rounded-full bg-indigo-500 shrink-0 flex items-center justify-center text-white mt-1">
                <Bot size={14} />
              </div>
            {/if}

            <div class="space-y-1 max-w-[80%] {isUserMessage(message) ? 'items-end flex flex-col' : ''}">
              <div class="p-3 text-sm rounded-2xl {isUserMessage(message) ? 'bg-nexus-accent text-black rounded-tr-none font-medium' : 'bg-nexus-card border border-white/10 rounded-tl-none text-white/90'}">
                {getMessageText(message)}
              </div>
              
              <!-- Tool Invocations -->
              {#if getMessageParts(message).length}
                {#each getMessageParts(message) as part}
                  {#if isToolInvocationPart(part)}
                    <div class="mt-2 p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
                      <div class="flex items-center gap-2 text-indigo-400 mb-1">
                        <Bot size={12} />
                        <span>Executing: {part.toolInvocation.toolName}</span>
                      </div>
                      <div class="text-white/50 pl-5">
                        {#if part.toolInvocation.state === 'result'}
                          <span class="text-green-400">✓ Success</span>
                          <pre class="mt-1 overflow-x-auto text-[10px]">{JSON.stringify(part.toolInvocation.result, null, 2)}</pre>
                          {@const workflowId = extractWorkflowId(part.toolInvocation.result)}
                          {#if workflowId}
                            {@const workflowStatus = workflowStatuses[workflowId]}
                            <div class="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 not-prose">
                              <div class="flex items-start justify-between gap-3">
                                <div class="min-w-0">
                                  <div class="text-[10px] uppercase tracking-[0.2em] text-white/40">Workflow Status</div>
                                  <div class="mt-1 truncate text-[11px] text-white/80">{workflowId}</div>
                                </div>
                                <span class="rounded-full border px-2 py-0.5 text-[10px] font-semibold {getWorkflowStatusTone(workflowStatus?.status)}">
                                  {workflowStatus?.status ?? 'RUNNING'}
                                </span>
                              </div>

                              <div class="mt-3 flex items-center justify-between gap-3 text-[10px] text-white/60">
                                <span>Step: {workflowStatus?.currentStep ?? 'INIT'}</span>
                                {#if workflowStatus?.status === 'RUNNING'}
                                  <span class="flex items-center gap-1 text-amber-200">
                                    <Loader2 size={10} class="animate-spin" />
                                    Syncing
                                  </span>
                                {/if}
                              </div>

                              {#if workflowStatus?.logs?.length}
                                <p class="mt-2 text-[10px] leading-5 text-white/55">
                                  {workflowStatus.logs[workflowStatus.logs.length - 1]}
                                </p>
                              {/if}

                              {#if workflowStatus?.artifacts?.liveUrl}
                                <a
                                  class="mt-3 inline-flex text-[10px] font-semibold text-indigo-300 hover:text-indigo-200"
                                  href={workflowStatus.artifacts.liveUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Open deployment URL
                                </a>
                              {/if}
                            </div>
                          {/if}
                        {:else}
                          <span class="flex items-center gap-1"><Loader2 size={10} class="animate-spin" /> In progress...</span>
                        {/if}
                      </div>
                    </div>
                  {/if}
                {/each}
              {/if}
            </div>
          </div>
        {/each}

        {#if (chat.status === 'streaming' || chat.status === 'submitted') && isUserMessage(chat.messages[chat.messages.length - 1])}
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-500 shrink-0 flex items-center justify-center text-white mt-1">
              <Bot size={14} />
            </div>
            <div class="bg-nexus-card border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={14} class="animate-spin text-white/50" />
              <span class="text-xs text-white/50">Thinking...</span>
            </div>
          </div>
        {/if}

        {#if chat.error}
          <div class="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
            {chat.error.message}
          </div>
        {/if}
      </div>

      <!-- Input Area -->
      <footer class="p-4 bg-black/20 border-t border-white/10 shrink-0">
        <form onsubmit={handleSend} class="bg-white/5 border border-white/10 rounded-xl p-1.5 flex items-center gap-2">
          <input
            type="text"
            bind:value={messageInput}
            disabled={chat.status === 'streaming' || chat.status === 'submitted'}
            placeholder="Ask VoltAgent..."
            class="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 disabled:opacity-50 text-white placeholder:text-white/30"
          />
          <button
            type="submit"
            disabled={(chat.status === 'streaming' || chat.status === 'submitted') || !messageInput.trim()}
            class="w-8 h-8 rounded-lg bg-nexus-accent text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send size={14} />
          </button>
        </form>
      </footer>
    </div>
  {/if}

  <!-- Toggle Button -->
  <button
    onclick={toggleChat}
    class="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
  >
    {#if isOpen}
      <X size={24} />
    {:else}
      <MessageSquare size={24} />
    {/if}
  </button>
</div>

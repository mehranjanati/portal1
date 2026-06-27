<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  import { DefaultChatTransport } from 'ai';
  import { onDestroy, onMount } from 'svelte';
  import { agentsStore } from '$lib/stores/agents';
  import { superNode, type WorkflowStatus } from '$lib/services/supernode';
  import type { Agent, AgentCapability, AgentExecutionMode, AgentResultSurface } from '$lib/types';
  import { appHashToPageName, currentAppHash } from '$lib/utils';
  import { Bot, Loader2, Send, X, MessageSquare, Maximize2, Minimize2, AlertCircle } from 'lucide-svelte';

  type WorkflowInsightItem = {
    workflowId: string;
    name: string;
    status: string;
    currentStep: string;
    planningSource?: string;
    lastLog?: string;
    updatedAt?: string;
    matchedBy?: string;
  };

  let isOpen = $state(false);
  let isExpanded = $state(false);
  let chatContainer = $state<HTMLElement | null>(null);
  let messageInput = $state("");
  let workflowStatuses = $state<Record<string, WorkflowStatus>>({});
  let currentHash = $state(currentAppHash());
  let selectedAgent = $state<Agent | null>(null);
  let composerError = $state("");

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

  function extractToolResultStatus(result: unknown) {
    if (!result || typeof result !== 'object') return null;

    const record = result as Record<string, unknown>;
    return typeof record.status === 'string' ? record.status : null;
  }

  function extractToolResultMessage(result: unknown) {
    if (!result || typeof result !== 'object') return null;

    const record = result as Record<string, unknown>;
    if (typeof record.message === 'string' && record.message.length > 0) {
      return record.message;
    }
    if (typeof record.error === 'string' && record.error.length > 0) {
      return record.error;
    }

    return null;
  }

  function extractToolResultErrorCode(result: unknown) {
    if (!result || typeof result !== 'object') return null;

    const record = result as Record<string, unknown>;
    return typeof record.error === 'string' ? record.error : null;
  }

  function extractPlanningSource(result: unknown) {
    if (!result || typeof result !== 'object') return null;

    const record = result as Record<string, unknown>;
    return typeof record.planning_source === 'string' ? record.planning_source : null;
  }

  function isWorkflowInsightResult(result: unknown) {
    if (!result || typeof result !== 'object') return false;

    const record = result as Record<string, unknown>;
    return (
      record.capability === 'workflow_insight' ||
      Array.isArray(record.selected_workflows) ||
      typeof record.summary === 'string'
    );
  }

  function extractWorkflowInsightSummary(result: unknown) {
    if (!result || typeof result !== 'object') return null;

    const record = result as Record<string, unknown>;
    return typeof record.summary === 'string' ? record.summary : null;
  }

  function extractWorkflowInsightQuestion(result: unknown) {
    if (!result || typeof result !== 'object') return null;

    const record = result as Record<string, unknown>;
    return typeof record.question === 'string' ? record.question : null;
  }

  function extractWorkflowInsightItems(result: unknown): WorkflowInsightItem[] {
    if (!result || typeof result !== 'object') return [];

    const record = result as Record<string, unknown>;
    if (!Array.isArray(record.selected_workflows)) {
      return [];
    }

    return record.selected_workflows
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
      .map((item) => ({
        workflowId:
          typeof item.workflowId === 'string'
            ? item.workflowId
            : typeof item.workflow_id === 'string'
              ? item.workflow_id
              : 'unknown',
        name: typeof item.name === 'string' ? item.name : 'workflow',
        status: typeof item.status === 'string' ? item.status : 'RUNNING',
        currentStep:
          typeof item.currentStep === 'string'
            ? item.currentStep
            : typeof item.current_step === 'string'
              ? item.current_step
              : 'INIT',
        planningSource:
          typeof item.planningSource === 'string'
            ? item.planningSource
            : typeof item.planning_source === 'string'
              ? item.planning_source
              : undefined,
        lastLog:
          typeof item.lastLog === 'string'
            ? item.lastLog
            : typeof item.last_log === 'string'
              ? item.last_log
              : undefined,
        updatedAt:
          typeof item.updatedAt === 'string'
            ? item.updatedAt
            : typeof item.updated_at === 'string'
              ? item.updated_at
              : undefined,
        matchedBy:
          typeof item.matchedBy === 'string'
            ? item.matchedBy
            : typeof item.matched_by === 'string'
              ? item.matched_by
              : undefined,
      }));
  }

  function extractWorkflowInsightTotal(result: unknown) {
    if (!result || typeof result !== 'object') return null;

    const record = result as Record<string, unknown>;
    return typeof record.total_workflows === 'number' ? record.total_workflows : null;
  }

  function getCapabilityLabel(capability: AgentCapability | undefined) {
    return capability === 'deploy_website' ? 'Deploy Website' : 'Workflow Insight';
  }

  function getExecutionModeLabel(executionMode: AgentExecutionMode | undefined) {
    return executionMode === 'deploy_workflow'
      ? 'Deploy Workflow'
      : 'Read-Only Insight';
  }

  function getResultSurfaceLabel(resultSurface: AgentResultSurface | undefined) {
    switch (resultSurface) {
      case 'foundry':
        return 'Foundry';
      case 'projects':
        return 'Projects';
      default:
        return 'Global Chat';
    }
  }

  function getWorkflowInsightPresentation(result: unknown) {
    const errorCode = extractToolResultErrorCode(result);
    const items = extractWorkflowInsightItems(result);

    switch (errorCode) {
      case 'workflow_not_found':
        return {
          tone: 'border-amber-500/30 bg-amber-500/10 text-amber-100',
          badge: 'Workflow Not Found',
          title: 'workflow موردنظر پیدا نشد',
          description: 'شناسه یا فیلتر فعلی با workflow موجود match نشد. یک سوال کلی‌تر بپرس یا بدون workflowId دوباره تلاش کن.',
        };
      case 'no_workflows_available':
        return {
          tone: 'border-slate-500/30 bg-slate-500/10 text-slate-100',
          badge: 'No Workflows',
          title: 'فعلاً workflowی برای نمایش وجود ندارد',
          description: 'در data فعلی هیچ workflow قابل‌نمایشی پیدا نشد. این حالت empty است، نه failure پنهان.',
        };
      case 'workflow_data_unavailable':
        return {
          tone: 'border-red-500/30 bg-red-500/10 text-red-100',
          badge: 'Data Unavailable',
          title: 'داده runtime موقتاً در دسترس نیست',
          description: 'اتصال به backend یا endpointهای workflow/log با مشکل مواجه شده است. بعداً دوباره امتحان کن.',
        };
      case 'question_required':
        return {
          tone: 'border-amber-500/30 bg-amber-500/10 text-amber-100',
          badge: 'Question Required',
          title: 'سوال runtime خالی است',
          description: 'برای گرفتن insight باید یک سوال مشخص درباره workflowها یا failureها بپرسی.',
        };
      default:
        if (isToolResultError(result)) {
          return {
            tone: 'border-red-500/30 bg-red-500/10 text-red-100',
            badge: 'Agent Failure',
            title: 'Agent نتوانست نتیجه قابل‌استفاده بسازد',
            description: 'پاسخ runtime با خطا برگشته است. جزئیات فنی ممکن است ناقص یا موقتی باشند.',
          };
        }

        if (items.length === 0) {
          return {
            tone: 'border-slate-500/30 bg-slate-500/10 text-slate-100',
            badge: 'Empty Result',
            title: 'نتیجه‌ای برای نمایش آماده نشد',
            description: 'در این درخواست summaryی برگشته اما workflow مشخصی برای render شدن وجود ندارد.',
          };
        }

        return {
          tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
          badge: 'Agent Result',
          title: 'خلاصه runtime آماده است',
          description: 'این card نتیجه product-facing agent را نشان می‌دهد، نه فقط payload خام tool.',
        };
    }
  }

  function formatInsightTimestamp(value: string | undefined) {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('en-GB', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  function hasVisibleArtifacts(status: WorkflowStatus | undefined) {
    return Boolean(
      status?.artifacts?.liveUrl ||
      status?.artifacts?.previewUrl ||
      status?.artifacts?.repoUrl
    );
  }

  function isToolResultError(result: unknown) {
    const status = extractToolResultStatus(result);
    if (status === 'error' || status === 'FAILED') return true;

    if (!result || typeof result !== 'object') return false;
    const record = result as Record<string, unknown>;
    return typeof record.error === 'string' && record.error.length > 0;
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
            text: "VoltAgent آماده است. یک draft agent را انتخاب کن و درباره workflowها، failureها یا آخرین وضعیت runtime سوال بپرس.",
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

    if (!selectedAgent) {
      composerError = 'برای اجرای agent MVP اول باید یک draft را از Foundry یا Projects انتخاب کنی.';
      return;
    }
    
    const currentRoute = currentHash;
    composerError = "";
    
    chat.sendMessage({
      text: messageInput
    }, {
      body: {
        data: {
          currentPath: appHashToPageName(currentRoute),
          currentRoute,
          selectedAgent: selectedAgent
            ? {
                id: selectedAgent.id,
                name: selectedAgent.name,
                type: selectedAgent.type,
                config: selectedAgent.config ?? {},
              }
            : null,
        }
      }
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

  onMount(() => {
    void agentsStore.loadAgents();

    const updateHash = () => {
      currentHash = currentAppHash();
    };

    window.addEventListener('hashchange', updateHash);
    updateHash();

    const unsubscribeAgents = agentsStore.subscribe((state) => {
      selectedAgent = state.selectedAgent;
    });

    return () => {
      window.removeEventListener('hashchange', updateHash);
      unsubscribeAgents();
    };
  });

  $effect(() => {
    if (selectedAgent) {
      composerError = "";
    }
  });

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
            <p class="text-[10px] text-white/50">Current Page: {appHashToPageName(currentHash)}</p>
            {#if selectedAgent}
              <p class="text-[10px] text-indigo-200/80">Draft: {selectedAgent.name}</p>
            {/if}
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
        {#if selectedAgent}
          <div class="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-white">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-[10px] uppercase tracking-[0.2em] text-indigo-200/70">Active Draft</div>
                <div class="mt-1 text-sm font-semibold">{selectedAgent.name}</div>
                <p class="mt-1 text-[11px] leading-5 text-white/65">
                  {selectedAgent.config?.capability === 'deploy_website'
                    ? 'این draft مسیر deploy را نگه می‌دارد، اما use case اصلی MVP فعلاً workflow insight است.'
                    : 'این draft برای insight read-only از workflowها و logها در همین chat آماده شده است.'}
                </p>
              </div>
              <div class="text-right text-[10px] text-white/60">
                <div>{selectedAgent.type}</div>
                <div class="mt-1">{getResultSurfaceLabel(selectedAgent.config?.resultSurface)}</div>
              </div>
            </div>
            <div class="mt-3 flex flex-wrap gap-2 text-[10px]">
              <span class="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-2 py-1 text-indigo-100">
                {getCapabilityLabel(selectedAgent.config?.capability)}
              </span>
              <span class="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/75">
                {getExecutionModeLabel(selectedAgent.config?.executionMode)}
              </span>
              <span class="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/75">
                {getResultSurfaceLabel(selectedAgent.config?.resultSurface)}
              </span>
            </div>
          </div>
        {:else}
          <div class="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-100">
            <div class="flex items-start gap-3">
              <AlertCircle size={16} class="mt-0.5 shrink-0" />
              <div>
                <div class="text-sm font-semibold">هیچ draft فعالی انتخاب نشده است</div>
                <p class="mt-1 text-[11px] leading-5 text-amber-100/80">
                  برای این MVP، چت فقط وقتی معنی‌دار است که یک draft agent با capability مشخص انتخاب شده باشد. از `Projects` یا `Foundry` یک draft را فعال کن.
                </p>
              </div>
            </div>
          </div>
        {/if}

        {#each chat.messages as message}
          {@const messageText = getMessageText(message)}
          <div class="flex gap-3 {isUserMessage(message) ? 'justify-end' : ''}">
            {#if !isUserMessage(message)}
              <div class="w-8 h-8 rounded-full bg-indigo-500 shrink-0 flex items-center justify-center text-white mt-1">
                <Bot size={14} />
              </div>
            {/if}

            <div class="space-y-1 max-w-[80%] {isUserMessage(message) ? 'items-end flex flex-col' : ''}">
              {#if messageText}
                <div class="p-3 text-sm rounded-2xl {isUserMessage(message) ? 'bg-nexus-accent text-black rounded-tr-none font-medium' : 'bg-nexus-card border border-white/10 rounded-tl-none text-white/90'}">
                  {messageText}
                </div>
              {/if}
              
              <!-- Tool Invocations -->
              {#if getMessageParts(message).length}
                {#each getMessageParts(message) as part}
                  {#if isToolInvocationPart(part)}
                    {#if part.toolInvocation.toolName === 'workflow_insight'}
                      <div class="mt-2 rounded-2xl border border-indigo-500/20 bg-black/40 p-4 text-white">
                        {#if part.toolInvocation.state === 'result'}
                          {@const toolMessage = extractToolResultMessage(part.toolInvocation.result)}
                          {@const insightSummary = extractWorkflowInsightSummary(part.toolInvocation.result)}
                          {@const insightQuestion = extractWorkflowInsightQuestion(part.toolInvocation.result)}
                          {@const insightItems = extractWorkflowInsightItems(part.toolInvocation.result)}
                          {@const insightTotal = extractWorkflowInsightTotal(part.toolInvocation.result)}
                          {@const insightPresentation = getWorkflowInsightPresentation(part.toolInvocation.result)}
                          <div class="flex items-start justify-between gap-3">
                            <div>
                              <div class="text-[10px] uppercase tracking-[0.2em] text-indigo-200/70">Agent Result</div>
                              <div class="mt-1 text-sm font-semibold">{insightPresentation.title}</div>
                              <p class="mt-1 text-[11px] leading-5 text-white/60">{insightPresentation.description}</p>
                            </div>
                            <span class="rounded-full border px-2 py-1 text-[10px] font-semibold {insightPresentation.tone}">
                              {insightPresentation.badge}
                            </span>
                          </div>

                          {#if insightQuestion}
                            <div class="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] text-white/55">
                              درخواست: {insightQuestion}
                            </div>
                          {/if}

                          {#if insightSummary}
                            <div class="mt-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3">
                              <div class="text-[10px] uppercase tracking-[0.2em] text-indigo-200/70">Summary</div>
                              <p class="mt-2 text-[11px] leading-5 text-white/80">{insightSummary}</p>
                            </div>
                          {/if}

                          {#if toolMessage && toolMessage !== insightSummary}
                            <p class="mt-3 text-[10px] leading-5 text-white/55">{toolMessage}</p>
                          {/if}

                          {#if insightTotal !== null}
                            <div class="mt-3 text-[10px] text-white/45">
                              {insightTotal} workflow در این پاسخ وارد result surface شده است.
                            </div>
                          {/if}

                          {#if insightItems.length}
                            <div class="mt-3 space-y-2">
                              {#each insightItems as item}
                                <div class="rounded-xl border border-white/10 bg-black/20 p-3">
                                  <div class="flex items-start justify-between gap-3">
                                    <div class="min-w-0">
                                      <div class="truncate text-[11px] font-semibold text-white/90">{item.name}</div>
                                      <div class="mt-1 truncate text-[10px] text-white/45">{item.workflowId}</div>
                                    </div>
                                    <span class="rounded-full border px-2 py-0.5 text-[10px] font-semibold {getWorkflowStatusTone(item.status as WorkflowStatus['status'])}">
                                      {item.status}
                                    </span>
                                  </div>
                                  <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-white/60">
                                    <span>Step: {item.currentStep}</span>
                                    {#if item.planningSource}
                                      <span>Source: {item.planningSource}</span>
                                    {/if}
                                    {#if item.matchedBy}
                                      <span>Match: {item.matchedBy}</span>
                                    {/if}
                                    {#if item.updatedAt}
                                      <span>Updated: {formatInsightTimestamp(item.updatedAt)}</span>
                                    {/if}
                                  </div>
                                  {#if item.lastLog}
                                    <p class="mt-2 text-[10px] leading-5 text-white/55">{item.lastLog}</p>
                                  {/if}
                                </div>
                              {/each}
                            </div>
                          {/if}
                        {:else}
                          <div class="flex items-start gap-3">
                            <Loader2 size={14} class="mt-0.5 animate-spin text-indigo-300" />
                            <div>
                              <div class="text-sm font-semibold text-white">در حال ساختن insight از workflowها</div>
                              <p class="mt-1 text-[11px] leading-5 text-white/55">
                                agent دارد وضعیت workflowها و logها را جمع می‌کند تا به‌جای payload خام، خلاصه قابل‌خواندن برگرداند.
                              </p>
                            </div>
                          </div>
                        {/if}
                      </div>
                    {:else}
                      <div class="mt-2 p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
                        <div class="flex items-center gap-2 text-indigo-400 mb-1">
                          <Bot size={12} />
                          <span>Executing: {part.toolInvocation.toolName}</span>
                        </div>
                        <div class="text-white/50 pl-5">
                          {#if part.toolInvocation.state === 'result'}
                            {@const toolFailed = isToolResultError(part.toolInvocation.result)}
                            {@const toolMessage = extractToolResultMessage(part.toolInvocation.result)}
                            {@const planningSource = extractPlanningSource(part.toolInvocation.result)}
                            <span class={toolFailed ? 'text-red-400' : 'text-green-400'}>
                              {toolFailed ? '✗ Failed' : '✓ Success'}
                            </span>
                            {#if toolMessage}
                              <div class={toolFailed ? 'mt-1 text-[10px] text-red-200' : 'mt-1 text-[10px] text-white/70'}>
                                {toolMessage}
                              </div>
                            {/if}
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
                                  <div class="flex items-center gap-3">
                                    {#if planningSource}
                                      <span>Source: {planningSource}</span>
                                    {/if}
                                    {#if workflowStatus?.status === 'RUNNING'}
                                      <span class="flex items-center gap-1 text-amber-200">
                                        <Loader2 size={10} class="animate-spin" />
                                        Syncing
                                      </span>
                                    {/if}
                                  </div>
                                </div>

                                {#if hasVisibleArtifacts(workflowStatus)}
                                  <div class="mt-3 flex flex-wrap gap-3 text-[10px]">
                                    {#if workflowStatus?.artifacts?.liveUrl}
                                      <a
                                        class="inline-flex font-semibold text-indigo-300 hover:text-indigo-200"
                                        href={workflowStatus.artifacts.liveUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        Open deployment URL
                                      </a>
                                    {/if}
                                    {#if workflowStatus?.artifacts?.previewUrl}
                                      <a
                                        class="inline-flex font-semibold text-emerald-300 hover:text-emerald-200"
                                        href={workflowStatus.artifacts.previewUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        Open Preview URL
                                      </a>
                                    {/if}
                                    {#if workflowStatus?.artifacts?.repoUrl}
                                      <a
                                        class="inline-flex font-semibold text-gray-300 hover:text-gray-200"
                                        href={workflowStatus.artifacts.repoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        View Source Code
                                      </a>
                                    {/if}
                                  </div>
                                {/if}

                                {#if workflowStatus?.logs?.length}
                                  <p class="mt-2 text-[10px] leading-5 text-white/55">
                                    {workflowStatus.logs[workflowStatus.logs.length - 1]}
                                  </p>
                                {/if}

                                <details class="mt-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[10px] text-white/60">
                                  <summary class="cursor-pointer select-none text-white/70">
                                    Technical Payload
                                  </summary>
                                  <pre class="mt-2 overflow-x-auto text-[10px]">{JSON.stringify(part.toolInvocation.result, null, 2)}</pre>
                                </details>
                              </div>
                            {/if}
                          {:else}
                            <span class="flex items-center gap-1"><Loader2 size={10} class="animate-spin" /> In progress...</span>
                          {/if}
                        </div>
                      </div>
                    {/if}
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
              <span class="text-xs text-white/50">در حال فکر کردن...</span>
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
        {#if composerError}
          <div class="mb-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
            {composerError}
          </div>
        {/if}
        <form onsubmit={handleSend} class="bg-white/5 border border-white/10 rounded-xl p-1.5 flex items-center gap-2">
          <input
            type="text"
            bind:value={messageInput}
            disabled={chat.status === 'streaming' || chat.status === 'submitted'}
            placeholder={selectedAgent
              ? `از ${selectedAgent.name} درباره workflowها، failureها یا runtime بپرس...`
              : "ابتدا یک draft agent را انتخاب کن..."}
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

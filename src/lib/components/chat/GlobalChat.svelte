<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  import { DefaultChatTransport } from 'ai';
  import { page } from '$app/stores';
  import { Bot, Loader2, Send, X, MessageSquare, Maximize2, Minimize2 } from 'lucide-svelte';

  let isOpen = $state(false);
  let isExpanded = $state(false);
  let chatContainer = $state<HTMLElement | null>(null);
  let messageInput = $state("");

  const chatApi = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:3001/api/chat';

  function getMessageText(message: { parts?: Array<{ type: string; text?: string }> }) {
    return (message.parts ?? [])
      .filter((part) => part.type === 'text')
      .map((part) => part.text ?? '')
      .join('');
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
          <div class="flex gap-3 {message.role === 'user' ? 'justify-end' : ''}">
            {#if message.role !== 'user'}
              <div class="w-8 h-8 rounded-full bg-indigo-500 shrink-0 flex items-center justify-center text-white mt-1">
                <Bot size={14} />
              </div>
            {/if}

            <div class="space-y-1 max-w-[80%] {message.role === 'user' ? 'items-end flex flex-col' : ''}">
              <div class="p-3 text-sm rounded-2xl {message.role === 'user' ? 'bg-nexus-accent text-black rounded-tr-none font-medium' : 'bg-nexus-card border border-white/10 rounded-tl-none text-white/90'}">
                {getMessageText(message)}
              </div>
              
              <!-- Tool Invocations -->
              {#if message.parts}
                {#each message.parts as part}
                  {#if part.type === 'tool-invocation'}
                    <div class="mt-2 p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
                      <div class="flex items-center gap-2 text-indigo-400 mb-1">
                        <Bot size={12} />
                        <span>Executing: {part.toolInvocation.toolName}</span>
                      </div>
                      <div class="text-white/50 pl-5">
                        {#if part.toolInvocation.state === 'result'}
                          <span class="text-green-400">✓ Success</span>
                          <pre class="mt-1 overflow-x-auto text-[10px]">{JSON.stringify(part.toolInvocation.result, null, 2)}</pre>
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

        {#if (chat.status === 'streaming' || chat.status === 'submitted') && chat.messages[chat.messages.length - 1]?.role === 'user'}
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

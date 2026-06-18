<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chat } from '@ai-sdk/svelte';
  import { Bot, User, Loader2, CheckCircle2, Globe, ArrowRight } from "lucide-svelte";
  
  let rooms = [
    { id: '1', name: 'General', lastMsg: 'Hello world!', time: '12:00' },
    { id: '2', name: 'VoltAgent', lastMsg: 'Deployment Specialist', time: 'Now' },
    { id: '3', name: 'Development', lastMsg: 'Bug fix deployed', time: 'Yesterday' }
  ];
  
  let selectedRoomId = '2'; // Default to VoltAgent room
  let chatContainer: HTMLElement;

  // --- Vercel AI SDK Integration ---
  const chat = new Chat({
    api: 'http://localhost:3000/api/chat', // اتصال به سرور BFF
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: 'Hello! I am your Nexus Agent. I can help you deploy websites. Try saying "Generate a personal portfolio".',
      },
    ],
  });

  let input = "";

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (!input.trim() || chat.status === 'streaming' || chat.status === 'submitted') return;
    chat.sendMessage({ text: input });
    input = "";
  }

  // اسکرول خودکار به پایین هنگام دریافت پیام جدید
  $: if (chat.messages && chatContainer) {
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 50);
  }
</script>

<div class="flex flex-1 h-full overflow-hidden">
  <!-- Room List -->
  <aside class="w-80 border-r border-white/10 bg-black/20 flex flex-col">
    <div class="p-6 border-b border-white/10 flex items-center justify-between">
      <h2 class="font-bold">Messaging</h2>
      <button class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">+</button>
    </div>
    
    <div class="flex-1 overflow-y-auto">
      {#each rooms as room}
        <button 
          on:click={() => selectedRoomId = room.id}
          class="w-full p-4 flex gap-4 hover:bg-white/5 transition-colors border-l-2 {selectedRoomId === room.id ? 'border-nexus-accent bg-white/5' : 'border-transparent'}"
        >
          <div class="w-12 h-12 rounded-xl bg-nexus-card border border-white/10 flex items-center justify-center text-xl">
            {room.name[0]}
          </div>
          <div class="flex-1 text-left min-w-0">
            <div class="flex justify-between items-baseline">
              <span class="font-medium truncate">{room.name}</span>
              <span class="text-[10px] text-white/30">{room.time}</span>
            </div>
            <p class="text-sm text-white/50 truncate">{room.lastMsg}</p>
          </div>
        </button>
      {/each}
    </div>
  </aside>

  <!-- Message View -->
  <div class="flex-1 flex flex-col min-w-0 bg-nexus-bg">
    {#if selectedRoomId}
      <header class="p-6 border-b border-white/10 flex items-center justify-between">
        <h2 class="font-bold text-lg">{rooms.find(r => r.id === selectedRoomId)?.name}</h2>
        <div class="flex items-center gap-4">
          <button class="text-white/50 hover:text-white">📞</button>
          <button class="text-white/50 hover:text-white">ℹ️</button>
        </div>
      </header>

      <div class="flex-1 p-6 overflow-y-auto space-y-6" bind:this={chatContainer}>
        {#each chat.messages as message}
          <div class="flex gap-4 {message.role === 'user' ? 'justify-end' : ''}">
            {#if message.role === 'assistant'}
              <div class="w-10 h-10 rounded-full bg-indigo-500 shrink-0 flex items-center justify-center text-white">
                <Bot size={20} />
              </div>
            {/if}
            
            <div class="space-y-1 {message.role === 'user' ? 'items-end flex flex-col' : ''}">
              <div class="flex items-baseline gap-2">
                {#if message.role === 'user'}
                  <span class="text-[10px] text-white/30">Now</span>
                  <span class="font-bold text-sm">You</span>
                {:else}
                  <span class="font-bold text-sm">Nexus Agent</span>
                  <span class="text-[10px] text-white/30">Now</span>
                {/if}
              </div>
              
              <div class="p-4 rounded-2xl max-w-lg {message.role === 'user' ? 'bg-nexus-accent text-black rounded-tr-none font-medium' : 'bg-nexus-card border border-white/10 rounded-tl-none'}">
                {message.content}
                
                <!-- نمایش وضعیت ابزارها (Tool Invocations) -->
                {#if message.toolInvocations}
                  <div class="mt-4 space-y-2">
                    {#each message.toolInvocations as tool}
                      <div class="bg-black/20 rounded-lg p-3 border border-white/5 text-sm">
                        <div class="flex items-center gap-2 text-white/70 mb-2">
                          {#if tool.state === 'result'}
                            <CheckCircle2 size={16} class="text-green-400" />
                          {:else}
                            <Loader2 size={16} class="animate-spin text-nexus-accent" />
                          {/if}
                          <span class="font-mono">{tool.toolName}</span>
                        </div>
                        
                        {#if tool.state === 'result'}
                          <div class="text-green-400/80 text-xs">
                            {tool.result.message || 'Completed successfully'}
                            {#if tool.result.url}
                              <a href={tool.result.url} target="_blank" class="block mt-1 text-blue-400 hover:underline">
                                {tool.result.url}
                              </a>
                            {/if}
                          </div>
                        {:else}
                          <div class="text-white/50 text-xs">Processing request...</div>
                        {/if}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>

            {#if message.role === 'user'}
              <div class="w-10 h-10 rounded-full bg-nexus-accent shrink-0 flex items-center justify-center text-black">
                <User size={20} />
              </div>
            {/if}
          </div>
        {/each}
        
        {#if (chat.status === 'streaming' || chat.status === 'submitted') && chat.messages[chat.messages.length - 1]?.role === 'user'}
          <div class="flex gap-4">
            <div class="w-10 h-10 rounded-full bg-indigo-500 shrink-0 flex items-center justify-center text-white">
              <Bot size={20} />
            </div>
            <div class="bg-nexus-card border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={16} class="animate-spin text-white/50" />
              <span class="text-sm text-white/50">Thinking...</span>
            </div>
          </div>
        {/if}
      </div>

      <footer class="p-6">
        <form on:submit={handleSubmit} class="bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center gap-2">
          <button type="button" class="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-xl">📎</button>
          <input 
            type="text" 
            bind:value={input}
            disabled={chat.status === 'streaming' || chat.status === 'submitted'}
            placeholder="Type a message to deploy or ask a question..."
            class="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={(chat.status === 'streaming' || chat.status === 'submitted') || !input.trim()}
            class="px-5 py-2 rounded-xl bg-nexus-accent text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            Send
          </button>
        </form>
      </footer>
    {:else}
      <div class="flex-1 flex items-center justify-center text-white/30">
        Select a room to start chatting
      </div>
    {/if}
  </div>
</div>

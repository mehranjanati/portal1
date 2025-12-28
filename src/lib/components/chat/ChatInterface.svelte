<script lang="ts">
  import { onMount } from 'svelte';
  
  let rooms = [
    { id: '1', name: 'General', lastMsg: 'Hello world!', time: '12:00' },
    { id: '2', name: 'SuperNode Support', lastMsg: 'Need help with config', time: '11:45' },
    { id: '3', name: 'Development', lastMsg: 'Bug fix deployed', time: 'Yesterday' }
  ];
  
  let selectedRoomId = '1';
  let messageInput = '';

  function handleSend() {
    if (!messageInput.trim()) return;
    // Integration with matrix-js-sdk would go here
    messageInput = '';
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

      <div class="flex-1 p-6 overflow-y-auto space-y-6">
        <div class="flex gap-4">
          <div class="w-10 h-10 rounded-full bg-indigo-500 shrink-0"></div>
          <div class="space-y-1">
            <div class="flex items-baseline gap-2">
              <span class="font-bold text-sm">Alice</span>
              <span class="text-[10px] text-white/30">12:00 PM</span>
            </div>
            <div class="bg-nexus-card border border-white/10 p-4 rounded-2xl rounded-tl-none max-w-lg">
              Welcome to the Nexus Communication Hub! 🚀
            </div>
          </div>
        </div>

        <div class="flex gap-4 justify-end">
          <div class="space-y-1 items-end flex flex-col">
            <div class="flex items-baseline gap-2">
              <span class="text-[10px] text-white/30">12:05 PM</span>
              <span class="font-bold text-sm">You</span>
            </div>
            <div class="bg-nexus-accent text-black p-4 rounded-2xl rounded-tr-none max-w-lg font-medium">
              Thanks! The Matrix integration looks solid.
            </div>
          </div>
          <div class="w-10 h-10 rounded-full bg-nexus-accent shrink-0"></div>
        </div>
      </div>

      <footer class="p-6">
        <div class="bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center gap-2">
          <button class="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-xl">📎</button>
          <input 
            type="text" 
            bind:value={messageInput}
            placeholder="Type a message..."
            class="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2"
          />
          <button 
            on:click={handleSend}
            class="px-5 py-2 rounded-xl bg-nexus-accent text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Send
          </button>
        </div>
      </footer>
    {:else}
      <div class="flex-1 flex items-center justify-center text-white/30">
        Select a room to start chatting
      </div>
    {/if}
  </div>
</div>

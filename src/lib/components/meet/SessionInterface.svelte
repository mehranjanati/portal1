<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  let participants = [
    { id: '1', name: 'Operator (You)', active: true, video: true, audio: true },
    { id: '2', name: 'Node-042', active: false, video: true, audio: false },
    { id: '3', name: 'Agent-Smith', active: true, video: false, audio: true }
  ];

  let isCamOn = true;
  let isMicOn = true;
  let stream: MediaStream | null = null;
  let videoEl: HTMLVideoElement;

  onMount(async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoEl) videoEl.srcObject = stream;
    } catch (e) {
      console.error('Camera access denied', e);
    }
  });

  onDestroy(() => {
    stream?.getTracks().forEach(t => t.stop());
  });

  function toggleCam() { isCamOn = !isCamOn; stream?.getVideoTracks().forEach(t => t.enabled = isCamOn); }
  function toggleMic() { isMicOn = !isMicOn; stream?.getAudioTracks().forEach(t => t.enabled = isMicOn); }
</script>

<div class="flex-1 flex flex-col bg-[#050505]">
  <header class="p-6 border-b border-white/10 flex items-center justify-between">
    <div>
      <h2 class="font-bold text-lg">Main Briefing Room</h2>
      <p class="text-xs text-white/50">LiveKit Session • ID: 882-991-X</p>
    </div>
    <div class="flex items-center gap-3">
      <div class="px-3 py-1 bg-red-500/20 text-red-500 text-[10px] font-bold uppercase rounded border border-red-500/30">REC</div>
      <span class="text-xs text-white/50">00:12:45</span>
    </div>
  </header>

  <div class="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
    <!-- Video Grid -->
    <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Local Preview -->
      <div class="relative bg-nexus-card border border-white/10 rounded-3xl overflow-hidden group">
        <video 
          bind:this={videoEl} 
          autoplay 
          muted 
          class="w-full h-full object-cover transform scale-x-[-1] {isCamOn ? 'opacity-100' : 'opacity-0'}"
        ></video>
        {#if !isCamOn}
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-nexus-accent to-indigo-500 flex items-center justify-center text-3xl font-bold">Y</div>
          </div>
        {/if}
        <div class="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">
          <span class="text-xs font-medium">You (Operator)</span>
          {#if !isMicOn} <span class="text-xs">🔇</span> {/if}
        </div>
      </div>

      <!-- Remote Mock 1 -->
      <div class="relative bg-nexus-card border border-indigo-500/30 rounded-3xl overflow-hidden group">
        <div class="absolute inset-0 bg-indigo-900/10 backdrop-blur-sm flex items-center justify-center">
           <div class="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-col">
             <span class="text-3xl">🤖</span>
             <span class="text-[10px] text-white/30 mt-2">Connecting...</span>
           </div>
        </div>
        <div class="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">
          <span class="text-xs font-medium">Node-042</span>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-center gap-4 py-4">
      <button 
        on:click={toggleMic}
        class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all {isMicOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500'}"
      >
        {isMicOn ? '🎙️' : '🔇'}
      </button>
      <button 
        on:click={toggleCam}
        class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all {isCamOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500'}"
      >
        {isCamOn ? '📹' : '📵'}
      </button>
      <button class="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center">🖥️</button>
      <div class="w-px h-8 bg-white/10 mx-2"></div>
      <button class="px-8 h-14 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl flex items-center gap-3 transition-all">
        <span class="text-xl">📞</span> End Call
      </button>
    </div>
  </div>
</div>

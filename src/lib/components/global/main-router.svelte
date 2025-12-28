<script lang="ts">
  import { onMount } from "svelte";
  import Dashboard from "$lib/components/dashboard/Dashboard.svelte";
  import Chat from "$lib/components/chat/ChatInterface.svelte";
  import Meet from "$lib/components/meet/SessionInterface.svelte";
  import CMS from "$lib/components/global/cms-view.svelte";

  let currentHash = "#/";

  onMount(() => {
    const handleHashChange = () => {
      currentHash = window.location.hash || "#/";
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  });
</script>

{#if currentHash === "#/" || currentHash === ""}
  <Dashboard />
{:else if currentHash === "#/chat"}
  <Chat />
{:else if currentHash === "#/meet"}
  <Meet />
{:else if currentHash === "#/cms"}
  <CMS />
{:else}
  <div class="flex-1 flex items-center justify-center">
    <p class="text-white/50 italic">Page not found: {currentHash}</p>
  </div>
{/if}

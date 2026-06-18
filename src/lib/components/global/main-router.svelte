<script lang="ts">
  import { onMount } from "svelte";
  import Dashboard from "$lib/components/dashboard/Dashboard.svelte";
  import Chat from "$lib/components/chat/ChatInterface.svelte";
  import Meet from "$lib/components/meet/SessionInterface.svelte";
  import CMS from "$lib/components/global/cms-view.svelte";
  
  // Missing pages
  import Projects from "$lib/components/projects/Projects.svelte";
  import Marketplace from "$lib/components/marketplace/Marketplace.svelte";
  import Foundry from "$lib/components/foundry/Foundry.svelte";
  import Billing from "$lib/components/billing/Billing.svelte";
  import Streams from "$lib/components/streams/Streams.svelte";
  import Deployments from "$lib/components/deployments/Deployments.svelte";
  import Workflows from "$lib/components/workflows/Workflows.svelte";
  import Logs from "$lib/components/logs/Logs.svelte";
  import Handoff from "$lib/components/handoff/Handoff.svelte";
  import Settings from "$lib/components/settings/Settings.svelte";

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

{#if currentHash === "#/" || currentHash === "" || currentHash === "#/dashboard"}
  <Dashboard />
{:else if currentHash === "#/chat"}
  <Chat />
{:else if currentHash === "#/meet"}
  <Meet />
{:else if currentHash === "#/cms"}
  <CMS />
{:else if currentHash === "#/projects"}
  <Projects />
{:else if currentHash === "#/marketplace"}
  <Marketplace />
{:else if currentHash === "#/foundry"}
  <Foundry />
{:else if currentHash === "#/billing"}
  <Billing />
{:else if currentHash === "#/streams"}
  <Streams />
{:else if currentHash === "#/deployments"}
  <Deployments />
{:else if currentHash === "#/workflows"}
  <Workflows />
{:else if currentHash === "#/logs"}
  <Logs />
{:else if currentHash === "#/handoff"}
  <Handoff />
{:else if currentHash === "#/settings"}
  <Settings />
{:else}
  <div class="flex-1 flex items-center justify-center">
    <p class="text-white/50 italic">Page not found: {currentHash}</p>
  </div>
{/if}


<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import Dashboard from "$lib/components/dashboard/Dashboard.svelte";
  import Foundry from "$lib/components/foundry/Foundry.svelte";
  import Streams from "$lib/components/streams/Streams.svelte";
  import Deployments from "$lib/components/deployments/Deployments.svelte";
  import Workflows from "$lib/components/workflows/Workflows.svelte";
  import Logs from "$lib/components/logs/Logs.svelte";
  import Handoff from "$lib/components/handoff/Handoff.svelte";
  import Settings from "$lib/components/settings/Settings.svelte";
  import Projects from "$lib/components/projects/Projects.svelte";
  import Billing from "$lib/components/billing/Billing.svelte";
  import Marketplace from "$lib/components/marketplace/Marketplace.svelte";

  // Track current hash
  let currentHash = $state("");

  onMount(() => {
    const updateHash = () => {
      currentHash = window.location.hash || "#/dashboard";
      // Normalization: if hash is #/, redirect to #/dashboard
      if (currentHash === "#/") {
        window.location.hash = "#/dashboard";
      }
    };

    window.addEventListener("hashchange", updateHash);
    updateHash();

    return () => window.removeEventListener("hashchange", updateHash);
  });

  // Simple router mapping
  const routes = {
    "#/dashboard": Dashboard,
    "#/projects": Projects,
    "#/marketplace": Marketplace,
    "#/billing": Billing,
    "#/foundry": Foundry,
    "#/streams": Streams,
    "#/deployments": Deployments,
    "#/workflows": Workflows,
    "#/logs": Logs,
    "#/handoff": Handoff,
    "#/settings": Settings,
  };

  // Helper to match components (naive matching)
  const CurrentComponent = $derived(() => {
    // Find exact match or default to Dashboard
    for (const [route, component] of Object.entries(routes)) {
      if (currentHash.startsWith(route)) {
        return component;
      }
    }
    return Dashboard;
  });
</script>

<svelte:head>
  <title
    >Nexus Portal | {currentHash.replace("#/", "").toUpperCase() ||
      "DASHBOARD"}</title
  >
</svelte:head>

<div class="h-full">
  {#if CurrentComponent()}
    {@const Component = CurrentComponent()}
    <Component />
  {/if}
</div>

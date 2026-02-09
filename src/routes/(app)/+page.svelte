<script lang="ts">
  import MainRouter from "$lib/components/global/main-router.svelte";
</script>

<!-- Hidden h1 for accessibility and SEO -->
<h1 class="sr-only">Nexus Portal - Web3 Agentic Social Network</h1>

<MainRouter />

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>

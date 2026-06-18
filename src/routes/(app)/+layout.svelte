<script lang="ts">
    import "../../app.css";
    import AppShell from "$lib/components/layout/AppShell.svelte";

    let { children } = $props();

    // Agent state logic moved to specific pages or stores if needed globally
    // For now, layout handles the shell
</script>

<AppShell>
    {@render children()}
</AppShell>

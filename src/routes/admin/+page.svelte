<script lang="ts">
    import { onMount } from "svelte";

    onMount(() => {
        // Redirect to the static admin page if not served automatically
        window.location.href = "/admin/index.html";
    });
</script>

<div
    class="flex items-center justify-center h-screen bg-neutral-900 text-white"
>
    <p>Loading Sveltia CMS...</p>
</div>

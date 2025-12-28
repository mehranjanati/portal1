<script lang="ts">
    import "../../app.css";
    import { onMount } from "svelte";

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

<div
    class="flex h-screen w-screen overflow-hidden bg-nexus-bg text-white font-sans"
>
    <!-- Sidebar -->
    <aside class="w-64 bg-black/50 border-r border-white/10 flex flex-col">
        <div class="p-6 flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-nexus-accent animate-pulse"></div>
            <h1 class="text-xl font-bold tracking-tight">NEXUS PORTAL</h1>
        </div>

        <nav class="flex-1 px-4 space-y-1">
            <p
                class="px-4 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest"
            >
                Core
            </p>
            <a
                href="#/"
                class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {currentHash ===
                    '#/' || currentHash === ''
                    ? 'bg-white/5 text-nexus-accent'
                    : 'hover:bg-white/5 text-white/70'}"
            >
                <span class="text-lg">🏠</span> Dashboard
            </a>
            <a
                href="#/chat"
                class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {currentHash ===
                '#/chat'
                    ? 'bg-white/5 text-nexus-accent'
                    : 'hover:bg-white/5 text-white/70'}"
            >
                <span class="text-lg">💬</span> Communication
            </a>
            <a
                href="#/meet"
                class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {currentHash ===
                '#/meet'
                    ? 'bg-white/5 text-nexus-accent'
                    : 'hover:bg-white/5 text-white/70'}"
            >
                <span class="text-lg">🎥</span> Live Sessions
            </a>

            <p
                class="px-4 py-2 mt-4 text-[10px] font-bold text-white/30 uppercase tracking-widest"
            >
                Management
            </p>
            <a
                href="#/cms"
                class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {currentHash ===
                '#/cms'
                    ? 'bg-white/5 text-nexus-accent'
                    : 'hover:bg-white/5 text-white/70'}"
            >
                <span class="text-lg">🛠️</span> Node CMS
            </a>
        </nav>

        <div class="p-4 border-t border-white/10">
            <div class="flex items-center gap-3 p-3 rounded bg-white/5">
                <div
                    class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-nexus-accent"
                ></div>
                <div>
                    <p class="text-xs font-medium">Super Node</p>
                    <p class="text-[10px] text-white/50">v1.0.0-alpha</p>
                </div>
            </div>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <slot />
    </main>
</div>

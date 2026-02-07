<script lang="ts">
    import "../../app.css";
    import { page } from "$app/stores";
    import { base } from "$app/paths";

    let isMobileMenuOpen = $state(false);

    let agents = $state([
        {
            id: "1",
            name: "AlphaTrader_V2",
            status: "Active",
            roi: "+0.45%",
            logs: "Executed arbitrage strategy on ETH-USDC pair.",
        },
        {
            id: "2",
            name: "ContentGen_X",
            status: "Idle",
            roi: "0.00%",
            logs: "Drafting newsletter for 'Web3 Trends'. Waiting for final key...",
        },
    ]);

    function togglePause(agent: any) {
        if (agent.status === "Paused") {
            agent.status = "Active";
        } else {
            agent.status = "Paused";
        }
    }

    function closeMobileMenu() {
        isMobileMenuOpen = false;
    }

    let selectedAgent = $state(null);
    let showAgentModal = $state(false);

    function openAgentModal(agent: any) {
        selectedAgent = agent;
        showAgentModal = true;
    }
</script>

<div
    class="flex h-screen w-full bg-[#0a0a0a] text-white font-sans overflow-hidden"
>
    <!-- LEFT SIDEBAR: Navigation (Hidden on mobile, visible on md+) -->
    <aside
        data-testid="left-sidebar"
        class="hidden md:flex flex-col border-r border-[#1f1f1f] bg-[#0a0a0a]"
        style="width: var(--sidebar-width);"
    >
        <!-- App Header (Logo) -->
        <div class="h-[60px] flex items-center px-5 border-b border-[#1f1f1f]">
            <div class="w-6 h-6 rounded bg-blue-500 mr-3"></div>
            <h1 class="font-semibold text-sm tracking-wide">NEXUS</h1>
        </div>

        <!-- Navigation Links -->
        <nav
            data-testid="main-nav"
            class="flex-1 p-3 space-y-1"
            aria-label="Primary Navigation"
        >
            <a
                data-testid="nav-dashboard"
                href="#/"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[#1a1a1a] {$page
                    .url.hash === '#/' || $page.url.hash === ''
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-[#a1a1aa]'}"
            >
                <span class="opacity-70" aria-hidden="true">🏠</span> Home
            </a>
            <a
                href="#/network"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[#1a1a1a] {$page
                    .url.hash === '#/network'
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-[#a1a1aa]'}"
            >
                <span class="opacity-70" aria-hidden="true">🌍</span> Network
            </a>
            <a
                data-testid="nav-agents"
                href="#/agents"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[#1a1a1a] {$page
                    .url.hash === '#/agents'
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-[#a1a1aa]'}"
            >
                <span class="opacity-70" aria-hidden="true">🤖</span> My Agents
            </a>
            <a
                href="{base}/marketplace"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[#1a1a1a] {$page
                    .url.pathname ===
                base + '/marketplace'
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-[#a1a1aa]'}"
            >
                <span class="opacity-70" aria-hidden="true">🛍️</span> Marketplace
            </a>
            <a
                href="{base}/chat"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[#1a1a1a] {$page
                    .url.pathname ===
                base + '/chat'
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-[#a1a1aa]'}"
            >
                <span class="opacity-70" aria-hidden="true">💬</span> VoltAgent
            </a>
            <a
                href="{base}/deployments"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[#1a1a1a] {$page
                    .url.pathname ===
                base + '/deployments'
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-[#a1a1aa]'}"
            >
                <span class="opacity-70" aria-hidden="true">🚀</span> Deployments
            </a>
            <div class="pt-4 pb-2 px-3">
                <p
                    class="text-[10px] uppercase font-bold text-[#a1a1aa] tracking-wider"
                >
                    Workspace
                </p>
            </div>
            <a
                href="#/cms"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[#1a1a1a] text-[#a1a1aa]"
            >
                <span class="opacity-70" aria-hidden="true">⚡</span> Node CMS
            </a>
        </nav>

        <!-- User Profile (Bottom) -->
        <div
            data-testid="user-profile"
            class="p-4 border-t border-[#1f1f1f]"
            aria-label="User Profile"
        >
            <div class="flex items-center gap-3">
                <div
                    data-testid="user-avatar"
                    class="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600"
                    role="img"
                    aria-label="User Avatar"
                ></div>
                <div class="overflow-hidden">
                    <p
                        data-testid="username"
                        class="text-xs font-medium text-white truncate"
                    >
                        Alex D.
                    </p>
                    <p class="text-[10px] text-[#a1a1aa]">Pro Plan</p>
                </div>
            </div>
        </div>
    </aside>

    <!-- CENTER (Main Content / Stream) -->
    <main
        data-testid="center-feed"
        class="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]"
        aria-label="Main Feed"
    >
        <!-- Global Header (Search / Breadcrumbs) -->
        <header
            class="h-[60px] flex items-center justify-between px-4 md:px-6 border-b border-[#1f1f1f] shrink-0"
        >
            <div class="flex items-center gap-3">
                <button
                    data-testid="mobile-menu-button"
                    class="md:hidden p-2 text-[#a1a1aa] hover:text-white"
                    onclick={() => (isMobileMenuOpen = true)}
                    aria-label="Open Menu"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><line x1="3" x2="21" y1="6" y2="6" /><line
                            x1="3"
                            x2="21"
                            y1="12"
                            y2="12"
                        /><line x1="3" x2="21" y1="18" y2="18" /></svg
                    >
                </button>
                <div
                    class="flex items-center text-sm text-[#a1a1aa]"
                    aria-label="Breadcrumbs"
                >
                    >
                    <span>Workspace</span>
                    <span class="mx-2" aria-hidden="true">/</span>
                    <span class="text-white">Stream</span>
                </div>
                <div class="flex gap-4">
                    <!-- Actions -->
                    <div
                        data-testid="wallet-balance"
                        class="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1a1a1a] text-xs"
                        aria-label="Wallet Balance"
                    >
                        <span class="text-emerald-500" aria-hidden="true"
                            >$</span
                        >
                        <span class="text-white font-mono">24,500</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Scrollable Content Area -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden relative">
            <slot />
        </div>
    </main>

    <!-- RIGHT SIDEBAR: Context Panel (Hidden on mobile, visible on lg+) -->
    <aside
        data-testid="right-sidebar"
        class="hidden lg:flex flex-col border-l border-[#1f1f1f] bg-[#0a0a0a]"
        style="width: var(--context-width);"
        aria-label="Active Agents"
    >
        <div class="h-[60px] flex items-center px-5 border-b border-[#1f1f1f]">
            <h2 class="font-medium text-sm">Active Agents</h2>
        </div>

        <div class="flex-1 p-4 space-y-4 overflow-y-auto">
            {#each agents as agent}
                <div
                    data-testid="agent-card"
                    class="p-3 rounded-lg border border-[#1f1f1f] bg-[#111] hover:border-[#333] transition-colors cursor-pointer group"
                    role="article"
                    onclick={() => openAgentModal(agent)}
                >
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <div
                                class="w-2 h-2 rounded-full {agent.status ===
                                'Active'
                                    ? 'bg-emerald-500'
                                    : agent.status === 'Paused'
                                      ? 'bg-red-500'
                                      : 'bg-amber-500'}"
                                aria-hidden="true"
                            ></div>
                            <span class="text-xs font-medium text-white"
                                >{agent.name}</span
                            >
                        </div>
                        <div class="flex items-center gap-2">
                            <span
                                data-testid="agent-status"
                                class="text-[10px] uppercase font-bold {agent.status ===
                                'Active'
                                    ? 'text-emerald-500'
                                    : agent.status === 'Paused'
                                      ? 'text-red-500'
                                      : 'text-amber-500'}">{agent.status}</span
                            >
                            <button
                                data-testid="agent-pause"
                                class="p-1 hover:text-white text-[#a1a1aa]"
                                title={agent.status === "Paused"
                                    ? "Resume"
                                    : "Pause"}
                                onclick={(e) => {
                                    e.stopPropagation();
                                    togglePause(agent);
                                }}
                                aria-label="Toggle Pause {agent.name}"
                                >{agent.status === "Paused"
                                    ? "▶"
                                    : "⏸"}</button
                            >
                        </div>
                    </div>
                    <p class="text-[11px] text-[#a1a1aa] leading-relaxed">
                        {agent.logs}
                        <span
                            data-testid="agent-roi"
                            class="text-emerald-500 ml-1">{agent.roi}</span
                        >
                    </p>
                </div>
            {/each}

            <!-- Marketplace Teaser -->
            <div class="pt-6 border-t border-[#1f1f1f]">
                <h3
                    class="text-xs font-bold text-[#a1a1aa] uppercase mb-3 tracking-wider"
                >
                    Marketplace
                </h3>
                <div
                    class="flex items-center gap-3 p-2 rounded hover:bg-[#1a1a1a] cursor-pointer"
                    role="link"
                >
                    <div
                        class="w-8 h-8 rounded bg-indigo-900/30 text-indigo-400 flex items-center justify-center text-xs font-bold"
                        aria-hidden="true"
                    >
                        DA
                    </div>
                    <div>
                        <p class="text-xs text-white">DataAnalyzer</p>
                        <p class="text-[10px] text-[#a1a1aa]">$5/mo</p>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</div>

{#if isMobileMenuOpen}
    <div
        data-testid="mobile-menu"
        class="fixed inset-0 z-[200] bg-[#0a0a0a] flex flex-col"
    >
        <div
            class="h-[60px] flex items-center justify-between px-5 border-b border-[#1f1f1f]"
        >
            <div class="flex items-center">
                <div class="w-6 h-6 rounded bg-blue-500 mr-3"></div>
                <h1 class="font-semibold text-sm tracking-wide">NEXUS</h1>
            </div>
            <button
                onclick={closeMobileMenu}
                class="p-2 text-[#a1a1aa] hover:text-white"
                aria-label="Close Menu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><line x1="18" x2="6" y1="6" y2="18"></line><line
                        x1="6"
                        x2="18"
                        y1="6"
                        y2="18"
                    ></line></svg
                >
            </button>
        </div>
        <nav class="flex-1 p-6 space-y-4">
            <a
                href="#/"
                onclick={closeMobileMenu}
                class="block text-lg font-medium">Home</a
            >
            <a
                href="#/agents"
                onclick={closeMobileMenu}
                class="block text-lg font-medium">My Agents</a
            >
            <a
                href="{base}/marketplace"
                onclick={closeMobileMenu}
                class="block text-lg font-medium">Marketplace</a
            >
            <a
                href="{base}/chat"
                onclick={closeMobileMenu}
                class="block text-lg font-medium">VoltAgent</a
            >
            <a
                href="{base}/deployments"
                onclick={closeMobileMenu}
                class="block text-lg font-medium">Deployments</a
            >
        </nav>
        <div class="p-6 border-t border-[#1f1f1f]">
            <div class="flex items-center gap-3">
                <div
                    class="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600"
                ></div>
                <div>
                    <p class="font-medium">Alex D.</p>
                    <p class="text-xs text-[#a1a1aa]">Pro Plan</p>
                </div>
            </div>
        </div>
    </div>
{/if}

{#if showAgentModal && selectedAgent}
    <div
        data-testid="agent-detail-modal"
        class="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
        <div
            class="bg-[#111] border border-[#1f1f1f] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
        >
            <div class="p-8 space-y-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl"
                        >
                            🤖
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold">
                                {selectedAgent.name}
                            </h2>
                            <p class="text-[#a1a1aa] text-sm">
                                Agent ID: {selectedAgent.id}
                            </p>
                        </div>
                    </div>
                    <button
                        onclick={() => (showAgentModal = false)}
                        class="p-2 hover:bg-white/5 rounded-full transition-colors"
                        >✕</button
                    >
                </div>

                <div class="grid grid-cols-3 gap-4">
                    <div
                        class="p-4 rounded-2xl bg-[#0a0a0a] border border-[#1f1f1f]"
                    >
                        <p
                            class="text-[10px] uppercase font-bold text-[#a1a1aa] mb-1"
                        >
                            Status
                        </p>
                        <p
                            data-testid="agent-status"
                            class="text-emerald-500 font-bold"
                        >
                            {selectedAgent.status}
                        </p>
                    </div>
                    <div
                        class="p-4 rounded-2xl bg-[#0a0a0a] border border-[#1f1f1f]"
                    >
                        <p
                            class="text-[10px] uppercase font-bold text-[#a1a1aa] mb-1"
                        >
                            ROI (24h)
                        </p>
                        <p
                            data-testid="agent-roi"
                            class="text-white font-mono font-bold"
                        >
                            {selectedAgent.roi}
                        </p>
                    </div>
                    <div
                        class="p-4 rounded-2xl bg-[#0a0a0a] border border-[#1f1f1f]"
                    >
                        <p
                            class="text-[10px] uppercase font-bold text-[#a1a1aa] mb-1"
                        >
                            Latency
                        </p>
                        <p class="text-white font-mono font-bold">42ms</p>
                    </div>
                </div>

                <div class="space-y-3">
                    <h3
                        class="text-sm font-bold uppercase text-[#a1a1aa] tracking-widest"
                    >
                        Recent Activity
                    </h3>
                    <div
                        class="p-4 rounded-2xl bg-[#0a0a0a] border border-[#1f1f1f] font-mono text-xs text-gray-400"
                    >
                        {selectedAgent.logs}
                    </div>
                </div>

                <div class="flex justify-end gap-3 pt-4">
                    <button
                        onclick={() => {
                            togglePause(selectedAgent);
                            showAgentModal = false;
                        }}
                        class="px-6 py-2.5 rounded-xl border border-[#1f1f1f] hover:bg-[#1a1a1a] transition-all font-bold"
                    >
                        {selectedAgent.status === "Paused"
                            ? "Resume Agent"
                            : "Pause Agent"}
                    </button>
                    <button
                        onclick={() => (showAgentModal = false)}
                        class="px-8 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

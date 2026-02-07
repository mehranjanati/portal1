<script lang="ts">
    import "../../app.css";
    import { page } from "$app/stores";
    import { base } from "$app/paths";
</script>

<div
    class="flex h-screen w-full bg-[#0a0a0a] text-white font-sans overflow-hidden"
>
    <!-- LEFT SIDEBAR: Navigation -->
    <aside
        data-testid="left-sidebar"
        class="flex flex-col border-r border-[#1f1f1f] bg-[#0a0a0a]"
        style="width: var(--sidebar-width);"
    >
        <!-- App Header (Logo) -->
        <div class="h-[60px] flex items-center px-5 border-b border-[#1f1f1f]">
            <div class="w-6 h-6 rounded bg-blue-500 mr-3"></div>
            <h1 class="font-semibold text-sm tracking-wide">NEXUS</h1>
        </div>

        <!-- Navigation Links -->
        <nav data-testid="main-nav" class="flex-1 p-3 space-y-1">
            <a
                data-testid="nav-dashboard"
                href="#/"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[#1a1a1a] {$page
                    .url.hash === '#/' || $page.url.hash === ''
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-[#a1a1aa]'}"
            >
                <span class="opacity-70">🏠</span> Home
            </a>
            <a
                href="#/network"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[#1a1a1a] {$page
                    .url.hash === '#/network'
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-[#a1a1aa]'}"
            >
                <span class="opacity-70">🌍</span> Network
            </a>
            <a
                data-testid="nav-agents"
                href="#/agents"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[#1a1a1a] {$page
                    .url.hash === '#/agents'
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-[#a1a1aa]'}"
            >
                <span class="opacity-70">🤖</span> My Agents
            </a>
            <a
                href="{base}/marketplace"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[#1a1a1a] {$page
                    .url.pathname ===
                base + '/marketplace'
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-[#a1a1aa]'}"
            >
                <span class="opacity-70">🛍️</span> Marketplace
            </a>
            <a
                href="{base}/chat"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[#1a1a1a] {$page
                    .url.pathname ===
                base + '/chat'
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-[#a1a1aa]'}"
            >
                <span class="opacity-70">💬</span> VoltAgent
            </a>
            <a
                href="{base}/deployments"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[#1a1a1a] {$page
                    .url.pathname ===
                base + '/deployments'
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-[#a1a1aa]'}"
            >
                <span class="opacity-70">🚀</span> Deployments
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
                <span class="opacity-70">⚡</span> Node CMS
            </a>
        </nav>

        <!-- User Profile (Bottom) -->
        <div data-testid="user-profile" class="p-4 border-t border-[#1f1f1f]">
            <div class="flex items-center gap-3">
                <div
                    data-testid="user-avatar"
                    class="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600"
                ></div>
                <div class="overflow-hidden">
                    <p
                        data-testid="username"
                        class="text-xs font-medium text-white truncat"
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
    >
        <!-- Global Header (Search / Breadcrumbs) -->
        <header
            class="h-[60px] flex items-center justify-between px-6 border-b border-[#1f1f1f] shrink-0"
        >
            <div class="flex items-center text-sm text-[#a1a1aa]">
                <span>Workspace</span>
                <span class="mx-2">/</span>
                <span class="text-white">Stream</span>
            </div>
            <div class="flex gap-4">
                <!-- Actions -->
                <div
                    data-testid="wallet-balance"
                    class="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1a1a1a] text-xs"
                >
                    <span class="text-emerald-500">$</span>
                    <span class="text-white font-mono">24,500</span>
                </div>
            </div>
        </header>

        <!-- Scrollable Content Area -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden relative">
            <slot />
        </div>
    </main>

    <!-- RIGHT SIDEBAR: Context Panel (Agents / Meeting) -->
    <aside
        data-testid="right-sidebar"
        class="flex flex-col border-l border-[#1f1f1f] bg-[#0a0a0a]"
        style="width: var(--context-width);"
    >
        <div class="h-[60px] flex items-center px-5 border-b border-[#1f1f1f]">
            <span class="font-medium text-sm">Active Agents</span>
        </div>

        <div class="flex-1 p-4 space-y-4 overflow-y-auto">
            <!-- Mock Agent Card 1 -->
            <div
                data-testid="agent-card"
                class="p-3 rounded-lg border border-[#1f1f1f] bg-[#111] hover:border-[#333] transition-colors cursor-pointer group"
            >
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span class="text-xs font-medium text-white"
                            >AlphaTrader_V2</span
                        >
                    </div>
                    <div class="flex items-center gap-2">
                        <span
                            data-testid="agent-status"
                            class="text-[10px] text-emerald-500 uppercase font-bold"
                            >Active</span
                        >
                        <button
                            data-testid="agent-pause"
                            class="p-1 hover:text-white text-[#a1a1aa]"
                            title="Pause">⏸</button
                        >
                    </div>
                </div>
                <p class="text-[11px] text-[#a1a1aa] leading-relaxed">
                    Executed arbitrage strategy on ETH-USDC pair. Net profit: <span
                        data-testid="agent-roi">+0.45%</span
                    >
                </p>
            </div>

            <!-- Mock Agent Card 2 -->
            <div
                data-testid="agent-card"
                class="p-3 rounded-lg border border-[#1f1f1f] bg-[#111] hover:border-[#333] transition-colors cursor-pointer group"
            >
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span class="text-xs font-medium text-white"
                            >ContentGen_X</span
                        >
                    </div>
                    <div class="flex items-center gap-2">
                        <span
                            data-testid="agent-status"
                            class="text-[10px] text-amber-500 uppercase font-bold"
                            >Idle</span
                        >
                        <button
                            data-testid="agent-pause"
                            class="p-1 hover:text-white text-[#a1a1aa]"
                            title="Pause">⏸</button
                        >
                    </div>
                </div>
                <p class="text-[11px] text-[#a1a1aa] leading-relaxed">
                    Drafting newsletter for 'Web3 Trends'. Waiting for final
                    key...
                </p>
            </div>

            <!-- Marketplace Teaser -->
            <div class="pt-6 border-t border-[#1f1f1f]">
                <h4
                    class="text-xs font-bold text-[#a1a1aa] uppercase mb-3 tracking-wider"
                >
                    Marketplace
                </h4>
                <div
                    class="flex items-center gap-3 p-2 rounded hover:bg-[#1a1a1a] cursor-pointer"
                >
                    <div
                        class="w-8 h-8 rounded bg-indigo-900/30 text-indigo-400 flex items-center justify-center text-xs font-bold"
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

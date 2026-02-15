<script lang="ts">
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import { cn } from "$lib/utils";
    import {
        Search,
        Filter,
        Download,
        Star,
        ShieldCheck,
        Globe,
        Database,
        Cpu,
        ExternalLink,
    } from "lucide-svelte";

    let searchQuery = $state("");
    let selectedCategory = $state("all");

    const categories = [
        { id: "all", label: "All Items" },
        { id: "database", label: "Databases", icon: Database },
        { id: "mcp", label: "MCP Connectors", icon: Cpu },
        { id: "storage", label: "Storage", icon: Globe },
        { id: "api", label: "Social APIs", icon: ShieldCheck },
    ];

    const marketplaceItems = [
        {
            name: "TiDB Connector",
            category: "database",
            desc: "Native MySQL-compatible distributed SQL database connector.",
            author: "PingCAP",
            rating: 4.9,
            installs: "12k",
            featured: true,
        },
        {
            name: "IPFS Gateway",
            category: "storage",
            desc: "Decentralized storage layer for persistent Super Node data.",
            author: "Protocol Labs",
            rating: 4.7,
            installs: "8.5k",
            featured: false,
        },
        {
            name: "Twitter/X MCP",
            category: "mcp",
            desc: "Advanced social listening and automated posting workflows.",
            author: "Nexus Labs",
            rating: 5.0,
            installs: "2k",
            featured: true,
        },
        {
            name: "Redis Cache",
            category: "database",
            desc: "Low-latency key-value store for session management.",
            author: "Redis Inc",
            rating: 4.8,
            installs: "25k",
            featured: false,
        },
    ];

    let filteredItems = $derived(() => {
        return marketplaceItems.filter((item) => {
            const matchesSearch = item.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesCategory =
                selectedCategory === "all" ||
                item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    });
</script>

<div class="space-y-6">
    <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
        <div>
            <h1 class="text-2xl font-bold tracking-tight">Marketplace</h1>
            <p class="text-sm text-text-muted mt-1">
                Discover, install, and manage official and community
                integrations.
            </p>
        </div>
        <div class="flex items-center gap-3">
            <div class="relative w-full md:w-64">
                <Search
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                    size={16}
                />
                <Input
                    bind:value={searchQuery}
                    placeholder="Search integrations..."
                    class="pl-10 h-10 bg-bg-secondary border-white/5"
                />
            </div>
            <Button variant="outline" class="gap-2 border-white/5">
                <Filter size={16} />
            </Button>
        </div>
    </div>

    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {#each categories as cat}
            <button
                onclick={() => (selectedCategory = cat.id)}
                class={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border transition-all whitespace-nowrap",
                    selectedCategory === cat.id
                        ? "bg-accent-primary/10 border-accent-primary/30 text-accent-primary"
                        : "bg-white/5 border-white/5 text-text-muted hover:border-white/10",
                )}
            >
                {#if cat.icon}<cat.icon size={14} />{/if}
                {cat.label}
            </button>
        {/each}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredItems() as item}
            <Card
                class="p-6 flex flex-col bg-bg-secondary/30 hover:bg-bg-secondary/50 border-white/5 transition-all group active:scale-[0.98]"
            >
                <div class="flex items-start justify-between mb-4">
                    <div
                        class="p-3 bg-white/5 rounded-xl text-text-primary group-hover:text-accent-primary transition-colors"
                    >
                        {#if item.category === "database"}<Database size={24} />
                        {:else if item.category === "mcp"}<Cpu size={24} />
                        {:else if item.category === "storage"}<Globe
                                size={24}
                            />
                        {:else}<ShieldCheck size={24} />{/if}
                    </div>
                    {#if item.featured}
                        <span
                            class="text-[10px] font-bold uppercase tracking-widest text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded"
                            >Featured</span
                        >
                    {/if}
                </div>

                <h3 class="font-bold text-lg">{item.name}</h3>
                <p
                    class="text-[10px] text-text-muted mb-3 flex items-center gap-1"
                >
                    by <span class="text-text-primary/70">{item.author}</span>
                </p>
                <p
                    class="text-sm text-text-muted flex-1 line-clamp-2 leading-relaxed"
                >
                    {item.desc}
                </p>

                <div
                    class="mt-6 pt-4 border-t border-white/5 flex items-center justify-between"
                >
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-1">
                            <Star
                                size={12}
                                class="text-accent-primary fill-accent-primary"
                            />
                            <span class="text-xs font-bold">{item.rating}</span>
                        </div>
                        <div class="flex items-center gap-1 text-text-muted">
                            <Download size={12} />
                            <span class="text-xs">{item.installs}</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        class="h-8 gap-1.5 text-xs hover:text-accent-primary"
                    >
                        Details <ExternalLink size={12} />
                    </Button>
                </div>
            </Card>
        {/each}
    </div>
</div>

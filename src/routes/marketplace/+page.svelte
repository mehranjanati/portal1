<script lang="ts">
    import { mcpRegistry } from "$lib/data/mcp-registry";
    import mcpRegistryJson from "$lib/data/mcp-registry.json";
    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import { Input } from "$lib/components/ui/input";
    import { Separator } from "$lib/components/ui/separator";
    import {
        Search,
        Download,
        CheckCircle2,
        Globe,
        Terminal,
        Box,
        Play,
        Star,
        Clock,
        Tags,
    } from "lucide-svelte";

    // Fallback if ts import fails or data structure differs
    const registryItems = mcpRegistry || mcpRegistryJson || [];

    let searchQuery = "";
    let selectedCategory: string | null = null;

    const categories = [
        { id: "server", label: "MCP Servers", icon: Terminal },
        { id: "tool", label: "Tools", icon: Box },
        { id: "agent", label: "Agents", icon: Globe },
    ];

    $: filteredItems = registryItems.filter((item: any) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            (item.tags &&
                item.tags.some((tag: string) =>
                    tag.toLowerCase().includes(searchQuery.toLowerCase()),
                ));
        const matchesCategory = selectedCategory
            ? item.type === selectedCategory
            : true;
        return matchesSearch && matchesCategory;
    });
</script>

<div class="min-h-screen bg-nexus-bg text-white font-inter">
    <header
        class="sticky top-0 z-50 bg-nexus-bg/80 backdrop-blur-xl border-b border-white/10"
    >
        <div
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        >
            <div class="flex items-center gap-2">
                <Box class="text-nexus-accent" />
                <h1 class="text-xl font-bold tracking-tight">
                    MCP Marketplace
                </h1>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div
            class="flex flex-col md:flex-row gap-4 justify-between items-center"
        >
            <div class="relative w-full md:w-96">
                <Search
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"
                />
                <Input
                    type="search"
                    placeholder="Search for tools (e.g., 'Shadcn', 'Kafka')..."
                    class="pl-9"
                    bind:value={searchQuery}
                />
            </div>

            <div
                class="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0"
            >
                <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onclick={() => (selectedCategory = null)}
                    class="rounded-full"
                >
                    All
                </Button>
                {#each categories as cat}
                    <Button
                        variant={selectedCategory === cat.id
                            ? "default"
                            : "outline"}
                        size="sm"
                        onclick={() => (selectedCategory = cat.id)}
                        class="rounded-full"
                    >
                        {cat.label}
                    </Button>
                {/each}
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredItems as item}
                <Card
                    class="bg-nexus-card border-white/10 hover:border-nexus-accent/50 transition-all duration-300 group"
                >
                    <CardHeader>
                        <div class="flex justify-between items-start mb-2">
                            <div
                                class="p-2 rounded-lg bg-white/5 group-hover:bg-nexus-accent/10 transition-colors"
                            >
                                {#if item.type === "server"}
                                    <Terminal
                                        class="w-5 h-5 text-nexus-accent"
                                    />
                                {:else if item.type === "tool"}
                                    <Box class="w-5 h-5 text-purple-400" />
                                {:else}
                                    <Globe class="w-5 h-5 text-emerald-400" />
                                {/if}
                            </div>
                            <Badge
                                variant="outline"
                                class="uppercase text-[10px] tracking-wider"
                            >
                                {item.type}
                            </Badge>
                        </div>
                        <CardTitle class="text-lg">{item.name}</CardTitle>
                        <CardDescription class="line-clamp-2">
                            {item.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="flex flex-wrap gap-2 mb-4">
                            {#if item.tags}
                                {#each item.tags.slice(0, 3) as tag}
                                    <Badge
                                        variant="secondary"
                                        class="text-xs bg-white/5 hover:bg-white/10"
                                    >
                                        {tag}
                                    </Badge>
                                {/each}
                            {/if}
                        </div>
                        <div
                            class="flex items-center gap-4 text-xs text-white/40"
                        >
                            <div class="flex items-center gap-1">
                                <Star class="w-3 h-3" />
                                {item.downloads}
                            </div>
                            <div class="flex items-center gap-1">
                                <Clock class="w-3 h-3" /> v{item.version}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            class="w-full gap-2 group-hover:bg-nexus-accent group-hover:text-black transition-colors"
                        >
                            <Download class="w-4 h-4" /> Install
                        </Button>
                    </CardFooter>
                </Card>
            {/each}
        </div>
    </main>
</div>

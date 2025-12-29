<script lang="ts">
    import { mcpRegistry } from "$lib/data/mcp-registry";
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
        Database,
        Folder,
    } from "lucide-svelte";

    let searchQuery = "";
    let selectedCategory: string | null = null;

    // Dynamic filtering
    $: filteredServers = mcpRegistry.filter((server) => {
        const matchesSearch =
            server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            server.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory
            ? server.type === selectedCategory
            : true;
        return matchesSearch && matchesCategory;
    });

    const categories = [
        { id: "ui", label: "UI Design" },
        { id: "data", label: "Data & Streaming" },
        { id: "devops", label: "DevOps" },
        { id: "system", label: "System" },
    ];

    function getIcon(iconName: string) {
        // Simple mapping for icons based on registry data
        switch (iconName) {
            case "palette":
                return Globe; // using Globe as placeholder for design
            case "activity":
                return Terminal;
            case "database":
                return Database;
            case "folder":
                return Folder;
            case "github":
                return Globe;
            default:
                return Globe;
        }
    }
</script>

<div
    class="min-h-screen bg-background text-foreground p-8 space-y-8 animate-in fade-in duration-500"
>
    <!-- Header Section -->
    <div
        class="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center"
    >
        <div>
            <h1
                class="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent"
            >
                MCP Marketplace
            </h1>
            <p class="text-muted-foreground mt-2 text-lg">
                Supercharge your Agent with new capabilities and tools.
            </p>
        </div>
        <div class="flex items-center space-x-2">
            <Button variant="outline">Documentation</Button>
            <Button>Manage Keys</Button>
        </div>
    </div>

    <Separator />

    <!-- Search & Filter Bar -->
    <div
        class="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b"
    >
        <div class="relative w-full md:w-96">
            <Search
                class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            />
            <Input
                type="search"
                placeholder="Search for tools (e.g., 'Shadcn', 'Kafka')..."
                class="pl-9"
                bind:value={searchQuery}
            />
        </div>

        <div class="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                on:click={() => (selectedCategory = null)}
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
                    on:click={() => (selectedCategory = cat.id)}
                    class="rounded-full"
                >
                    {cat.label}
                </Button>
            {/each}
        </div>
    </div>

    <!-- Marketplace Grid -->
    <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
        {#each filteredServers as server}
            <Card
                class="group hover:shadow-lg transition-all duration-300 border-muted hover:border-primary/50 relative overflow-hidden"
            >
                <!-- Status Indicator -->
                {#if server.installed}
                    <div class="absolute top-0 right-0 p-2">
                        <Badge
                            variant="secondary"
                            class="bg-green-500/10 text-green-500 hover:bg-green-500/20 gap-1"
                        >
                            <CheckCircle2 class="w-3 h-3" /> Installed
                        </Badge>
                    </div>
                {/if}

                <CardHeader class="pb-3">
                    <div class="flex items-center gap-3">
                        <div
                            class="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                            <svelte:component
                                this={getIcon(server.icon)}
                                class="w-6 h-6"
                            />
                        </div>
                        <div class="space-y-1">
                            <CardTitle class="text-xl">{server.name}</CardTitle>
                            <Badge
                                variant="outline"
                                class="text-xs font-normal opacity-70"
                                >{server.version}</Badge
                            >
                        </div>
                    </div>
                </CardHeader>

                <CardContent class="h-32">
                    <p class="text-muted-foreground text-sm leading-relaxed">
                        {server.description}
                    </p>
                    <div class="flex flex-wrap gap-2 mt-4">
                        {#each server.tags.slice(0, 3) as tag}
                            <span
                                class="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                            >
                                #{tag}
                            </span>
                        {/each}
                    </div>
                </CardContent>

                <CardFooter class="pt-4 border-t bg-muted/20">
                    <Button
                        class="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
                        variant={server.installed ? "outline" : "default"}
                    >
                        {#if server.installed}
                            Configure
                        {:else}
                            <Download class="w-4 h-4" /> Install
                        {/if}
                    </Button>
                </CardFooter>
            </Card>
        {/each}
    </div>

    {#if filteredServers.length === 0}
        <div
            class="flex flex-col items-center justify-center py-20 text-center"
        >
            <div class="p-4 rounded-full bg-muted mb-4">
                <Search class="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 class="text-xl font-semibold">No servers found</h3>
            <p class="text-muted-foreground max-w-sm mt-2">
                We couldn't find any MCP servers matching "{searchQuery}". Try a
                different search term or category.
            </p>
            <Button variant="link" class="mt-4"
                >Request a new integration</Button
            >
        </div>
    {/if}
</div>

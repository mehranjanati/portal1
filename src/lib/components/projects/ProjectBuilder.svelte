<script lang="ts">
    import { cn } from "$lib/utils";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import Select from "$lib/components/ui/Select.svelte";
    import {
        Settings2,
        Blocks,
        FileJson,
        Rocket,
        Terminal,
        ArrowRight,
        ArrowLeft,
        ChevronRight,
        Info,
    } from "lucide-svelte";

    let activeTab = $state("setup");
    let { onComplete = () => {} } = $props();

    const tabs = [
        { id: "setup", label: "Project Setup", icon: Settings2 },
        { id: "integrations", label: "Integrations", icon: Blocks },
        { id: "prompt", label: "Prompt Builder", icon: FileJson },
        { id: "build", label: "Build & Deploy", icon: Rocket },
        { id: "logs", label: "Logs", icon: Terminal },
    ];

    const personas = [
        "Startup Founder",
        "Digital Marketer",
        "Dropshipper",
        "Product Manager",
        "Business Owner",
    ];

    const categories = [
        "E-commerce",
        "SaaS",
        "Fintech",
        "Web3/Crypto",
        "AI/Automation",
        "Marketplace",
    ];

    let formData = $state({
        projectName: "",
        persona: "",
        category: "",
        description: "",
        businessModel: "B2B",
        integrations: [] as string[],
        mcp: [] as string[],
    });

    const nextTab = () => {
        const index = tabs.findIndex((t) => t.id === activeTab);
        if (index < tabs.length - 1) activeTab = tabs[index + 1].id;
    };

    const prevTab = () => {
        const index = tabs.findIndex((t) => t.id === activeTab);
        if (index > 0) activeTab = tabs[index - 1].id;
    };
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold tracking-tight">Project Builder</h1>
            <p class="text-sm text-text-muted mt-1">
                Configure and deploy your Super Node application.
            </p>
        </div>
        <div
            class="flex items-center gap-2 text-xs font-mono text-text-muted bg-white/5 px-3 py-1.5 rounded-full"
        >
            <div
                class="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse"
            ></div>
            Drafting: {formData.projectName || "Untitled Project"}
        </div>
    </div>

    <!-- Stepper Navigation -->
    <div
        class="flex items-center gap-2 p-1 bg-bg-secondary rounded-xl border border-white/5 overflow-x-auto no-scrollbar"
    >
        {#each tabs as tab, i}
            {#if i > 0}
                <ChevronRight size={14} class="text-white/10 shrink-0" />
            {/if}
            <button
                onclick={() => (activeTab = tab.id)}
                class={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all shrink-0 whitespace-nowrap",
                    activeTab === tab.id
                        ? "bg-accent-primary/10 text-accent-primary shadow-[inset_0_0_12px_rgba(0,255,157,0.05)] border border-accent-primary/20"
                        : "text-text-muted hover:text-text-primary hover:bg-white/5 border border-transparent",
                )}
            >
                <tab.icon size={16} />
                {tab.label}
            </button>
        {/each}
    </div>

    <!-- Tab Content Area -->
    <div class="min-h-[500px]">
        {#if activeTab === "setup"}
            <div
                class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
                <div class="lg:col-span-2 space-y-8">
                    <Card
                        class="p-8 space-y-6 bg-bg-secondary/30 backdrop-blur-md border-white/5"
                    >
                        <div class="space-y-4">
                            <label class="block">
                                <span
                                    class="text-xs uppercase font-bold text-text-muted tracking-widest"
                                    >Project Name</span
                                >
                                <Input
                                    bind:value={formData.projectName}
                                    placeholder="e.g. Nexus Alpha"
                                    class="mt-2 h-12 bg-black/20 border-white/10 focus:border-accent-primary/50 text-lg transition-all"
                                />
                            </label>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label class="block">
                                    <span
                                        class="text-xs uppercase font-bold text-text-muted tracking-widest"
                                        >Target Persona</span
                                    >
                                    <div class="mt-2">
                                        <Select
                                            placeholder="Select Persona..."
                                            options={personas.map((p) => ({
                                                label: p,
                                                value: p,
                                            }))}
                                            onSelect={(v: string) =>
                                                (formData.persona = v)}
                                        />
                                    </div>
                                </label>
                                <label class="block">
                                    <span
                                        class="text-xs uppercase font-bold text-text-muted tracking-widest"
                                        >Business Category</span
                                    >
                                    <div class="mt-2">
                                        <Select
                                            placeholder="Select Category..."
                                            options={categories.map((c) => ({
                                                label: c,
                                                value: c,
                                            }))}
                                            onSelect={(v: string) =>
                                                (formData.category = v)}
                                        />
                                    </div>
                                </label>
                            </div>

                            <label class="block">
                                <span
                                    class="text-xs uppercase font-bold text-text-muted tracking-widest"
                                    >Project Description</span
                                >
                                <textarea
                                    value={formData.description}
                                    oninput={(e) =>
                                        (formData.description =
                                            e.currentTarget.value)}
                                    placeholder="Describe your project vision..."
                                    class="mt-2 w-full min-h-[120px] bg-black/20 border border-white/10 rounded-lg p-4 text-sm text-text-primary focus:outline-none focus:border-accent-primary/50 transition-all resize-none"
                                ></textarea>
                            </label>

                            <div class="pt-4 border-t border-white/5">
                                <span
                                    class="text-xs uppercase font-bold text-text-muted tracking-widest block mb-4"
                                    >Business Model</span
                                >
                                <div class="grid grid-cols-3 gap-3">
                                    {#each ["B2B", "B2C", "P2P"] as model}
                                        <button
                                            onclick={() =>
                                                (formData.businessModel =
                                                    model)}
                                            class={cn(
                                                "py-3 rounded-lg border text-sm font-medium transition-all text-center",
                                                formData.businessModel === model
                                                    ? "bg-accent-primary/10 border-accent-primary/30 text-accent-primary shadow-[0_0_15px_rgba(0,255,157,0.1)]"
                                                    : "bg-white/5 border-white/10 text-text-muted hover:border-white/20",
                                            )}
                                        >
                                            {model}
                                        </button>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div class="flex items-center justify-between pt-4">
                        <Button
                            variant="ghost"
                            class="text-text-muted hover:text-white"
                            disabled
                        >
                            <ArrowLeft size={16} class="mr-2" /> Back
                        </Button>
                        <Button
                            variant="primary"
                            onclick={nextTab}
                            class="px-8 gap-2 shadow-[0_0_20px_rgba(0,255,157,0.2)]"
                        >
                            Configure Integrations <ArrowRight size={16} />
                        </Button>
                    </div>
                </div>

                <!-- Guidance Sidebar -->
                <div class="space-y-6">
                    <Card
                        class="p-6 bg-accent-primary/5 border-accent-primary/20"
                    >
                        <div
                            class="flex items-center gap-2 text-accent-primary mb-3"
                        >
                            <Info size={18} />
                            <h3 class="font-bold text-sm tracking-tight">
                                Builder Strategy
                            </h3>
                        </div>
                        <p class="text-xs text-text-muted leading-relaxed">
                            Your selections here will influence the AI-generated
                            UI schema and suggested MCP connectors.
                        </p>
                        <div class="mt-4 space-y-2">
                            <div
                                class="flex items-center gap-2 text-[10px] text-accent-primary/80 uppercase font-bold"
                            >
                                <div
                                    class="w-1 h-1 rounded-full bg-accent-primary"
                                ></div>
                                Persona optimized UI
                            </div>
                            <div
                                class="flex items-center gap-2 text-[10px] text-accent-primary/80 uppercase font-bold"
                            >
                                <div
                                    class="w-1 h-1 rounded-full bg-accent-primary"
                                ></div>
                                Industry specific patterns
                            </div>
                        </div>
                    </Card>

                    <Card class="p-6 border-white/5 bg-bg-secondary/20">
                        <h3 class="font-bold text-sm mb-4">Output Preview</h3>
                        <div
                            class="space-y-3 opacity-50 blur-[2px] pointer-events-none"
                        >
                            <div class="h-2 w-full bg-white/10 rounded"></div>
                            <div class="h-2 w-3/4 bg-white/10 rounded"></div>
                            <div class="h-20 w-full bg-white/5 rounded"></div>
                        </div>
                        <p class="text-[10px] text-center text-text-muted mt-4">
                            Draft will auto-save
                        </p>
                    </Card>
                </div>
            </div>
        {:else if activeTab === "integrations"}
            <div
                class="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500"
            >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Data & Storage -->
                    <div class="space-y-4">
                        <h3
                            class="text-xs uppercase font-bold text-text-muted tracking-widest pl-1"
                        >
                            Data & Storage
                        </h3>
                        <div class="space-y-3">
                            {#each [{ id: "tidb", name: "TiDB", desc: "Transactional SQL" }, { id: "redis", name: "Redis", desc: "Caching & Queues" }, { id: "ipfs", name: "IPFS", desc: "Decentralized Ops" }] as item}
                                <Card
                                    class={cn(
                                        "p-4 cursor-pointer transition-all border-white/5",
                                        formData.integrations.includes(item.id)
                                            ? "border-accent-primary/30 bg-accent-primary/5"
                                            : "hover:bg-white/5",
                                    )}
                                    onclick={() => {
                                        if (
                                            formData.integrations.includes(
                                                item.id,
                                            )
                                        ) {
                                            formData.integrations =
                                                formData.integrations.filter(
                                                    (id) => id !== item.id,
                                                );
                                        } else {
                                            formData.integrations.push(item.id);
                                        }
                                    }}
                                >
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <div>
                                            <p class="font-bold text-sm">
                                                {item.name}
                                            </p>
                                            <p
                                                class="text-[10px] text-text-muted"
                                            >
                                                {item.desc}
                                            </p>
                                        </div>
                                        <div
                                            class={cn(
                                                "w-4 h-4 rounded border transition-colors flex items-center justify-center",
                                                formData.integrations.includes(
                                                    item.id,
                                                )
                                                    ? "bg-accent-primary border-accent-primary"
                                                    : "border-white/20",
                                            )}
                                        >
                                            {#if formData.integrations.includes(item.id)}
                                                <div
                                                    class="w-1.5 h-1.5 bg-black rounded-full"
                                                ></div>
                                            {/if}
                                        </div>
                                    </div>
                                </Card>
                            {/each}
                        </div>
                    </div>

                    <!-- MCP Connectors -->
                    <div class="space-y-4">
                        <h3
                            class="text-xs uppercase font-bold text-text-muted tracking-widest pl-1"
                        >
                            MCP Connectors
                        </h3>
                        <div class="space-y-3">
                            {#each [{ id: "ai-mcp", name: "AI MCP", desc: "UI Schema Drafting" }, { id: "crypto-mcp", name: "Crypto MCP", desc: "Market Workflows" }, { id: "monitor-mcp", name: "Monitoring MCP", desc: "Metrics Streams" }] as item}
                                <Card
                                    class={cn(
                                        "p-4 cursor-pointer transition-all border-white/5",
                                        formData.mcp.includes(item.id)
                                            ? "border-accent-secondary/30 bg-accent-secondary/5"
                                            : "hover:bg-white/5",
                                    )}
                                    onclick={() => {
                                        if (formData.mcp.includes(item.id)) {
                                            formData.mcp = formData.mcp.filter(
                                                (id) => id !== item.id,
                                            );
                                        } else {
                                            formData.mcp.push(item.id);
                                        }
                                    }}
                                >
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <div>
                                            <p class="font-bold text-sm">
                                                {item.name}
                                            </p>
                                            <p
                                                class="text-[10px] text-text-muted"
                                            >
                                                {item.desc}
                                            </p>
                                        </div>
                                        <div
                                            class={cn(
                                                "w-4 h-4 rounded-full border transition-colors flex items-center justify-center",
                                                formData.mcp.includes(item.id)
                                                    ? "bg-accent-secondary border-accent-secondary"
                                                    : "border-white/20",
                                            )}
                                        >
                                            {#if formData.mcp.includes(item.id)}
                                                <div
                                                    class="w-1.5 h-1.5 bg-black rounded-full"
                                                ></div>
                                            {/if}
                                        </div>
                                    </div>
                                </Card>
                            {/each}
                        </div>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between pt-8 border-t border-white/5"
                >
                    <Button
                        variant="ghost"
                        class="text-text-muted hover:text-white"
                        onclick={prevTab}
                    >
                        <ArrowLeft size={16} class="mr-2" /> Back to Setup
                    </Button>
                    <Button
                        variant="primary"
                        onclick={nextTab}
                        class="px-8 gap-2 shadow-[0_0_20px_rgba(32,166,255,0.2)]"
                    >
                        Generate UI Schema <ArrowRight size={16} />
                    </Button>
                </div>
            </div>
        {:else if activeTab === "prompt"}
            <div
                class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
            >
                <Card class="p-8 bg-bg-secondary/30 border-white/5 space-y-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-lg">
                                UI Schema & Prompt Generator
                            </h3>
                            <p class="text-sm text-text-muted">
                                Drafting technical specification for {formData.projectName ||
                                    "New Project"}
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                class="h-8 text-xs">Validate</Button
                            >
                            <Button
                                variant="ghost"
                                size="sm"
                                class="h-8 text-xs">Copy JSON</Button
                            >
                        </div>
                    </div>

                    <div
                        class="bg-black/40 rounded-xl p-6 font-mono text-xs text-accent-primary/80 leading-relaxed border border-white/5 min-h-[300px]"
                    >
                        <pre>{`{
  "project": "${formData.projectName}",
  "persona": "${formData.persona}",
  "template": "SvelteKit SPA",
  "integrations": ${JSON.stringify(formData.integrations)},
  "mcp_connectors": ${JSON.stringify(formData.mcp)},
  "ui_requirements": {
    "theme": "Dark Industrial",
    "layout": "Dashboard",
    "business_model": "${formData.businessModel}"
  }
}`}</pre>
                    </div>
                </Card>

                <div class="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        class="text-text-muted hover:text-white"
                        onclick={prevTab}
                    >
                        <ArrowLeft size={16} class="mr-2" /> Previous Step
                    </Button>
                    <Button
                        variant="primary"
                        onclick={nextTab}
                        class="px-8 gap-2"
                    >
                        Initialize Build <ArrowRight size={16} />
                    </Button>
                </div>
            </div>
        {:else if activeTab === "build"}
            <div
                class="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 animate-in zoom-in-95 duration-500"
            >
                <div class="relative">
                    <div
                        class="w-24 h-24 rounded-full border-2 border-accent-primary/20 flex items-center justify-center"
                    >
                        <Rocket size={40} class="text-accent-primary" />
                    </div>
                    <div
                        class="absolute inset-0 rounded-full border-2 border-accent-primary border-t-transparent animate-spin"
                    ></div>
                </div>
                <div>
                    <h3 class="text-xl font-bold">Ready for Orchestration</h3>
                    <p class="text-sm text-text-muted mt-2 max-w-sm mx-auto">
                        Your project configuration is complete. Trigger the
                        build to deploy to GitHub Pages (SPA) or Vercel (SSR).
                    </p>
                </div>
                <div class="flex flex-col gap-3 w-full max-w-xs">
                    <Button
                        variant="primary"
                        class="h-12 text-lg shadow-[0_10px_30px_rgba(0,255,157,0.15)]"
                        onclick={nextTab}
                    >
                        Trigger Build & Deploy
                    </Button>
                    <Button variant="ghost" class="text-text-muted"
                        >Save as Template</Button
                    >
                </div>
            </div>
        {:else if activeTab === "logs"}
            <div
                class="bg-black/60 rounded-xl border border-white/5 overflow-hidden animate-in fade-in duration-500"
            >
                <div
                    class="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between"
                >
                    <div class="flex items-center gap-2">
                        <Terminal size={14} class="text-text-muted" />
                        <span
                            class="text-xs font-mono text-text-muted tracking-tight"
                            >CI/CD Pipeline Logs</span
                        >
                    </div>
                    <span
                        class="text-[10px] text-status-success font-bold uppercase"
                        >Streaming...</span
                    >
                </div>
                <div
                    class="p-6 font-mono text-[11px] space-y-2 max-h-[400px] overflow-y-auto"
                >
                    <div class="text-text-muted">
                        [08:44:12] Initializing environment...
                    </div>
                    <div class="text-text-muted">
                        [08:44:15] Fetching dependencies...
                    </div>
                    <div class="text-accent-primary">
                        [08:44:20] Compiling WASM runtimes...
                    </div>
                    <div class="text-text-muted">
                        [08:44:25] Building SvelteKit (SPA mode)...
                    </div>
                    <div class="text-text-muted">
                        [08:44:30] Optimizing assets...
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-status-warning">!</span>
                        <span class="text-text-muted"
                            >PostCSS processing standard CSS...</span
                        >
                    </div>
                </div>
                <div
                    class="p-4 border-t border-white/5 bg-black/20 flex justify-end"
                >
                    <Button
                        variant="outline"
                        size="sm"
                        onclick={() => onComplete()}>Return to Projects</Button
                    >
                </div>
            </div>
        {/if}
    </div>
</div>

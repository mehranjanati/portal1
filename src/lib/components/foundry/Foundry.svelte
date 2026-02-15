<script lang="ts">
    import { cn } from "$lib/utils";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import Select from "$lib/components/ui/Select.svelte";
    import {
        Play,
        Save,
        Code,
        Terminal,
        Upload,
        FileText,
    } from "lucide-svelte";

    let activeTab = $state("files");

    const languages = [
        { label: "English (EN)", value: "en" },
        { label: "Persian (FA)", value: "fa" },
    ];

    const frameworks = [
        { label: "SvelteKit (SPA)", value: "svelte" },
        { label: "React (SPA)", value: "react" },
    ];

    const runtimes = [
        { label: "Go (TinyGo WASM)", value: "go" },
        { label: "Rust (WASM)", value: "rust" },
    ];
</script>

<div
    class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]"
>
    <!-- LEFT PANEL: Config -->
    <Card
        class="lg:col-span-3 flex flex-col h-full bg-bg-secondary/40 backdrop-blur-sm border-white/5"
    >
        <div
            class="p-4 border-b border-white/5 flex items-center justify-between"
        >
            <h2 class="font-semibold tracking-tight">Agent Config</h2>
            <Button variant="ghost" size="icon" class="h-8 w-8">
                <Save size={16} />
            </Button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-6">
            <!-- Section: Prompt -->
            <div class="space-y-4">
                <div class="space-y-2">
                    <label class="block">
                        <span
                            class="text-xs uppercase font-bold text-text-muted"
                            >Project Name</span
                        >
                        <Input placeholder="my-agent-portal" class="mt-2" />
                    </label>
                    <label class="block mt-4">
                        <span
                            class="text-xs uppercase font-bold text-text-muted"
                            >Use Case / Prompt</span
                        >
                        <textarea
                            class="flex w-full mt-2 rounded-button bg-bg-secondary border border-white/10 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent-primary/20 hover:border-white/20 min-h-[120px] resize-none"
                            placeholder="Describe the agent's purpose, behavior, and UI..."
                            aria-label="Agent Description"
                        ></textarea>
                    </label>
                </div>

                <div class="space-y-2">
                    <label class="block">
                        <span
                            class="text-xs uppercase font-bold text-text-muted"
                            >Target Audience</span
                        >
                        <Input placeholder="e.g., DeFi Traders" class="mt-2" />
                    </label>
                </div>

                <div class="space-y-2">
                    <label class="block">
                        <span
                            class="text-xs uppercase font-bold text-text-muted"
                            >Language</span
                        >
                        <div class="mt-2">
                            <Select options={languages} />
                        </div>
                    </label>
                </div>
            </div>

            <div class="h-px bg-white/5"></div>

            <!-- Section: Tech Stack -->
            <div class="space-y-4">
                <label class="block">
                    <span class="text-xs uppercase font-bold text-text-muted"
                        >Tech Stack</span
                    >
                    <div class="space-y-3 mt-2">
                        <Select
                            options={frameworks}
                            placeholder="Frontend Framework"
                        />
                        <Select options={runtimes} placeholder="WASM Runtime" />
                    </div>
                </label>
            </div>
        </div>

        <div class="p-4 border-t border-white/5 space-y-2 bg-bg-secondary/50">
            <Button variant="primary" class="w-full gap-2">
                <Code size={16} />
                Generate UI JSON
            </Button>
            <Button variant="ghost" class="w-full">Validate Schema</Button>
        </div>
    </Card>

    <!-- CENTER PANEL: Preview -->
    <Card
        class="lg:col-span-6 flex flex-col h-full bg-bg-primary/50 border-white/5 relative overflow-hidden group"
    >
        <div
            class="absolute inset-0 bg-grid-white/[0.02] bg-[length:16px_16px] pointer-events-none"
        ></div>

        <div
            class="p-2 border-b border-white/5 flex items-center justify-between bg-bg-secondary/40 backdrop-blur-sm z-10"
        >
            <div class="flex items-center gap-2">
                <div class="flex gap-1.5 px-2">
                    <div
                        class="w-2.5 h-2.5 rounded-full bg-status-danger/50"
                    ></div>
                    <div
                        class="w-2.5 h-2.5 rounded-full bg-status-warning/50"
                    ></div>
                    <div
                        class="w-2.5 h-2.5 rounded-full bg-status-success/50"
                    ></div>
                </div>
                <div
                    class="text-xs text-text-muted font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 min-w-[200px] text-center"
                >
                    localhost:3000/preview/agent-x
                </div>
            </div>
            <div class="flex gap-1">
                <Button variant="ghost" size="sm" class="h-7 text-xs"
                    >Desktop</Button
                >
                <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 text-xs text-text-muted">Mobile</Button
                >
            </div>
        </div>

        <!-- Preview Canvas -->
        <div class="flex-1 flex items-center justify-center p-8 z-0">
            <div class="text-center space-y-4">
                <div
                    class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto"
                >
                    <Play size={24} class="text-text-muted ml-1" />
                </div>
                <div>
                    <h3 class="text-lg font-medium text-text-primary">
                        Ready to Build
                    </h3>
                    <p class="text-sm text-text-muted mt-1 max-w-xs mx-auto">
                        Configure your agent on the left and click "Generate
                        Schema" to start the WASM build process.
                    </p>
                </div>
            </div>
        </div>

        <!-- Build Status Bar -->
        <div
            class="p-3 border-t border-white/5 bg-bg-secondary/80 backdrop-blur-md flex items-center gap-4 text-xs font-mono"
        >
            <div class="flex items-center gap-2 text-accent-primary">
                <div
                    class="w-2 h-2 rounded-full bg-accent-primary animate-pulse"
                ></div>
                Building...
            </div>
            <div class="h-4 w-px bg-white/10"></div>
            <div class="flex-1 text-text-muted truncate">
                Generate -> Build -> Deploy
            </div>
            <div class="text-text-muted">v0.1.0</div>
        </div>
    </Card>

    <!-- RIGHT PANEL: Artifacts -->
    <Card
        class="lg:col-span-3 flex flex-col h-full bg-bg-secondary/40 backdrop-blur-sm border-white/5"
    >
        <div class="flex items-center border-b border-white/5">
            <button
                class={cn(
                    "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === "files"
                        ? "border-accent-primary text-text-primary bg-white/5"
                        : "border-transparent text-text-muted hover:text-text-primary hover:bg-white/5",
                )}
                onclick={() => (activeTab = "files")}
            >
                Files
            </button>
            <button
                class={cn(
                    "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === "logs"
                        ? "border-accent-primary text-text-primary bg-white/5"
                        : "border-transparent text-text-muted hover:text-text-primary hover:bg-white/5",
                )}
                onclick={() => (activeTab = "logs")}
            >
                CI Logs
            </button>
            <button
                class={cn(
                    "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === "deploy"
                        ? "border-accent-primary text-text-primary bg-white/5"
                        : "border-transparent text-text-muted hover:text-text-primary hover:bg-white/5",
                )}
                onclick={() => (activeTab = "deploy")}
            >
                Deploy
            </button>
        </div>

        <div class="flex-1 overflow-hidden relative">
            {#if activeTab === "files"}
                <div class="p-4 space-y-2">
                    <div
                        class="flex items-center gap-2 text-sm text-text-primary p-2 rounded hover:bg-white/5 cursor-pointer"
                    >
                        <FileText size={16} class="text-accent-secondary" />
                        index.html
                    </div>
                    <div
                        class="flex items-center gap-2 text-sm text-text-primary p-2 rounded hover:bg-white/5 cursor-pointer"
                    >
                        <FileText size={16} class="text-orange-400" />
                        app.js
                    </div>
                    <div
                        class="flex items-center gap-2 text-sm text-text-primary p-2 rounded hover:bg-white/5 cursor-pointer"
                    >
                        <FileText size={16} class="text-blue-400" />
                        styles.css
                    </div>
                    <div
                        class="flex items-center gap-2 text-sm text-text-primary p-2 rounded hover:bg-white/5 cursor-pointer"
                    >
                        <FileText size={16} class="text-blue-400" />
                        config.json
                    </div>
                </div>
            {:else if activeTab === "logs"}
                <div
                    class="p-4 font-mono text-xs space-y-1 text-text-muted h-full overflow-y-auto"
                >
                    <div class="flex gap-2">
                        <span class="text-white/30">10:42:01</span>
                        <span>[CI] Running build script...</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-white/30">10:42:02</span>
                        <span class="text-accent-primary"
                            >[WASM] Optmizing binary</span
                        >
                    </div>
                </div>
            {:else if activeTab === "deploy"}
                <div class="p-6 space-y-4">
                    <div class="space-y-4">
                        <label class="block">
                            <span
                                class="text-xs uppercase font-bold text-text-muted"
                                >GitHub Repo</span
                            >
                            <Input
                                value="github.com/my-user/agent-app"
                                class="mt-2"
                            />
                        </label>
                        <label class="block">
                            <span
                                class="text-xs uppercase font-bold text-text-muted"
                                >Pages URL</span
                            >
                            <Input
                                readonly
                                value="https://my-user.github.io/agent-app"
                                class="mt-2 bg-white/5"
                            />
                        </label>
                        <label class="block">
                            <span
                                class="text-xs uppercase font-bold text-text-muted"
                                >Last Deploy</span
                            >
                            <span class="block text-sm text-text-primary mt-1"
                                >2026-02-14 14:02:11</span
                            >
                        </label>
                    </div>
                    <div class="pt-4 space-y-2">
                        <Button variant="primary" class="w-full">
                            Trigger Deploy
                        </Button>
                        <Button
                            variant="ghost"
                            class="w-full text-status-danger hover:bg-status-danger/10"
                            >Rollback</Button
                        >
                    </div>
                </div>
            {/if}
        </div>
    </Card>
</div>

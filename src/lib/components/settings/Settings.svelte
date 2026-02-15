<script lang="ts">
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import Select from "$lib/components/ui/Select.svelte";
    import {
        Settings,
        Github,
        Database,
        Shield,
        Globe,
        Bell,
        Key,
        Save,
        AlertCircle,
    } from "lucide-svelte";
    import { cn } from "$lib/utils";

    let activeTab = $state("general");
</script>

<div class="space-y-6 max-w-4xl">
    <div>
        <h1 class="text-2xl font-bold tracking-tight">Settings</h1>
        <p class="text-sm text-text-muted mt-1">
            Configure portal behavior and external integrations.
        </p>
    </div>

    <div class="flex gap-8">
        <!-- Sidebar Navigation -->
        <aside class="w-48 shrink-0 flex flex-col gap-1">
            <button
                onclick={() => (activeTab = "general")}
                class={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all",
                    activeTab === "general"
                        ? "bg-accent-primary/10 text-accent-primary"
                        : "text-text-muted hover:text-text-primary hover:bg-white/5",
                )}
            >
                <Globe size={16} /> General
            </button>
            <button
                onclick={() => (activeTab = "integrations")}
                class={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all",
                    activeTab === "integrations"
                        ? "bg-accent-primary/10 text-accent-primary"
                        : "text-text-muted hover:text-text-primary hover:bg-white/5",
                )}
            >
                <Database size={16} /> Integrations
            </button>
            <button
                onclick={() => (activeTab = "security")}
                class={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all",
                    activeTab === "security"
                        ? "bg-accent-primary/10 text-accent-primary"
                        : "text-text-muted hover:text-text-primary hover:bg-white/5",
                )}
            >
                <Shield size={16} /> Security
            </button>
            <button
                onclick={() => (activeTab = "notifications")}
                class={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all",
                    activeTab === "notifications"
                        ? "bg-accent-primary/10 text-accent-primary"
                        : "text-text-muted hover:text-text-primary hover:bg-white/5",
                )}
            >
                <Bell size={16} /> Notifications
            </button>
        </aside>

        <!-- Main Content -->
        <div class="flex-1">
            <Card class="p-6">
                {#if activeTab === "general"}
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 gap-4">
                            <label class="block">
                                <span
                                    class="text-xs uppercase font-bold text-text-muted"
                                    >Portal Name</span
                                >
                                <Input
                                    value="Nexus Super Node Portal"
                                    class="mt-2"
                                />
                            </label>
                            <label class="block">
                                <span
                                    class="text-xs uppercase font-bold text-text-muted"
                                    >Default Theme</span
                                >
                                <div class="mt-2">
                                    <Select
                                        options={[
                                            {
                                                label: "Dark Industrial",
                                                value: "dark",
                                            },
                                        ]}
                                    />
                                </div>
                            </label>
                            <label class="block">
                                <span
                                    class="text-xs uppercase font-bold text-text-muted"
                                    >Timezone</span
                                >
                                <div class="mt-2">
                                    <Select
                                        options={[
                                            {
                                                label: "UTC (Universal Coordinated Time)",
                                                value: "utc",
                                            },
                                        ]}
                                    />
                                </div>
                            </label>
                        </div>
                    </div>
                {:else if activeTab === "integrations"}
                    <div class="space-y-8">
                        <section class="space-y-4">
                            <div class="flex items-center gap-2">
                                <Github size={18} class="text-text-muted" />
                                <h3 class="text-sm font-semibold">
                                    GitHub Integration
                                </h3>
                            </div>
                            <div
                                class="p-4 bg-bg-primary/50 border border-white/5 rounded-lg space-y-4"
                            >
                                <label class="block">
                                    <span class="text-xs text-text-muted"
                                        >Personal Access Token</span
                                    >
                                    <Input
                                        type="password"
                                        value="••••••••••••••••"
                                        class="mt-1"
                                    />
                                </label>
                                <div
                                    class="flex items-center gap-2 text-[10px] text-status-success font-bold uppercase tracking-wider"
                                >
                                    <div
                                        class="w-1.5 h-1.5 rounded-full bg-status-success"
                                    ></div>
                                    Connected to GitHub Account
                                </div>
                            </div>
                        </section>

                        <section class="space-y-4">
                            <div class="flex items-center gap-2">
                                <Database size={18} class="text-text-muted" />
                                <h3 class="text-sm font-semibold">
                                    Infrastructure
                                </h3>
                            </div>
                            <div class="space-y-4">
                                <label class="block">
                                    <span class="text-xs text-text-muted"
                                        >Benthos Base URL</span
                                    >
                                    <Input
                                        value="http://cluster-01.internal:4195"
                                        class="mt-1"
                                    />
                                </label>
                                <label class="block">
                                    <span class="text-xs text-text-muted"
                                        >Temporal Host</span
                                    >
                                    <Input
                                        value="temporal.nexus-main:7233"
                                        class="mt-1"
                                    />
                                </label>
                            </div>
                        </section>

                        <div class="pt-4 flex gap-3">
                            <Button variant="primary" class="gap-2"
                                ><Save size={16} /> Save Changes</Button
                            >
                            <Button variant="ghost">Test Connections</Button>
                        </div>
                    </div>
                {:else if activeTab === "security"}
                    <div class="space-y-6">
                        <div
                            class="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                            <div>
                                <h4 class="text-sm font-semibold">
                                    Multifactor Authentication (MFA)
                                </h4>
                                <p class="text-xs text-text-muted mt-0.5">
                                    Protect your portal with extra security.
                                </p>
                            </div>
                            <div
                                class="w-10 h-6 bg-accent-primary rounded-full relative cursor-pointer"
                            >
                                <div
                                    class="absolute right-1 top-1 w-4 h-4 bg-black rounded-full"
                                ></div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <label class="block">
                                <span
                                    class="text-xs uppercase font-bold text-text-muted"
                                    >Session Timeout</span
                                >
                                <div class="mt-2">
                                    <Select
                                        options={[
                                            {
                                                label: "30 Minutes",
                                                value: "30m",
                                            },
                                            { label: "1 Hour", value: "1h" },
                                        ]}
                                    />
                                </div>
                            </label>
                        </div>

                        <div
                            class="p-4 bg-status-danger/5 border border-status-danger/20 rounded-lg flex gap-3"
                        >
                            <AlertCircle
                                size={20}
                                class="text-status-danger shrink-0"
                            />
                            <div>
                                <h4
                                    class="text-sm font-bold text-status-danger uppercase tracking-tighter"
                                >
                                    Danger Zone
                                </h4>
                                <p class="text-xs text-text-muted mt-1">
                                    Permanently reset all portal data. This
                                    cannot be undone.
                                </p>
                                <Button
                                    variant="outline"
                                    class="mt-3 text-status-danger border-status-danger/30 hover:bg-status-danger/10"
                                    >Reset Portal</Button
                                >
                            </div>
                        </div>
                    </div>
                {/if}
            </Card>
        </div>
    </div>
</div>

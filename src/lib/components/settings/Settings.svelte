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
        User,
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
        <aside class="w-48 shrink-0 flex flex-col gap-6">
            <div class="space-y-1">
                <h3
                    class="px-4 text-xs font-bold text-text-muted uppercase tracking-wider mb-2"
                >
                    Organization
                </h3>
                <button
                    onclick={() => (activeTab = "general")}
                    class={cn(
                        "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all",
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
                        "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all",
                        activeTab === "integrations"
                            ? "bg-accent-primary/10 text-accent-primary"
                            : "text-text-muted hover:text-text-primary hover:bg-white/5",
                    )}
                >
                    <Database size={16} /> Integrations
                </button>
                <button
                    onclick={() => (activeTab = "audit_logs")}
                    class={cn(
                        "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all",
                        activeTab === "audit_logs"
                            ? "bg-accent-primary/10 text-accent-primary"
                            : "text-text-muted hover:text-text-primary hover:bg-white/5",
                    )}
                >
                    <Settings size={16} /> Audit Logs
                </button>
            </div>

            <div class="space-y-1">
                <h3
                    class="px-4 text-xs font-bold text-text-muted uppercase tracking-wider mb-2"
                >
                    User
                </h3>
                <button
                    onclick={() => (activeTab = "profile")}
                    class={cn(
                        "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all",
                        activeTab === "profile"
                            ? "bg-accent-primary/10 text-accent-primary"
                            : "text-text-muted hover:text-text-primary hover:bg-white/5",
                    )}
                >
                    <User size={16} /> Profile
                </button>
                <button
                    onclick={() => (activeTab = "security")}
                    class={cn(
                        "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all",
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
                        "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all",
                        activeTab === "notifications"
                            ? "bg-accent-primary/10 text-accent-primary"
                            : "text-text-muted hover:text-text-primary hover:bg-white/5",
                    )}
                >
                    <Bell size={16} /> Notifications
                </button>
            </div>
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

                        <section class="space-y-6">
                            <div class="flex items-center gap-2">
                                <Database size={18} class="text-text-muted" />
                                <h3 class="text-sm font-semibold">
                                    Infrastructure & Databases
                                </h3>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- TiDB Card -->
                                <Card
                                    class="p-6 bg-white/5 border-white/5 space-y-4"
                                >
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="p-2 bg-accent-primary/10 text-accent-primary rounded-lg"
                                        >
                                            <Database size={20} />
                                        </div>
                                        <div>
                                            <h4 class="font-bold">
                                                TiDB Cloud
                                            </h4>
                                            <p
                                                class="text-[10px] text-text-muted uppercase tracking-widest font-black"
                                            >
                                                Transactional SQL
                                            </p>
                                        </div>
                                    </div>
                                    <div class="space-y-3">
                                        <Input
                                            placeholder="Cluster ID"
                                            class="h-9 text-xs"
                                        />
                                        <Input
                                            type="password"
                                            placeholder="CA Certificate (PEM)"
                                            class="h-9 text-xs"
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            class="w-full h-8 text-xs border-accent-primary/20 text-accent-primary hover:bg-accent-primary/5"
                                            >Verify TiDB Connection</Button
                                        >
                                    </div>
                                </Card>

                                <!-- Redis Card -->
                                <Card
                                    class="p-6 bg-white/5 border-white/5 space-y-4"
                                >
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="p-2 bg-red-500/10 text-red-500 rounded-lg"
                                        >
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h4 class="font-bold">
                                                Redis (Upstash)
                                            </h4>
                                            <p
                                                class="text-[10px] text-text-muted uppercase tracking-widest font-black"
                                            >
                                                Caching Layer
                                            </p>
                                        </div>
                                    </div>
                                    <div class="space-y-3">
                                        <Input
                                            placeholder="REST URL"
                                            class="h-9 text-xs"
                                        />
                                        <Input
                                            type="password"
                                            placeholder="REST Token"
                                            class="h-9 text-xs"
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            class="w-full h-8 text-xs border-red-500/20 text-red-500 hover:bg-red-500/5"
                                            >Test Global Latency</Button
                                        >
                                    </div>
                                </Card>

                                <!-- IPFS Card -->
                                <Card
                                    class="p-6 bg-white/5 border-white/5 space-y-4"
                                >
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="p-2 bg-accent-secondary/10 text-accent-secondary rounded-lg"
                                        >
                                            <Globe size={20} />
                                        </div>
                                        <div>
                                            <h4 class="font-bold">
                                                IPFS (Pinata)
                                            </h4>
                                            <p
                                                class="text-[10px] text-text-muted uppercase tracking-widest font-black"
                                            >
                                                Decentralized Storage
                                            </p>
                                        </div>
                                    </div>
                                    <div class="space-y-3">
                                        <Input
                                            placeholder="API Key"
                                            class="h-9 text-xs"
                                        />
                                        <Input
                                            type="password"
                                            placeholder="JWT Secret"
                                            class="h-9 text-xs"
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            class="w-full h-8 text-xs border-accent-secondary/20 text-accent-secondary hover:bg-accent-secondary/5"
                                            >Sync Gateway</Button
                                        >
                                    </div>
                                </Card>

                                <!-- Generic Infrastructure -->
                                <Card
                                    class="p-6 bg-white/5 border-white/5 flex flex-col justify-between"
                                >
                                    <div class="space-y-4">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="p-2 bg-white/5 text-text-muted rounded-lg"
                                            >
                                                <Key size={20} />
                                            </div>
                                            <div>
                                                <h4 class="font-bold">
                                                    Vector DB
                                                </h4>
                                                <p
                                                    class="text-[10px] text-text-muted"
                                                >
                                                    Coming Soon
                                                </p>
                                            </div>
                                        </div>
                                        <p class="text-xs text-text-muted">
                                            Direct integration for Pinecone and
                                            Milvus is in development.
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        class="w-full mt-4 text-[10px] uppercase font-bold tracking-widest"
                                        >View SDK Docs</Button
                                    >
                                </Card>
                            </div>
                        </section>

                        <div class="pt-4 flex gap-3">
                            <Button variant="primary" class="gap-2"
                                ><Save size={16} /> Save All Changes</Button
                            >
                            <Button variant="ghost">Revert to Defaults</Button>
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
                {:else if activeTab === "audit_logs"}
                    <div class="space-y-6">
                        <div class="flex items-center gap-2">
                            <Settings size={18} class="text-text-muted" />
                            <h3 class="text-sm font-semibold">Audit Logs</h3>
                        </div>
                        <div
                            class="overflow-hidden rounded-lg border border-white/5"
                        >
                            <table class="w-full text-left text-sm">
                                <thead
                                    class="bg-white/5 text-text-muted font-medium"
                                >
                                    <tr>
                                        <th class="px-4 py-3">Action</th>
                                        <th class="px-4 py-3">User</th>
                                        <th class="px-4 py-3">Date</th>
                                        <th class="px-4 py-3">IP Address</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-white/5">
                                    <tr
                                        class="hover:bg-white/5 transition-colors"
                                    >
                                        <td class="px-4 py-3"
                                            >Updated Billing Plan</td
                                        >
                                        <td class="px-4 py-3">Admin User</td>
                                        <td class="px-4 py-3 text-text-muted"
                                            >Just now</td
                                        >
                                        <td
                                            class="px-4 py-3 font-mono text-xs text-text-muted"
                                            >192.168.1.1</td
                                        >
                                    </tr>
                                    <tr
                                        class="hover:bg-white/5 transition-colors"
                                    >
                                        <td class="px-4 py-3"
                                            >Created Project 'Alpha'</td
                                        >
                                        <td class="px-4 py-3">Admin User</td>
                                        <td class="px-4 py-3 text-text-muted"
                                            >2 hours ago</td
                                        >
                                        <td
                                            class="px-4 py-3 font-mono text-xs text-text-muted"
                                            >192.168.1.1</td
                                        >
                                    </tr>
                                    <tr
                                        class="hover:bg-white/5 transition-colors"
                                    >
                                        <td class="px-4 py-3">Invited Member</td
                                        >
                                        <td class="px-4 py-3">Admin User</td>
                                        <td class="px-4 py-3 text-text-muted"
                                            >1 day ago</td
                                        >
                                        <td
                                            class="px-4 py-3 font-mono text-xs text-text-muted"
                                            >10.0.0.5</td
                                        >
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                {:else if activeTab === "profile"}
                    <div class="space-y-6">
                        <div class="space-y-4">
                            <div class="flex items-center gap-2">
                                <User size={18} class="text-text-muted" />
                                <h3 class="text-sm font-semibold">
                                    Profile Settings
                                </h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label class="block">
                                    <span class="text-xs text-text-muted"
                                        >Full Name</span
                                    >
                                    <Input value="Admin User" class="mt-1" />
                                </label>
                                <label class="block">
                                    <span class="text-xs text-text-muted"
                                        >Email Address</span
                                    >
                                    <Input
                                        value="admin@nexus.io"
                                        class="mt-1"
                                    />
                                </label>
                            </div>
                            <div class="pt-4">
                                <Button variant="primary">Update Profile</Button
                                >
                            </div>
                        </div>
                    </div>
                {:else if activeTab === "notifications"}
                    <div class="space-y-6">
                        <div class="flex items-center gap-2">
                            <Bell size={18} class="text-text-muted" />
                            <h3 class="text-sm font-semibold">
                                Notification Preferences
                            </h3>
                        </div>
                        <p class="text-sm text-text-muted">
                            Manage how you receive updates and alerts.
                        </p>
                        <div
                            class="space-y-4 p-4 bg-white/5 rounded-lg border border-white/5"
                        >
                            <div class="flex items-center justify-between">
                                <span class="text-sm">Email Alerts</span>
                                <div
                                    class="w-10 h-6 bg-accent-primary rounded-full relative cursor-pointer"
                                >
                                    <div
                                        class="absolute right-1 top-1 w-4 h-4 bg-black rounded-full"
                                    ></div>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm">Browser Push</span>
                                <div
                                    class="w-10 h-6 bg-white/10 rounded-full relative cursor-pointer"
                                >
                                    <div
                                        class="absolute left-1 top-1 w-4 h-4 bg-text-muted rounded-full"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            </Card>
        </div>
    </div>
</div>

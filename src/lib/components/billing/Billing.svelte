<script lang="ts">
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Select from "$lib/components/ui/Select.svelte";
    import { cn } from "$lib/utils";
    import {
        CreditCard,
        Activity,
        Zap,
        Wallet,
        ArrowUpRight,
        History,
        CheckCircle2,
        Clock,
    } from "lucide-svelte";
    import MetricCard from "../dashboard/MetricCard.svelte";
    import SparklineChart from "../dashboard/SparklineChart.svelte";

    let activeTab = $state("usage");

    const plans = [
        {
            name: "Developer",
            price: "Free",
            desc: "For hobbyists and testing",
            features: [
                "1 Super Node",
                "100k WASM credits",
                "LiveKit 500 mins",
                "Community Support",
            ],
            current: true,
        },
        {
            name: "Pro",
            price: "$49/mo",
            desc: "For growing applications",
            features: [
                "5 Super Nodes",
                "2M WASM credits",
                "LiveKit 10k mins",
                "Priority Support",
                "Custom Domains",
            ],
            current: false,
        },
        {
            name: "Enterprise",
            price: "Custom",
            desc: "Scale without limits",
            features: [
                "Unlimited Nodes",
                "Unlimited WASM",
                "Dedicated Instance",
                "24/7 SLA Support",
                "Audit Logs",
            ],
            current: false,
        },
    ];
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold tracking-tight">Billing & Finance</h1>
            <p class="text-sm text-text-muted mt-1">
                Manage your subscriptions, usage tokens, and wallet.
            </p>
        </div>
        <Button variant="outline" class="gap-2 border-white/10">
            <History size={16} /> Transaction History
        </Button>
    </div>

    <!-- Sub-navigation -->
    <div
        class="flex items-center gap-1 p-1 bg-bg-secondary w-fit rounded-lg border border-white/5"
    >
        {#each ["usage", "plans", "payments", "wallet"] as tab}
            <button
                onclick={() => (activeTab = tab)}
                class={cn(
                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize",
                    activeTab === tab
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-text-muted hover:text-text-primary",
                )}
            >
                {tab}
            </button>
        {/each}
    </div>

    {#if activeTab === "usage"}
        <div class="space-y-6 animate-in fade-in duration-500">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Current Spend"
                    value="$12.40"
                    trend="Forecast: $45"
                    icon={CreditCard}
                    color="accent-primary"
                />
                <MetricCard
                    title="WASM Credits"
                    value="84.2k"
                    trend="84% remaining"
                    icon={Zap}
                    color="status-warning"
                />
                <MetricCard
                    title="LiveKit Tokens"
                    value="1,240"
                    trend="+12% from last wk"
                    icon={Activity}
                    color="accent-secondary"
                />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card class="p-6 bg-bg-secondary/40 border-white/5">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-bold">Consumption History</h3>
                        <Select
                            placeholder="Last 30 Days"
                            options={[{ label: "Last 7 Days", value: "7d" }]}
                        />
                    </div>
                    <div class="h-64">
                        <SparklineChart title="Compute Usage" unit="tokens" />
                    </div>
                </Card>

                <Card class="p-6 bg-bg-secondary/40 border-white/5 space-y-4">
                    <h3 class="font-bold">Automated Top-up</h3>
                    <p class="text-sm text-text-muted">
                        Automatically purchase credits when balance falls below
                        threshold.
                    </p>
                    <div
                        class="p-4 bg-white/5 rounded-lg flex items-center justify-between"
                    >
                        <div class="flex items-center gap-3">
                            <div
                                class="w-2 h-2 rounded-full bg-status-success shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                            ></div>
                            <span class="text-sm font-medium"
                                >Smart Top-up Active</span
                            >
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                    </div>
                </Card>
            </div>
        </div>
    {:else if activeTab === "plans"}
        <div
            class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500"
        >
            {#each plans as plan}
                <Card
                    class={cn(
                        "p-8 flex flex-col transition-all duration-300",
                        plan.current
                            ? "border-accent-primary bg-accent-primary/5 ring-1 ring-accent-primary/20"
                            : "border-white/5 bg-bg-secondary/40 hover:border-white/20",
                    )}
                >
                    {#if plan.current}
                        <span
                            class="text-[10px] uppercase font-black text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded-full w-fit mb-4 tracking-widest"
                            >Current Plan</span
                        >
                    {/if}
                    <h3 class="text-xl font-bold">{plan.name}</h3>
                    <div class="flex items-baseline gap-1 mt-2">
                        <span class="text-3xl font-black">{plan.price}</span>
                        {#if plan.price !== "Custom"}
                            <span class="text-xs text-text-muted">/month</span>
                        {/if}
                    </div>
                    <p class="text-sm text-text-muted mt-2">{plan.desc}</p>

                    <div class="mt-8 space-y-4 flex-1">
                        {#each plan.features as feature}
                            <div class="flex items-start gap-3 text-sm">
                                <CheckCircle2
                                    size={16}
                                    class="text-accent-primary shrink-0 mt-0.5"
                                />
                                <span class="text-text-primary/80"
                                    >{feature}</span
                                >
                            </div>
                        {/each}
                    </div>

                    <Button
                        variant={plan.current ? "outline" : "primary"}
                        class="w-full mt-8"
                        disabled={plan.current}
                    >
                        {plan.current
                            ? "Current Plan"
                            : "Upgrade to " + plan.name}
                    </Button>
                </Card>
            {/each}
        </div>
    {:else if activeTab === "wallet"}
        <div
            class="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-500"
        >
            <Card
                class="p-8 text-center space-y-6 bg-gradient-to-br from-accent-primary/10 via-transparent to-transparent border-white/10"
            >
                <div
                    class="w-16 h-16 bg-accent-primary/20 rounded-2xl flex items-center justify-center mx-auto text-accent-primary mb-2"
                >
                    <Wallet size={32} />
                </div>
                <div>
                    <h2 class="text-2xl font-bold">Web3 Payments</h2>
                    <p class="text-text-muted mt-1">
                        Connect your wallet to pay for services using USDC or
                        NEON tokens.
                    </p>
                </div>
                <div class="flex justify-center gap-4">
                    <Button variant="primary" class="gap-2 px-8">
                        <Wallet size={18} /> Connect Wallet
                    </Button>
                </div>
            </Card>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                    class="p-4 bg-white/5 border-white/5 flex items-center gap-4"
                >
                    <div class="p-2 rounded bg-white/5">
                        <div class="w-6 h-6 rounded-full bg-blue-500"></div>
                    </div>
                    <div class="flex-1">
                        <p class="text-xs text-text-muted">
                            Supported Stablecoin
                        </p>
                        <p class="font-bold">USDC (Polygon/Solana)</p>
                    </div>
                </Card>
                <Card
                    class="p-4 bg-white/5 border-white/5 flex items-center gap-4"
                >
                    <div class="p-2 rounded bg-white/5">
                        <div
                            class="w-6 h-6 rounded-full bg-accent-primary"
                        ></div>
                    </div>
                    <div class="flex-1">
                        <p class="text-xs text-text-muted">Native Token</p>
                        <p class="font-bold">NEON (Super Node)</p>
                    </div>
                </Card>
            </div>
        </div>
    {:else}
        <Card
            class="p-12 text-center bg-bg-secondary/40 border-white/5 animate-in fade-in duration-500"
        >
            <div
                class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"
            >
                <Clock size={32} class="text-text-muted" />
            </div>
            <h3 class="text-lg font-bold">Section Coming Soon</h3>
            <p class="text-text-muted text-sm mt-2 max-w-xs mx-auto">
                We are finalizing the Stripe and Crypto gateway integrations for
                this feature.
            </p>
        </Card>
    {/if}
</div>

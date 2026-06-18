<script lang="ts">
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import {
        Phone,
        PhoneIncoming,
        PhoneOff,
        Mic,
        MicOff,
        Video,
        VideoOff,
        MoreHorizontal,
        User,
        UserPlus,
        ShieldAlert,
        Clock,
    } from "lucide-svelte";
    import { cn } from "$lib/utils";

    let callState = $state("idle"); // idle, ringing, in_call
    let selectedRequest = $state(null);

    const requests = [
        {
            id: "usr-1",
            name: "User_882",
            reason: "Order Failure",
            urgency: "High",
            wait: "2m 14s",
        },
        {
            id: "usr-2",
            name: "User_124",
            reason: "Agent Logic Clarification",
            urgency: "Medium",
            wait: "5m 20s",
        },
        {
            id: "usr-3",
            name: "User_905",
            reason: "Wallet Connect Issue",
            urgency: "Critical",
            wait: "12s",
        },
    ];
</script>

<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
    <!-- LEFT: Incoming Requests -->
    <div class="lg:col-span-4 flex flex-col gap-6">
        <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold flex items-center gap-2">
                <UserPlus size={20} class="text-accent-secondary" />
                Intervention Queue
            </h2>
            <span
                class="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-full text-text-muted uppercase font-bold tracking-widest"
                >3 active</span
            >
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto pr-2">
            {#each requests as req}
                <Card
                    class={cn(
                        "p-4 cursor-pointer hover:border-accent-secondary/40 transition-all space-y-4",
                        selectedRequest?.id === req.id
                            ? "border-accent-secondary bg-accent-secondary/5"
                            : "",
                    )}
                    onclick={() => (selectedRequest = req)}
                >
                    <div class="flex items-start justify-between">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-muted"
                            >
                                <User size={20} />
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold">
                                    {req.name}
                                </h3>
                                <p
                                    class="text-[10px] text-text-muted uppercase font-bold tracking-tighter"
                                >
                                    {req.reason}
                                </p>
                            </div>
                        </div>
                        <span
                            class={cn(
                                "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                                req.urgency === "Critical"
                                    ? "bg-status-danger/10 text-status-danger"
                                    : req.urgency === "High"
                                      ? "bg-status-warning/10 text-status-warning"
                                      : "bg-white/5 text-text-muted",
                            )}>{req.urgency}</span
                        >
                    </div>

                    <div
                        class="flex items-center justify-between pt-2 border-t border-white/5"
                    >
                        <div
                            class="flex items-center gap-2 text-text-muted text-xs"
                        >
                            <Clock size={12} />
                            Waiting: {req.wait}
                        </div>
                        <div class="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                class="text-status-danger h-7 px-2"
                                >Reject</Button
                            >
                            <Button
                                variant="primary"
                                size="sm"
                                class="h-7 px-2"
                                onclick={() => {
                                    selectedRequest = req;
                                    callState = "ringing";
                                }}>Accept</Button
                            >
                        </div>
                    </div>
                </Card>
            {/each}
        </div>
    </div>

    <!-- RIGHT: Call Panel -->
    <Card
        class="lg:col-span-8 flex flex-col bg-bg-secondary/40 backdrop-blur-md relative overflow-hidden"
    >
        <div
            class="absolute inset-0 bg-grid-white/[0.01] pointer-events-none"
        ></div>

        <div
            class="p-6 border-b border-white/5 flex items-center justify-between relative z-10"
        >
            <h2 class="font-semibold flex items-center gap-2">
                <Phone size={18} class="text-accent-primary" />
                Handoff Console
            </h2>
            <div class="flex gap-2">
                <Button variant="ghost" size="icon"
                    ><MoreHorizontal size={18} /></Button
                >
            </div>
        </div>

        <div
            class="flex-1 flex flex-col items-center justify-center relative z-10 space-y-8"
        >
            {#if callState === "idle"}
                <div class="text-center space-y-4 max-w-sm">
                    <div
                        class="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto text-text-muted opacity-20 border border-white/10"
                    >
                        <PhoneOff size={40} />
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-text-primary">
                            Ready to Interface
                        </h3>
                        <p class="text-sm text-text-muted mt-2 leading-relaxed">
                            Select a request from the left to start a direct
                            human-to-agent interface session.
                        </p>
                    </div>
                </div>
            {:else if callState === "ringing"}
                <div class="text-center space-y-6">
                    <div class="relative">
                        <div
                            class="w-32 h-32 rounded-full bg-accent-secondary/20 flex items-center justify-center mx-auto animate-pulse"
                        >
                            <div
                                class="w-24 h-24 rounded-full bg-accent-secondary/40 flex items-center justify-center"
                            >
                                <User size={48} class="text-white" />
                            </div>
                        </div>
                        <div
                            class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-bg-secondary border border-white/10 px-3 py-1 rounded-full flex items-center gap-2"
                        >
                            <div
                                class="w-2 h-2 rounded-full bg-accent-secondary animate-bounce"
                            ></div>
                            <span
                                class="text-xs font-bold font-mono tracking-widest uppercase"
                                >Connecting...</span
                            >
                        </div>
                    </div>
                    <div class="space-y-1">
                        <h3 class="text-xl font-bold">
                            {selectedRequest?.name}
                        </h3>
                        <p class="text-sm text-text-muted">
                            {selectedRequest?.reason}
                        </p>
                    </div>
                    <div class="flex gap-4">
                        <Button
                            variant="outline"
                            class="w-16 h-16 rounded-2xl text-status-danger border-status-danger/30 hover:bg-status-danger/10"
                            onclick={() => (callState = "idle")}
                        >
                            <PhoneOff size={24} />
                        </Button>
                        <Button
                            variant="primary"
                            class="w-16 h-16 rounded-2xl bg-status-success text-black hover:bg-status-success/80 shadow-[0_0_20px_rgba(0,255,157,0.4)]"
                            onclick={() => (callState = "in_call")}
                        >
                            <PhoneIncoming size={24} />
                        </Button>
                    </div>
                </div>
            {:else if callState === "in_call"}
                <div class="w-full h-full flex flex-col p-6">
                    <div
                        class="flex-1 rounded-2xl bg-bg-primary/80 border border-white/5 overflow-hidden flex items-center justify-center relative"
                    >
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                        ></div>
                        <div class="text-center space-y-2 z-10">
                            <User
                                size={64}
                                class="mx-auto text-white opacity-20"
                            />
                            <p
                                class="text-xs uppercase font-bold tracking-widest text-[#00ff9d] animate-pulse"
                            >
                                Active Session
                            </p>
                        </div>

                        <div
                            class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 p-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                class="h-12 w-12 rounded-xl hover:bg-white/10"
                                ><Mic size={20} /></Button
                            >
                            <Button
                                variant="ghost"
                                size="icon"
                                class="h-12 w-12 rounded-xl hover:bg-white/10"
                                ><Video size={20} /></Button
                            >
                            <Button
                                variant="primary"
                                class="h-12 px-6 rounded-xl bg-status-danger text-white hover:bg-status-danger/80"
                                onclick={() => (callState = "idle")}
                                >End Call</Button
                            >
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        {#if selectedRequest && callState !== "idle"}
            <div
                class="p-6 border-t border-white/5 bg-bg-secondary/40 relative z-10"
            >
                <div
                    class="flex items-center gap-4 text-xs font-mono text-text-muted"
                >
                    <span class="flex items-center gap-2"
                        ><ShieldAlert size={14} class="text-status-warning" /> Agent
                        Override Active</span
                    >
                    <span class="opacity-30">|</span>
                    <span>Session ID: f9-2ca-918</span>
                </div>
            </div>
        {/if}
    </Card>
</div>

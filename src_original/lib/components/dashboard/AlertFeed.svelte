<script lang="ts">
    import Card from "$lib/components/ui/Card.svelte";
    import { cn } from "$lib/utils";
    import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-svelte";

    let { title, alerts = [], class: className = "" } = $props();

    // Explicitly type the maps
    const iconMap: Record<string, typeof AlertCircle> = {
        warning: AlertCircle,
        success: CheckCircle,
        info: Info,
        error: XCircle,
    };

    const colorMap: Record<string, string> = {
        warning: "text-status-warning",
        success: "text-status-success",
        info: "text-accent-secondary",
        error: "text-status-danger",
    };

    // Helper to safely get icon
    function getIcon(type: string) {
        return iconMap[type] || Info;
    }
</script>

<Card
    class={cn(
        "flex flex-col h-full bg-bg-secondary/40 backdrop-blur-sm border-white/5",
        className,
    )}
>
    <div
        class="px-6 py-4 border-b border-white/5 flex items-center justify-between"
    >
        <h3 class="text-sm font-medium text-text-muted">{title}</h3>
        <span
            class="text-xs text-text-muted bg-white/5 px-2 py-0.5 rounded-full"
            >{alerts.length}</span
        >
    </div>

    <div class="flex-1 overflow-y-auto p-2 space-y-1">
        {#each alerts as alert}
            {@const type = alert.type || "info"}
            {@const Icon = getIcon(type)}
            <div
                class="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
            >
                <div
                    class={cn(
                        "mt-0.5 shrink-0",
                        colorMap[type] || colorMap.info,
                    )}
                >
                    <Icon size={16} />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm text-text-primary leading-snug">
                        {alert.message}
                    </p>
                    <p class="text-xs text-text-muted mt-1">{alert.time}</p>
                </div>
            </div>
        {/each}
    </div>
</Card>

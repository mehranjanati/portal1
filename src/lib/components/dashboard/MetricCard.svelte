<script lang="ts">
    import Card from "$lib/components/ui/Card.svelte";
    import { cn } from "$lib/utils";

    let {
        title,
        value,
        trend,
        trendDirection = "up", // 'up' | 'down' | 'neutral'
        icon: Icon,
        color = "accent-primary",
        class: className = "",
    } = $props();

    const trendColors: Record<string, string> = {
        up: "text-status-success",
        down: "text-status-danger",
        neutral: "text-text-muted",
    };
</script>

<Card
    class={cn(
        "p-6 flex flex-col justify-between h-full bg-bg-secondary/40 hover:bg-bg-secondary/60 backdrop-blur-sm border-white/5",
        className,
    )}
>
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-text-muted">{title}</h3>
        {#if Icon}
            <div class={cn("p-2 rounded-lg bg-white/5", `text-${color}`)}>
                <Icon size={18} />
            </div>
        {/if}
    </div>

    <div>
        <div class="text-2xl font-bold text-text-primary tracking-tight">
            {value}
        </div>
        {#if trend}
            <div
                class={cn(
                    "text-xs font-medium mt-1 flex items-center gap-1",
                    trendColors[trendDirection],
                )}
            >
                {trendDirection === "up"
                    ? "↑"
                    : trendDirection === "down"
                      ? "↓"
                      : "•"}
                {trend}
                <span class="text-text-muted font-normal ml-1"
                    >vs last period</span
                >
            </div>
        {/if}
    </div>
</Card>

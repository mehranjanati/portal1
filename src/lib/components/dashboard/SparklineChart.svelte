<script lang="ts">
    import Card from "$lib/components/ui/Card.svelte";
    import { cn } from "$lib/utils";

    let { title, unit = "", class: className = "" } = $props();

    // Mock data for sparkline
    const data = Array.from(
        { length: 24 },
        () => Math.floor(Math.random() * 80) + 20,
    );
    const max = Math.max(...data);
    const min = Math.min(...data);
    const height = 64;
    const width = 200;

    // Create path for SVG sparkline
    const points = data
        .map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((d - min) / (max - min)) * height;
            return `${x},${y}`;
        })
        .join(" ");
</script>

<Card
    class={cn(
        "p-6 flex flex-col justify-between h-full bg-bg-secondary/40 hover:bg-bg-secondary/60 backdrop-blur-sm border-white/5",
        className,
    )}
>
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-text-muted">{title}</h3>
        <span
            class="text-xs text-text-muted px-2 py-0.5 rounded-full bg-white/5"
            >24h</span
        >
    </div>

    <div class="flex items-end gap-2 mb-2">
        <span class="text-2xl font-bold text-text-primary tracking-tight"
            >{data[data.length - 1]}</span
        >
        <span class="text-sm text-text-muted mb-1">{unit}</span>
    </div>

    <div class="h-16 w-full relative overflow-hidden">
        <svg
            viewBox={`0 0 ${width} ${height}`}
            class="w-full h-full overflow-visible"
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#00ff9d" stop-opacity="0.2" />
                    <stop offset="100%" stop-color="#00ff9d" stop-opacity="0" />
                </linearGradient>
            </defs>

            <!-- Area fill -->
            <path
                d={`M0,${height} L${points} L${width},${height} Z`}
                fill="url(#gradient)"
            />

            <!-- Line -->
            <path
                d={`M${points}`}
                fill="none"
                stroke="#00ff9d"
                stroke-width="2"
                vector-effect="non-scaling-stroke"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    </div>
</Card>

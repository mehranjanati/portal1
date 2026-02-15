<script lang="ts">
    import { cn } from "$lib/utils";

    export let text: string;
    export let variant: "default" | "success" | "warning" | "danger" | "info" =
        "default";

    const variants = {
        default: "bg-bg-tertiary text-text-muted border border-white/10",
        success:
            "bg-status-success/10 text-status-success border border-status-success/20",
        warning:
            "bg-status-warning/10 text-status-warning border border-status-warning/20",
        danger: "bg-status-danger/10 text-status-danger border border-status-danger/20",
        info: "bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20",
    };
</script>

<span
    class={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide",
        variants[variant],
    )}
>
    {text}
</span>

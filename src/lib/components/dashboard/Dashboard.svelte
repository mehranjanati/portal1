<script lang="ts">
  import { cn } from "$lib/utils";
  import MetricCard from "$lib/components/dashboard/MetricCard.svelte";
  import SparklineChart from "$lib/components/dashboard/SparklineChart.svelte";
  import AlertFeed from "$lib/components/dashboard/AlertFeed.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import {
    Cpu,
    Activity,
    ShieldCheck,
    Zap,
    LayoutGrid,
    Settings2,
    Table as TableIcon,
    Waves,
    Gauge as GaugeIcon,
  } from "lucide-svelte";

  let activeTab = $state("overview");

  const alerts = [
    { type: "warning", message: "CI queue backlog detected", time: "2m ago" },
    {
      type: "info",
      message: "New agent 'DataAnalyzer' deployed",
      time: "10m ago",
    },
    { type: "success", message: "System backup completed", time: "1h ago" },
    { type: "error", message: "Node-4 connection timeout", time: "2h ago" },
  ];

  const nodes = [
    {
      id: "node-1",
      role: "Validator",
      status: "online",
      uptime: "14d 2h",
      load: "42%",
    },
    {
      id: "node-2",
      role: "Ingestor",
      status: "online",
      uptime: "5d 1h",
      load: "68%",
    },
    {
      id: "node-3",
      role: "Executor",
      status: "offline",
      uptime: "0s",
      load: "0%",
    },
    {
      id: "node-4",
      role: "Validator",
      status: "online",
      uptime: "125d",
      load: "12%",
    },
  ];
</script>

<div class="space-y-6">
  <!-- Header with Tabs -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-text-primary">
        Command Center
      </h1>
      <p class="text-sm text-text-muted mt-1">
        Real-time monitoring and node orchestration.
      </p>
    </div>

    <div
      class="flex items-center gap-2 p-1 bg-bg-secondary rounded-lg border border-white/5"
    >
      <button
        onclick={() => (activeTab = "overview")}
        class={cn(
          "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
          activeTab === "overview"
            ? "bg-bg-tertiary text-accent-primary shadow-sm"
            : "text-text-muted hover:text-text-primary",
        )}
      >
        Overview
      </button>
      <button
        onclick={() => (activeTab = "infra")}
        class={cn(
          "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
          activeTab === "infra"
            ? "bg-bg-tertiary text-accent-primary shadow-sm"
            : "text-text-muted hover:text-text-primary",
        )}
      >
        Infra
      </button>
    </div>
  </div>

  {#if activeTab === "overview"}
    <!-- Overview Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Active Agents"
        value="1,248"
        trend="+12%"
        icon={Cpu}
        color="accent-primary"
      />
      <MetricCard
        title="Streams Throughput"
        value="38,992 msg/s"
        trend="+3%"
        icon={Waves}
        color="accent-secondary"
      />
      <MetricCard
        title="WASM Runtime Health"
        value="99.9%"
        trend="stable"
        icon={ShieldCheck}
        color="status-success"
      />
      <MetricCard
        title="Avg Latency (p95)"
        value="42ms"
        trend="-5%"
        trendDirection="down"
        icon={Zap}
        color="status-warning"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[400px]">
      <Card class="lg:col-span-8 h-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-semibold flex items-center gap-2">
            <Activity size={18} class="text-accent-primary" />
            Performance Latency (p95)
          </h3>
          <span class="text-xs text-text-muted">Last 24h</span>
        </div>
        <SparklineChart class="h-[280px]" />
      </Card>

      <Card class="lg:col-span-4 h-full flex flex-col">
        <div class="p-6 border-b border-white/5">
          <h3 class="font-semibold flex items-center gap-2">
            <Zap size={18} class="text-status-warning" />
            System Alerts
          </h3>
        </div>
        <div class="flex-1 overflow-y-auto">
          <AlertFeed {alerts} hideTitle />
        </div>
      </Card>
    </div>
  {:else}
    <!-- Infra Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Gauge 1 -->
      <Card class="p-6 flex flex-col items-center text-center space-y-4">
        <div class="relative w-32 h-32 flex items-center justify-center">
          <svg class="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              stroke-width="8"
              fill="transparent"
              class="text-white/5"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              stroke-width="8"
              fill="transparent"
              stroke-dasharray="364.4"
              stroke-dashoffset={364.4 * (1 - 0.68)}
              class="text-accent-primary transition-all duration-1000"
            />
          </svg>
          <span class="absolute text-2xl font-bold">68%</span>
        </div>
        <div>
          <h3 class="font-semibold">CPU Load</h3>
          <p class="text-xs text-text-muted">Cluster Average</p>
        </div>
      </Card>

      <!-- Gauge 2 -->
      <Card class="p-6 flex flex-col items-center text-center space-y-4">
        <div class="relative w-32 h-32 flex items-center justify-center">
          <svg class="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              stroke-width="8"
              fill="transparent"
              class="text-white/5"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              stroke-width="8"
              fill="transparent"
              stroke-dasharray="364.4"
              stroke-dashoffset={364.4 * (1 - 0.74)}
              class="text-accent-secondary transition-all duration-1000"
            />
          </svg>
          <span class="absolute text-2xl font-bold">74%</span>
        </div>
        <div>
          <h3 class="font-semibold">Memory Usage</h3>
          <p class="text-xs text-text-muted">High Consumption</p>
        </div>
      </Card>

      <!-- Gauge 3 -->
      <Card class="p-6 flex flex-col items-center text-center space-y-4">
        <div class="relative w-32 h-32 flex items-center justify-center">
          <svg class="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              stroke-width="8"
              fill="transparent"
              class="text-white/5"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              stroke-width="8"
              fill="transparent"
              stroke-dasharray="364.4"
              stroke-dashoffset={364.4 * (1 - 0.41)}
              class="text-status-warning transition-all duration-1000"
            />
          </svg>
          <span class="absolute text-2xl font-bold">41%</span>
        </div>
        <div>
          <h3 class="font-semibold">Disk IO</h3>
          <p class="text-xs text-text-muted">Optimizing storage...</p>
        </div>
      </Card>
    </div>

    <Card class="overflow-hidden">
      <div
        class="p-6 border-b border-white/5 flex items-center justify-between"
      >
        <h3 class="font-semibold flex items-center gap-2">
          <TableIcon size={18} class="text-text-muted" />
          Active Nodes
        </h3>
        <button class="text-xs text-accent-primary hover:underline"
          >Rebalance Cluster</button
        >
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white/5 text-xs uppercase font-bold text-text-muted">
              <th class="px-6 py-3">Node ID</th>
              <th class="px-6 py-3">Role</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Uptime</th>
              <th class="px-6 py-3">Load</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            {#each nodes as node}
              <tr
                class="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <td class="px-6 py-4 font-mono text-accent-secondary"
                  >{node.id}</td
                >
                <td class="px-6 py-4 text-text-primary">{node.role}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div
                      class={cn(
                        "w-2 h-2 rounded-full",
                        node.status === "online"
                          ? "bg-status-success shadow-[0_0_8px_#00ff9d]"
                          : "bg-status-danger",
                      )}
                    ></div>
                    <span class="capitalize">{node.status}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-text-muted">{node.uptime}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden"
                    >
                      <div
                        class="h-full bg-accent-primary"
                        style="width: {node.load}"
                      ></div>
                    </div>
                    <span class="text-xs">{node.load}</span>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </Card>
  {/if}
</div>

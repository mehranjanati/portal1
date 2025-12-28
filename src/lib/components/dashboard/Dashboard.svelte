<script lang="ts">
  import BackendStatusIndicator from "$lib/components/common/BackendStatusIndicator.svelte";
  import dashboardConfig from "../../../data/dashboard.json";

  // Load announcements from CMS-generated JSON files
  const announcementModules = import.meta.glob(
    "../../../data/announcements/*.json",
    { eager: true },
  );
  const announcements = Object.values(announcementModules)
    .map((mod: any) => mod.default || mod)
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

  let matrixStatus: any = "connecting";
  let liveKitStatus: any = "connecting";

  // Simulate connection
  setTimeout(() => {
    matrixStatus = "connected";
  }, 2000);
  setTimeout(() => {
    liveKitStatus = "connected";
  }, 3500);

  function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return date.toLocaleDateString();
  }
</script>

<div class="p-8 space-y-8 flex-1 overflow-y-auto">
  <!-- Header -->
  <header class="flex items-center justify-between">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">System Dashboard</h2>
      <p class="text-white/50 mt-1">{dashboardConfig.welcome_message}</p>
    </div>
    <div class="flex gap-4">
      <BackendStatusIndicator name="Matrix" status={matrixStatus} />
      <BackendStatusIndicator name="LiveKit" status={liveKitStatus} />
    </div>
  </header>

  <!-- Widget Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Matrix Status Widget -->
    <div
      class="bg-nexus-card border border-white/10 p-6 rounded-2xl flex flex-col gap-4"
    >
      <div class="flex items-center justify-between">
        <span class="text-2xl">💬</span>
        <span class="text-xs font-mono text-white/30 uppercase"
          >Secure Chat</span
        >
      </div>
      <div>
        <h3 class="text-lg font-semibold">Communication Hub</h3>
        <p class="text-sm text-white/50 mt-1">
          Connected to Matrix Mesh. 12 active rooms.
        </p>
      </div>
      <a
        href="#/chat"
        class="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-nexus-accent text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Open Messages
      </a>
    </div>

    <!-- LiveKit Status Widget -->
    <div
      class="bg-nexus-card border border-white/10 p-6 rounded-2xl flex flex-col gap-4"
    >
      <div class="flex items-center justify-between">
        <span class="text-2xl">⚡</span>
        <span class="text-xs font-mono text-white/30 uppercase">Real-time</span>
      </div>
      <div>
        <h3 class="text-lg font-semibold">Session Manager</h3>
        <p class="text-sm text-white/50 mt-1">
          LiveKit instance ready. 0 active meetups.
        </p>
      </div>
      <a
        href="#/meet"
        class="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white text-black font-bold text-sm hover:bg-white/90 transition-all"
      >
        Start Session
      </a>
    </div>

    <!-- App Builder Launcher -->
    <div
      class="bg-gradient-to-br from-indigo-900/40 to-nexus-bg border border-indigo-500/30 p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group"
    >
      <div
        class="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"
      ></div>
      <div class="flex items-center justify-between">
        <span class="text-2xl">🛠️</span>
        <span class="text-xs font-mono text-indigo-400 uppercase font-bold"
          >WebContainers</span
        >
      </div>
      <div>
        <h3 class="text-lg font-semibold">App Builder</h3>
        <p class="text-sm text-white/50 mt-1">
          Build and deploy new node modules in isolation.
        </p>
      </div>
      <button
        class="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all"
      >
        Launch IDE
      </button>
    </div>
  </div>

  <!-- Recent Activity Section -->
  <section class="mt-12">
    <h3 class="text-xl font-bold mb-6">Recent Activity</h3>
    <div
      class="bg-nexus-card border border-white/10 rounded-2xl overflow-hidden"
    >
      <table class="w-full text-left">
        <thead class="bg-white/5 border-b border-white/10">
          <tr>
            <th
              class="px-6 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider"
              >Event</th
            >
            <th
              class="px-6 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider"
              >Type</th
            >
            <th
              class="px-6 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider"
              >Time</th
            >
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          {#each announcements as item}
            <tr class="hover:bg-white/5 transition-colors">
              <td class="px-6 py-4 text-sm font-medium">{item.title}</td>
              <td class="px-6 py-4 text-sm font-mono">
                <span
                  class:text-nexus-accent={item.type === "success"}
                  class:text-yellow-400={item.type === "warning"}
                  class:text-blue-400={item.type === "info"}
                >
                  {item.type}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-white/40"
                >{timeAgo(item.date)}</td
              >
            </tr>
          {/each}
          {#if announcements.length === 0}
            <tr>
              <td colspan="3" class="px-6 py-8 text-center text-white/30 italic"
                >No recent activity</td
              >
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </section>
</div>

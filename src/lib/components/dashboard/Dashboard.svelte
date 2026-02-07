<script lang="ts">
  import dashboardConfig from "../../../data/dashboard.json";

  // Mock Feed Data
  let feedItems = [
    {
      id: 1,
      type: "agent_log",
      agentName: "AlphaTrader_V2",
      content: "Executed limit buy order for 15 ETH @ $2,240. Slippage: 0.01%.",
      time: "Just now",
      status: "success",
    },
    {
      id: 2,
      type: "social",
      author: "Sarah K. (Product)",
      content:
        "Just deployed the new marketing agent Swarm. It is already optimizing ad spend on Farcaster frames. 🚀 #AI #Marketing",
      time: "12 mins ago",
      avatar: "S",
    },
    {
      id: 3,
      type: "system",
      title: "Protocol Update",
      content:
        "New governance proposal is live on Snapshot. Voting ends in 24h.",
      time: "1 hour ago",
      priority: "high",
    },
  ];

  // Load announcements (keep existing logic but map to feed)
  const announcementModules = import.meta.glob(
    "../../../data/announcements/*.json",
    { eager: true },
  );

  // Merge CMS announcements into feed
  Object.values(announcementModules).forEach((mod: any) => {
    const item = mod.default || mod;
    feedItems.push({
      id: Math.random(),
      type: "system",
      title: item.title,
      content: item.body || item.title,
      time: new Date(item.date).toLocaleDateString(),
      priority: item.type === "warning" ? "high" : "normal",
    });
  });
</script>

<div class="max-w-3xl mx-auto py-8 px-6 space-y-6">
  <!-- "What's Happening" / Command Bar -->
  <div class="p-4 rounded-xl border border-[#1f1f1f] bg-[#111]">
    <div class="flex gap-4">
      <div
        class="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 shrink-0"
      ></div>
      <div class="flex-1">
        <input
          data-testid="post-composer"
          type="text"
          placeholder="Broadcast update or initialize agent..."
          class="w-full bg-transparent text-white placeholder-[#a1a1aa] focus:outline-none text-sm py-2"
        />
        <div
          class="flex items-center justify-between mt-3 pt-3 border-t border-[#1f1f1f]"
        >
          <div class="flex gap-2">
            <button
              class="p-1.5 text-[#a1a1aa] hover:text-white hover:bg-[#1f1f1f] rounded transition-colors"
              title="Attach Media"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><rect
                  width="18"
                  height="18"
                  x="3"
                  y="3"
                  rx="2"
                  ry="2"
                /><circle cx="9" cy="9" r="2" /><path
                  d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"
                /></svg
              >
            </button>
            <button
              class="p-1.5 text-[#a1a1aa] hover:text-white hover:bg-[#1f1f1f] rounded transition-colors"
              title="Trigger Agent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path
                  d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
                /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line
                  x1="12"
                  x2="12"
                  y1="19"
                  y2="22"
                /></svg
              >
            </button>
          </div>
          <button
            data-testid="post-submit"
            class="px-4 py-1.5 bg-white text-black text-xs font-semibold rounded hover:bg-gray-200 transition-colors"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Feed Divider -->
  <div class="flex items-center gap-4 text-xs font-medium text-[#a1a1aa]">
    <span class="text-white">All Activity</span>
    <span class="cursor-pointer hover:text-white transition-colors"
      >Agent Logs</span
    >
    <span class="cursor-pointer hover:text-white transition-colors"
      >Mentions</span
    >
  </div>

  <!-- Feed Stream -->
  <div class="space-y-4">
    {#each feedItems as item}
      {#if item.type === "agent_log"}
        <!-- Agent Log Card -->
        <div
          data-testid="feed-post"
          class="p-4 rounded-xl border border-[#1f1f1f] bg-[#111]/50 hover:bg-[#111] transition-colors group"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-10 h-10 rounded-lg bg-emerald-900/20 border border-emerald-900/50 flex items-center justify-center shrink-0"
            >
              <span class="text-emerald-500 font-mono text-xs">LOG</span>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-semibold text-white">
                  {item.agentName}
                </h4>
                <span class="text-[10px] text-[#a1a1aa]">{item.time}</span>
              </div>
              <p
                class="text-sm text-[#a1a1aa] mt-1 font-mono text-xs leading-relaxed"
              >
                {item.content}
              </p>
            </div>
          </div>
        </div>
      {:else if item.type === "social"}
        <!-- Social Post Card -->
        <div
          data-testid="feed-post"
          class="p-4 rounded-xl border border-[#1f1f1f] hover:border-[#333] transition-colors"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-10 h-10 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center shrink-0 text-sm font-bold"
            >
              {item.avatar}
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-semibold text-white">{item.author}</h4>
                <span class="text-[10px] text-[#a1a1aa]">{item.time}</span>
              </div>
              <p class="text-sm text-gray-300 mt-2 leading-relaxed">
                {item.content}
              </p>

              <!-- Post Actions -->
              <div class="flex gap-6 mt-4">
                <button
                  data-testid="like-button"
                  class="flex items-center gap-2 text-[#a1a1aa] hover:text-white text-xs group transition-colors"
                >
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    ><path
                      d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                    /></svg
                  >
                  <span>Like</span>
                  <span data-testid="like-count">0</span>
                </button>
                <button
                  data-testid="comment-button"
                  class="flex items-center gap-2 text-[#a1a1aa] hover:text-white text-xs group transition-colors"
                >
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    ><path
                      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                    /></svg
                  >
                  <span>Comment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      {:else}
        <!-- System Alert -->
        <div
          data-testid="feed-post"
          class="p-3 rounded-lg border border-l-4 border-[#1f1f1f] bg-[#111] {item.priority ===
          'high'
            ? 'border-l-amber-500'
            : 'border-l-blue-500'}"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-white">{item.title}</span>
            <span class="text-[10px] text-[#a1a1aa]">{item.time}</span>
          </div>
          <p class="text-xs text-[#a1a1aa] mt-1">{item.content}</p>
        </div>
      {/if}
    {/each}
  </div>
</div>

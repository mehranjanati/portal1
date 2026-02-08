<script lang="ts">
  import dashboardConfig from "../../../data/dashboard.json";

  // Mock Feed Data
  let feedItems = $state([
    {
      id: 1,
      type: "agent_log",
      agentName: "AlphaTrader_V2",
      content: "Executed limit buy order for 15 ETH @ $2,240. Slippage: 0.01%.",
      time: "Just now",
      status: "success",
      likes: 0,
      liked: false,
    },
    {
      id: 2,
      type: "social",
      author: "Sarah K. (Product)",
      content:
        "Just deployed the new marketing agent Swarm. It is already optimizing ad spend on Farcaster frames. 🚀 #AI #Marketing",
      time: "12 mins ago",
      avatar: "S",
      likes: 5,
      liked: false,
    },
    {
      id: 3,
      type: "system",
      title: "Protocol Update",
      content:
        "New governance proposal is live on Snapshot. Voting ends in 24h.",
      time: "1 hour ago",
      priority: "high",
      likes: 0,
      liked: false,
    },
  ]);

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
      likes: 0,
      liked: false,
    });
  });

  let newPostContent = $state("");

  function handlePostSubmit() {
    if (!newPostContent.trim()) return;
    const newItem = {
      id: Math.random(),
      type: "social",
      author: "Alex D.",
      content: newPostContent,
      time: "Just now",
      avatar: "A",
      likes: 0,
      liked: false,
    };
    feedItems = [newItem, ...feedItems];
    newPostContent = "";
  }

  function toggleLike(item: any) {
    const index = feedItems.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      if (feedItems[index].liked) {
        feedItems[index].likes--;
        feedItems[index].liked = false;
      } else {
        feedItems[index].likes = (feedItems[index].likes || 0) + 1;
        feedItems[index].liked = true;
      }
      // Trigger reactivity by creating a new array
      feedItems = [...feedItems];
    }
  }

  let showCommentModal = $state(false);
  function openCommentModal() {
    showCommentModal = true;
  }
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
          bind:value={newPostContent}
          onkeydown={(e) => e.key === "Enter" && handlePostSubmit()}
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
            onclick={handlePostSubmit}
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
    <h2 class="text-white font-medium">All Activity</h2>
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
                <h3 class="text-sm font-semibold text-white">
                  {item.agentName}
                </h3>
                <span class="text-[10px] text-[#a1a1aa]">{item.time}</span>
              </div>
              <p
                class="text-sm text-[#a1a1aa] mt-1 font-mono text-xs leading-relaxed"
              >
                {item.content}
              </p>

              <!-- Post Actions -->
              <div class="flex gap-6 mt-4">
                <button
                  data-testid="like-button"
                  onclick={() => toggleLike(item)}
                  class="flex items-center gap-2 {item.liked
                    ? 'text-blue-400 liked active'
                    : 'text-[#a1a1aa]'} hover:text-white text-xs group transition-colors"
                >
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill={item.liked ? "currentColor" : "none"}
                    stroke="currentColor"
                    stroke-width="2"
                    ><path
                      d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                    /></svg
                  >
                  <span>Like</span>
                  <span data-testid="like-count">{item.likes || 0}</span>
                </button>
                <button
                  data-testid="comment-button"
                  onclick={openCommentModal}
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
                <h3 class="text-sm font-semibold text-white">{item.author}</h3>
                <span class="text-[10px] text-[#a1a1aa]">{item.time}</span>
              </div>
              <p class="text-sm text-gray-300 mt-2 leading-relaxed">
                {item.content}
              </p>

              <!-- Post Actions -->
              <div class="flex gap-6 mt-4">
                <button
                  data-testid="like-button"
                  onclick={() => toggleLike(item)}
                  class="flex items-center gap-2 {item.liked
                    ? 'text-blue-400 liked active'
                    : 'text-[#a1a1aa]'} hover:text-white text-xs group transition-colors"
                >
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill={item.liked ? "currentColor" : "none"}
                    stroke="currentColor"
                    stroke-width="2"
                    ><path
                      d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                    /></svg
                  >
                  <span>Like</span>
                  <span data-testid="like-count">{item.likes || 0}</span>
                </button>
                <button
                  data-testid="comment-button"
                  onclick={openCommentModal}
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

              {#if showCommentModal}
                <div
                  data-testid="comment-modal"
                  class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                >
                  <div
                    class="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 w-full max-w-lg shadow-2xl"
                  >
                    <h2 class="text-xl font-bold mb-4">Add Comment</h2>
                    <textarea
                      class="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-4 text-white focus:outline-none focus:border-nexus-accent mb-4"
                      placeholder="Write your comment..."
                      rows="4"
                    ></textarea>
                    <div class="flex justify-end gap-3">
                      <button
                        onclick={() => (showCommentModal = false)}
                        class="px-5 py-2 text-[#a1a1aa] hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onclick={() => (showCommentModal = false)}
                        class="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all font-bold"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              {/if}
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

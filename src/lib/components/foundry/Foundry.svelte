<script lang="ts">
    import { onMount } from "svelte";
    import { cn } from "$lib/utils";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import Select from "$lib/components/ui/Select.svelte";
    import { agentsStore } from "$lib/stores/agents";
    import type {
        Agent,
        AgentCapability,
        AgentConfig,
        AgentExecutionMode,
        AgentResultSurface,
        AgentType,
    } from "$lib/types";
    import {
        ArrowRight,
        Bot,
        FileJson,
        FolderOpen,
        Save,
        Sparkles,
        Trash2,
    } from "lucide-svelte";

    type DraftForm = {
        name: string;
        prompt: string;
        targetAudience: string;
        language: string;
        framework: string;
        runtime: string;
        type: AgentType;
        capability: AgentCapability;
        executionMode: AgentExecutionMode;
        resultSurface: AgentResultSurface;
    };

    const languages = [
        { label: "English (EN)", value: "en" },
        { label: "Persian (FA)", value: "fa" },
    ];

    const frameworks = [
        { label: "SvelteKit (SPA)", value: "svelte" },
        { label: "React (SPA)", value: "react" },
    ];

    const runtimes = [
        { label: "Go (TinyGo WASM)", value: "go" },
        { label: "Rust (WASM)", value: "rust" },
    ];

    const agentTypes = [
        { label: "Custom", value: "custom" },
        { label: "Analytics", value: "analytics" },
        { label: "Content", value: "content" },
        { label: "Social", value: "social" },
        { label: "Trading", value: "trading" },
    ];

    const capabilities = [
        { label: "Workflow Insight", value: "workflow_insight" },
        { label: "Deploy Website", value: "deploy_website" },
    ] satisfies Array<{ label: string; value: AgentCapability }>;

    const executionModes = [
        { label: "Read-Only Insight", value: "read_only_workflow_insight" },
        { label: "Deploy Workflow", value: "deploy_workflow" },
    ] satisfies Array<{ label: string; value: AgentExecutionMode }>;

    const resultSurfaces = [
        { label: "Global Chat", value: "global_chat" },
        { label: "Foundry", value: "foundry" },
        { label: "Projects", value: "projects" },
    ] satisfies Array<{ label: string; value: AgentResultSurface }>;

    let activeTab = $state("drafts");
    let savedDrafts = $state<Agent[]>([]);
    let selectedDraftId = $state<string | null>(null);
    let saveError = $state("");
    let saveMessage = $state("");
    let isSaving = $state(false);

    function createEmptyDraft(): DraftForm {
        return {
            name: "",
            prompt: "",
            targetAudience: "",
            language: "fa",
            framework: "svelte",
            runtime: "go",
            type: "custom",
            capability: "workflow_insight",
            executionMode: "read_only_workflow_insight",
            resultSurface: "global_chat",
        };
    }

    function getAgentConfig(agent: Agent): AgentConfig {
        return agent.config ?? {};
    }

    function toolsForCapability(capability: AgentCapability): AgentCapability[] {
        return [capability];
    }

    function deriveExecutionMode(capability: AgentCapability): AgentExecutionMode {
        return capability === "deploy_website"
            ? "deploy_workflow"
            : "read_only_workflow_insight";
    }

    function getCapabilityLabel(capability: AgentCapability) {
        return capability === "deploy_website" ? "Deploy Website" : "Workflow Insight";
    }

    function getExecutionModeLabel(executionMode: AgentExecutionMode) {
        return executionMode === "deploy_workflow"
            ? "Deploy Workflow"
            : "Read-Only Workflow Insight";
    }

    function getResultSurfaceLabel(resultSurface: AgentResultSurface) {
        switch (resultSurface) {
            case "foundry":
                return "Foundry";
            case "projects":
                return "Projects";
            default:
                return "Global Chat";
        }
    }

    function draftFromAgent(agent: Agent): DraftForm {
        const config = getAgentConfig(agent);
        const capability =
            config.capability === "deploy_website"
                ? "deploy_website"
                : "workflow_insight";

        return {
            name: agent.name ?? "",
            prompt: config.systemPrompt ?? agent.description ?? "",
            targetAudience: config.targetAudience ?? "",
            language: config.language ?? "fa",
            framework: config.framework ?? "svelte",
            runtime: config.runtime ?? "go",
            type: agent.type ?? "custom",
            capability,
            executionMode:
                config.executionMode === "deploy_workflow" ||
                config.executionMode === "read_only_workflow_insight"
                    ? config.executionMode
                    : deriveExecutionMode(capability),
            resultSurface:
                config.resultSurface === "foundry" || config.resultSurface === "projects"
                    ? config.resultSurface
                    : "global_chat",
        };
    }

    let draft = $state<DraftForm>(createEmptyDraft());

    const draftPreview = $derived.by(() =>
        JSON.stringify(
            {
                name: draft.name.trim(),
                type: draft.type,
                prompt: draft.prompt.trim(),
                config: {
                    targetAudience: draft.targetAudience.trim(),
                    language: draft.language,
                    framework: draft.framework,
                    runtime: draft.runtime,
                    capability: draft.capability,
                    executionMode: draft.executionMode,
                    resultSurface: draft.resultSurface,
                    tools: toolsForCapability(draft.capability),
                    source: "foundry_draft",
                },
            },
            null,
            2,
        ),
    );

    const selectedDraft = $derived.by(
        () => savedDrafts.find((agent) => agent.id === selectedDraftId) ?? null,
    );

    const draftSummary = $derived.by(() => {
        if (!draft.prompt.trim()) {
            return "هنوز برای این agent رفتار یا کاری تعریف نشده است.";
        }

        return draft.prompt.trim();
    });

    const contractSummary = $derived.by(() => ({
        capability: draft.capability,
        executionMode: draft.executionMode,
        resultSurface: draft.resultSurface,
        tools: toolsForCapability(draft.capability),
    }));

    const runtimeNarrative = $derived.by(() => {
        if (draft.capability === "deploy_website") {
            return {
                title: "Deploy path is not the primary MVP flow",
                body: "این draft هنوز برای compatibility نگه داشته می‌شود، اما use case اصلی این سری نیست. اگر هدف تو insight از workflowهاست، `workflow_insight` انتخاب درست MVP است.",
                tone: "border-amber-500/20 bg-amber-500/10 text-amber-100",
            };
        }

        return {
            title: "This draft will answer with runtime insight",
            body: "این draft در `GlobalChat` از dataهای read-only workflow و log استفاده می‌کند و باید summary قابل‌فهم، وضعیت workflow و آخرین signal را نشان بدهد.",
            tone: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
        };
    });

    const resultSurfaceNarrative = $derived.by(() => {
        if (draft.resultSurface === "projects") {
            return "این contract در کارت‌های `Projects` هم قابل‌دیدن خواهد بود تا draft فعال و مسیر اجرا پنهان نماند.";
        }

        if (draft.resultSurface === "foundry") {
            return "این draft نتیجه را نزدیک به خود Foundry مدل می‌کند، ولی مسیر اصلی MVP فعلاً `GlobalChat` است.";
        }

        return "نتیجه این draft باید در `GlobalChat` به‌صورت result card خوانا دیده شود، نه فقط payload خام.";
    });

    function startNewDraft() {
        selectedDraftId = null;
        draft = createEmptyDraft();
        saveError = "";
        saveMessage = "";
        agentsStore.selectAgent(null);
    }

    function openDraft(agent: Agent) {
        selectedDraftId = agent.id;
        draft = draftFromAgent(agent);
        saveError = "";
        saveMessage = "";
        agentsStore.selectAgent(agent.id);
    }

    async function removeDraft(agent: Agent) {
        await agentsStore.deleteAgent(agent.id);

        if (selectedDraftId === agent.id) {
            startNewDraft();
        }
    }

    async function saveDraft() {
        saveError = "";
        saveMessage = "";

        const name = draft.name.trim();
        const prompt = draft.prompt.trim();
        if (!name) {
            saveError = "نام agent الزامی است.";
            return;
        }
        if (!prompt) {
            saveError = "behavior یا prompt اصلی agent را وارد کن.";
            return;
        }

        isSaving = true;

        const config: AgentConfig = {
            systemPrompt: prompt,
            targetAudience: draft.targetAudience.trim(),
            language: draft.language,
            framework: draft.framework,
            runtime: draft.runtime,
            capability: draft.capability,
            executionMode: draft.executionMode,
            resultSurface: draft.resultSurface,
            tools: toolsForCapability(draft.capability),
            source: "foundry_draft",
        };

        const payload = {
            name,
            description: prompt,
            type: draft.type,
            status: "paused" as const,
            owner: "local-user",
            performance: {
                roi: 0,
                trades: 0,
                uptime: 0,
                successRate: 0,
                lastActive: new Date(),
            },
            config,
        };

        try {
            if (selectedDraftId) {
                await agentsStore.updateAgent(selectedDraftId, payload);
                saveMessage = "Agent draft به‌روزرسانی شد.";
            } else {
                const createdAgent = await agentsStore.addAgent(payload);
                selectedDraftId = createdAgent?.id ?? null;
                saveMessage = "Agent draft ذخیره شد.";
            }

            await agentsStore.loadAgents();
            activeTab = "drafts";
        } catch (error) {
            saveError =
                error instanceof Error
                    ? error.message
                    : "ذخیره draft با خطا مواجه شد.";
        } finally {
            isSaving = false;
        }
    }

    function openBuilder() {
        window.location.hash = "#/builder";
    }

    function openProjects() {
        window.location.hash = "#/projects";
    }

    function handleCapabilityChange(value: AgentCapability) {
        draft = {
            ...draft,
            capability: value,
            executionMode: deriveExecutionMode(value),
        };
    }

    onMount(() => {
        void agentsStore.loadAgents();

        return agentsStore.subscribe((state) => {
            savedDrafts = [...state.agents].sort(
                (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
            );

            if (state.selectedAgent && state.selectedAgent.id !== selectedDraftId) {
                selectedDraftId = state.selectedAgent.id;
                draft = draftFromAgent(state.selectedAgent);
            }
        });
    });
</script>

<div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
    <Card class="lg:col-span-4 border-white/5 bg-bg-secondary/40">
        <div class="flex items-center justify-between border-b border-white/5 p-4">
            <div>
                <h1 class="font-semibold tracking-tight">Agent Foundry</h1>
                <p class="mt-1 text-xs text-text-muted">
                    این surface حالا draft واقعی agent را در مرورگر ذخیره می‌کند.
                </p>
            </div>
            <Button variant="ghost" size="icon" class="h-8 w-8" onclick={startNewDraft}>
                <Sparkles size={16} />
            </Button>
        </div>

        <div class="space-y-5 p-4">
            <label class="block">
                <span class="text-xs font-bold uppercase text-text-muted">Agent Name</span>
                <Input bind:value={draft.name} class="mt-2" placeholder="research-assistant" />
            </label>

            <label class="block">
                <span class="text-xs font-bold uppercase text-text-muted">Agent Type</span>
                <div class="mt-2">
                    <Select bind:value={draft.type} options={agentTypes} />
                </div>
            </label>

            <label class="block">
                <span class="text-xs font-bold uppercase text-text-muted">Use Case / Prompt</span>
                <textarea
                    bind:value={draft.prompt}
                    class="mt-2 min-h-[140px] w-full rounded-button border border-white/10 bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-all hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-primary/20"
                    placeholder="مثلاً: یک agent تحقیقاتی که سوال کاربر را بگیرد، از ابزارهای read-only استفاده کند و خلاصه قابل‌استفاده برگرداند."
                ></textarea>
            </label>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label class="block">
                    <span class="text-xs font-bold uppercase text-text-muted">Target Audience</span>
                    <Input bind:value={draft.targetAudience} class="mt-2" placeholder="Analysts / Founders / Ops" />
                </label>
                <label class="block">
                    <span class="text-xs font-bold uppercase text-text-muted">Capability</span>
                    <div class="mt-2">
                        <Select
                            value={draft.capability}
                            options={capabilities}
                            onchange={(event: Event) =>
                                handleCapabilityChange(
                                    (event.currentTarget as HTMLSelectElement)
                                        .value as AgentCapability,
                                )}
                        />
                    </div>
                </label>
                <label class="block">
                    <span class="text-xs font-bold uppercase text-text-muted">Language</span>
                    <div class="mt-2">
                        <Select bind:value={draft.language} options={languages} />
                    </div>
                </label>
                <label class="block">
                    <span class="text-xs font-bold uppercase text-text-muted">Frontend</span>
                    <div class="mt-2">
                        <Select bind:value={draft.framework} options={frameworks} />
                    </div>
                </label>
                <label class="block">
                    <span class="text-xs font-bold uppercase text-text-muted">Runtime</span>
                    <div class="mt-2">
                        <Select bind:value={draft.runtime} options={runtimes} />
                    </div>
                </label>
                <label class="block">
                    <span class="text-xs font-bold uppercase text-text-muted">Execution Mode</span>
                    <div class="mt-2">
                        <Select bind:value={draft.executionMode} options={executionModes} />
                    </div>
                </label>
                <label class="block">
                    <span class="text-xs font-bold uppercase text-text-muted">Result Surface</span>
                    <div class="mt-2">
                        <Select bind:value={draft.resultSurface} options={resultSurfaces} />
                    </div>
                </label>
            </div>

            {#if saveError}
                <div class="rounded-lg border border-status-danger/20 bg-status-danger/10 px-3 py-2 text-xs text-status-danger">
                    {saveError}
                </div>
            {/if}

            {#if saveMessage}
                <div class="rounded-lg border border-accent-primary/20 bg-accent-primary/10 px-3 py-2 text-xs text-accent-primary">
                    {saveMessage}
                </div>
            {/if}
        </div>

        <div class="space-y-2 border-t border-white/5 bg-bg-secondary/50 p-4">
            <Button variant="primary" class="w-full gap-2" loading={isSaving} onclick={saveDraft}>
                <Save size={16} />
                {selectedDraftId ? "Update Agent Draft" : "Save Agent Draft"}
            </Button>
            <div class="grid grid-cols-2 gap-2">
                <Button variant="outline" class="w-full" onclick={startNewDraft}>New Draft</Button>
                <Button variant="ghost" class="w-full" onclick={openProjects}>Open Projects</Button>
            </div>
        </div>
    </Card>

    <Card class="lg:col-span-5 border-white/5 bg-bg-primary/50">
        <div class="border-b border-white/5 p-4">
            <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Bot size={18} class="text-accent-primary" />
                </div>
                <div>
                    <h2 class="font-semibold text-text-primary">
                        {draft.name.trim() || "Untitled Agent"}
                    </h2>
                    <p class="text-xs text-text-muted">
                        draft محلی برای طراحی agent با contract اجرایی روشن قبل از هر orchestration پیچیده‌تر
                    </p>
                </div>
            </div>
        </div>

        <div class="space-y-6 p-6">
            <div class="grid grid-cols-2 gap-3">
                <div class="rounded-lg border border-white/5 bg-white/[0.03] p-4">
                    <div class="text-[11px] uppercase tracking-[0.2em] text-text-muted">Type</div>
                    <div class="mt-2 text-sm font-medium text-text-primary">{draft.type}</div>
                </div>
                <div class="rounded-lg border border-white/5 bg-white/[0.03] p-4">
                    <div class="text-[11px] uppercase tracking-[0.2em] text-text-muted">Audience</div>
                    <div class="mt-2 text-sm font-medium text-text-primary">
                        {draft.targetAudience.trim() || "Not set"}
                    </div>
                </div>
                <div class="rounded-lg border border-white/5 bg-white/[0.03] p-4">
                    <div class="text-[11px] uppercase tracking-[0.2em] text-text-muted">Frontend</div>
                    <div class="mt-2 text-sm font-medium text-text-primary">{draft.framework}</div>
                </div>
                <div class="rounded-lg border border-white/5 bg-white/[0.03] p-4">
                    <div class="text-[11px] uppercase tracking-[0.2em] text-text-muted">Runtime</div>
                    <div class="mt-2 text-sm font-medium text-text-primary">{draft.runtime}</div>
                </div>
                <div class="rounded-lg border border-white/5 bg-white/[0.03] p-4">
                    <div class="text-[11px] uppercase tracking-[0.2em] text-text-muted">Capability</div>
                    <div class="mt-2 text-sm font-medium text-text-primary">
                        {getCapabilityLabel(contractSummary.capability)}
                    </div>
                </div>
                <div class="rounded-lg border border-white/5 bg-white/[0.03] p-4">
                    <div class="text-[11px] uppercase tracking-[0.2em] text-text-muted">Result Surface</div>
                    <div class="mt-2 text-sm font-medium text-text-primary">
                        {getResultSurfaceLabel(contractSummary.resultSurface)}
                    </div>
                </div>
            </div>

            <div class="rounded-xl border border-white/5 bg-bg-secondary/30 p-5">
                <div class="text-[11px] uppercase tracking-[0.2em] text-text-muted">Behavior Summary</div>
                <p class="mt-3 whitespace-pre-wrap text-sm leading-6 text-text-primary">{draftSummary}</p>
            </div>

            <div class="rounded-xl border border-white/5 bg-black/20 p-5">
                <div class="text-[11px] uppercase tracking-[0.2em] text-text-muted">Execution Contract</div>
                <div class="mt-3 space-y-2 text-sm text-text-primary">
                    <p>Mode: <span class="font-medium">{getExecutionModeLabel(contractSummary.executionMode)}</span></p>
                    <p>Tools: <span class="font-medium">{contractSummary.tools.join(", ")}</span></p>
                    <p>Surface: <span class="font-medium">{getResultSurfaceLabel(contractSummary.resultSurface)}</span></p>
                </div>
                <p class="mt-3 text-xs leading-5 text-text-muted">{resultSurfaceNarrative}</p>
            </div>

            <div class="rounded-xl border p-5 {runtimeNarrative.tone}">
                <div class="text-[11px] uppercase tracking-[0.2em] opacity-80">Runtime Intent</div>
                <div class="mt-3 text-sm font-semibold">{runtimeNarrative.title}</div>
                <p class="mt-2 text-sm leading-6">{runtimeNarrative.body}</p>
            </div>

            <div class="rounded-xl border border-accent-primary/10 bg-accent-primary/5 p-5">
                <div class="text-[11px] uppercase tracking-[0.2em] text-accent-primary/80">Next Practical Step</div>
                <p class="mt-3 text-sm leading-6 text-text-primary">
                    بعد از ذخیره draft، این contract به `GlobalChat` و `BFF` می‌رسد تا agent انتخاب‌شده با capability واقعی خودش اجرا شود و failure یا empty state هم با copy روشن‌تری دیده شود.
                </p>
                <div class="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" class="gap-2" onclick={openBuilder}>
                        Open Builder <ArrowRight size={14} />
                    </Button>
                    <Button variant="ghost" class="gap-2" onclick={openProjects}>
                        <FolderOpen size={14} /> View Saved Drafts
                    </Button>
                </div>
            </div>
        </div>
    </Card>

    <Card class="lg:col-span-3 border-white/5 bg-bg-secondary/40">
        <div class="flex items-center border-b border-white/5">
            <button
                class={cn(
                    "flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                    activeTab === "drafts"
                        ? "border-accent-primary bg-white/5 text-text-primary"
                        : "border-transparent text-text-muted hover:bg-white/5 hover:text-text-primary",
                )}
                onclick={() => (activeTab = "drafts")}
            >
                Drafts
            </button>
            <button
                class={cn(
                    "flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                    activeTab === "config"
                        ? "border-accent-primary bg-white/5 text-text-primary"
                        : "border-transparent text-text-muted hover:bg-white/5 hover:text-text-primary",
                )}
                onclick={() => (activeTab = "config")}
            >
                Config
            </button>
            <button
                class={cn(
                    "flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                    activeTab === "next"
                        ? "border-accent-primary bg-white/5 text-text-primary"
                        : "border-transparent text-text-muted hover:bg-white/5 hover:text-text-primary",
                )}
                onclick={() => (activeTab = "next")}
            >
                Next
            </button>
        </div>

        <div class="min-h-[520px] p-4">
            {#if activeTab === "drafts"}
                {#if savedDrafts.length === 0}
                    <div class="rounded-xl border border-dashed border-white/10 p-4 text-sm text-text-muted">
                        هنوز draftی ذخیره نشده است. اولین agent ساده‌ات را از همین صفحه بساز.
                    </div>
                {:else}
                    <div class="space-y-3">
                        {#each savedDrafts as agent (agent.id)}
                            <div
                                class={cn(
                                    "rounded-xl border p-3 transition-colors",
                                    selectedDraftId === agent.id
                                        ? "border-accent-primary/30 bg-accent-primary/5"
                                        : "border-white/5 bg-white/[0.02]",
                                )}
                            >
                                <button class="w-full text-left" onclick={() => openDraft(agent)}>
                                    <div class="text-sm font-medium text-text-primary">{agent.name}</div>
                                    <div class="mt-1 text-[11px] text-text-muted">
                                        {agent.type} · {agent.status}
                                    </div>
                                    <div class="mt-2 flex flex-wrap gap-2 text-[11px]">
                                        <span class="rounded-full border border-accent-primary/20 bg-accent-primary/10 px-2 py-0.5 text-accent-primary">
                                            {getCapabilityLabel(getAgentConfig(agent).capability ?? "workflow_insight")}
                                        </span>
                                        <span class="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-text-muted">
                                            {getResultSurfaceLabel(getAgentConfig(agent).resultSurface ?? "global_chat")}
                                        </span>
                                    </div>
                                    <div class="mt-2 line-clamp-2 text-xs text-text-muted">
                                        {agent.description || "No description"}
                                    </div>
                                </button>
                                <div class="mt-3 flex items-center justify-between text-[11px] text-text-muted">
                                    <span>{agent.updatedAt.toLocaleString()}</span>
                                    <button class="inline-flex items-center gap-1 text-status-danger" onclick={() => removeDraft(agent)}>
                                        <Trash2 size={12} /> Delete
                                    </button>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            {:else if activeTab === "config"}
                <div class="rounded-xl border border-white/5 bg-black/30 p-4">
                    <div class="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-muted">
                        <FileJson size={14} /> Foundry Draft JSON
                    </div>
                    <pre class="overflow-auto text-xs leading-6 text-text-primary">{draftPreview}</pre>
                </div>
            {:else}
                <div class="space-y-4 text-sm text-text-muted">
                    <div class="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                        این صفحه الان کار واقعی انجام می‌دهد: draft را ذخیره و دوباره قابل‌ویرایش می‌کند.
                    </div>
                    <div class="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                        این draft حالا باید با execution mode روشن به `GlobalChat` برود و نتیجه‌اش به‌صورت user-facing دیده شود، نه فقط debug metadata.
                    </div>
                    {#if selectedDraft}
                        <div class="rounded-xl border border-accent-primary/10 bg-accent-primary/5 p-4 text-text-primary">
                            draft انتخاب‌شده: <span class="font-semibold">{selectedDraft.name}</span>
                            <div class="mt-2 text-xs text-text-muted">
                                {getCapabilityLabel(getAgentConfig(selectedDraft).capability ?? "workflow_insight")}
                                ·
                                {getExecutionModeLabel(
                                    getAgentConfig(selectedDraft).executionMode ??
                                        "read_only_workflow_insight",
                                )}
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </Card>
</div>

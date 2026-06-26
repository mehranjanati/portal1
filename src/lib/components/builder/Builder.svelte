<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { superNode, type WorkflowExecution, type WorkflowLogEntry, type WorkflowStatus } from "$lib/services/supernode";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";

    type VoltAgentTool = {
        name: string;
        description?: string;
        parameters?: any;
    };

    type VoltAgentManifest = {
        version: string;
        tools: VoltAgentTool[];
    };

    type ExecutionResult = {
        workflowId: string;
        workflow_id?: string;
        status?: string;
        current_step?: string;
        message?: string;
        planning_source?: string;
        data?: Record<string, string>;
        [key: string]: unknown;
    };

    const DEPLOY_TOOL_NAME = "system__deploy_website";

    let manifest: VoltAgentManifest | null = null;
    let isLoadingManifest = false;
    let manifestError: string | null = null;

    let search = "";
    let selectedToolName: string | null = DEPLOY_TOOL_NAME;
    let argsJson = "";
    let execResultJson: string | null = null;
    let execError: string | null = null;
    let isExecuting = false;

    let deployForm = {
        project_name: "my-site",
        prompt: "A modern landing page with CTA and pricing section",
        framework: "svelte",
        theme: "modern",
        template: "default",
    };

    let latestExecution: ExecutionResult | null = null;
    let latestWorkflowStatus: WorkflowStatus | null = null;
    let isPollingWorkflow = false;
    let recentWorkflows: WorkflowExecution[] = [];
    let recentLogs: WorkflowLogEntry[] = [];
    let supportDataError = "";
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    $: tools = manifest?.tools ?? [];
    $: filteredTools =
        search.trim().length === 0
            ? tools
            : tools.filter((t) => {
                  const q = search.toLowerCase();
                  return (
                      t.name.toLowerCase().includes(q) ||
                      (t.description ?? "").toLowerCase().includes(q)
                  );
              });
    $: selectedTool = tools.find((t) => t.name === selectedToolName) ?? null;
    $: isDeployToolSelected = selectedTool?.name === DEPLOY_TOOL_NAME;
    $: workflowId = latestExecution?.workflowId ?? latestExecution?.workflow_id ?? "";
    $: currentWorkflowLogs = latestWorkflowStatus?.logs?.slice(-5) ?? [];
    $: relevantRecentLogs = recentLogs
        .filter((entry) => !workflowId || entry.workflowId === workflowId)
        .slice(0, 5);

    function defaultArgsForTool(toolName: string) {
        if (toolName === DEPLOY_TOOL_NAME) {
            return JSON.stringify(deployForm, null, 2);
        }

        return JSON.stringify({ args: [] }, null, 2);
    }

    function selectTool(name: string) {
        selectedToolName = name;
        execError = null;
        execResultJson = null;
        argsJson = defaultArgsForTool(name);
    }

    async function loadManifest() {
        isLoadingManifest = true;
        manifestError = null;
        try {
            const data = await superNode.getVoltAgentManifest();
            manifest = data;

            const nextTool = data?.tools?.some((tool: VoltAgentTool) => tool.name === DEPLOY_TOOL_NAME)
                ? DEPLOY_TOOL_NAME
                : data?.tools?.[0]?.name;

            if (nextTool) {
                selectTool(nextTool);
            }
        } catch (e) {
            console.error(e);
            manifestError = e instanceof Error ? e.message : "Failed to load manifest.";
            manifest = null;
            selectedToolName = null;
        } finally {
            isLoadingManifest = false;
        }
    }

    async function loadSupportData() {
        supportDataError = "";

        try {
            const [workflows, logs] = await Promise.all([
                superNode.listWorkflowExecutions(),
                superNode.listWorkflowLogs(),
            ]);

            recentWorkflows = workflows.slice(0, 4);
            recentLogs = logs.slice(0, 6);
        } catch (error) {
            supportDataError =
                error instanceof Error ? error.message : "Failed to load workflows and logs.";
        }
    }

    async function refreshWorkflowStatus() {
        if (!workflowId) return;

        try {
            latestWorkflowStatus = await superNode.getWorkflowStatus(workflowId);

            if (latestWorkflowStatus.status !== "RUNNING") {
                stopWorkflowPolling();
            }
        } catch (error) {
            execError =
                error instanceof Error ? error.message : "Failed to refresh workflow status.";
            stopWorkflowPolling();
        }
    }

    function startWorkflowPolling() {
        stopWorkflowPolling();
        if (!workflowId) return;

        isPollingWorkflow = true;
        pollTimer = setInterval(() => {
            void refreshWorkflowStatus();
        }, 3000);
    }

    function stopWorkflowPolling() {
        isPollingWorkflow = false;
        if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
        }
    }

    async function executeSelectedTool() {
        execError = null;
        execResultJson = null;

        if (!selectedTool) {
            execError = "No tool selected";
            return;
        }

        let args: Record<string, unknown>;

        if (selectedTool.name === DEPLOY_TOOL_NAME) {
            args = {
                project_name: deployForm.project_name.trim(),
                prompt: deployForm.prompt.trim(),
                framework: deployForm.framework.trim(),
                theme: deployForm.theme.trim(),
                template: deployForm.template.trim(),
            };
        } else {
            try {
                args = JSON.parse(argsJson || "{}");
            } catch (e) {
                execError = "Invalid JSON in args";
                return;
            }
        }

        if (selectedTool.name === DEPLOY_TOOL_NAME && !String(args.project_name ?? "").trim()) {
            execError = "Project name is required";
            return;
        }

        isExecuting = true;
        latestExecution = null;
        latestWorkflowStatus = null;
        stopWorkflowPolling();

        try {
            const result = await superNode.executeVoltAgentTool(
                selectedTool.name,
                args,
            );
            latestExecution = result as ExecutionResult;
            execResultJson = JSON.stringify(result, null, 2);

            if (selectedTool.name === DEPLOY_TOOL_NAME && workflowId) {
                await refreshWorkflowStatus();
                startWorkflowPolling();
            }

            await loadSupportData();
        } catch (e) {
            execError =
                e instanceof Error ? e.message : "Tool execution failed";
        } finally {
            isExecuting = false;
        }
    }

    function goTo(hash: string) {
        window.location.hash = hash;
    }

    function resultBadgeText() {
        if (latestWorkflowStatus) {
            return `${latestWorkflowStatus.status} · ${latestWorkflowStatus.currentStep}`;
        }
        if (latestExecution?.status) {
            return latestExecution.status;
        }
        return "Queued";
    }

    onMount(async () => {
        await loadManifest();
        await loadSupportData();
    });

    onDestroy(() => {
        stopWorkflowPolling();
    });
</script>

<div class="p-6 space-y-6 text-white">
    <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
            <h1 class="text-2xl font-semibold">VoltAgent Builder</h1>
            <p class="text-sm text-[#a1a1aa]">
                Trigger the primary MVP deploy flow, watch workflow progress, and inspect artifacts without leaving the SPA.
            </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
            <Button
                variant="outline"
                onclick={loadManifest}
                disabled={isLoadingManifest}
            >
                {isLoadingManifest ? "Refreshing..." : "Refresh Contract"}
            </Button>
            <Button variant="outline" onclick={() => loadSupportData()}>
                Refresh Workflow Data
            </Button>
            <Button variant="outline" onclick={() => goTo("#/workflows")}>
                Open Workflows
            </Button>
            <Button variant="outline" onclick={() => goTo("#/logs")}>
                Open Logs
            </Button>
        </div>
    </div>

    <Card class="border-[#1f1f1f] bg-[#111] text-white">
        <CardContent class="grid gap-4 p-6 lg:grid-cols-4">
            <div class="rounded-lg border border-[#1f1f1f] bg-[#0b0b0b] p-4">
                <div class="text-[11px] uppercase tracking-[0.2em] text-[#71717a]">
                    Phase 1 Path
                </div>
                <div class="mt-2 text-sm font-medium">
                    Builder -> Go internal tools -> VoltAgent planning -> Temporal
                </div>
            </div>
            <div class="rounded-lg border border-[#1f1f1f] bg-[#0b0b0b] p-4">
                <div class="text-[11px] uppercase tracking-[0.2em] text-[#71717a]">
                    Manifest
                </div>
                <div class="mt-2 text-lg font-semibold">
                    {manifest?.version ? `v${manifest.version}` : "Unavailable"}
                </div>
                <div class="mt-1 text-xs text-[#a1a1aa]">
                    {tools.length} tool(s) visible in current contract
                </div>
            </div>
            <div class="rounded-lg border border-[#1f1f1f] bg-[#0b0b0b] p-4">
                <div class="text-[11px] uppercase tracking-[0.2em] text-[#71717a]">
                    Latest Workflow
                </div>
                <div class="mt-2 text-sm font-medium break-all">
                    {workflowId || "No deploy triggered yet"}
                </div>
                <div class="mt-1 text-xs text-[#a1a1aa]">
                    {latestExecution?.planning_source ?? "planning source not available yet"}
                </div>
            </div>
            <div class="rounded-lg border border-[#1f1f1f] bg-[#0b0b0b] p-4">
                <div class="text-[11px] uppercase tracking-[0.2em] text-[#71717a]">
                    Status
                </div>
                <div class="mt-2 text-lg font-semibold">
                    {latestExecution ? resultBadgeText() : "Ready"}
                </div>
                <div class="mt-1 text-xs text-[#a1a1aa]">
                    {isPollingWorkflow ? "Polling workflow every 3 seconds" : "No active polling"}
                </div>
            </div>
        </CardContent>
    </Card>

    {#if manifestError}
        <div class="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {manifestError}
            <div class="mt-2 text-xs text-red-200/80">
                Builder no longer falls back to mock tools. Restore the backend contract to continue.
            </div>
        </div>
    {/if}

    {#if supportDataError}
        <div class="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {supportDataError}
        </div>
    {/if}

    <div class="grid gap-4 xl:grid-cols-12">
        <Card class="border-[#1f1f1f] bg-[#111] text-white xl:col-span-3">
            <CardHeader class="space-y-2">
                <CardTitle class="text-sm">Tool Catalog</CardTitle>
                <Input bind:value={search} placeholder="Search tools..." />
                <div class="text-[10px] text-[#52525b]">
                    `deploy_website` is the only product-grade path in the current MVP.
                </div>
            </CardHeader>

            <CardContent class="space-y-2">
                {#if isLoadingManifest}
                    <div class="text-xs text-[#a1a1aa]">Loading tools...</div>
                {:else if filteredTools.length === 0}
                    <div class="text-xs text-[#a1a1aa]">No tools found</div>
                {:else}
                    <div class="space-y-2">
                        {#each filteredTools as tool (tool.name)}
                            <button
                                class={`w-full rounded-lg border p-3 text-left transition-colors ${
                                    tool.name === selectedToolName
                                        ? "border-[#3f3f46] bg-[#191919]"
                                        : "border-[#1f1f1f] hover:border-[#333] hover:bg-[#141414]"
                                }`}
                                onclick={() => selectTool(tool.name)}
                            >
                                <div class="flex items-center justify-between gap-2">
                                    <div class="text-xs font-medium">{tool.name}</div>
                                    {#if tool.name === DEPLOY_TOOL_NAME}
                                        <span class="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                                            Recommended
                                        </span>
                                    {/if}
                                </div>
                                {#if tool.description}
                                    <div class="mt-1 text-[11px] text-[#a1a1aa] line-clamp-2">
                                        {tool.description}
                                    </div>
                                {/if}
                            </button>
                        {/each}
                    </div>
                {/if}
            </CardContent>
        </Card>

        <div class="space-y-4 xl:col-span-6">
            <Card class="border-[#1f1f1f] bg-[#111] text-white">
                <CardHeader class="space-y-2">
                    <CardTitle class="text-sm">
                        {isDeployToolSelected ? "Deploy Website" : "Execute Tool"}
                    </CardTitle>
                    <div class="text-xs text-[#a1a1aa]">
                        {selectedTool?.description ?? "Select a tool to execute."}
                    </div>
                </CardHeader>

                <CardContent class="space-y-4">
                    <div class="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-3">
                        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div class="text-[11px] uppercase tracking-[0.2em] text-[#71717a]">
                                    Primary Action
                                </div>
                                <div class="mt-1 text-sm text-white">
                                    {isDeployToolSelected
                                        ? "Trigger the main deploy workflow and follow its status here."
                                        : "Run the selected internal tool with the payload below."}
                                </div>
                                <div class="mt-1 text-xs text-[#a1a1aa]">
                                    {latestExecution
                                        ? `Latest status: ${resultBadgeText()}`
                                        : "No execution started yet."}
                                </div>
                            </div>

                            <div class="flex flex-wrap items-center gap-2">
                                <Button onclick={executeSelectedTool} disabled={!selectedTool || isExecuting}>
                                    {isExecuting ? "Executing..." : isDeployToolSelected ? "Start MVP Deploy" : "Run Tool"}
                                </Button>
                                {#if workflowId}
                                    <Button variant="outline" onclick={() => goTo("#/workflows")}>
                                        View Workflow Board
                                    </Button>
                                    <Button variant="outline" onclick={() => goTo("#/logs")}>
                                        Inspect Logs
                                    </Button>
                                {/if}
                            </div>
                        </div>

                        {#if execError}
                            <div class="mt-3 text-xs text-red-400">{execError}</div>
                        {/if}
                    </div>

                    {#if isDeployToolSelected}
                        <div class="grid gap-4 md:grid-cols-2">
                            <label class="space-y-2 text-xs text-[#a1a1aa]">
                                <span>Project Name</span>
                                <Input bind:value={deployForm.project_name} placeholder="my-site" />
                            </label>
                            <label class="space-y-2 text-xs text-[#a1a1aa]">
                                <span>Framework</span>
                                <Input bind:value={deployForm.framework} placeholder="svelte" />
                            </label>
                            <label class="space-y-2 text-xs text-[#a1a1aa]">
                                <span>Theme</span>
                                <Input bind:value={deployForm.theme} placeholder="modern" />
                            </label>
                            <label class="space-y-2 text-xs text-[#a1a1aa]">
                                <span>Template</span>
                                <Input bind:value={deployForm.template} placeholder="default" />
                            </label>
                        </div>

                        <label class="block space-y-2 text-xs text-[#a1a1aa]">
                            <span>Prompt</span>
                            <textarea
                                class="min-h-[140px] w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#333]"
                                bind:value={deployForm.prompt}
                                spellcheck="false"
                            ></textarea>
                        </label>

                        <div class="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-3">
                            <div class="text-[11px] uppercase tracking-[0.2em] text-[#71717a]">
                                Request Preview
                            </div>
                            <pre class="mt-2 overflow-auto text-xs text-white">{JSON.stringify(deployForm, null, 2)}</pre>
                        </div>
                    {:else}
                        <div class="space-y-2">
                            <div class="text-[11px] text-[#a1a1aa]">Args (JSON)</div>
                            <textarea
                                class="min-h-[220px] w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#333]"
                                bind:value={argsJson}
                                spellcheck="false"
                            ></textarea>
                        </div>
                    {/if}
                </CardContent>
            </Card>

            <Card class="border-[#1f1f1f] bg-[#111] text-white">
                <CardHeader class="space-y-2">
                    <CardTitle class="text-sm">Execution Output</CardTitle>
                    <div class="text-xs text-[#a1a1aa]">
                        Raw result from the current internal tools contract.
                    </div>
                </CardHeader>

                <CardContent class="space-y-4">
                    {#if latestExecution}
                        <div class="grid gap-3 md:grid-cols-3">
                            <div class="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-3">
                                <div class="text-[11px] text-[#71717a]">Workflow ID</div>
                                <div class="mt-1 break-all text-sm">{workflowId}</div>
                            </div>
                            <div class="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-3">
                                <div class="text-[11px] text-[#71717a]">Planning Source</div>
                                <div class="mt-1 text-sm">{latestExecution.planning_source ?? "unknown"}</div>
                            </div>
                            <div class="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-3">
                                <div class="text-[11px] text-[#71717a]">Current State</div>
                                <div class="mt-1 text-sm">{resultBadgeText()}</div>
                            </div>
                        </div>
                    {/if}

                    <pre class="min-h-[160px] overflow-auto rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-3 text-xs text-white">{execResultJson ?? "No execution yet."}</pre>

                    {#if selectedTool?.parameters}
                        <details class="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-3">
                            <summary class="cursor-pointer text-xs text-[#a1a1aa]">
                                Schema (from manifest)
                            </summary>
                            <pre class="mt-2 overflow-auto text-xs text-white">{JSON.stringify(selectedTool.parameters, null, 2)}</pre>
                        </details>
                    {/if}
                </CardContent>
            </Card>
        </div>

        <div class="space-y-4 xl:col-span-3">
            <Card class="border-[#1f1f1f] bg-[#111] text-white">
                <CardHeader class="space-y-2">
                    <CardTitle class="text-sm">Live Workflow Pulse</CardTitle>
                    <div class="text-xs text-[#a1a1aa]">
                        Latest status pulled from `/workflows/:id`.
                    </div>
                </CardHeader>
                <CardContent class="space-y-3">
                    {#if latestWorkflowStatus}
                        <div class="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-3">
                            <div class="text-[11px] text-[#71717a]">Status</div>
                            <div class="mt-1 text-sm font-medium">
                                {latestWorkflowStatus.status} · {latestWorkflowStatus.currentStep}
                            </div>
                        </div>

                        {#if currentWorkflowLogs.length > 0}
                            <div class="space-y-2">
                                {#each currentWorkflowLogs as log}
                                    <div class="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-3 text-xs text-[#d4d4d8]">
                                        {log}
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <div class="text-xs text-[#a1a1aa]">Workflow started, waiting for logs...</div>
                        {/if}

                        {#if latestWorkflowStatus.artifacts}
                            <div class="mt-4 flex flex-col gap-2">
                                {#if latestWorkflowStatus.artifacts.liveUrl}
                                    <a href={latestWorkflowStatus.artifacts.liveUrl} target="_blank" rel="noreferrer" class="text-xs text-indigo-400 hover:underline">
                                        Open Live URL
                                    </a>
                                {/if}
                                {#if latestWorkflowStatus.artifacts.previewUrl}
                                    <a href={latestWorkflowStatus.artifacts.previewUrl} target="_blank" rel="noreferrer" class="text-xs text-emerald-400 hover:underline">
                                        Open Preview URL
                                    </a>
                                {/if}
                                {#if latestWorkflowStatus.artifacts.repoUrl}
                                    <a href={latestWorkflowStatus.artifacts.repoUrl} target="_blank" rel="noreferrer" class="text-xs text-gray-400 hover:underline">
                                        View Source Repository
                                    </a>
                                {/if}
                            </div>
                        {/if}
                    {:else}
                        <div class="text-xs text-[#a1a1aa]">
                            Trigger a deploy to start polling workflow status here.
                        </div>
                    {/if}
                </CardContent>
            </Card>

            <Card class="border-[#1f1f1f] bg-[#111] text-white">
                <CardHeader class="space-y-2">
                    <CardTitle class="text-sm">Recent Workflows</CardTitle>
                </CardHeader>
                <CardContent class="space-y-2">
                    {#if recentWorkflows.length === 0}
                        <div class="text-xs text-[#a1a1aa]">No workflows loaded yet.</div>
                    {:else}
                        {#each recentWorkflows as workflow}
                            <button
                                class="w-full rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-3 text-left transition-colors hover:border-[#333]"
                                onclick={async () => {
                                    latestExecution = {
                                        workflowId: workflow.workflowId,
                                        workflow_id: workflow.workflowId,
                                        status: workflow.status,
                                        current_step: workflow.currentStep,
                                    };
                                    await refreshWorkflowStatus();
                                    startWorkflowPolling();
                                }}
                            >
                                <div class="text-xs font-medium">{workflow.name}</div>
                                <div class="mt-1 break-all text-[11px] text-[#a1a1aa]">
                                    {workflow.workflowId}
                                </div>
                                <div class="mt-1 text-[11px] text-[#71717a]">
                                    {workflow.status} · {workflow.currentStep}
                                </div>
                            </button>
                        {/each}
                    {/if}
                </CardContent>
            </Card>

            <Card class="border-[#1f1f1f] bg-[#111] text-white">
                <CardHeader class="space-y-2">
                    <CardTitle class="text-sm">Recent Logs</CardTitle>
                </CardHeader>
                <CardContent class="space-y-2">
                    {#if relevantRecentLogs.length === 0}
                        <div class="text-xs text-[#a1a1aa]">No recent logs for the current workflow.</div>
                    {:else}
                        {#each relevantRecentLogs as entry}
                            <div class="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-3">
                                <div class="text-[11px] text-[#71717a]">{entry.service} · {entry.level}</div>
                                <div class="mt-1 text-xs text-white">{entry.message}</div>
                            </div>
                        {/each}
                    {/if}
                </CardContent>
            </Card>
        </div>
    </div>
</div>

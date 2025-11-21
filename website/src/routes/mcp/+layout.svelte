<script lang="ts">
	import type { LayoutData } from './$types';

	const { data } = $props<{ data: LayoutData }>();

	const tools = $derived(data.mcp.tools);
	const resources = $derived(data.mcp.resources);
	const ecosystems = $derived(data.mcp.ecosystems);

	let mode = $state<'tools' | 'resources'>('tools');
	let selectedEcosystem = $state('*');
	let verbose = $state(false);

	// Update selectedEcosystem when ecosystems changes
	$effect(() => {
		if (ecosystems.length > 0 && !ecosystems.includes(selectedEcosystem)) {
			selectedEcosystem = ecosystems[0];
		}
	});

	const currentTools = $derived(tools.filter((t: { label: string }) => t.label === selectedEcosystem));
	const currentResources = $derived(resources.filter((r: { label: string }) => r.label === selectedEcosystem));

	function handleEcosystemChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		selectedEcosystem = select.value;
	}

	function toggleVerbose() {
		verbose = !verbose;
	}
</script>

<div class="min-h-screen bg-black text-green-400 font-mono">
	<div class="max-w-6xl mx-auto px-4 py-8 space-y-6">
		<header class="border-b border-green-700 pb-4 mb-4">
			<h1 class="text-2xl tracking-widest uppercase">lovely-docs :: mcp console</h1>
			<p class="text-xs text-green-600 mt-1">Fake MCP interface over static docs. No network. No daemons. Just bits.</p>
		</header>

		<section class="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6">
			<aside class="space-y-4">
				<div class="border border-green-700 bg-black/60 p-3">
					<div class="text-xs text-green-500 mb-1">mode</div>
					<div class="flex gap-2 text-sm">
						<button
							type="button"
							class="px-2 py-1 border border-green-700 bg-black/60 hover:bg-green-900/30 transition {mode === 'tools'
								? 'bg-green-900/40 text-green-200'
								: 'text-green-500'}"
							onclick={() => (mode = 'tools')}>
							$ tools
						</button>
						<button
							type="button"
							class="px-2 py-1 border border-green-700 bg-black/60 hover:bg-green-900/30 transition {mode ===
							'resources'
								? 'bg-green-900/40 text-green-200'
								: 'text-green-500'}"
							onclick={() => (mode = 'resources')}>
							$ resources
						</button>
					</div>
				</div>

				<div class="border border-green-700 bg-black/60 p-3 space-y-2">
					<div class="text-xs text-green-500">ecosystem</div>
					<select
						class="w-full bg-black text-green-400 border border-green-700 text-xs px-1 py-0.5"
						onchange={handleEcosystemChange}>
						{#each ecosystems as eco}
							<option value={eco}>{eco}</option>
						{/each}
					</select>
				</div>

				<div class="border border-green-700 bg-black/60 p-3 flex items-center justify-between text-xs">
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" class="accent-green-500" checked={verbose} onchange={toggleVerbose} />
						<span>verbose</span>
					</label>
					<span class="text-green-600">--detail {verbose ? 'on' : 'off'}</span>
				</div>
			</aside>

			<main class="border border-green-700 bg-black/80 p-4 overflow-auto min-h-[320px]">
				{#if mode === 'tools'}
					<h2 class="text-sm text-green-300 mb-2">$ mcp tools :: listLibraries</h2>
					{#if currentTools.length === 0}
						<p class="text-xs text-green-600"># no tools for this ecosystem</p>
					{:else}
						{#each currentTools as t}
							<div class="mb-4">
								<div class="text-xs text-green-500 mb-1"># ecosystem: {t.label}</div>
								<pre class="text-xs whitespace-pre-wrap">
{verbose ? t.verboseYaml : t.payloadYaml}
								</pre>
							</div>
						{/each}
					{/if}
				{:else}
					<h2 class="text-sm text-green-300 mb-2">$ mcp resources :: doc-index / doc-index-verbose</h2>
					{#if currentResources.length === 0}
						<p class="text-xs text-green-600"># no resources for this ecosystem</p>
					{:else}
						{#each currentResources as r}
							<div class="mb-4">
								<div class="text-xs text-green-500 mb-1"># doc-index :: {r.label}</div>
								<pre class="text-xs whitespace-pre-wrap mb-2">
{r.indexYaml}
								</pre>
								<div class="text-xs text-green-500 mb-1"># doc-index-verbose :: {r.label}</div>
								<pre class="text-xs whitespace-pre-wrap">
{r.verboseYaml}
								</pre>
							</div>
						{/each}
					{/if}
				{/if}
			</main>
		</section>
	</div>
</div>

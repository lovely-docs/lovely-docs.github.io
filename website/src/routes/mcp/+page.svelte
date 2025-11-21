<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import {
		getNodeMarkdown,
		getRelevantEssenceSubTree,
		markdownVariantKeys,
		type MarkdownLevel
	} from 'lovely-docs-mcp/doc-cache';

	const { data } = $props<{ data: PageData }>();
	const libraries = $derived(data.libraries);

	const url = new URL(page.url);
	const searchParams = $derived(new URLSearchParams(url.search));

	const selectedLibrary = $derived(searchParams.get('library') ?? libraries[0]?.key ?? '');
	const op = $derived(searchParams.get('op') ?? 'getNodeMarkdown');
	const path = $derived(searchParams.get('path') ?? '');
	const level = $derived((searchParams.get('level') ?? 'digest') as MarkdownLevel);

	const hasLibrary = $derived(Boolean(selectedLibrary));

	const request = $derived({
		tool: op,
		args: { library: selectedLibrary, path: path || undefined, level }
	});

	const { result, error } = $derived.by(() => {
		if (!hasLibrary) return { result: null, error: 'Library is required' } as const;

		try {
			if (op === 'getNodeMarkdown') {
				const res = getNodeMarkdown(selectedLibrary, path || undefined, level) ?? null;
				return { result: res, error: null } as const;
			}
			if (op === 'getRelevantEssenceSubTree') {
				const res = getRelevantEssenceSubTree(selectedLibrary, path || '');
				return { result: res ?? null, error: null } as const;
			}
			return { result: null, error: `Unknown operation: ${op}` } as const;
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Unknown error';
			return { result: null, error: msg } as const;
		}
	});

	function buildUrl(params: Record<string, string | undefined>): string {
		const url = new URL(page.url);
		Object.entries(params).forEach(([k, v]) => {
			if (v === undefined || v === '') url.searchParams.delete(k);
			else url.searchParams.set(k, v);
		});
		return `${url.pathname}${url.search}`;
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl space-y-6">
	<h1 class="text-3xl font-bold tracking-tight">MCP-style playground</h1>
	<p class="text-sm text-muted-foreground max-w-2xl">
		Interact with the documentation using the same helpers that back the MCP server – no client required. Use the URL to
		describe the call, similar to how an MCP client would.
	</p>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start border rounded-lg p-4 bg-background/60">
		<div class="space-y-4">
			<div class="space-y-1">
				<label class="block text-sm font-medium">Library</label>
				<select
					class="w-full border rounded px-2 py-1 bg-background text-sm"
					on:change={(e) => {
						const value = (e.currentTarget as HTMLSelectElement).value;
						location.href = buildUrl({ library: value });
					}}>
					{#each libraries as lib}
						<option value={lib.key} selected={lib.key === selectedLibrary}>
							{lib.key} – {lib.summary.name}
						</option>
					{/each}
				</select>
			</div>

			<div class="space-y-1">
				<label class="block text-sm font-medium">Operation</label>
				<select
					class="w-full border rounded px-2 py-1 bg-background text-sm"
					on:change={(e) => {
						const value = (e.currentTarget as HTMLSelectElement).value;
						location.href = buildUrl({ library: selectedLibrary, op: value, path, level });
					}}>
					<option value="getNodeMarkdown" selected={op === 'getNodeMarkdown'}> getNodeMarkdown </option>
					<option value="getRelevantEssenceSubTree" selected={op === 'getRelevantEssenceSubTree'}>
						getRelevantEssenceSubTree
					</option>
				</select>
			</div>

			<div class="space-y-1">
				<label class="block text-sm font-medium">Path (optional)</label>
				<input
					value={path}
					placeholder="e.g. api/Client/connect"
					class="w-full border rounded px-2 py-1 bg-background text-sm"
					on:change={(e) => {
						const value = (e.currentTarget as HTMLInputElement).value;
						location.href = buildUrl({ library: selectedLibrary, op, path: value, level });
					}} />
				<p class="text-xs text-muted-foreground">Matches the internal doc tree paths used by the MCP server.</p>
			</div>

			{#if op === 'getNodeMarkdown'}
				<div class="space-y-1">
					<label class="block text-sm font-medium">Markdown level</label>
					<select
						class="bg-black text-green-400 border border-green-700 text-xs px-1 py-0.5 w-full"
						value={level}
						on:change={(e) => {
							const value = (e.target as HTMLSelectElement).value;
							searchParams.set('level', value);
							goto(`?${searchParams.toString()}`, { replaceState: true });
						}}>
						{#each markdownVariantKeys as k}
							<option value={k} selected={level === k}>{k}</option>
						{/each}
					</select>
				</div>
			{/if}

			{#if error}
				<p class="text-xs text-destructive mt-1">{error}</p>
			{/if}
		</div>

		<div class="space-y-4">
			<div class="border rounded-md p-3 bg-muted/40">
				<h2 class="text-sm font-semibold mb-2">Request</h2>
				<pre class="text-xs overflow-x-auto whitespace-pre-wrap">
{JSON.stringify(request, null, 2)}
				</pre>
			</div>

			<div class="border rounded-md p-3 bg-muted/40 min-h-32">
				<h2 class="text-sm font-semibold mb-2">Response</h2>
				{#if result === null || result === undefined}
					<p class="text-xs text-muted-foreground">No result.</p>
				{:else if op === 'getNodeMarkdown' && typeof result === 'string'}
					<pre class="text-xs overflow-x-auto whitespace-pre-wrap">{result}</pre>
				{:else}
					<pre class="text-xs overflow-x-auto whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
				{/if}
			</div>
		</div>
	</div>
</div>

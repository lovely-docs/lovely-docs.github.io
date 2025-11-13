<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Github } from '@lucide/svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import type { LibraryDBItem, DocItem } from 'lovely-docs-mcp/doc-cache';
	import dbg from 'debug';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let { data } = $props();
	let lib: LibraryDBItem = $derived(data.library);
	let debug = $derived(dbg(`app:page:library/${lib.name}`));

	$effect(() => {
		debug({lib});
	});
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<div class="flex items-center justify-between mb-6">
		<a href={resolve('/')} class="text-sm text-muted-foreground hover:text-foreground transition-colors">
			← Back to libraries
		</a>
		<div class="flex items-center gap-2">
			<a href="https://github.com/xl0/lovely-docs" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
				<Button variant="outline" size="icon">
					<Github size={20} />
				</Button>
			</a>
			<ThemeToggle />
		</div>
	</div>

	<h1 class="text-4xl font-bold tracking-tight mb-8">{lib.name}</h1>

	<Card class="mb-8">
		<CardHeader>
			<CardTitle>Source Information</CardTitle>
		</CardHeader>
		<CardContent>
			<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
				{#if lib.source.repo}
					<dt class="font-semibold text-muted-foreground">Repository:</dt>
					<dd class="font-mono text-xs">{lib.source.repo}</dd>
				{/if}
				{#if lib.source.commit}
					<dt class="font-semibold text-muted-foreground">Commit:</dt>
					<dd class="font-mono text-xs">{lib.source.commit}</dd>
				{/if}
				{#if lib.source.doc_dir}
					<dt class="font-semibold text-muted-foreground">Documentation Directory:</dt>
					<dd class="font-mono text-xs">{lib.source.doc_dir}</dd>
				{/if}
			</dl>
		</CardContent>
	</Card>

	<div class="mb-4">
		<h2 class="text-2xl font-semibold mb-2">Documentation Structure</h2>
		<p class="text-sm text-muted-foreground">Click on any item to view its documentation</p>
	</div>
	{#snippet renderTree(node: DocItem, base: string, depth: number = 0)}
		{#each Object.entries(node.children) as [k, child]}
			<div class="relative">
				<a href={resolve(`/${page.params.name}/${base}${k}`)} class="block group">
					<div
						class="flex items-center justify-between py-2 px-3 rounded hover:bg-accent transition-colors"
						style="padding-left: {depth * 1.5 + 0.75}rem">
						<div class="flex items-center gap-2 flex-1">
							<span class="text-muted-foreground text-xs">
								{#if depth > 0}
									{#each Array(depth) as _}
										<span class="inline-block w-4"></span>
									{/each}
									└─
								{/if}
							</span>
							<span class="font-mono text-sm">{child.displayName}</span>
						</div>
						<Badge variant={child.relevant ? 'default' : 'secondary'} class="ml-2">
							{child.relevant ? '✓ Relevant' : 'Not relevant'}
						</Badge>
					</div>
				</a>
				{#if Object.keys(child.children).length}
					{@render renderTree(child, base + "/" + k + "/", depth + 1)}
				{/if}
			</div>
		{/each}
	{/snippet}
	<Card>
		<CardContent class="p-4">
			{@render renderTree(lib.tree, "")}
		</CardContent>
	</Card>
</div>

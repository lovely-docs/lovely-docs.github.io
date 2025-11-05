<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import type { TreeNode } from 'lovely-docs-mcp/doc-cache';
	import dbg from 'debug';
	import { resolve } from '$app/paths';

	const debug = dbg('app:page:library');

	let { data } = $props();
	const { library } = data;
	debug(library);

	const tree = library.tree as TreeNode;
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<div class="flex items-center justify-between mb-6">
		<a href={resolve('/')} class="text-sm text-muted-foreground hover:text-foreground transition-colors">
			← Back to libraries
		</a>
		<ThemeToggle />
	</div>

	<h1 class="text-4xl font-bold tracking-tight mb-8">{library.library}</h1>

	<Card class="mb-8">
		<CardHeader>
			<CardTitle>Source Information</CardTitle>
		</CardHeader>
		<CardContent>
			<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
				{#if library.source.repo}
					<dt class="font-semibold text-muted-foreground">Repository:</dt>
					<dd class="font-mono text-xs">{library.source.repo}</dd>
				{/if}
				{#if library.source.commit}
					<dt class="font-semibold text-muted-foreground">Commit:</dt>
					<dd class="font-mono text-xs">{library.source.commit}</dd>
				{/if}
				{#if library.source.doc_dir}
					<dt class="font-semibold text-muted-foreground">Documentation Directory:</dt>
					<dd class="font-mono text-xs">{library.source.doc_dir}</dd>
				{/if}
			</dl>
		</CardContent>
	</Card>

	<div class="mb-4">
		<h2 class="text-2xl font-semibold mb-2">Documentation Structure</h2>
		<p class="text-sm text-muted-foreground">Click on any item to view its documentation</p>
	</div>

	{#snippet renderTree(node: TreeNode, depth: number = 0)}
		{#each node.children.values() as child}
			<div class="relative">
				{#if child.children.size === 0}
					<a href={resolve(`/library/${library.library}/${child.path}`)} class="block group">
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
								<span class="font-mono text-sm">{child.name}</span>
							</div>
							<Badge variant={child.data?.relevant ? 'default' : 'secondary'} class="ml-2">
								{child.data?.relevant ? '✓ Relevant' : 'Not relevant'}
							</Badge>
						</div>
					</a>
				{:else}
					{#if child.data}
						<a href={resolve(`/library/${library.library}/${child.path}`)} class="block group">
							<div
								class="flex items-center justify-between py-2 px-3 rounded hover:bg-accent transition-colors font-medium"
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
									<span class="font-mono text-sm">{child.name}/</span>
								</div>
								<Badge variant={child.data.relevant ? 'default' : 'secondary'} class="ml-2">
									{child.data.relevant ? '✓ Relevant' : 'Not relevant'}
								</Badge>
							</div>
						</a>
					{:else}
						<div class="py-2 px-3 font-medium text-sm" style="padding-left: {depth * 1.5 + 0.75}rem">
							<span class="text-muted-foreground text-xs">
								{#if depth > 0}
									{#each Array(depth) as _}
										<span class="inline-block w-4"></span>
									{/each}
									└─
								{/if}
							</span>
							<span class="font-mono">{child.name}/</span>
						</div>
					{/if}
					{@render renderTree(child, depth + 1)}
				{/if}
			</div>
		{/each}
	{/snippet}

	<Card>
		<CardContent class="p-4">
			{@render renderTree(tree)}
		</CardContent>
	</Card>
</div>

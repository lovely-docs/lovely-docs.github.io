<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Markdown from '$lib/components/Markdown.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Github } from '@lucide/svelte';
	import dbg from 'debug';

	let { data } = $props();
	let lib = $derived(data.library);
	let debug = $derived(dbg(`app:page:library/${lib.name}/${page.params.path}`));

	let pathSegments = $derived((page.params.path ?? '').split('/').filter(Boolean));

	let breadcrumbs = $derived(
		pathSegments.map((segment, i) => ({
			name: segment,
			href: `${page.params.name}/${pathSegments.slice(0, i + 1).join('/')}`,
			isLast: i === pathSegments.length - 1
		}))
	);

	let item = $derived.by(() => {
		let current = lib.tree;

		for (const p of pathSegments) {
			const child = current.children[p];
			debug({ current, p, child });
			if (!child) return undefined;
			current = child;
		}
		return current;
	});

	$effect(() => {
		debug({ lib, item });
	});

	type MarkdownVariant = 'fulltext' | 'digest' | 'short_digest' | 'essence';

	const variantLabels: Record<MarkdownVariant, string> = {
		fulltext: 'Full Text',
		digest: 'Digest',
		short_digest: 'Short Digest',
		essence: 'Essence'
	};

	// Get available variants from actual markdown data (excluding essence)
	const availableVariants = $derived.by(() => {
		if (item) {
			return (Object.keys(item.markdown) as MarkdownVariant[]).filter(
				(variant) => item.markdown[variant] && variant !== 'essence'
			);
		}
		return undefined;
	});

	// Initialize from hash or default to essence
	let selectedVariant = $state<MarkdownVariant>(
		(typeof window !== 'undefined' && (window.location.hash.slice(1) as MarkdownVariant)) || 'digest'
	);

	let showRaw = $state(false);

	// Update hash when variant changes
	function selectVariant(variant: MarkdownVariant) {
		selectedVariant = variant;
		if (typeof window !== 'undefined') {
			window.location.hash = variant;
		}
	}

	// Listen to hash changes
	$effect(() => {
		if (typeof window === 'undefined') return;

		const handleHashChange = () => {
			const hash = window.location.hash.slice(1) as MarkdownVariant;
			if (hash && availableVariants?.includes(hash)) {
				selectedVariant = hash;
			}
		};

		window.addEventListener('hashchange', handleHashChange);
		return () => window.removeEventListener('hashchange', handleHashChange);
	});
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<div class="flex items-center justify-between mb-6">
		<nav class="flex items-center gap-2 text-sm text-muted-foreground">
			<a href={resolve('/')} class="hover:text-foreground transition-colors">Home</a>
			<span>/</span>
			<a href={resolve(`/${page.params.name}`)} class="hover:text-foreground transition-colors">{lib.name}</a>
			{#each breadcrumbs as crumb}
				<span>/</span>
				{#if crumb.isLast}
					<span class="text-foreground">{crumb.name}</span>
				{:else}
					<a href={resolve(`/${crumb.href}`)} class="hover:text-foreground transition-colors">
						{crumb.name}
					</a>
				{/if}
			{/each}
		</nav>
		<div class="flex items-center gap-2">
			<a href="https://github.com/xl0/lovely-docs" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
				<Button variant="outline" size="icon">
					<Github size={20} />
				</Button>
			</a>
			<ThemeToggle />
		</div>
	</div>

	{#if item}
		<div class="mb-6">
			<div class="flex items-center justify-between mb-2">
				<h1 class="text-3xl font-bold tracking-tight">
					{item.displayName}
				</h1>
				<Badge variant={item.relevant ? 'default' : 'secondary'}>
					{item.relevant ? '✓ Relevant' : 'Not relevant'}
				</Badge>
			</div>
			<p class="text-sm text-muted-foreground font-mono">
				Source: {item.origPath}
			</p>
			{#if item?.markdown?.essence}
				<div class="mt-3 text-sm text-muted-foreground italic border-l-2 border-muted pl-3">
					{item.markdown.essence}
				</div>
			{/if}
		</div>

		<Card class="mb-6">
			<CardContent>
				<div class="flex items-center justify-between gap-4">
					<div class="flex flex-wrap gap-2">
						{#each availableVariants as variant}
							<Button
								variant={selectedVariant === variant ? 'default' : 'outline'}
								size="sm"
								onclick={() => selectVariant(variant)}>
								{variantLabels[variant]}
								{#if item.token_counts}
									{#if variant === 'fulltext' && item.token_counts.fulltext}
										<span class="ml-1 text-xs opacity-70">
											({item.token_counts.fulltext.toLocaleString()} tok)
										</span>
									{:else if variant === 'digest' && item.token_counts.digest && item.token_counts.fulltext}
										<span class="ml-1 text-xs opacity-70">
											({Math.round((item.token_counts.digest / item.token_counts.fulltext) * 100)}%)
										</span>
									{:else if variant === 'short_digest' && item.token_counts.short_digest && item.token_counts.fulltext}
										<span class="ml-1 text-xs opacity-70">
											({Math.round((item.token_counts.short_digest / item.token_counts.fulltext) * 100)}%)
										</span>
									{/if}
								{/if}
							</Button>
						{/each}
					</div>
					<Button variant={showRaw ? 'default' : 'outline'} size="sm" onclick={() => (showRaw = !showRaw)}>
						{showRaw ? 'Raw' : 'Markdown'}
					</Button>
				</div>
			</CardContent>
		</Card>

		<Card>
		<CardContent class="pt-6">
			{#if item.markdown[selectedVariant]}
				{#if showRaw}
					<pre class="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg overflow-auto">{item.markdown[
							selectedVariant
						]}</pre>
				{:else}
					<Markdown content={item.markdown[selectedVariant]!} />
				{/if}
			{:else}
				<div class="rounded-lg bg-destructive/10 p-4 text-destructive">
					<p class="font-semibold">Variant not available</p>
					<p class="text-sm mt-1">{variantLabels[selectedVariant]} is not available for this document.</p>
				</div>
			{/if}
		</CardContent>
	</Card>
	{/if}
</div>

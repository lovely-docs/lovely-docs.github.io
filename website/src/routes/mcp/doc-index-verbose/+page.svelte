<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const { data } = $props();

	const ecosystem = $derived(page.url.hash.slice(1));
	const activeResource = $derived(data.mcp.resources.find((r) => (r.label === page.url.hash.slice(1)) || !ecosystem));
</script>

{#if activeResource}
	<div class="font-mono text-sm whitespace-pre-wrap">
			{#each Object.entries(activeResource.verbose) as [lib, summary]}
				<button
					class="block w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors"
					onclick={() => {
						goto(resolve(`/mcp/page-index/${lib}`));
					}}>
					{lib}<span class="text-muted-foreground">: {summary}</span>
				</button>
			{/each}
	</div>
{:else}
	<p class="text-xs text-muted-foreground"># no resources for ecosystem {ecosystem??'*'}</p>
{/if}

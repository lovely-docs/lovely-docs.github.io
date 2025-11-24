<script lang="ts">
	import { resolve } from '$app/paths';
	import { BookOpen, Bot } from '@lucide/svelte';
</script>

<div class="min-h-[80vh] flex flex-col items-center justify-center p-4 space-y-12">
	<div class="text-center space-y-4">
		<h1
			class="text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
			Lovely Docs
		</h1>
		<p class="text-xl text-muted-foreground max-w-[600px]">
			Documentation optimized for both biological and artificial intelligence.
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
		<a href={resolve('/human')} class="group">
			<div
				class="h-full p-8 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-300 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md hover:scale-[1.02]">
				<div
					class="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
					<BookOpen size={32} />
				</div>
				<div class="space-y-2">
					<h2 class="text-2xl font-semibold">Human View</h2>
					<p class="text-muted-foreground">Explore Lovely Docs</p>
				</div>
			</div>
		</a>

		<a href={resolve('/mcp')} class="group">
			<div
				class="h-full p-8 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-300 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md hover:scale-[1.02]">
				<div
					class="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
					<Bot size={32} />
				</div>
				<div class="space-y-2">
					<h2 class="text-2xl font-semibold">Agent View</h2>
					<p class="text-muted-foreground">Explore through the eyes of an AI Agent</p>
				</div>
			</div>
		</a>
	</div>
</div>

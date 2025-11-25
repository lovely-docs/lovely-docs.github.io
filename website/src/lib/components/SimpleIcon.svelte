<script lang="ts">
	import type { SimpleIcon } from 'simple-icons';

	type Props = {
		icon: SimpleIcon;
		class?: string;
		size?: number;
	};

	let { icon, class: className, size = 24 }: Props = $props();
</script>

<svg
	role="img"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
	fill="currentColor"
	class={className}
	width={size}
	height={size}>
	<title>{icon.title}</title>
	<path d={icon.path} />
</svg>

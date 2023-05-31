<script lang="ts" context="module">
  import type { SvelteHTMLElements } from 'svelte/elements';

  type HomeProps = SvelteHTMLElements['svg'];
</script>

<script lang="ts">
  type $$Props = HomeProps;

  export let className: $$Props['class'] = '';
  export let width: $$Props['width'] = 24;
  export let height: $$Props['height'] = 24;
  export let fill: $$Props['fill'] = 'currentColor';
  export let viewBox: $$Props['viewBox'] = '0 0 24 24';
  export let xmlns: $$Props['xmlns'] = 'http://www.w3.org/2000/svg';
</script>

<svg class={className} {width} {height} {fill} {viewBox} {xmlns} {...$$restProps}>
  <title>Home</title>
  <path
    fill="currentColor"
    d="M12 2a1 1 0 00-.71.297l-10.087 8.8A.5.5 0 001 11.5a.5.5 0 00.5.5H4v8a1 1 0 001 1h4a1 1 0 001-1v-6h4v6a1 1 0 001 1h4a1 1 0 001-1v-8h2.5a.5.5 0 00.5-.5.5.5 0 00-.203-.402l-10.08-8.795a1 1 0 00-.006-.006A1 1 0 0012 2z"
  />
</svg>

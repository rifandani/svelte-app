<script lang="ts" context="module">
  import type { SvelteHTMLElements } from 'svelte/elements';

  type ErrorProps = SvelteHTMLElements['svg'] & {
    strokeWidthPath?: SvelteHTMLElements['path']['stroke-width'];
  };
</script>

<script lang="ts">
  type $$Props = ErrorProps;

  export let width: $$Props['width'] = 16;
  export let height: $$Props['height'] = 16;
  export let fill: $$Props['fill'] = 'currentColor';
  export let viewBox: $$Props['viewBox'] = '0 0 16 16';
  export let xmlns: $$Props['xmlns'] = 'http://www.w3.org/2000/svg';
  export let strokeWidthPath: $$Props['strokeWidthPath'] = '2';
</script>

<svg {width} {height} {viewBox} {fill} {xmlns} {...$$restProps}>
  <title>Error</title>
  <path
    stroke-width={strokeWidthPath}
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
  />
</svg>

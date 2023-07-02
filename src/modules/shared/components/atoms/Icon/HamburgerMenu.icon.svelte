<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements';
  import type { SvgProps } from '../../../types/element.type';

  type $$Props = SvgProps & {
    strokeWidthPath?: SvelteHTMLElements['path']['stroke-width'];
  };

  export let width: $$Props['width'] = 24;
  export let height: $$Props['height'] = 24;
  export let viewBox: $$Props['viewBox'] = '0 0 24 24';
  export let fill: $$Props['fill'] = 'currentColor';
  export let xmlns: $$Props['xmlns'] = 'http://www.w3.org/2000/svg';
  export let strokeWidthPath: $$Props['strokeWidthPath'] = '2';
</script>

<svg {width} {height} {viewBox} {fill} {xmlns} {...$$restProps}>
  <title>HamburgerMenu</title>
  <path
    stroke-width={strokeWidthPath}
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M4 6h16M4 12h16M4 18h16"
  />
</svg>

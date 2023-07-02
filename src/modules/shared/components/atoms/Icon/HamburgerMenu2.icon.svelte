<script lang="ts">
  import type { SvgProps } from '../../../types/element.type';

  type $$Props = SvgProps;

  export let width: $$Props['width'] = 16;
  export let height: $$Props['height'] = 16;
  export let viewBox: $$Props['viewBox'] = '0 0 16 16';
  export let fill: $$Props['fill'] = 'currentColor';
  export let xmlns: $$Props['xmlns'] = 'http://www.w3.org/2000/svg';
</script>

<svg {width} {height} {viewBox} {fill} {xmlns} {...$$restProps}>
  <title>HamburgerMenu2</title>
  <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
</svg>

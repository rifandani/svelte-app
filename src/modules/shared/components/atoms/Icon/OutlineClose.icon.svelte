<script lang="ts">
  import type { SvgProps } from '../../../types/element.type';

  type $$Props = SvgProps;

  export let width: $$Props['width'] = 24;
  export let height: $$Props['height'] = 24;
  export let viewBox: $$Props['viewBox'] = '0 0 24 24';
  export let fill: $$Props['fill'] = 'currentColor';
</script>

<svg {width} {height} {viewBox} {fill} {...$$restProps}>
  <title>OutlineClose</title>
  <path
    fill="currentColor"
    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
  />
</svg>

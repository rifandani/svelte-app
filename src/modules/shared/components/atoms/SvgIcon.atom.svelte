<script lang="ts">
  import type { SvgProps } from '@shared/types/element.type';

  type $$Props = SvgProps & {
    id: 'icon-svelte';
  };

  export let id: $$Props['id'];
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  aria-hidden="true"
  role="img"
  {...$$restProps}
>
  <use href={`#${id}`} />
</svg>

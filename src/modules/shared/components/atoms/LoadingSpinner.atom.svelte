<script lang="ts" context="module">
  import type { SpinnerProps } from './Icon/Spinner.icon.svelte';

  export type LoadingSpinnerProps = SpinnerProps & {
    className?: string;
  };
</script>

<script lang="ts">
  import { Icon } from '.';
  import { cn } from '../../utils/helper.util';

  type $$Props = LoadingSpinnerProps;

  export let className: $$Props['className'] = '';
</script>

<div class={cn(['inline-block h-16 w-16 animate-spin', className])}>
  <Icon.Spinner {...$$restProps} />
</div>

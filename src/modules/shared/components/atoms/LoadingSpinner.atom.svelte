<script lang="ts" context="module">
  import type { SpinnerProps } from './Icon/Spinner.icon.svelte';

  export type LoadingSpinnerProps = SpinnerProps & {
    className?: string;
  };
</script>

<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import { Icon } from '.';

  type $$Props = LoadingSpinnerProps;

  export let className: $$Props['className'] = '';
</script>

<div class={twMerge(['inline-block h-16 w-16 animate-spin', className])}>
  <Icon.Spinner {...$$restProps} />
</div>

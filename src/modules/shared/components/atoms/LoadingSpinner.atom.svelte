<script lang="ts">
  import { Icon } from '.';
  import { cn } from '../../utils/helper.util';

  export let className = '';
  export let stroke = '#8b5cf6';
</script>

<div class={cn(['inline-block h-16 w-16 animate-spin', className])}>
  <Icon.Spinner {stroke} />
</div>

<script>
  import { Icon } from '..';
  import { cn } from '../../../utils/global.util';

  export let className = '';
</script>

<div class={cn(['inline-block h-16 w-16 animate-spin', className])}>
  <Icon.Spinner />
</div>

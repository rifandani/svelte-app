<script lang="ts">
  import { fly, scale } from 'svelte/transition';
  import { createToast } from '../../stores/createToast.store';

  const { toasts, toaster, useToast, rootAttrs, groupAttrs, progress } = createToast();
</script>

<section class="toast z-20 w-96" {...$groupAttrs}>
  {#each $toasts as toast (toast.id)}
    <div
      class="alert alert-{toast.type} relative overflow-hidden shadow-lg"
      in:fly={{ y: 500 }}
      out:scale={{ duration: 500 }}
      use:useToast={toast}
      {...$rootAttrs(toast)}
    >
      <div>
        <h3 class="font-bold">{toast.title}</h3>
        {#if toast.description}
          <div class="text-xs">{toast.description}</div>
        {/if}

        {#if isFinite(toast.duration)}
          <progress
            class="progress progress-{toast.type} absolute bottom-0 left-0 right-0 w-full"
            value={$progress(toast)}
            max={toast.duration}
          />
        {/if}
      </div>

      <div class="flex-none">
        <button class="btn btn-sm" on:click={() => toaster.dismiss(toast.id)}>❌</button>
      </div>
    </div>
  {/each}
</section>

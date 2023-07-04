<script lang="ts">
  import Icon from '@iconify/svelte';
  import { fly, scale } from 'svelte/transition';
  import { twMerge } from 'tailwind-merge';
  import { createToast } from '../../stores/createToast.store';

  const { toasts, toaster, useToast, rootAttrs, groupAttrs, progress } = createToast();
</script>

<section class="toast z-20" {...$groupAttrs}>
  {#each $toasts as toast (toast.id)}
    <div
      class={`alert alert-${toast.type} relative block overflow-hidden p-0 shadow-lg min-w-[20rem] max-w-[20rem]`}
      in:fly={{ y: 500 }}
      out:scale={{ duration: 500 }}
      use:useToast={toast}
      {...$rootAttrs(toast)}
    >
      <div class={twMerge(['flex items-center justify-between p-3', !toast.description && 'pb-5'])}>
        <h3 class={`font-bold text-${toast.type}-content`}>{toast.title}</h3>

        <button class="btn btn-xs btn-ghost" on:click={() => toaster.dismiss(toast.id)}>
          <Icon icon="lucide:x" height="1.5em" />
        </button>
      </div>

      {#if toast.description}
        <p class="line-clamp-3 max-w-[90%] whitespace-pre-wrap break-words px-3 pb-5 text-sm">
          {toast.description}
        </p>
      {/if}

      {#if isFinite(toast.duration)}
        <progress
          class={`progress progress-${toast.type} absolute bottom-0`}
          value={$progress(toast)}
          max={toast.duration}
        />
      {/if}
    </div>
  {/each}
</section>

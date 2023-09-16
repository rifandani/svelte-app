<script lang="ts">
  import Icon from '@iconify/svelte';
  import { createToast } from '@shared/stores/createToast.store';
  import { fly, scale } from 'svelte/transition';
  import { twJoin } from 'tailwind-merge';

  const { toasts, toaster, useToast, rootAttrs, groupAttrs, progress } = createToast();
  const mapper = {
    text: {
      success: 'text-success',
      error: 'text-error',
      info: 'text-info',
      warning: 'text-warning',
      loading: 'text-primary',
      custom: '',
    },
    progress: {
      success: 'progress-success',
      error: 'progress-error',
      info: 'progress-info',
      warning: 'progress-warning',
      loading: 'progress-primary',
      custom: '',
    },
  };
</script>

<section class="toast z-20" {...$groupAttrs}>
  {#each $toasts as toast (toast.id)}
    <div
      class="alert relative block min-w-[20rem] max-w-[20rem] overflow-hidden p-0 shadow-lg"
      in:fly={{ y: 500 }}
      out:scale={{ duration: 500 }}
      use:useToast={toast}
      {...$rootAttrs(toast)}
    >
      <div
        class={twJoin(
          'flex items-center justify-between text-ellipsis p-3',
          !toast.description && 'pb-5',
        )}
      >
        <h3 class={twJoin(`font-bold`, mapper.text[toast.type])}>
          {toast.title}
        </h3>

        <button class="btn btn-xs btn-ghost" on:click={() => toaster.dismiss(toast.id)}>
          <Icon icon="lucide:x" height="1.5em" />
        </button>
      </div>

      {#if toast.description}
        <p
          class={twJoin(
            'line-clamp-3 max-w-[90%] whitespace-pre-wrap break-words px-3 pb-5 text-sm',
            mapper.text[toast.type],
          )}
        >
          {toast.description}
        </p>
      {/if}

      {#if isFinite(toast.duration)}
        <progress
          class={twJoin('progress absolute bottom-0 left-0', mapper.progress[toast.type])}
          value={$progress(toast)}
          max={toast.duration}
        />
      {/if}
    </div>
  {/each}
</section>

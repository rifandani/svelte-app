<script lang="ts">
  import { createPagination } from '../../stores/createPagination.action';

  const { navAttrs, items, pageAttrs, page, start, end, total } = createPagination({ total: 69 });
</script>

<nav {...$navAttrs}>
  <div class="join">
    {#each $items as item}
      <button
        {...$pageAttrs(item)}
        class="join-item btn"
        class:btn-active={item.selected}
        on:click={() => ($page = item.page || $page)}
      >
        {#if item.type === 'page'}
          {item.page}
        {:else if item.type === 'ellipsis-start' || item.type === 'ellipsis-end'}
          ...
        {:else}
          {item.type}
        {/if}
      </button>
    {/each}
  </div>
</nav>

<div>{$start} - {$end} of {$total}</div>

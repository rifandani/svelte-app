<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import LL from '../../../../i18n/i18n-svelte';
  import { LoadingSpinner } from '../../../shared/components/atoms';
  import { createTodoListQuery } from '../../stores/createTodoListQuery.store';
  import TodosItem from '../TodosItem/TodosItem.svelte';

  //#region VALUES
  const { queryOptions } = createTodoListQuery();
  $: todosQuery = createQuery($queryOptions);
  //#endregion
</script>

{#if $todosQuery.isLoading}
  <div class="flex items-center justify-center py-5">
    <LoadingSpinner stroke="currentColor" />
  </div>
{/if}

{#if $todosQuery.isError}
  <div class="alert alert-error mt-2 shadow-lg">
    <div class="flex items-center">
      <span>{$LL.common.error({ module: 'Todos' })}:</span>
      <pre>{JSON.stringify($todosQuery.error, null, 2)}</pre>
    </div>
  </div>
{/if}

{#if $todosQuery.isSuccess}
  {#each $todosQuery.data.todos as todo (todo.id)}
    <TodosItem {todo} />
  {:else}
    <p class="flex items-center justify-center py-5">{$LL.common.empty()}</p>
  {/each}
{/if}

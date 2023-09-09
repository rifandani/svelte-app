<script lang="ts">
  import LL from '@i18n/i18n-svelte';
  import Icon from '@iconify/svelte';
  import { createQuery } from '@tanstack/svelte-query';
  import { todoApi } from '@todo/api/todo.api';
  import TodosItem from '@todo/components/TodosItem/TodosItem.svelte';
  import { createTodoListParams } from '@todo/stores/createTodoListParams.store';

  //#region VALUES
  const { queryKey } = createTodoListParams();
  $: todosQuery = createQuery({
    queryKey: $queryKey,
    queryFn: ({ queryKey }) => todoApi.list(queryKey[2]),
  });
  //#endregion
</script>

{#if $todosQuery.isLoading}
  <div data-testid="list-loading" class="flex items-center justify-center py-5">
    <Icon icon="svg-spinners:3-dots-fade" height="5em" class="text-primary-content" />
  </div>
{/if}

{#if $todosQuery.isError}
  <div data-testid="list-error" class="alert alert-error mt-2 shadow-lg">
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
    <p data-testid="list-empty" class="flex items-center justify-center py-5">
      {$LL.common.empty()}
    </p>
  {/each}
{/if}

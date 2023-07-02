<script lang="ts">
  import { push } from 'svelte-spa-router';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import LL from '../../../../i18n/i18n-svelte';
  import { limits } from '../../pages/Todos/Todos.page.svelte';
  import { createTodoListReadable } from '../../stores/createTodoListReadable.store';

  //#region VALUES
  const { searchParams, queryParams } = createTodoListReadable();
  $: selectedOption = $queryParams.limit.toString();
  //#endregion

  //#region HANDLERS
  const onChangeLimit: HTMLSelectAttributes['on:change'] = async ({ currentTarget }) => {
    // set to url params
    $searchParams.set('limit', currentTarget.value);
    await push(`/todos?${$searchParams.toString()}`);
  };
  //#endregion
</script>

<form data-testid="form" class="mb-3 flex w-full flex-col duration-300 md:flex-row md:space-x-2">
  <label data-testid="label-limit" for="limit" class="label">
    <span class="label-text text-primary-content">{$LL.forms.limit()}</span>
  </label>

  <select
    data-testid="select-limit"
    class="select-bordered select select-secondary"
    name="limit"
    id="limit"
    value={selectedOption}
    on:change={onChangeLimit}
  >
    {#each limits as limit (limit)}
      <option
        data-testid={`option-limit-${limit}`}
        value={limit}
        selected={limit === selectedOption}>{limit}</option
      >
    {:else}
      <p class="flex w-full items-center justify-center py-5">{$LL.common.empty()}</p>
    {/each}
  </select>
</form>

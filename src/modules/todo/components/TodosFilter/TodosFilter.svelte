<script lang="ts">
  import LL from '@i18n/i18n-svelte';
  import { limits } from '@todo/pages/Todos/Todos.page.svelte';
  import { createTodoListParams } from '@todo/stores/createTodoListParams.store';
  import { push } from 'svelte-spa-router';
  import type { HTMLSelectAttributes } from 'svelte/elements';

  //#region VALUES
  const { searchParams, queryParams } = createTodoListParams();
  $: selectedOption = $queryParams.limit?.toString();
  //#endregion

  //#region HANDLERS
  const onChangeLimit: HTMLSelectAttributes['on:change'] = async ({ currentTarget }) => {
    // set to url params
    $searchParams.set('limit', currentTarget.value);
    await push(`/todos?${$searchParams.toString()}`);
  };
  //#endregion
</script>

<form
  aria-label="form-filter"
  class="mb-3 flex w-full flex-col duration-300 md:flex-row md:space-x-2"
>
  <label for="limit" class="label">
    <span class="label-text text-primary-content">{$LL.forms.limit()}</span>
  </label>

  <select
    aria-label="combobox-filter"
    class="select-bordered select select-secondary"
    name="limit"
    id="limit"
    value={selectedOption}
    on:change={onChangeLimit}
  >
    {#each limits as limit (limit)}
      <option
        data-testid={`filter-option-${limit}`}
        value={limit}
        selected={limit === selectedOption}>{limit}</option
      >
    {/each}
  </select>
</form>

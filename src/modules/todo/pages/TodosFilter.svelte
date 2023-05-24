<script lang="ts">
  import { push, querystring } from 'svelte-spa-router';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import { defaultLimit } from './Todos.page.svelte';

  $: searchParams = new URLSearchParams(`?${$querystring}`);
  $: queryParams = Object.fromEntries(searchParams);

  const onChangeLimit: HTMLSelectAttributes['on:change'] = async ({ currentTarget }) => {
    // set to url params
    searchParams.set('limit', currentTarget.value);
    await push(`/todos?${searchParams.toString()}`);
  };
</script>

<form class="mb-3 flex w-full flex-col duration-300 md:flex-row md:space-x-2">
  <label for="limit" class="label">
    <span class="label-text">Limit</span>
  </label>

  <select
    value={queryParams?.limit ?? defaultLimit}
    on:change={onChangeLimit}
    class="select-bordered select select-md"
    name="limit"
    id="limit"
  >
    <option value="10">10</option>
    <option value="20">20</option>
    <option value="30">30</option>
  </select>
</form>

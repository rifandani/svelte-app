<script lang="ts" context="module">
  // Code contained inside it will run once, when the module first evaluates, rather than when a component is instantiated.
  export const defaultLimit = '10';
  export const limits = ['10', '25', '50', '100'] as const;
</script>

<script lang="ts">
  import LL from '@i18n/i18n-svelte';
  import { Navbar } from '@shared/components/organisms';
  import TodosCreate from '@todo/components/TodosCreate/TodosCreate.svelte';
  import TodosFilter from '@todo/components/TodosFilter/TodosFilter.svelte';
  import TodosList from '@todo/components/TodosList/TodosList.svelte';
</script>

<Navbar>
  <main
    class="flex flex-col items-center justify-center px-10 py-20 duration-300 md:px-24 lg:px-40 xl:px-52"
  >
    <h1 class="mb-10 text-2xl font-semibold tracking-wider">
      {$LL.common.list('Todo')}
    </h1>

    <section class="card bg-base-200 w-full p-5 shadow-lg">
      <TodosCreate />

      <TodosFilter />

      <TodosList />
    </section>
  </main>
</Navbar>

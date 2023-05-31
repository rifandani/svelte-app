<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { HTMLFormAttributes } from 'svelte/elements';
  import { fly } from 'svelte/transition';
  import LL from '../../../../i18n/i18n-svelte';
  import type { LoginApiResponseSchema } from '../../../auth/api/auth.schema';
  import { useLocalStorage } from '../../../shared/hooks/useLocalStorage.hook';
  import type { TodoSchema } from '../../api/todo.schema';

  export let todo: TodoSchema;
  export let onDeleteTodo: HTMLFormAttributes['on:submit'];

  //#region VALUES
  // event forwarding
  const dispatch = createEventDispatcher<{ changeTodo: TodoSchema }>();

  const { store: user } = useLocalStorage<LoginApiResponseSchema>('user');
  //#endregion

  //#region HANDLERS
  const onChangeTodo = () => {
    dispatch('changeTodo', todo);
  };
  //#endregion
</script>

<form
  transition:fly={{ y: 10, duration: 1000 }}
  class="mb-2 flex items-center justify-between"
  on:submit|preventDefault={onDeleteTodo}
>
  <input value={todo.id} type="hidden" name="todoId" id="todoId" />

  <input
    on:change={onChangeTodo}
    checked={todo.completed}
    name={`todo-${todo.id}`}
    id={`todo-${todo.id}`}
    class="checkbox-accent checkbox"
    type="checkbox"
  />

  <p
    class="text-secondary-content ml-5 w-full text-left text-lg"
    class:line-through={todo.completed}
  >
    {todo.todo}
  </p>

  {#if todo.userId === $user.id}
    <button class="btn-accent btn-sm btn normal-case" type="submit"
      >{$LL.forms.remove({ icon: '💥' })}</button
    >
  {/if}
</form>

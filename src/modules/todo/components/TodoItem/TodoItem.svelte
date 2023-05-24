<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { HTMLFormAttributes } from 'svelte/elements';
  import type { LoginApiResponseSchema } from '../../../auth/models/Auth.model';
  import { useLocalStorage } from '../../../shared/hooks/useLocalStorage.hook';
  import type { TodoSchema } from '../../models/Todo.model';

  export let todo: TodoSchema;
  export let onDeleteTodo: HTMLFormAttributes['on:submit'];

  // event forwarding
  const dispatch = createEventDispatcher<{ changeTodo: TodoSchema }>();

  const { store: user } = useLocalStorage<LoginApiResponseSchema>('user');

  const onChangeTodo = () => {
    dispatch('changeTodo', todo);
  };
</script>

<form class="mb-2 flex items-center justify-between" on:submit|preventDefault={onDeleteTodo}>
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
    <button class="btn-accent btn-sm btn normal-case" type="submit"> Remove 💥 </button>
  {/if}
</form>

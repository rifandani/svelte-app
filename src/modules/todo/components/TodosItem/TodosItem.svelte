<script lang="ts">
  import { link } from 'svelte-spa-router';
  import type { HTMLFormAttributes, HTMLInputAttributes } from 'svelte/elements';
  import { fly } from 'svelte/transition';
  import LL from '../../../../i18n/i18n-svelte';
  import type { LoginApiResponseSchema } from '../../../auth/api/auth.schema';
  import { createLocalStorage } from '../../../shared/stores/createLocalStorage.store';
  import type { TodoSchema } from '../../api/todo.schema';
  import { createTodoDeleteMutation } from '../../stores/createTodoDeleteMutation.store';
  import { createTodoListQuery } from '../../stores/createTodoListQuery.store';
  import { createTodoUpdateMutation } from '../../stores/createTodoUpdateMutation.store';

  //#region VALUES
  export let todo: TodoSchema;

  const { queryOptions } = createTodoListQuery();
  const { store: user } = createLocalStorage<LoginApiResponseSchema>('user');
  const todoUpdateMutation = createTodoUpdateMutation({ queryKey: $queryOptions.queryKey });
  const todoDeleteMutation = createTodoDeleteMutation({ queryKey: $queryOptions.queryKey });
  //#endregion

  //#region HANDLERS
  const onChangeTodo: HTMLInputAttributes['on:change'] = () => {
    $todoUpdateMutation.mutate({ ...todo, completed: !todo.completed });
  };

  const onDeleteTodo: HTMLFormAttributes['on:submit'] = (ev) => {
    // don't allow if not the correct auth user
    if (todo.userId !== $user.id) return;

    // parse form data & get todo id from input hidden with name/id `todoId`
    const formData = new FormData(ev.currentTarget);
    const { todoId } = Object.fromEntries(formData.entries());

    $todoDeleteMutation.mutate(Number(todoId));
  };
  //#endregion
</script>

<form
  data-testid="form"
  class="mb-2 flex items-center justify-between"
  transition:fly={{ y: 10, duration: 1000 }}
  on:submit|preventDefault={onDeleteTodo}
>
  <input data-testid="input-todoId" value={todo.id} type="hidden" name="todoId" id="todoId" />

  <input
    data-testid="input-todo"
    class="checkbox-accent checkbox"
    type="checkbox"
    id={`todo-${todo.id}`}
    name={`todo-${todo.id}`}
    checked={todo.completed}
    on:change={onChangeTodo}
  />

  <a
    use:link
    data-testid="p-todo"
    href={`/todos/${todo.id}`}
    class="ml-5 w-full text-left text-lg text-secondary-content hover:font-bold"
    class:line-through={todo.completed}
  >
    {todo.todo}
  </a>

  {#if todo.userId === $user.id}
    <button data-testid="button-remove" class="btn-accent btn-sm btn normal-case" type="submit"
      >{$LL.forms.remove({ icon: '💥' })}</button
    >
  {/if}
</form>

<script lang="ts">
  import { link } from 'svelte-spa-router';
  import type { HTMLFormAttributes, HTMLInputAttributes } from 'svelte/elements';
  import { fly } from 'svelte/transition';
  import LL from '../../../../i18n/i18n-svelte';
  import type { LoginApiResponseSchema } from '../../../auth/api/auth.schema';
  import { createLocalStorage } from '../../../shared/stores/createLocalStorage.store';
  import type { TodoSchema } from '../../api/todo.schema';
  import { createTodoDeleteMutation } from '../../stores/createTodoDeleteMutation.store';
  import { createTodoListParams } from '../../stores/createTodoListParams.store';
  import { createTodoUpdateMutation } from '../../stores/createTodoUpdateMutation.store';

  //#region VALUES
  export let todo: TodoSchema;

  const { queryKey } = createTodoListParams();
  const { store: user } = createLocalStorage<LoginApiResponseSchema>('user');
  $: todoUpdateMutation = createTodoUpdateMutation({ queryKey: $queryKey });
  $: todoDeleteMutation = createTodoDeleteMutation({ queryKey: $queryKey });
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
  aria-label="form-todo"
  data-testid={`form-${todo.id}`}
  class="mb-2 flex items-center justify-between"
  transition:fly={{ y: 10, duration: 1000 }}
  on:submit|preventDefault={onDeleteTodo}
>
  <input data-testid="input-todoId" type="hidden" name="todoId" id="todoId" value={todo.id} />

  <input
    aria-label="checkbox-todo"
    class="checkbox-accent checkbox"
    type="checkbox"
    id={`todo-${todo.id}`}
    name={`todo-${todo.id}`}
    checked={todo.completed}
    on:change={onChangeTodo}
  />

  <a
    use:link
    aria-label="todo"
    class="ml-5 w-full text-left text-lg text-secondary-content hover:font-bold"
    class:line-through={todo.completed}
    href={`/todos/${todo.id}`}
  >
    {todo.todo}
  </a>

  {#if todo.userId === $user.id}
    <button aria-label="button-submit" class="btn-accent btn-sm btn normal-case" type="submit"
      >{$LL.forms.remove({ icon: '💥' })}</button
    >
  {/if}
</form>

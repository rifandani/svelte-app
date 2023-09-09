<script lang="ts">
  import { createUserStore } from '@auth/stores/createUserStore.store';
  import LL from '@i18n/i18n-svelte';
  import type { TodoSchema } from '@todo/api/todo.schema';
  import { createTodoDeleteMutation } from '@todo/stores/createTodoDeleteMutation.store';
  import { createTodoListParams } from '@todo/stores/createTodoListParams.store';
  import { createTodoUpdateMutation } from '@todo/stores/createTodoUpdateMutation.store';
  import { link } from 'svelte-spa-router';
  import type { HTMLFormAttributes, HTMLInputAttributes } from 'svelte/elements';
  import { fly } from 'svelte/transition';

  //#region VALUES
  export let todo: TodoSchema;

  const { queryKey } = createTodoListParams();
  const user = createUserStore();
  $: todoUpdateMutation = createTodoUpdateMutation({ queryKey: $queryKey });
  $: todoDeleteMutation = createTodoDeleteMutation({ queryKey: $queryKey });
  //#endregion

  //#region HANDLERS
  const onChangeTodo: HTMLInputAttributes['on:change'] = () => {
    $todoUpdateMutation.mutate({ ...todo, completed: !todo.completed });
  };

  const onDeleteTodo: HTMLFormAttributes['on:submit'] = (evt) => {
    // example of directly manipulate submitter disabled attribute
    evt.submitter?.setAttribute('disabled', 'true');

    // don't allow if not the correct auth user
    if (todo.userId !== $user?.id) return;

    // parse form data & get todo id from input hidden with name/id `todoId`
    const formData = new FormData(evt.currentTarget);
    const { todoId } = Object.fromEntries(formData.entries());

    $todoDeleteMutation.mutate(Number(todoId));
    evt.submitter?.removeAttribute('disabled');
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
    class="checkbox-primary checkbox"
    type="checkbox"
    id={`todo-${todo.id}`}
    name={`todo-${todo.id}`}
    checked={todo.completed}
    on:change={onChangeTodo}
  />

  <a
    use:link
    aria-label="todo"
    class="ml-5 w-full text-left text-lg hover:font-bold"
    class:line-through={todo.completed}
    href={`/todos/${todo.id}`}
  >
    {todo.todo}
  </a>

  {#if todo.userId === $user?.id}
    <button aria-label="button-submit" class="btn-primary btn-sm btn normal-case" type="submit"
      >{$LL.forms.remove({ icon: '💥' })}</button
    >
  {/if}
</form>

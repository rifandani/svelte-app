<script lang="ts">
  import { validator } from '@felte/validator-zod';
  import { random } from '@rifandani/nxact-yutiriti';
  import { useQueryClient } from '@tanstack/svelte-query';
  import { createForm } from 'felte';
  import LL from '../../../../i18n/i18n-svelte';
  import type { LoginApiResponseSchema } from '../../../auth/api/auth.schema';
  import { createLocalStorage } from '../../../shared/stores/createLocalStorage.store';
  import { createToast } from '../../../shared/stores/createToast.store';
  import { todoSchema, type TodoSchema } from '../../api/todo.schema';
  import { createTodoCreateMutation } from '../../stores/createTodoCreateMutation.store';
  import { createTodoListQuery } from '../../stores/createTodoListQuery.store';

  //#region VALUES
  const queryClient = useQueryClient();
  const { store: user } = createLocalStorage<LoginApiResponseSchema>('user');
  const { toaster } = createToast();
  const { queryOptions } = createTodoListQuery();
  const todoCreateMutation = createTodoCreateMutation({ queryKey: $queryOptions.queryKey });

  const { form } = createForm<TodoSchema>({
    extend: [validator({ schema: todoSchema })],
    initialValues: {
      id: 1, // doesn't matter, we override it later on `onSubmit` anyway
      todo: '',
      userId: $user.id,
      completed: false,
    },
    onSubmit: (values, { reset }) => {
      const payload = {
        ...values,
        id: random(11, 999_999),
      };

      $todoCreateMutation.mutate(payload, {
        onSettled: (_newTodo, error, _variables, context) => {
          // reset form
          reset();

          toaster.create({
            type: error ? 'error' : 'success',
            title: error
              ? $LL.error.action({ module: 'Todo', action: 'create' })
              : $LL.success.action({ module: 'Todo', action: 'created' }),
          });

          // If the mutation fails, use the context returned from `onMutate` to roll back
          if (error)
            queryClient.setQueryData($queryOptions.queryKey, context?.previousTodosQueryResponse);
        },
      });
    },
  });
  //#endregion
</script>

<form use:form data-testid="form" class="form-control mb-3 w-full duration-300 lg:flex-row">
  <input
    data-testid="input-todo"
    class="input-bordered input-accent input text-accent-content w-full lg:w-10/12"
    placeholder={$LL.forms.todoPlaceholder()}
    name="todo"
    id="todo"
    type="text"
    required
  />

  <button
    data-testid="button-submit"
    class="btn-accent btn ml-0 mt-2 w-full normal-case lg:ml-2 lg:mt-0 lg:w-2/12"
    type="submit"
  >
    {$LL.forms.add({ icon: '✔' })}
  </button>
</form>

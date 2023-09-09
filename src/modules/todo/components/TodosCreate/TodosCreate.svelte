<script lang="ts">
  import { createUserStore } from '@auth/stores/createUserStore.store';
  import { validator } from '@felte/validator-zod';
  import LL from '@i18n/i18n-svelte';
  import { random } from '@rifandani/nxact-yutiriti';
  import { createToast } from '@shared/stores/createToast.store';
  import { useQueryClient } from '@tanstack/svelte-query';
  import { todoSchema, type TodoSchema } from '@todo/api/todo.schema';
  import { createTodoCreateMutation } from '@todo/stores/createTodoCreateMutation.store';
  import { createTodoListParams } from '@todo/stores/createTodoListParams.store';
  import { createForm } from 'felte';

  //#region VALUES
  const queryClient = useQueryClient();
  const user = createUserStore();
  const { toaster } = createToast();
  const { queryKey } = createTodoListParams();
  $: todoCreateMutation = createTodoCreateMutation({ queryKey: $queryKey });

  const { form, isSubmitting } = createForm<TodoSchema>({
    extend: [validator({ schema: todoSchema })],
    initialValues: {
      id: 1, // override it later on `onSubmit`
      userId: 1, // override it later on `onSubmit`
      todo: '',
      completed: false,
    },
    onSubmit: (values, { reset }) => {
      const payload = {
        ...values,
        id: random(11, 999_999),
        userId: $user?.id ?? 1,
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
          if (error) queryClient.setQueryData($queryKey, context?.previousTodosQueryResponse);
        },
      });
    },
  });
  //#endregion
</script>

<form use:form aria-label="form-add" class="form-control mb-3 w-full duration-300 lg:flex-row">
  <input
    class="input-bordered input-primary input w-full lg:w-10/12"
    aria-label="textbox-add"
    name="todo"
    id="todo"
    type="text"
    required
    placeholder={$LL.forms.todoPlaceholder()}
  />

  <button
    aria-label="button-add"
    class="btn-primary btn ml-0 mt-2 w-full normal-case text-primary-content lg:ml-2 lg:mt-0 lg:w-2/12 disabled:btn-disabled"
    type="submit"
    disabled={$isSubmitting}
  >
    {$LL.forms.add({ icon: '💾' })}
  </button>
</form>

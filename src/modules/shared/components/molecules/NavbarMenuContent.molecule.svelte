<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { link } from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';
  import type { LoginApiResponseSchema } from '../../../auth/api/auth.schema';
  import { themes } from '../../constants/global.constant';
  import { useLocalStorage } from '../../hooks/useLocalStorage.hook';

  // event forwarding
  const dispatch = createEventDispatcher<{ logout: undefined }>();

  // get 'user' store
  const { store: user } = useLocalStorage<LoginApiResponseSchema>('user');

  const onClickLogout = () => {
    dispatch('logout');
  };

  // const [t] = useI18n();
</script>

<li>
  <a
    use:link
    use:active={{ path: '/todos', className: 'link-secondary', inactiveClassName: 'link-neutral' }}
    href="/todos"
    class="link-hover link text-primary"
  >
    Todos
  </a>
</li>
<li>
  <a
    use:link
    use:active={{ path: '/posts', className: 'link-secondary', inactiveClassName: 'link-neutral' }}
    href="/posts"
    class="link-hover link mx-0 text-primary lg:mx-3"
  >
    Posts
  </a>
</li>
<li class="dropdown-bottom dropdown-end dropdown mt-3 lg:mt-0">
  <button class="btn-secondary btn rounded-none normal-case text-secondary-content">Theme</button>

  <ul
    tabIndex={0}
    class="dropdown-content menu rounded-box block max-h-60 w-52 overflow-y-auto bg-base-100 p-2 shadow"
  >
    {#each themes as theme (theme)}
      <li>
        <button class="capitalize text-secondary" data-set-theme={theme}>
          {theme}
        </button>
      </li>
    {/each}
  </ul>
</li>

{#if !!$user.username}
  <li class="ml-0 mt-auto lg:ml-3 lg:mt-0">
    <button on:click={onClickLogout} class="btn-primary btn h-full normal-case">
      Logout ({$user.username})
    </button>
  </li>
{/if}

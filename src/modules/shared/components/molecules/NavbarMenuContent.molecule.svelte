<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { link } from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';
  import LL from '../../../../i18n/i18n-svelte';
  import type { LoginApiResponseSchema } from '../../../auth/api/auth.schema';
  import { modes, themes } from '../../constants/global.constant';
  import { createColorMode } from '../../stores/createColorMode.store';
  import { createLocalStorage } from '../../stores/createLocalStorage.store';
  import type { Theme } from '../../types/theme.type';

  // event forwarding
  const dispatch = createEventDispatcher<{ logout: undefined }>();

  // get 'user' store
  const { store: user } = createLocalStorage<LoginApiResponseSchema>('user');
  const mode = createColorMode({
    modes,
    attribute: 'data-theme',
  });

  //#region HANDLERS
  const onClickLogout = () => {
    dispatch('logout');
  };

  const onClickChangeTheme = (_theme: Theme) => {
    mode.update(_theme);
  };
  //#endregion
</script>

<li>
  <a
    use:link
    use:active={{ path: '/todos', className: 'link-secondary', inactiveClassName: 'link-neutral' }}
    href="/todos"
    class="link-hover px-3 link text-primary tracking-wide mx-0 lg:mx-3"
  >
    Todos
  </a>
</li>
<li class="dropdown-top lg:dropdown-bottom lg:dropdown-end dropdown mt-auto mb-3 lg:mb-0 lg:mt-0">
  <button tabindex={0} class="btn btn-sm btn-secondary btn-block normal-case text-secondary-content"
    >{$LL.common.theme()}</button
  >

  <ul
    tabIndex={0}
    class="bg-secondary text-secondary-content dropdown-content menu rounded-box block max-h-60 w-72 lg:w-52 overflow-y-auto p-2 shadow z-10"
  >
    {#each themes as theme (theme)}
      <li>
        <button
          type="button"
          class="capitalize tracking-wide"
          on:click={() => onClickChangeTheme(theme)}
        >
          {theme}
        </button>
      </li>
    {/each}
  </ul>
</li>

{#if !!$user.username}
  <li class="ml-0 lg:ml-3 lg:mt-0">
    <button
      on:click={onClickLogout}
      class="btn btn-sm btn-primary normal-case text-primary-content tracking-wide"
    >
      {$LL.auth.logoutUsername({ username: $user.username })}
    </button>
  </li>
{/if}

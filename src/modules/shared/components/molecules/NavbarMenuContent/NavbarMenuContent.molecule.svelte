<script lang="ts">
  import { createUserStore } from '@auth/stores/createUserStore.store';
  import LL from '@i18n/i18n-svelte';
  import { modes, themes } from '@shared/constants/global.constant';
  import { createColorMode } from '@shared/stores/createColorMode.store';
  import type { Theme } from '@shared/types/theme.type';
  import { createEventDispatcher } from 'svelte';
  import { link } from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';

  // event forwarding
  const dispatch = createEventDispatcher<{ logout: undefined }>();
  const user = createUserStore();
  const mode = createColorMode({
    modes,
    attribute: 'data-theme',
  });

  //#region HANDLERS
  const onClickLogout = () => {
    dispatch('logout');
  };

  const onClickChangeTheme = (_theme: Theme) => {
    mode.set(_theme);
  };
  //#endregion
</script>

<li>
  <a
    use:link
    use:active={{ path: '/todos', className: 'link-hover' }}
    href="/todos"
    aria-label="todos"
    class="px-3 link tracking-wide mx-0 lg:mx-3"
  >
    Todos
  </a>
</li>

<li class="dropdown-top lg:dropdown-bottom lg:dropdown-end dropdown mt-auto mb-3 lg:mb-0 lg:mt-0">
  <button
    type="button"
    tabindex={0}
    aria-label="themes-opener"
    class="btn btn-sm btn-outline btn-block normal-case">{$LL.common.theme()}</button
  >

  <ul
    tabIndex={0}
    class="bg-base-200 dropdown-content menu rounded-box block max-h-60 w-72 lg:w-52 overflow-y-auto p-2 shadow z-10"
  >
    {#each themes as theme (theme)}
      <li>
        <button
          type="button"
          class="capitalize tracking-wide"
          aria-label={`theme-${theme}`}
          on:click={() => onClickChangeTheme(theme)}
        >
          {theme}
        </button>
      </li>
    {/each}
  </ul>
</li>

{#if !!$user?.username}
  <li class="ml-0 lg:ml-3 lg:mt-0">
    <button
      type="button"
      class="btn btn-sm btn-error normal-case tracking-wide text-error-content"
      on:click={onClickLogout}
    >
      {$LL.auth.logoutUsername({ username: $user.username })}
    </button>
  </li>
{/if}

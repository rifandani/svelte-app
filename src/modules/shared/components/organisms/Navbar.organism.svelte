<script lang="ts">
  import { onMount, type ComponentEvents } from 'svelte';
  import { link, replace } from 'svelte-spa-router';
  import { fade, fly } from 'svelte/transition';
  import { themeChange } from 'theme-change';
  import svelteLogo from '../../../../assets/svelte.svg';
  import LL from '../../../../i18n/i18n-svelte';
  import type { LoginApiResponseSchema } from '../../../auth/api/auth.schema';
  import { createLocalStorage } from '../../stores/createLocalStorage.store';
  import { Icon } from '../atoms';
  import { NavbarMenuContent } from '../molecules';

  // get 'user' store
  const { reset } = createLocalStorage<LoginApiResponseSchema>('user');

  //#region HANDLERS
  // CustomEvent<undefined>
  const logout = (_ev: ComponentEvents<NavbarMenuContent>['logout']) => {
    reset(); // reset `user` store
    void replace('/login'); // back to login
  };
  //#endregion

  onMount(() => themeChange(false));
</script>

<nav in:fly={{ x: -100, duration: 1000 }} out:fade class="drawer text-primary-content min-h-screen">
  <input id="my-nav-drawer" type="checkbox" class="drawer-toggle" />

  <section class="drawer-content flex flex-col">
    <!-- Navbar -->
    <div class="navbar w-full bg-base-300">
      <div class="flex-none lg:hidden">
        <label for="my-nav-drawer" class="btn-primary btn-square btn">
          <Icon.HamburgerMenu2 width={20} height={20} style="fill:hsl(var(--p))" />
        </label>
      </div>

      <a use:link href="/" class="link-primary link mx-2 flex-1 px-2">
        <span class="flex items-center space-x-2 pl-2 text-2xl">
          <img src={svelteLogo} alt="svelte logo" class="h-6 w-6" />
          <p class="font-semibold text-primary tracking-wider">{$LL.common.appName()}</p>
        </span>
      </a>

      <div class="hidden flex-none lg:block">
        <ul class="menu menu-horizontal">
          <!-- Navbar menu content here -->
          <NavbarMenuContent on:logout={logout} />
        </ul>
      </div>
    </div>

    <!-- Page content here -->
    <slot>
      <h1 class="text-lg/10">{$LL.common.noPageContent()}</h1>
    </slot>
  </section>

  <section class="drawer-side">
    <label for="my-nav-drawer" class="drawer-overlay" />

    <ul class="menu h-full w-80 bg-base-200 p-4">
      <!-- Sidebar content here -->
      <NavbarMenuContent on:logout={logout} />
    </ul>
  </section>
</nav>

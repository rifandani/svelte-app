<script lang="ts">
  import { createUserStore } from '@auth/stores/createUserStore.store';
  import LL from '@i18n/i18n-svelte';
  import Icon from '@iconify/svelte';
  import SvgIcon from '@shared/components/atoms/SvgIcon/SvgIcon.svelte';
  import NavbarMenuContent from '@shared/components/molecules/NavbarMenuContent/NavbarMenuContent.svelte';
  import { link, replace } from 'svelte-spa-router';
  import { fade, fly } from 'svelte/transition';

  // #region VALUES
  const user = createUserStore();
  // #endregion

  //#region HANDLERS
  // CustomEvent<undefined> | ComponentEvents<NavbarMenuContent>['logout']
  const logout = () => {
    user.set(null); // reset `user` store
    void replace('/login'); // back to login
  };
  //#endregion
</script>

<nav in:fly={{ x: -100, duration: 1000 }} out:fade class="drawer min-h-screen">
  <input id="my-nav-drawer" type="checkbox" aria-label="drawer" class="drawer-toggle" />

  <section class="drawer-content flex flex-col">
    <!-- Navbar -->
    <div class="navbar w-full shadow-md">
      <div class="flex-none lg:hidden">
        <label for="my-nav-drawer" class="btn-ghost btn-square btn">
          <Icon icon="lucide:menu" height="2em" />
        </label>
      </div>

      <a
        use:link
        href="/"
        aria-label="logo"
        class="link mx-2 flex-1 px-2 flex items-center space-x-2 pl-2 text-2xl"
      >
        <SvgIcon id="icon-svelte" class="w-6 h-6" />
        <p class="font-semibold tracking-wider">{$LL.common.appName()}</p>
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

    <ul class="menu h-full w-80 bg-base-100 p-4">
      <!-- Sidebar content here -->
      <NavbarMenuContent on:logout={logout} />
    </ul>
  </section>
</nav>

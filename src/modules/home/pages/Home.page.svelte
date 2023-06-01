<script lang="ts">
  import { onMount } from 'svelte';
  import LL from '../../../i18n/i18n-svelte';
  import { Navbar } from '../../shared/components/organisms';
  import HomeClock from '../components/HomeClock.svelte';

  onMount(() =>
    console.log('this should be displayed later, because onMount happens after component renders'),
  );
  console.log('🏁 end of Home component script tag');
</script>

<Navbar>
  <main
    class="text-primary-content container mx-auto flex flex-col items-center py-24 duration-300"
  >
    <h1 class="text-primary-content mb-4 text-3xl font-medium sm:text-4xl">{$LL.home.title()}</h1>

    <div class="mockup-code">
      <code class="block px-6"
        >$ pnpm add svelte-spa-router @tanstack/svelte-query zod @formkit/auto-animate ...</code
      >
      <code class="px-6">$ pnpm add -D typescript vite vitest msw tailwindcss daisyui ...</code>
    </div>

    <HomeClock />
  </main>
</Navbar>

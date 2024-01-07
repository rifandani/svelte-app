<script lang="ts">
  import HomeClock from '@home/components/HomeClock/HomeClock.svelte';
  import LL from '@i18n/i18n-svelte';
  import Navbar from '@shared/components/organisms/Navbar/Navbar.svelte';
</script>

<Navbar>
  <main class="container mx-auto flex flex-col items-center py-24 duration-300">
    <h1 class="mb-4 text-3xl font-medium sm:text-4xl">
      {$LL.home.title()}
    </h1>

    <HomeClock />
  </main>
</Navbar>

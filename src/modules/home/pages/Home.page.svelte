<script lang="ts">
  import LL from '../../../i18n/i18n-svelte';
  import { Navbar } from '../../shared/components/organisms';
  import HomeClock from '../components/HomeClock/HomeClock.svelte';
</script>

<Navbar>
  <main
    class="text-primary-content container mx-auto flex flex-col items-center py-24 duration-300"
  >
    <h1 data-testid="home-title" class="text-primary-content mb-4 text-3xl font-medium sm:text-4xl">
      {$LL.home.title()}
    </h1>

    <HomeClock />
  </main>
</Navbar>

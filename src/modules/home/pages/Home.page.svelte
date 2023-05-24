<script lang="ts">
  import autoAnimate from '@formkit/auto-animate';
  import { shuffle } from '@rifandani/nxact-yutiriti';
  import { onDestroy, onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { slide } from 'svelte/transition';
  import { Navbar } from '../../shared/components/organisms';

  let showClock = false;
  let timeoutId: number;
  let seconds = 0;
  let minutes = 0;
  let hours = 0;

  // recalculate `seconds` every 100 ms
  $: {
    if (showClock && !timeoutId) {
      timeoutId = setInterval(() => {
        seconds = +(seconds + 0.1).toFixed(2);
      }, 100);
    }
    if (!showClock && timeoutId) {
      seconds = 0;

      // NOTE: it's important to clear the timeout and set `timeoutId` back to undefined
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  }

  // recalculate `minutes` when `seconds` changes
  $: minutes = seconds > 0 ? (seconds % 2 === 0 ? minutes + 1 : minutes) : 0;

  // recalculate `hours` when `minutes` changes
  $: hours = minutes > 0 ? (minutes % 2 === 0 ? hours + 1 : hours) : 0;

  let buttons = [
    {
      id: 'sort',
      class: 'btn-ghost btn',
      onClick: () => {},
      text: 'Sort Buttons', // `${t('sortButtons')} 💫`,
    },
    {
      id: 'clock',
      class: 'btn-active btn',
      onClick: () => (showClock = !showClock),
      text: 'Toggle Clock', // `${t('toggleClock')} 🕰`,
    },
    {
      id: 'language',
      class: 'btn-accent btn',
      onClick: () => {}, // locale(locale() === 'en-US' ? 'id' : 'en-US'),
      text: 'Change Language', // `${t('changeLanguage')} ♻`,
    },
    {
      id: 'start',
      class: 'btn-secondary btn',
      onClick: () => push('/todos'),
      text: 'Get Started', // `${t('getStarted')} ✨`,
    },
  ];

  onMount(() =>
    console.log('this should be displayed later, because onMount happens after component renders'),
  );
  onDestroy(() => clearTimeout(timeoutId));
  console.log('🏁 end of Home component script tag');
</script>

<Navbar>
  <main
    in:slide={{ axis: 'y', duration: 1000 }}
    class="text-primary-content container mx-auto flex flex-col items-center py-24 duration-300"
  >
    <h1 class="text-primary-content mb-4 text-3xl font-medium sm:text-4xl">Svelte App using:</h1>

    <div class="mockup-code">
      <code class="block px-6"
        >$ pnpm add svelte-spa-router @tanstack/svelte-query zod @formkit/auto-animate ...</code
      >
      <code class="px-6">$ pnpm add -D typescript vite vitest msw tailwindcss daisyui ...</code>
    </div>

    {#if showClock}
      <div class="stats mt-8 shadow">
        <div class="stat">
          <div class="stat-title">Clock:</div>
          <div class="stat-value">
            {hours} : {minutes} : {seconds}{' '}
          </div>
          <div class="stat-desc">Click toggle clock to restart the clock</div>
        </div>
      </div>
    {/if}

    <div
      use:autoAnimate
      class="mt-8 grid grid-cols-1 gap-2 duration-300 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {#each buttons as btn (btn.id)}
        <button
          class={btn.class}
          on:click={btn.id === 'sort' ? () => (buttons = shuffle(buttons)) : btn.onClick}
        >
          {btn.text}
        </button>
      {/each}
    </div>
  </main>
</Navbar>

<script lang="ts">
  import LL, { locale } from '@i18n/i18n-svelte';
  import { shuffle } from '@rifandani/nxact-yutiriti';
  import { chooseLocaleSync } from '@shared/utils/helper/helper.util';
  import { onDestroy } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { flip, type FlipParams } from 'svelte/animate';
  import { slide } from 'svelte/transition';

  //#region VALUES
  const flipParams: FlipParams = { duration: (dur) => 30 * Math.sqrt(dur) };
  let showClock = false;
  let timeoutId: ReturnType<typeof setInterval> | undefined;
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

  $: buttons = [
    {
      id: 'sort' as const,
      class: 'btn-neutral btn',
      text: $LL.home.sortBtn(),
    },
    {
      id: 'clock' as const,
      class: 'btn-active btn',
      text: $LL.home.toggleClock(),
    },
    {
      id: 'language' as const,
      class: 'btn-accent btn',
      text: $LL.home.changeLang(),
    },
    {
      id: 'start' as const,
      class: 'btn-secondary btn',
      text: $LL.home.getStarted(),
    },
  ];

  const onClickMapper = (btnId: 'sort' | 'clock' | 'language' | 'start') => {
    const mapper: Record<typeof btnId, () => void> = {
      sort: () => (buttons = shuffle(buttons)),
      clock: () => (showClock = !showClock),
      language: () => chooseLocaleSync($locale === 'en' ? 'id' : 'en'),
      start: () => void push('/todos'),
    };

    mapper[btnId]();
  };

  //#endregion

  onDestroy(() => clearTimeout(timeoutId));
</script>

{#if showClock}
  <div
    data-testid="home-clock-show"
    in:slide={{ axis: 'y', duration: 500 }}
    out:slide={{ axis: 'y', duration: 250 }}
    class="stats mt-8 bg-base-200 shadow"
  >
    <div class="stat">
      <div class="stat-title">{$LL.home.clock()}:</div>
      <div class="stat-value">
        {hours} : {minutes} : {seconds}{' '}
      </div>
      <div class="stat-desc">{$LL.home.clickToggleClock()}</div>
    </div>
  </div>
{/if}

<ul class="mt-8 grid grid-cols-1 gap-2 duration-300 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {#each buttons as btn (btn.id)}
    <button
      type="button"
      data-testid={`home-clock-button-${btn.id}`}
      class={btn.class}
      animate:flip={flipParams}
      on:click={() => onClickMapper(btn.id)}
    >
      {btn.text}
    </button>
  {/each}
</ul>

<script lang="ts">
  import {
    myCounterEventDecrement,
    myCounterEventIncrement,
    type MyCounterEventDetail,
  } from '@lib/wc/MyCounter.constant';
  import '@lib/wc/MyCounter.wc.svelte';
  import { onDestroy, onMount } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  let sectionRef: Element;
  let initialCount = '10';

  const handleClickTambah: HTMLButtonAttributes['on:click'] = () => {
    initialCount = (Number(initialCount) + 1).toString();
  };

  const onDecrement = (ev: CustomEvent<MyCounterEventDetail>) => {
    initialCount = ev.detail.count;
  };
  const onIncrement = (ev: CustomEvent<MyCounterEventDetail>) => {
    initialCount = ev.detail.count;
  };

  onMount(() => {
    sectionRef.addEventListener(
      myCounterEventDecrement,
      onDecrement as EventListenerOrEventListenerObject,
    );
    sectionRef.addEventListener(
      myCounterEventIncrement,
      onIncrement as EventListenerOrEventListenerObject,
    );
  });

  onDestroy(() => {
    sectionRef.removeEventListener(
      myCounterEventDecrement,
      onDecrement as EventListenerOrEventListenerObject,
    );
    sectionRef.removeEventListener(
      myCounterEventIncrement,
      onIncrement as EventListenerOrEventListenerObject,
    );
  });
</script>

<section
  class="card bg-base-200 w-full rounded-lg p-5 flex flex-col space-y-3 items-center"
  bind:this={sectionRef}
>
  <button class="btn btn-xs btn-primary" on:click={handleClickTambah}>Tambah</button>

  <my-counter {initialCount} />
</section>

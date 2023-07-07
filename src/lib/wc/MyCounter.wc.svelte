<!-- https://svelte.dev/docs/custom-elements-api -->
<svelte:options
  accessors={true}
  customElement={{
    tag: 'my-counter',
    shadow: 'none', // styles are no longer encapsulated but now we can use global styles, and you can't use slots
    props: {
      name: { reflect: true, type: 'Number', attribute: 'initial-count' },
    },
  }}
/>

<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { myCounterEventDecrement, myCounterEventIncrement } from './MyCounter.constant';

  export let initialCount = '0';
  $: count = initialCount;

  const onDecrement: HTMLButtonAttributes['on:click'] = (ev) => {
    const newCount = (Number(count) - 1).toString();

    count = newCount;
    ev.currentTarget.dispatchEvent(
      new CustomEvent(myCounterEventDecrement, {
        bubbles: true,
        composed: true, // to cross the Shadow DOM boundaries
        detail: { count: newCount },
      }),
    );
  };
  const onIncrement: HTMLButtonAttributes['on:click'] = (ev) => {
    const newCount = (Number(count) + 1).toString();

    count = newCount;
    ev.currentTarget.dispatchEvent(
      new CustomEvent(myCounterEventIncrement, {
        bubbles: true,
        composed: true, // to cross the Shadow DOM boundaries
        detail: { count: newCount },
      }),
    );
  };
</script>

<div class="flex items-center space-x-2">
  <button class="btn btn-xs btn-primary" on:click={onDecrement}>Decrement</button>
  <p>{count}</p>
  <button class="btn btn-xs btn-primary" on:click={onIncrement}>Increment</button>
</div>

<!-- comment these if we use `shadow: 'none'` -->
<!-- <style>
  .flex {
    display: flex;
  }

  .space-x-2 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(0.5rem * var(--tw-space-x-reverse));
    margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
  }
</style> -->

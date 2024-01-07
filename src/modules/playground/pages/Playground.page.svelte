<script lang="ts">
  import Designer from '@playground/components/Designer.svelte';
  import RealPlayground from '@playground/components/RealPlayground.svelte';
  import { Tabs } from 'bits-ui';
</script>

<main class="flex min-h-screen w-full">
  <Tabs.Root value="designer" class="w-full">
    <Tabs.List aria-label="Playground Tabs" class="mx-auto my-5 flex w-fit justify-center">
      <Tabs.Trigger value="designer">Designer</Tabs.Trigger>
      <Tabs.Trigger value="playground">Playground</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="designer" class="flex h-full w-full">
      <Designer />
    </Tabs.Content>
    <Tabs.Content value="playground" class="flex h-full w-full">
      <RealPlayground />
    </Tabs.Content>
  </Tabs.Root>
</main>

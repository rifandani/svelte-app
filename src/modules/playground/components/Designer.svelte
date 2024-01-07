<script lang="ts">
  import { modes, themes } from '@shared/constants/global.constant';
  import { createColorMode } from '@shared/stores/createColorMode.store';
  import type { Theme } from '@shared/types/theme.type';
  import { Accordion, AlertDialog } from 'bits-ui';

  const mode = createColorMode({
    modes,
    attribute: 'data-theme',
  });

  const onClickChangeTheme = (_theme: Theme) => {
    mode.set(_theme);
  };
</script>

<aside class="flex w-1/5 flex-col rounded-tr-lg bg-base-300 p-4">
  <h1 data-testid="title" class="text-2xl font-semibold tracking-wider">Designer</h1>

  <ul class="menu w-full max-w-xs p-0 pt-4">
    <li>
      <details open>
        <summary>Themes</summary>

        <ul class="max-h-80 overflow-y-auto">
          {#each themes as theme}
            <li>
              <button
                type="button"
                class="btn btn-sm justify-start capitalize tracking-wide"
                on:click={() => onClickChangeTheme(theme)}
              >
                {theme}
              </button>
            </li>
          {/each}
        </ul>
      </details>
    </li>
  </ul>
</aside>

<aside class="grid w-full grid-cols-2 gap-4 p-4">
  <section class="rounded-lg bg-base-200 p-4">
    <p class="text-primary">Accordion</p>
    <div class="flex space-x-2 py-2">
      <Accordion.Root>
        <Accordion.Item value="accordion-1">
          <Accordion.Header>
            <Accordion.Trigger
              value="accordion-1"
              class="flex flex-1 items-center justify-between data-[state='open']:bg-white data-[state='open']:text-primary"
              >Accordion Trigger 1</Accordion.Trigger
            >
          </Accordion.Header>

          <Accordion.Content>Accordion Content 1</Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="accordion-2">
          <Accordion.Header>
            <Accordion.Trigger
              value="accordion-2"
              class="flex flex-1 items-center justify-between data-[state='open']:bg-white data-[state='open']:text-primary"
              >Accordion Trigger 2</Accordion.Trigger
            >
          </Accordion.Header>

          <Accordion.Content>Accordion Content 2</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>

    <p class="text-primary">Alert Dialog</p>
    <div class="flex space-x-2 py-2">
      <AlertDialog.Root>
        <AlertDialog.Trigger />

        <AlertDialog.Portal>
          <AlertDialog.Overlay />
          <AlertDialog.Content>
            <AlertDialog.Title />
            <AlertDialog.Description />
            <AlertDialog.Cancel />
            <AlertDialog.Action />
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  </section>

  <section class="rounded-lg bg-base-200 p-4">
    <p>Content</p>
  </section>
</aside>

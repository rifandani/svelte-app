<script lang="ts">
  import svelteCyber from '@assets/svelte-cyber.avif';
  import LoginForm from '@auth/components/LoginForm/LoginForm.svelte';
  import LL from '@i18n/i18n-svelte';
  import Icon from '@iconify/svelte';
  import { WrapTranslation } from '@shared/components/atoms';
  import { link } from 'svelte-spa-router';
  import { fade, fly } from 'svelte/transition';
</script>

<main in:fly={{ y: 50, duration: 1000 }} out:fade class="h-screen bg-white">
  <div class="flex w-full flex-wrap">
    <!-- Login Section -->
    <section class="flex w-full flex-col md:w-1/2">
      <div class="flex justify-center pt-12 md:-mb-24 md:justify-start md:pl-12">
        <a
          use:link
          href="/"
          aria-label="link-home"
          class="relative cursor-pointer rounded-full hover:text-primary"
        >
          <Icon icon="lucide:home" height="1.5em" />
        </a>
      </div>

      <div
        class="my-auto flex flex-col justify-center px-8 pt-8 md:justify-start md:px-24 md:pt-0 lg:px-32"
      >
        <h1 class="text-center text-3xl text-primary">
          {$LL.auth.welcome()}
        </h1>

        <LoginForm />

        <p class="py-12 text-center">
          <WrapTranslation message={$LL.auth.registerHere()} let:infix>
            <a use:link aria-label="link-register" href="/register" class="link-primary link"
              >{infix}</a
            >
          </WrapTranslation>
        </p>
      </div>
    </section>

    <!-- Image Section -->
    <section class="w-1/2 shadow-2xl">
      <span class="relative hidden h-screen w-full md:flex md:items-center md:justify-center">
        <img src={svelteCyber} aria-label="img-cover" alt="login page cover" loading="lazy" />
      </span>
    </section>
  </div>
</main>

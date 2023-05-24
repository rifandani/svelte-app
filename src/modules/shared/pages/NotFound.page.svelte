<script>
  import { link } from 'svelte-spa-router';
</script>

<section class="flex h-screen flex-col items-center justify-center space-y-3 text-primary-content">
  <h1 class="text-3xl font-bold italic">404: Not Found</h1>
  <p class="!mb-5">It's gone 😞</p>

  <a use:link href="/" class="link-neutral link hover:skew-x-12"> Go back to home 🏡 </a>
</section>

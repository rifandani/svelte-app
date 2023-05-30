<!--
  usage with a component inside a translation

  const en = {
    'WELCOME': 'Hi {name:string}, click <>here<> to create your first project'
    'LOGOUT': 'Logout'
  }

  <WrapTranslation message={LL.WELCOME({ name: 'John' })} let:infix>
    <button on:click={() => alert('clicked')}>
      {infix}
    </button>
  </WrapTranslation>
-->
<script lang="ts">
  import type { LocalizedString } from 'typesafe-i18n';

  export let message: LocalizedString;

  $: [prefix, infix, postfix] = message.split('<>') as LocalizedString[];

  // render infix only if the message doesn't have any split characters
  $: if (!infix && !postfix) {
    infix = prefix;
    prefix = '' as LocalizedString;
  }
</script>

{prefix}<slot {infix} />{postfix}

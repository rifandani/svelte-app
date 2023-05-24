export function createStyleTag() {
  const tag = document.createElement('style');
  tag.type = 'text/css';
  tag.setAttribute('svelte-scroll-lock', '');

  return tag;
}

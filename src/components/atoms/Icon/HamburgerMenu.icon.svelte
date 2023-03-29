<script>
  export let className = '';
  export let width = 24;
  export let height = 24;
  export let viewBox = '0 0 24 24';
  export let fill = 'currentColor';
</script>

<svg class={className} {width} {height} {viewBox} {fill} xmlns="http://www.w3.org/2000/svg">
  <title>Hamburger Menu</title>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M4 6h16M4 12h16M4 18h16"
  />
</svg>

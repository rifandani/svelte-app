<script>
  export let className = '';
  export let width = 16;
  export let height = 16;
  export let viewBox = '0 0 16 16';
  export let fill = 'currentColor';
</script>

<svg class={className} {width} {height} {viewBox} {fill} xmlns="http://www.w3.org/2000/svg">
  <title>Error</title>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
  />
</svg>

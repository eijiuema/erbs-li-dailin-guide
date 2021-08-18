<script>
  import Quote from "./Quote.svelte";
</script>

<Quote color="#fccd33" {...$$props}>
  <slot />
</Quote>

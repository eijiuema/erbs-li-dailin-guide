<script>
  export let src;
  export let key = "";
  export let size = 32;
</script>

<span class="container" style="--size: {size}px">
  <img {src} alt={key} />
  {#if key}
    <span class="key">{key}</span>
  {/if}
</span>

<style>
  .container {
    display: inline-block;
    position: relative;
    vertical-align: middle;
    height: var(--size);
  }
  img {
    height: 100%;
  }
  .key {
    text-align: center;
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    width: calc(var(--size) / 3);
    height: calc(var(--size) / 3);
    font-size: calc(var(--size) / 3.75);
    line-height: calc(var(--size) / 3);
    font-weight: 700;
    content: attr(data-key);
  }
</style>

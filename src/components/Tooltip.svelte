<script>
  export let width;
  let show = false;
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<span
  style="--width: {width}px"
  class="container"
  on:mouseover={() => (show = true)}
  on:mouseleave={() => (show = false)}
>
  <span class="hoverable">
    <slot name="hoverable" />
  </span>
  {#if show}
    <div class="tooltip">
      <slot name="tooltip" />
    </div>
  {/if}
</span>

<style>
  .hoverable {
    border-bottom: 1px dashed white;
  }
  .tooltip {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    padding: 1em;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 8px;
    border-top-left-radius: 0;
    min-width: var(--width);
    max-width: 100vw;
  }
</style>

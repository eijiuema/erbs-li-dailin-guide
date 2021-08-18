<script>
  export let src;
  export let caption;
  export let height = "auto";
  export let width = "auto";
  export let center = false;
</script>

<figure style="--width: {width}; --height: {height};" class:center>
  <img {src} alt={caption} />
  {#if caption}
    <figcaption>
      {caption}
    </figcaption>
  {/if}
</figure>

<style>
  figure {
    display: flex;
    flex-flow: column;
    padding: 5px;
    margin: auto;
  }

  figure.center {
    align-items: center;
  }

  img {
    width: var(--width);
    height: var(--height);
    object-fit: contain;
    max-width: 100%;
  }

  figcaption {
    font: italic smaller sans-serif;
    padding-top: 8px;
    text-align: center;
  }
</style>

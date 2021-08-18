<script>
  export let src;
  export let controls = false;
  export let autoplay = false;
  export let muted = true;
  export let loop = false;
  export let width = "320px";
  export let height = "auto";
  export let caption;
  export let preload = true;

  let video;
  let loading = true;
  let paused = !autoplay;

  function toggleVideo() {
    if (paused) {
      video.play();
    } else {
      video.pause();
    }
  }
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<figure style="width: {width}">
  <div class="video" on:click={toggleVideo}>
    <div class="overlay" class:paused>
      {#if loading}
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="resources/loading.svg" />
      {:else if paused}
        <span class="text">▶</span>
      {/if}
    </div>
    <video
      {src}
      {controls}
      {autoplay}
      {loop}
      {muted}
      {width}
      {height}
      {preload}
      bind:paused
      on:canplay={() => (loading = false)}
      bind:this={video}
    />
  </div>
  {#if caption}
    <figcaption>
      {caption}
    </figcaption>
  {/if}
</figure>

<style>
  .video {
    margin: 0 auto;
    width: 100%;
    position: relative;
    cursor: pointer;
  }
  video {
    width: 100%;
    display: block;
  }
  .overlay {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
  }
  .overlay.paused {
    background-color: rgba(0, 0, 0, 0.25);
  }
  figure {
    display: flex;
    flex-flow: column;
    padding: 5px;
    margin: 1em auto;
  }

  figcaption {
    font: italic smaller sans-serif;
    padding-top: 8px;
    text-align: center;
  }
</style>

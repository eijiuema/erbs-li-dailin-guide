<script>
  export let src;
  export let controls = false;
  export let autoplay = false;
  export let muted = true;
  export let loop = true;
  export let width = 320;
  export let height;

  let video;
  let paused = !autoplay;

  function toggleVideo() {
    if (paused) {
      video.play();
    } else {
      video.pause();
    }
    paused = !paused;
  }
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div class="video" on:click={toggleVideo} style="--width: {width}px">
  <div class="overlay" class:paused>
    {#if paused}
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
    bind:this={video}
  />
</div>

<style>
  video {
    width: 100%;
    display: block;
  }
  .video {
    margin: 0 auto;
    width: var(--width);
    max-width: 100%;
    position: relative;
    cursor: pointer;
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
</style>

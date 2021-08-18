<script>
  export let text;
  export let tip;
</script>

<span class="container">
  <span class="hoverable">
    {text}
  </span>
  <small class="tip">{tip}</small>
</span>

<style>
  .container {
    position: relative;
  }
  .tip {
    position: absolute;
    top: 100%;
    left: 0;
    visibility: hidden;
    background-color: rgba(0, 0, 0, 0.9);
    padding: 8px;
    border-bottom-right-radius: 8px;
    z-index: 1000;
  }
  .container:hover .tip {
    visibility: visible;
  }
  .hoverable {
    border-bottom: 1px dashed white;
  }
</style>

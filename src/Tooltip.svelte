<span>
  <span class="hoverable">
    <slot name="hoverable" />
  </span>
  <div class="tooltip">
    <slot name="tooltip" />
  </div>
</span>

<style>
  span {
    position: relative;
  }

  .hoverable {
    border-bottom: 1px dashed #fff;
  }

  .tooltip {
    position: absolute;
    visibility: hidden;
    padding: 1em;
    margin-top: 1em;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 8px;
    border-bottom-left-radius: 0;
    min-width: 320px;
    max-width: 100vw;
  }

  span:hover .tooltip {
    visibility: visible;
  }
</style>

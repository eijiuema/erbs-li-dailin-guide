<span>
  <slot class="hoverable" name="hoverable" />
  <div class="tooltip">
    <slot name="tooltip" />
  </div>
</span>

<style>
  span {
    position: relative;
  }

  .tooltip {
    position: absolute;
    visibility: hidden;
    bottom: 50%;
    left: 50%;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 8px;
    border-bottom-left-radius: 0;
  }

  span:hover .tooltip {
    visibility: visible;
  }
</style>

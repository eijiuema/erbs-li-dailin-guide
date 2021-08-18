<script>
  export let show = false;

  function open() {
    show = true;
  }

  function close() {
    show = false;
  }
</script>

<span on:click={open} class="button">
  <slot name="button" />
</span>
{#if show}
  <div class="overlay" on:click={close} />
  <div class="modal">
    <div class="close" on:click={close}>✗</div>
    <slot name="modal" />
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.75);
  }
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #25292d;
    border-radius: 8px;
    padding: 36px;
    z-index: 2000;
  }
  .close {
    position: absolute;
    width: 28px;
    height: 28px;
    padding: 0;
    top: 12px;
    right: 12px;
    text-align: center;
  }

  .close:hover {
    cursor: pointer;
  }

  .button:hover {
    cursor: pointer;
  }
</style>

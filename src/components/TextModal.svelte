<script>
  import Modal from "./Modal.svelte";
  export let text;
</script>

<Modal>
  <span slot="button" class="text">
    {text}
  </span>
  <slot slot="modal" />
</Modal>

<style>
  .text {
    border-bottom: 1px solid #fccd33;
  }
</style>

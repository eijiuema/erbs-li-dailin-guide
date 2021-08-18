<script>
  export let text;
</script>

<span
  on:click={window.prompt("Copiar: Ctrl+C, Enter", text)}
  title="Clique para copiar"
>
  <i>{text}</i>
</span>

<style>
  span {
    cursor: pointer;
  }
</style>

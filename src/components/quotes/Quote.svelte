<script>
  export let color;
  export let author;
</script>

<blockquote style="color: {color}">
  <p>
    <slot />
  </p>
  {#if author}
    <small class="author">
      {author}
    </small>
  {/if}
</blockquote>

<style>
  blockquote {
    width: 80%;
    text-align: center;
    margin: auto auto;
  }
  p::before {
    content: "– ";
  }
  .author {
    color: white;
    display: block;
    text-align: right;
  }
</style>

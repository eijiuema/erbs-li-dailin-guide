<script>
  import HoverableSkill from "./skills/HoverableSkill.svelte";

  export let skills = [];
  export let size;
</script>

<div class="combo">
  {#each skills as skill}
    <div class="skill">
      <HoverableSkill {size} key={skill} />
    </div>
  {/each}
</div>

<style>
  .combo {
    display: flex;
    flex-wrap: wrap;
  }

  .skill {
    margin-bottom: 0.5em;
  }

  .skill:not(:last-child)::after {
    content: "→";
  }
</style>

<script>
  import * as skills from "./skills.json";
  import Icon from "./Icon.svelte";
  export let key;
  let skill = skills[key];
</script>

<div class="skill">
  <Icon src={skill.icon} size={48} />
  <span class="name">{skill.name}</span>
  {#each skill.description as p}
    <p>{p}</p>
  {/each}
</div>

<style>
  .skill {
    padding: 1em;
    text-align: left;
    min-width: 320px;
    max-width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    border-bottom-left-radius: 0;
  }

  .name {
    vertical-align: middle;
    white-space: nowrap;
}
</style>

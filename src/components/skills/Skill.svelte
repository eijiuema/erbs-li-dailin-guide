<script>
  import * as skills from "./skills.json";
  import Icon from "./Icon.svelte";
  export let id;
  let skill = skills[id];
</script>

<div class="skill">
  <Icon src={skill.icon} size={48} key={skill.key} />
  <span class="name">{skill.name}</span>
  {#each skill.description as p}
    <p>{p}</p>
  {/each}
</div>

<style>
  .skill {
    padding: 1em;
    text-align: left;
    background-color: rgba(0, 0, 0, 0.5);
    min-width: 300px;
  }

  .name {
    vertical-align: middle;
    white-space: nowrap;
}
</style>

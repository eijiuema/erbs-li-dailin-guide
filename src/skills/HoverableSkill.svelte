<script>
  import Icon from "./Icon.svelte";
  import Tooltip from "../Tooltip.svelte";
  import Skill from "./Skill.svelte";
  import * as skills from "./skills.json";

  export let key;
  export let size;

  let skill = skills[key];
</script>

<span class="skill">
  <Tooltip>
    <Icon slot="hoverable" src={skill.icon} key={skill.key} {size} />
    <Skill {key} slot="tooltip" />
  </Tooltip>
</span>

<style>
  .skill {
    font-size: 20px;
    text-transform: none;
    position: relative;
    color: #fff;
    vertical-align: middle;
  }
</style>

<script>
  import Modal from "../Modal.svelte";
  import Icon from "./Icon.svelte";
  import Skill from "./Skill.svelte";
  import * as skills from "./skills.json";
  
  export let id;
  export let size = 32;

  let skill = skills[id];
</script>

<span class="skill">
  <Modal>
    <Icon slot="button" src={skill.icon} key={skill.key} {size} />
    <Skill {id} slot="modal" />
  </Modal>
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

<script>
  import CopiableText from "./CopiableText.svelte";
  import HoverableSkill from "./skills/HoverableSkill.svelte";
  import Skill from "./skills/Skill.svelte";
</script>

<div class="container">
  <header>
    <h1>"....Do I really have to do this?"</h1>
    <!-- svelte-ignore a11y-missing-attribute -->
    <img src="img/Tourist_Li_Dailin.png" />
  </header>
  <main>
    <section>
      <h1>Disclaimer</h1>
      <p>
        Pra quem não me conhece, meu nick é uema, e sou mono Li Dailin desde
        novembro de 2020, não posso afirmar que sou a melhor Li Dailin do
        servidor, mas provavelmente a com mais experiência no jogo.
      </p>
      <p>
        Esse guia está longe de completo, e será atualizado sempre que eu tiver
        tempo. Se encontrar algum erro, tiver algum feedback, dúvida ou
        sugestão, pode falar comigo no Discord: <CopiableText
          text="uema#2118"
        />
      </p>
    </section>
    <section>
      <h1>Objetivo</h1>
      <p>
        O intuito desse guia, é passar um conhecimento geral sobre a personagem,
        fugindo um pouco de coisas que variam com atualizações, como rotas e
        builds.
      </p>
      <q class="question">Então esse guia vai ensinar só o básico?</q>
      <q class="answer"
        >Não se engane, apesar de não abordar rotas, vou me aprofundar bastante.</q
      >
      <p>
        A ideia é passar conhecimento teórico o suficiente pra que você entenda
        o personagem, e seja capaz de construir e avaliar jogadas e rotas por
        conta própria, independente do patch.
      </p>
    </section>
    <section>
      <h1>Introdução</h1>
      <p>
        Li Dailin é uma personagem conhecida pela sua mobilidade e por causar
        bastante dano em pouco tempo.
      </p>
      <q class="question">Ok, mas por que minha Li Dailin não dá dano?!</q>
      <small class="author">DE DAILIN, Novato.</small>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube-nocookie.com/embed/r1_iuvZxx4Y"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
      <p>
        Pra causar dano com ela, é necessário entender e utilizar muito bem suas
        skills, que apesar de simples têm diversas nuâncias e pequenos detalhes
        que podem alterar e muito o seu potencial de dano.
      </p>
    </section>
    <section>
      <h1>Skills</h1>
      <section>
        <h2>Passiva</h2>
        <Skill key="T" />
        <p>
          Essa é a principal habilidade da Li Dailin. É o bom aproveitamento
          dela que vai definir quanto de dano você pode causar.
        </p>
        <p>Se você tiver 40 CAS ou mais, ao usar uma habilidade:</p>
        <ol>
          <li>Você consumirá 40 de CAS (exceto W);</li>
          <li>A habilidade vai ganhar um efeito adicional e</li>
          <li>Seu próximo ataque normal sairá duas vezes.</li>
        </ol>
        <p>
          Obs: o segundo ataque tem dano reduzido, mas aumenta conforme o nível
          da passiva.
        </p>
        <p>
          Se você atingir 100 de CAS, ficará silenciado por 5s e todos os
          ataques normais sairão duas vezes, são raros os momentos em que isso é
          útil. Um exemplo é durante a Wickeline.
        </p>
        <aside>
          <video autoplay loop muted>
            <source src="videos/W.mp4" />
          </video>
          <small>
            <ol>
              <li>Ataque normal</li>
              <li>Ataque bêbada</li>
              <li>Ataque alcoolizada</li>
              <li>Ataque embriagada</li>
            </ol>
          </small>
          <video autoplay loop muted>
            <source src="videos/W2.mp4" />
          </video>
          <p><small>Embriagada durante Wickeline</small></p>
        </aside>
      </section>
      <Skill key="Q" />
      <Skill key="W" />
      <Skill key="E" />
      <Skill key="R" />
      <Skill key="DG" />
      <Skill key="DN" />
      <p>
        <HoverableSkill size={72} key="T" />
        <HoverableSkill size={72} key="Q" />
        <HoverableSkill size={72} key="W" />
        <HoverableSkill size={72} key="E" />
        <HoverableSkill size={72} key="R" />
        <HoverableSkill size={72} key="DG" />
        <HoverableSkill size={72} key="DN" />
      </p>
    </section>
  </main>
</div>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  header {
    width: 320px;
  }

  main {
    position: relative;
    margin: 0 1em;
  }

  section {
    position: relative;
    margin: 0 auto 2em;
    max-width: 720px;
  }

  q {
    text-align: center;
    display: block;
    width: 80%;
    margin: 2em auto;
  }

  q.question {
    color: #fccd33;
  }

  q.answer {
    color: #49fc33;
  }

  .author {
    display: block;
    width: 80%;
    text-align: right;
    margin-top: -2em;
    margin-bottom: 2em;
  }

  h1,
  h2 {
    color: #fccd33;
    text-transform: uppercase;
    font-weight: 100;
  }

  video {
    max-width: 100%;
  }

  iframe {
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }

  @media (min-width: 1140px) {
    aside {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 4em;
      left: -320px;
      width: 300px;
    }
  }
</style>

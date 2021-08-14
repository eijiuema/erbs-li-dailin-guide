<script>
  import Combo from "./Combo.svelte";
  import CopiableText from "./CopiableText.svelte";
  import HoverableSkill from "./skills/HoverableSkill.svelte";
  import Skill from "./skills/Skill.svelte";
  import Tooltip from "./Tooltip.svelte";
</script>

<div class="container">
  <header>
    <h1>"....Do I really have to do this?"</h1>
    <!-- svelte-ignore a11y-missing-attribute -->
    <img src="resources/header/Tourist_Li_Dailin.png" />
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
        tempo.
      </p>
      <p>
        Se encontrar algum erro, tiver algum feedback, dúvida ou sugestão, pode
        falar comigo no Discord: <CopiableText text="uema#2118" />
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
      <h1>Habilidades</h1>
      <section>
        <Skill key="T" />
        <p>
          Essa é a principal habilidade da Li Dailin. É o bom aproveitamento
          dela que vai definir quanto de dano você pode causar.
        </p>
        <p>
          Se você tiver
          <Tooltip>
            <span slot="hoverable">40 CAS ou mais</span>
            <span slot="tooltip">
              Use o traço branco em baixo da sua barra de mana como referência.
              <br />
              <br />
              <!-- svelte-ignore a11y-missing-attribute -->
              <img src="resources/habilidades/passiva/barra.png" />
            </span>
          </Tooltip> ao usar uma habilidade:
        </p>
        <ol>
          <li>Você consumirá 40 de CAS (exceto W)</li>
          <li>A habilidade vai ganhar um efeito adicional</li>
          <li>Seu próximo ataque normal sairá duas vezes</li>
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
        <p>
          <Tooltip>
            <span slot="hoverable">
              Obs²: Consumir bebidas alcóolicas dá um bonus considerável de
              velocidade de ataque e é muito importante em builds com pouca
              velocidade de ataque ou durante Alpha/Omega/Wickeline.
            </span>
            <span slot="tooltip">
              <video autoplay loop muted>
                <source src="resources/habilidades/passiva/SadDailin.mp4" />
              </video>
              <p><small>Normal</small></p>
              <video autoplay loop muted>
                <source src="resources/habilidades/passiva/HappyDailin.mp4" />
              </video>
              <p><small>Com bêbida</small></p>
            </span>
          </Tooltip>
        </p>
        <aside>
          <video autoplay loop muted>
            <source src="resources/habilidades/passiva/ataques.mp4" />
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
            <source src="resources/habilidades/passiva/silence.mp4" />
          </video>
          <p><small>Embriagada durante Wickeline</small></p>
        </aside>
      </section>
      <section>
        <Skill key="Q" />
        <p>
          Essa habilidade é a principal mobilidade da Li Dailin, cada uso dá um
          dash, e o terceiro dash pode atravessar paredes.
        </p>
        <p>Existem alguns detalhes importantes sobre essa habilidade:</p>
        <ol>
          <li>
            <Tooltip>
              <span slot="hoverable">
                Se a primeira ativação da habilidade foi buffada por
                alcoolizada, as duas ativações seguintes também serão
              </span>
              <span slot="tooltip">
                <video autoplay loop muted>
                  <source src="resources/habilidades/q/WQTQTQT.mp4" />
                </video>
              </span>
            </Tooltip>
          </li>
          <li>
            <Tooltip>
              <span slot="hoverable">
                Nenhuma das ativações atravessa unidades inimigas, isso é,
                jogadores, animais, Wickeline, etc
              </span>
              <span slot="tooltip">
                <video autoplay loop muted>
                  <source src="resources/habilidades/q/QQQ.mp4" />
                </video>
              </span>
            </Tooltip>
          </li>
          <li>
            <Tooltip>
              <span slot="hoverable">
                Qualquer atordoamento, empurrão ou enraizamento cancela o dash
              </span>
              <span slot="tooltip">
                <video autoplay loop muted>
                  <source src="resources/habilidades/q/QJavas.mp4" />
                </video>
              </span>
            </Tooltip>
          </li>
        </ol>
        <aside>
          <video autoplay loop muted>
            <source src="resources/habilidades/q/Q.mp4" />
          </video>
          <p><small>Q normal</small></p>
          <video autoplay loop muted>
            <source src="resources/habilidades/q/WQ.mp4" />
          </video>
          <p><small>Q buffado</small></p>
        </aside>
      </section>
      <section>
        <Skill key="W" />
        <p>
          Cada uso dessa habilidade vai te dar 45 de CAS e te deixa imune a
          ataques básicos durante a animação.
        </p>
        <q class="question"
          >Eu ganho mais mobilidade, mais dano e fico imune a ataque básico...
          Vou spammar essa skill então!</q
        >
        <small class="author"
          >DE DAILIN, Novato.
          <!-- svelte-ignore a11y-missing-attribute -->
          <img class="center" src="resources/habilidades/w/WastedDailin.png" />
        </small>

        <p>
          É interessante sempre manter a barra acima de 40 CAS, pra caso seja
          necessário usar uma habilidade buffada imediatamente, mas é preciso
          controlar o uso pra não se silenciar sem querer.
        </p>
        <p>
          No geral, use <HoverableSkill key="W" /> sempre que seu CAS chegar em <Tooltip
          >
            <span slot="hoverable">40</span>
            <span slot="tooltip">
              <!-- svelte-ignore a11y-missing-attribute -->
              <img src="resources/habilidades/passiva/barra.png" />
            </span>
          </Tooltip>.
        </p>
        <p>
          Outro detalhe importante, é que cada ataque básico reduz o tempo de
          recarga de <HoverableSkill key="W" /> em 1s, incluíndo o ataque duplo da
          passiva <HoverableSkill key="T" />.
        </p>
      </section>
      <section>
        <Skill key="E" />
        <p>
          Esse é o famigerado silence da Li Dailin, a habilidade também dá
          lentidão, mas na maioria das vezes é usada pelo silenciamento.
        </p>
        <p>
          Pra silenciar é necessário usar a skill buffada, e ela tem um tempo de
          conjuração relativamente alto, então pense bem antes de usa-la pra
          fugir ou perseguir alguém.
        </p>
        <p>
          O momento ideal pra usar o silenciamento varia muito do momento e da
          match up, e será abordado mais pra frente no guia.
        </p>
        <p>
          Obs: Nem todo tipo de conjuração é cancelado pelo silence, varia
          habilidade por habilidade.
        </p>
        <aside>
          <video autoplay loop muted>
            <source src="resources/habilidades/e/EJavas.mp4" />
          </video>
          <p><small>Silence no dash do Javali</small></p>
          <video autoplay loop muted>
            <source src="resources/habilidades/e/EAlpha.mp4" />
          </video>
          <p><small>Silence no knockback do Alpha</small></p>
        </aside>
      </section>
      <section>
        <Skill key="R" />
        <p>
          A ultimate da Li Dailin é um dash que suprime o alvo por 0.7s (1.2s se
          alcoolizada).
        </p>
        <p>
          O dano da habilidade aumenta conforme a vida perdida, mas não é
          baseado na vida máxima do alvo.
        </p>
        <p>Observações importantes:</p>
        <ol>
          <li>O dash atravessa paredes</li>
          <li>
            O cooldown é bem alto (180/150/115s), mas é reduzido em 40% se
            acertar um alvo
          </li>
          <li>
            <Tooltip>
              <span slot="hoverable">
                A Li Dailin fica imparável durante o dash
              </span>
              <span slot="tooltip">
                <video autoplay loop muted>
                  <source src="resources/habilidades/r/RAlpha2.mp4" />
                </video>
              </span>
            </Tooltip>
          </li>
          <li>
            <Tooltip>
              <span slot="hoverable">
                A Li Dailin não fica imparável durante a supressão
              </span>
              <span slot="tooltip">
                <video autoplay loop muted>
                  <source src="resources/habilidades/r/RAlpha1.mp4" />
                </video>
              </span>
            </Tooltip>
          </li>
          <li>
            <Tooltip>
              <span slot="hoverable"> O hitbox é estranho</span>
              <span slot="tooltip">
                <video autoplay loop muted>
                  <source src="resources/habilidades/r/RAlpha3.mp4" />
                </video>
              </span>
            </Tooltip>
          </li>
        </ol>
      </section>
      <section>
        <Skill key="DG" />
        <p>
          É uma habilidade target, não interrompível, que funciona como um
          ataque básico normal, mas com dano aumentado e causa dano verdadeiro
          adicional.
        </p>
        <p>
          Não existe um momento certo pra usar ela, recomendo usar sempre que
          sair do cooldown ou para garantir um last hit.
        </p>
        <p>
          Obs: o alcance dessa habilidade é maior que o alcance padrão de ataque
          básico, então ela dá um pequeno dash.
        </p>
      </section>
      <section>
        <Skill key="DN" />
        <p>
          São bem raras as situações em que é possível carregar o stun e ainda
          assim acertar o alvo, pois é possível ouvir o Nunchaku sendo carregado
          de muito longe.
        </p>
        <p>
          Então, no geral é utilizado como um pequeno dano adicional no combo,
          para finalizar kills à distância ou para farmar.
        </p>
      </section>
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
    <section>
      <h1>Combos</h1>
      <q class="question"
        >Tá, eu já entendi as habilidades, mas você pode me falar logo como eu
        combo?</q
      >
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="resources/combos/Well.jpg" />
      <p>
        Como eu falei antes, é o bom aproveitamento da passiva que define quanto
        dano você pode causar, então não existe um combo certo ou errado, tudo é
        situacional.
      </p>
      <p>Numa situacão perfeita, o combo com o maior dano é aquele que maximiza o uso da passiva, por exemplo: </p>
      <video style="float: left; margin-right: 1em;" autoplay loop muted>
        <source src="resources/combos/Combo.mp4" />
      </video>
      <Combo
        size={48}
        skills={[
          "W",
          "W",
          "DG",
          "T",
          "Q",
          "T",
          "W",
          "T",
          "Q",
          "T",
          "Q",
          "T",
          "E",
          "T",
          "R",
          "T",
          "DG",
        ]}
      />
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

  img {
    max-width: 100%;
  }

  .center {
    display: block;
    margin: 0 auto;
  }

  li {
    margin-top: 0.5em;
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

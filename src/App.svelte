<script>
  import Combo from "./Combo.svelte";
  import CopiableText from "./CopiableText.svelte";
  import HoverableSkill from "./skills/HoverableSkill.svelte";
  import Skill from "./skills/Skill.svelte";
  import Tooltip from "./Tooltip.svelte";
  import Video from "./Video.svelte";
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
          <Tooltip width="320">
            <span slot="hoverable">40 CAS ou mais</span>
            <span slot="tooltip">
              <span
                >Use o traço branco em baixo da sua barra de mana como
                referência.</span
              >
              <!-- svelte-ignore a11y-missing-attribute -->
              <img src="resources/habilidades/passiva/barra.png" />
            </span>
          </Tooltip> ao usar uma habilidade:
        </p>
        <ol>
          <li>Você consumirá 40 de CAS (exceto W).</li>
          <li>A habilidade vai ganhar um efeito adicional (exceto W).</li>
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
        <p>
          <Tooltip>
            <span slot="hoverable">
              Obs²: Consumir bebidas alcóolicas dá um bonus considerável de
              velocidade de ataque e é muito importante em builds com pouca
              velocidade de ataque ou durante Alpha/Omega/Wickeline.
            </span>
            <span slot="tooltip">
              <Video
                src="resources/habilidades/passiva/SadDailin.mp4"
                autoplay
              />
              <p><small>Normal</small></p>
              <Video
                src="resources/habilidades/passiva/HappyDailin.mp4"
                autoplay
              />
              <p><small>Com bebida</small></p>
            </span>
          </Tooltip>
        </p>
        <aside>
          <Video src="resources/habilidades/passiva/ataques.mp4" />
          <small>
            <ol>
              <li>Ataque normal</li>
              <li>Ataque bêbada</li>
              <li>Ataque alcoolizada</li>
              <li>Ataque embriagada</li>
            </ol>
          </small>
          <Video src="resources/habilidades/passiva/silence.mp4" />
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
                <Video src="resources/habilidades/q/WQTQTQT.mp4" autoplay />
              </span>
            </Tooltip>.
          </li>
          <li>
            <Tooltip>
              <span slot="hoverable">
                Nenhuma das ativações atravessa unidades inimigas, isso é,
                jogadores, animais, Wickeline, etc
              </span>
              <span slot="tooltip">
                <Video src="resources/habilidades/q/QQQ.mp4" autoplay />
              </span>
            </Tooltip>.
          </li>
          <li>
            <Tooltip>
              <span slot="hoverable">
                Qualquer atordoamento, empurrão ou enraizamento cancela o dash
              </span>
              <span slot="tooltip">
                <Video src="resources/habilidades/q/QJavas.mp4" autoplay />
              </span>
            </Tooltip>.
          </li>
        </ol>
        <aside>
          <Video src="resources/habilidades/q/Q.mp4" />
          <p><small>Q normal</small></p>
          <Video src="resources/habilidades/q/WQ.mp4" />
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
            width="120"
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
          <Video src="resources/habilidades/e/EJavas.mp4" />
          <p><small>Silence no dash do Javali</small></p>
          <Video src="resources/habilidades/e/EAlpha.mp4" />
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
          <li>O dash atravessa paredes.</li>
          <li>
            O cooldown é bem alto (180/150/115s), mas é reduzido em 40% se
            acertar um alvo.
          </li>
          <li>
            <Tooltip>
              <span slot="hoverable">
                A Li Dailin fica imparável durante o dash
              </span>
              <span slot="tooltip">
                <Video src="resources/habilidades/r/RAlpha2.mp4" autoplay />
              </span>
            </Tooltip>.
          </li>
          <li>
            <Tooltip>
              <span slot="hoverable">
                A Li Dailin não fica imparável durante a supressão
              </span>
              <span slot="tooltip">
                <Video src="resources/habilidades/r/RAlpha1.mp4" autoplay />
              </span>
            </Tooltip>.
          </li>
          <li>
            <Tooltip>
              <span slot="hoverable"> O hitbox é estranho</span>
              <span slot="tooltip">
                <Video src="resources/habilidades/r/RAlpha3.mp4" autoplay />
              </span>
            </Tooltip>.
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
      <p>
        Numa situacão perfeita, o combo com o maior dano é aquele que maximiza o
        uso da passiva, por exemplo:
      </p>
      <Video src="resources/combos/Combo.mp4" />
      <br />
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
      <p>
        No entanto o seu inimigo não é um boneco de treino. Então na maioria das
        vezes você vai ser obrigado a desperdiçar uma passiva ou outra, ou vai
        ter alguma habilidade interrompida.
      </p>
      <p>
        O combo mostrado acima é apenas um exemplo de aproveitamento da passiva,
        não se limite a ele. Situações diferentes vão exigir combos diferentes e
        saber se adaptar é absolutamente necessário.
      </p>
      <p>
        Mas não se preocupe, você não vai ter que lutar 10x contra o mesmo
        personagem pra aprender os combos apropriados, mais pra frente no guia
        eu vou explicar como agir em cada um dos match ups.
      </p>
    </section>
    <section>
      <h1><strike>Builds</strike> Stats</h1>
      <p>
        Esse guia não vai ter uma seção de builds. Use o buscador de planos
        dentro do jogo.
      </p>
      <q class="question"
        ><img src="resources/stats/scammed.gif" alt="Emote SCAM" /></q
      >
      <small class="author">PROCURANDO BUILD, Novato.</small>
      <q class="answer"
        >Calma, eu posso explicar <img
          style="vertical-align: middle;"
          src="resources/stats/D.png"
          alt="Emote D:"
        /></q
      >
      <p>
        Eu poderia fazer guias separados pra cada uma das builds possíveis de Li
        Dailin, mas eu tenho bons motivos para não fazer isso:
      </p>
      <ul>
        <li>Li Dailin tem muita build.</li>
        <li>
          Eu tenho pouco tempo <strike
            ><small>(talvez isso seja mentira)</small></strike
          >.
        </li>
      </ul>
      <p>
        Mas tendo uma visão geral sobre quais stats devem ser priorizados e como
        eles afetam o estilo de jogo, você pode pesquisar builds dentro do jogo
        e decidir por conta própria quais usar.
      </p>
      <h2>Stats ofensivos</h2>
      <ul>
        <li>
          Poder de Ataque: aumenta o dano dos ataques básicos e habilidades.
        </li>
        <li>
          Chance/Dano Crítico: é interessante em builds <Tooltip>
            <span slot="hoverable">glass cannon</span>
            <span slot="tooltip"
              >Build que sacrifica defesa pra ter mais dano</span
            >
          </Tooltip> e é eficiente contra alvos com pouca defesa.
        </li>
        <li>
          Dano Extra de Ataque Básico: aumenta o dano dos ataques básicos
          ignorando defesa, é interessante em builds mais tanks, e é eficiente
          contra alvos com muita defesa.
        </li>
      </ul>
      <h2>Stats defensivos</h2>
      <ul>
        <li>
          Defesa: é bom contra danos que não ignoram armadura <small
            >(duh)</small
          >.
        </li>
        <li>
          Vida: é bom contra Dano Extra de Ataque Básico, Dano Extra de Habilidade, Armadilhas e Dano
          Verdadeiro.
        </li>
        <li>
          Roubo de vida + <HoverableSkill key="T" /> =
          <img
            style="vertical-align: middle; height: 1.7em;"
            src="resources/stats/dailinSmile.png"
            alt="Emote Li Dailin Sorrindo"
          />.
        </li>
      </ul>
      <p>
        Obs: o interessante é ter um equilibrio entre Vida e Defesa, por
        exemplo: +300 de Vida e +40 de defesa
      </p>
      <h2>Stats úteis</h2>
      <ul>
        <li>
          Velocidade de movimento: quanto mais velocidade, menos você depende do
          seu <HoverableSkill key="Q" /> pra se aproximar, e mais você pode aproveitar
          a passiva.
        </li>
        <li>
          Redução de Tempo de Recarga: menos tempo de recarga, mais skills, mais
          mobilidade, mais passivas.
        </li>
        <li>
          Visão: Ter mais visão ajuda a abusar da mobilidade e do burst pra
          fugir ou dar third-party.
        </li>
      </ul>
      <h2>Stats situacionais</h2>
      <ul>
        Velocidade de ataque: é interessante ter pelo menos 1.0 de velocidade de
        ataque. Na Luva não é necessário fazer itens de velocidade de ataque, no
        Nunchaku 20~30% é suficiente.
      </ul>
      <h2>Outros stats</h2>
      <ul>
        <li>
          Dano Extra de Habilidade: Esse stat é interessante em personagens com
          muitos hits de habilidade, a Li Dailin num combo completo tem só 8
          hits, então no geral é um stat desnecessário.
        </li>
        <li>
          Alcance de ataque: É um stat interessante e relativamente útil, mas
          que não vale a pena ir atrás. E no caso do Nunchaku, ele já está
          presente no Cerberus e é um passivo único.
        </li>
      </ul>
      <q class="question">Tá, mas essa build aqui é boa? 177013</q>
      <q class="answer"
        >No geral, se ela prioriza stat ofensivo, faz stat defensivo e um pouco
        de stat útil, é uma boa build.</q
      >
    </section>
    <section>
      <h1>Match ups</h1>
    </section>
    <section>
      <h1>Streams</h1>
      <p>
        O melhor jeito de aprender Eternal é assistindo, e com Li Dailin não é
        diferente, segue a lista de streams que eu recomendo:
      </p>
      <ul>
        <li><a href="https://www.twitch.tv/qhrudwkd777">트백</a></li>
        <li><a href="https://www.twitch.tv/bi9sean55">BigSean</a></li>
        <li><a href="https://www.twitch.tv/lnerotv">lNeroTV</a></li>
        <li><a href="https://www.twitch.tv/shuvisenpai">ShuviSenpai</a></li>
        <li>
          <a href="https://www.twitch.tv/uemaaaaa">uemaaaaa</a>
          <small>(De vez em nunca eu streamo)</small>
        </li>
      </ul>
    </section>
  </main>
</div>

<style>
  :root {
    --yellow: #fccd33;
    --green: #49fc33;
  }

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
    margin: 0 0.5em;
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
    color: var(--yellow);
  }

  q.answer {
    color: var(--green);
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
    color: var(--yellow);
    text-transform: uppercase;
    font-weight: 100;
  }

  iframe {
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }

  .center {
    display: block;
    margin: 0 auto;
  }

  img {
    max-width: 100%;
  }

  li {
    margin-top: 0.5em;
  }

  a[href] {
    color: var(--yellow);
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

<script>
  import countapi from "countapi-js";
  import CopiableText from "./components/CopiableText.svelte";
  import Figure from "./components/Figure.svelte";
  import Answer from "./components/quotes/Answer.svelte";
  import Question from "./components/quotes/Question.svelte";
  import Combo from "./components/skills/Combo.svelte";
  import HoverableSkill from "./components/skills/SkillModal.svelte";
  import Skill from "./components/skills/Skill.svelte";
  import TextModal from "./components/TextModal.svelte";
  import Tooltip from "./components/Tooltip.svelte";
  import TooltipText from "./components/TooltipText.svelte";
  import Video from "./components/Video.svelte";
  countapi.visits().then((result) => console.log(result.value));
</script>

<div class="container">
  <h1>"....Do I really have to do this?"</h1>
  <Figure height="50vh" src="resources/header/Tourist_Li_Dailin.png" />
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
    <Question>Então esse guia vai ensinar só o básico?</Question>
    <Answer
      >Não se engane, apesar de não abordar rotas, vou me aprofundar bastante.</Answer
    >
    <p>
      A ideia é passar conhecimento teórico o suficiente pra que você entenda o
      personagem, e seja capaz de construir e avaliar jogadas e rotas por conta
      própria, independente do patch.
    </p>
  </section>
  <section>
    <h1>Introdução</h1>
    <p>
      Li Dailin é uma personagem conhecida pela sua mobilidade e por causar
      bastante dano em pouco tempo.
    </p>
    <Question author="DE DAILIN, Novato">
      Ok, mas por que minha Li Dailin não dá dano?!
    </Question>
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
      <Skill id="T" />
      <p>
        Essa é a principal habilidade da Li Dailin. É o bom aproveitamento dela
        que vai definir quanto de dano você pode causar.
      </p>
      <p>
        Se você tiver
        <TextModal text="40 CAS ou mais">
          <Figure
            height="48px"
            src="resources/habilidades/passiva/barra.png"
            caption="Use o traço branco em baixo da sua barra de mana como referência"
          />
        </TextModal>
        ao usar uma habilidade:
      </p>
      <ol>
        <li>
          Você consumirá 40 de CAS <small
            >(exceto <HoverableSkill id="W" />)</small
          >.
        </li>
        <li>
          A habilidade vai ganhar um efeito adicional <small
            >(exceto <HoverableSkill id="W" />)</small
          >.
        </li>
        <li>
          <TooltipText
            text="Seu próximo ataque normal sairá duas vezes."
            tip="O segundo ataque tem dano reduzido, mas aumenta conforme o nível da
          passiva"
          />
        </li>
      </ol>
      <p>
        Se você atingir 100 de CAS, ficará <span class="yellow"
          >silenciado por 5s</span
        >
        e todos os ataques normais sairão duas vezes, são raros os momentos em que
        isso é útil. Um exemplo é <TextModal
          text="durante
      a Wickeline."
        >
          <Video
            src="resources/habilidades/passiva/silence.mp4"
            caption="Embriagada durante Wickeline"
          />
        </TextModal>
      </p>
      <div class="flex">
        <Video
          src="resources/habilidades/passiva/AA1.mp4"
          caption="Ataque normal"
        />
        <Video
          src="resources/habilidades/passiva/AA2.mp4"
          caption="Ataque bêbada"
        />
        <Video
          src="resources/habilidades/passiva/AA3.mp4"
          caption="Ataque alcoolizada"
        />
        <Video
          src="resources/habilidades/passiva/AA4.mp4"
          caption="Ataque embriagada"
        />
      </div>
      <p>
        <b class="yellow"
          >É muito importante não cancelar o segundo ataque da passiva, ele
          depende da sua velocidade de ataque e é cancelado por movimentação ou
          uso de habilidades.</b
        >
      </p>
      <div class="flex">
        <Video src="resources/habilidades/passiva/wqtqtqt.mp4" caption="✓" />
        <Video src="resources/habilidades/passiva/wqaqaqa.mp4" caption="✗" />
      </div>
      <p>
        Consumir bebidas alcóolicas dá
        <TextModal text="bonus considerável de velocidade de ataque">
          <div class="flex">
            <Video
              src="resources/habilidades/passiva/SadDailin.mp4"
              caption="Normal"
            />
            <Video
              src="resources/habilidades/passiva/HappyDailin.mp4"
              caption="Com bebida"
            />
          </div>
        </TextModal>
        e é muito importante em builds com pouca velocidade de ataque ou durante
        Alpha / Omega / Wickeline.
      </p>
    </section>
    <section>
      <Skill id="Q" />
      <p>
        Essa habilidade é a principal mobilidade e a principal fonte de dano da
        Li Dailin, cada uso dá um dash, e o terceiro dash pode atravessar
        paredes.
      </p>
      <p>
        <b>Obs: O tempo de recarga dessa habilidade só começa a contar a partir da última ativação!</b>
      </p>
      <p>Outros detalhes importantes sobre essa habilidade:</p>
      <div class="flex">
        <Video
          width="320px"
          src="resources/habilidades/q/WQTQTQT.mp4"
          caption="Se a primeira ativação da habilidade foi buffada por alcoolizada,
            as duas ativações seguintes também serão"
        />
        <Video
          width="320px"
          src="resources/habilidades/q/QQQ.mp4"
          caption="Nenhuma das ativações atravessa unidades inimigas, isso é,
        jogadores, animais, Wickeline, etc"
        />
        <Video
          width="320px"
          src="resources/habilidades/q/QJavas.mp4"
          caption="Qualquer atordoamento, empurrão ou enraizamento cancela o dash"
        />
      </div>
      <p>
        A diferença entre o <HoverableSkill id="Q" /> buffado e não buffado é um
        aumento do dano e do alcance do pulo.
      </p>
      <div class="flex">
        <Video src="resources/habilidades/q/Q.mp4" caption="Q normal" />
        <Video src="resources/habilidades/q/WQ.mp4" caption="Q buffado" />
      </div>
    </section>
    <section>
      <Skill id="W" />
      <p>
        Cada uso dessa habilidade vai te dar 45 de CAS e te deixa imune a
        ataques básicos durante a animação.
      </p>
      <Question>
        Eu ganho mais mobilidade, mais dano e fico imune a ataque básico... Vou
        spammar essa skill então!
      </Question>
      <Figure
        height="160px"
        src="resources/habilidades/w/WastedDailin.png"
        caption="DE DAILIN, Novato."
      />

      <p>
        É interessante sempre manter a barra acima de 40 CAS, pra caso seja
        necessário usar uma habilidade buffada imediatamente, mas é preciso
        controlar o uso pra não se silenciar sem querer.
      </p>
      <p>
        No geral, use <HoverableSkill id="W" /> sempre que seu CAS chegar em <TextModal
          text="40"
        >
          <Figure
            height="48px"
            src="resources/habilidades/passiva/barra.png"
            caption="Use o traço branco em baixo da sua barra de mana como referência"
          />
        </TextModal>.
      </p>
      <p>
        Outro detalhe importante, é que cada ataque básico reduz o tempo de
        recarga de <HoverableSkill id="W" /> em 1s, incluíndo o ataque duplo da passiva
        <HoverableSkill id="T" />.
      </p>
    </section>
    <section>
      <Skill id="E" />
      <p>
        Esse é o famigerado silence da Li Dailin, a habilidade também dá
        lentidão, mas na maioria das vezes é usada pelo silenciamento.
      </p>
      <Figure
        center
        width="320px"
        src="resources/habilidades/e/spitDailin.png"
      />
      <p>
        Pra silenciar é necessário usar a skill buffada, e ela tem um tempo de
        conjuração relativamente alto, então pense bem antes de usa-la pra fugir
        ou perseguir alguém.
      </p>
      <p>
        O momento ideal pra usar o silenciamento varia muito do momento e da
        match up, e será abordado mais pra frente no guia.
      </p>
      <p>
        Nem todo tipo de conjuração é cancelado pelo silence, varia habilidade
        por habilidade.
      </p>
      <div class="flex">
        <Video
          src="resources/habilidades/e/EJavas.mp4"
          caption="Silence no dash do Javali"
        />
        <Video
          src="resources/habilidades/e/EAlpha.mp4"
          caption="Silence no knockback do Alpha"
        />
      </div>
    </section>
    <section>
      <Skill id="R" />
      <p>
        A ultimate da Li Dailin é um dash que suprime o alvo por 0.7s (1.2s se
        alcoolizada).
      </p>
      <p>
        O dano da habilidade aumenta conforme a vida perdida, mas não é baseado
        na vida máxima do alvo.
      </p>
      <p>Observações importantes:</p>
      <ol>
        <li>O dash atravessa paredes.</li>
        <li>
          O cooldown é bem alto (180/150/115s), mas é reduzido em 40% se acertar
          um alvo.
        </li>
        <li>
          <TextModal text="A Li Dailin fica imparável durante o dash">
            <Video
              src="resources/habilidades/r/RAlpha2.mp4"
              caption="A Li Dailin fica imparável durante o dash"
            />
          </TextModal>
        </li>
        <li>
          <TextModal text="A Li Dailin não fica imparável durante a supressão">
            <Video
              src="resources/habilidades/r/RAlpha1.mp4"
              caption="A Li Dailin não fica imparável durante a supressão"
            />
          </TextModal>
        </li>
        <li>
          <TextModal text="O hitbox é estranho">
            <Video
              src="resources/habilidades/r/RAlpha3.mp4"
              caption="O hitbox é estranho"
            />
          </TextModal>
        </li>
      </ol>
    </section>
    <section>
      <Skill id="DG" />
      <p>
        É uma habilidade target, não interrompível, que funciona como um ataque
        básico normal, mas com dano aumentado e causa dano verdadeiro adicional.
      </p>
      <p>
        Não existe um momento certo pra usar ela, recomendo usar sempre que sair
        do cooldown ou para garantir um last hit.
      </p>
      <p>
        Obs: o alcance dessa habilidade é maior que o alcance padrão de ataque
        básico, então ela dá um pequeno dash.
      </p>
    </section>
    <section>
      <Skill id="DN" />
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
    <Question
      >Tá, eu já entendi as habilidades, mas você pode me falar logo como eu
      combo?</Question
    >
    <!-- svelte-ignore a11y-missing-attribute -->
    <Figure src="resources/combos/Well.jpg" />
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
        "Q",
        "T",
        "W",
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
      vezes você vai ser obrigado a desperdiçar uma passiva ou outra, ou vai ter
      alguma habilidade interrompida.
    </p>
    <p>
      O combo mostrado acima é apenas um exemplo de aproveitamento da passiva,
      não se limite a ele. Situações diferentes vão exigir combos diferentes e
      saber se adaptar é absolutamente necessário.
    </p>
    <p>
      Mas não se preocupe, você não vai ter que lutar 10x contra o mesmo
      personagem pra aprender os combos apropriados, mais pra frente no guia eu
      vou explicar como agir em cada um dos match ups.
    </p>
  </section>
  <section>
    <h1><strike>Builds</strike> Stats</h1>
    <p>
      Esse guia não vai ter uma seção de builds. Use o buscador de planos dentro
      do jogo ou procure no canal de texto de builds no discord <a
        href="https://discord.gg/K3H5V3h6Xk">Hotel de Lumia</a
      >.
    </p>
    <Question author="PROCURANDO BUILD, Novato.">
      <img src="resources/stats/scammed.gif" alt="Emote SCAM" />
    </Question>
    <Answer>
      Calma, eu posso explicar <img
        style="vertical-align: middle;"
        src="resources/stats/D.png"
        alt="Emote D:"
      />
    </Answer>
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
      eles afetam o estilo de jogo, você pode pesquisar builds dentro do jogo e
      decidir por conta própria quais usar.
    </p>
    <h2>Stats ofensivos</h2>
    <ul>
      <li>
        Poder de Ataque: aumenta o dano dos ataques básicos e habilidades.
      </li>
      <li>
        Chance/Dano Crítico: é interessante em builds <TooltipText
          text="glass cannon"
          tip="Build que sacrifica defesa pra ter mais dano"
        /> e é eficiente contra alvos com pouca defesa.
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
        Defesa: é bom contra danos que não ignoram armadura <small>(duh)</small
        >.
      </li>
      <li>
        Vida: é bom contra Dano Extra de Ataque Básico, Dano Extra de
        Habilidade, Armadilhas e Dano Verdadeiro.
      </li>
      <li>
        Roubo de vida + <HoverableSkill id="T" /> =
        <img
          style="vertical-align: middle; height: 1.7em;"
          src="resources/stats/dailinSmile.png"
          alt="Emote Li Dailin Sorrindo"
        />.
      </li>
    </ul>
    <p>
      Obs: o interessante é ter um equilibrio entre Vida e Defesa, por exemplo:
      +300 de Vida e +40 de defesa
    </p>
    <h2>Stats úteis</h2>
    <ul>
      <li>
        Velocidade de movimento: quanto mais velocidade, menos você depende do
        seu <HoverableSkill id="Q" /> pra se aproximar, e mais você pode aproveitar
        a passiva.
      </li>
      <li>
        Redução de Tempo de Recarga: menos tempo de recarga, mais skills, mais
        mobilidade, mais passivas.
      </li>
      <li>
        Visão: Ter mais visão ajuda a abusar da mobilidade e do burst pra fugir
        ou dar third-party.
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
        muitos hits de habilidade, a Li Dailin num combo completo tem só 8 hits,
        então no geral é um stat desnecessário.
      </li>
      <li>
        Dano de Habilidade: Apesar de forte, a Li Dailin se beneficia mais de
        itens de poder de ataque, e pouquissimos itens tem ambos os stats, um
        exemplo de item bom é Vingança de Goujian.
      </li>
      <li>
        Alcance de ataque: É um stat interessante e relativamente útil, mas que
        não vale a pena ir atrás. E no caso do Nunchaku, ele já está presente no
        Cerberus e é um passivo único.
      </li>
    </ul>
    <Question>Tá, mas como eu sei que uma build é boa?</Question>
    <Answer>
      No geral, se ela prioriza stat ofensivo, faz stat defensivo e um pouco de
      stat útil, é uma boa build. Stats que não foram citados são pouco
      relevantes ou irrelevantes.
    </Answer>
  </section>
  <section>
    <h1>Match ups</h1>
    <p>Em construção</p>
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
  <section>
    <Figure
      center
      width="320px"
      src="resources/praiseDailin.png"
      caption="Obrigado por ler esse guia até o final, e boa sorte!"
    />
  </section>
</div>

<style>
  :root {
    --yellow: #fccd33;
    --green: #49fc33;
  }

  .yellow {
    color: #fccd33;
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
    margin: 1em auto;
  }

  a[href] {
    color: var(--yellow);
  }

  li {
    margin-top: 8px;
  }

  .flex {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    vertical-align: middle;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
  }
</style>

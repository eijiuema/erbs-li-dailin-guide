var app=function(){"use strict";function e(){}function t(e){return e()}function a(){return Object.create(null)}function o(e){e.forEach(t)}function n(e){return"function"==typeof e}function s(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let r,i;function l(e,t){return r||(r=document.createElement("a")),r.href=t,e===r.href}function c(e,t,a,o){if(e){const n=u(e,t,a,o);return e[0](n)}}function u(e,t,a,o){return e[1]&&o?function(e,t){for(const a in t)e[a]=t[a];return e}(a.ctx.slice(),e[1](o(t))):a.ctx}function d(e,t,a,o){if(e[2]&&o){const n=e[2](o(a));if(void 0===t.dirty)return n;if("object"==typeof n){const e=[],a=Math.max(t.dirty.length,n.length);for(let o=0;o<a;o+=1)e[o]=t.dirty[o]|n[o];return e}return t.dirty|n}return t.dirty}function p(e,t,a,o,n,s){if(n){const r=u(t,a,o,s);e.p(r,n)}}function m(e){if(e.ctx.length>32){const t=[],a=e.ctx.length/32;for(let e=0;e<a;e++)t[e]=-1;return t}return-1}function $(e,t){e.appendChild(t)}function f(e,t,a){e.insertBefore(t,a||null)}function g(e){e.parentNode.removeChild(e)}function b(e,t){for(let a=0;a<e.length;a+=1)e[a]&&e[a].d(t)}function v(e){return document.createElement(e)}function k(e){return document.createTextNode(e)}function h(){return k(" ")}function x(e,t,a){null==a?e.removeAttribute(t):e.getAttribute(t)!==a&&e.setAttribute(t,a)}function y(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function q(e,t,a,o){e.style.setProperty(t,a,o?"important":"")}function C(e){i=e}const w=[],z=[],D=[],L=[],A=Promise.resolve();let T=!1;function E(e){D.push(e)}let S=!1;const _=new Set;function j(){if(!S){S=!0;do{for(let e=0;e<w.length;e+=1){const t=w[e];C(t),Q(t.$$)}for(C(null),w.length=0;z.length;)z.pop()();for(let e=0;e<D.length;e+=1){const t=D[e];_.has(t)||(_.add(t),t())}D.length=0}while(w.length);for(;L.length;)L.pop()();T=!1,S=!1,_.clear()}}function Q(e){if(null!==e.fragment){e.update(),o(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(E)}}const H=new Set;let M;function N(e,t){e&&e.i&&(H.delete(e),e.i(t))}function O(e,t,a,o){if(e&&e.o){if(H.has(e))return;H.add(e),M.c.push((()=>{H.delete(e),o&&(a&&e.d(1),o())})),e.o(t)}}function W(e){e&&e.c()}function B(e,a,s,r){const{fragment:i,on_mount:l,on_destroy:c,after_update:u}=e.$$;i&&i.m(a,s),r||E((()=>{const a=l.map(t).filter(n);c?c.push(...a):o(a),e.$$.on_mount=[]})),u.forEach(E)}function R(e,t){const a=e.$$;null!==a.fragment&&(o(a.on_destroy),a.fragment&&a.fragment.d(t),a.on_destroy=a.fragment=null,a.ctx=[])}function G(e,t){-1===e.$$.dirty[0]&&(w.push(e),T||(T=!0,A.then(j)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function I(t,n,s,r,l,c,u,d=[-1]){const p=i;C(t);const m=t.$$={fragment:null,ctx:null,props:c,update:e,not_equal:l,bound:a(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(p?p.$$.context:n.context||[]),callbacks:a(),dirty:d,skip_bound:!1,root:n.target||p.$$.root};u&&u(m.root);let $=!1;if(m.ctx=s?s(t,n.props||{},((e,a,...o)=>{const n=o.length?o[0]:a;return m.ctx&&l(m.ctx[e],m.ctx[e]=n)&&(!m.skip_bound&&m.bound[e]&&m.bound[e](n),$&&G(t,e)),a})):[],m.update(),$=!0,o(m.before_update),m.fragment=!!r&&r(m.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);m.fragment&&m.fragment.l(e),e.forEach(g)}else m.fragment&&m.fragment.c();n.intro&&N(t.$$.fragment),B(t,n.target,n.anchor,n.customElement),j()}C(p)}class P{$destroy(){R(this,1),this.$destroy=e}$on(e,t){const a=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return a.push(t),()=>{const e=a.indexOf(t);-1!==e&&a.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function F(e){let t,a;return{c(){t=v("span"),a=k(e[1]),x(t,"class","key svelte-j4pn79")},m(e,o){f(e,t,o),$(t,a)},p(e,t){2&t&&y(a,e[1])},d(e){e&&g(t)}}}function J(t){let a,o,n,s,r=t[1]&&F(t);return{c(){a=v("span"),o=v("img"),s=h(),r&&r.c(),l(o.src,n=t[0])||x(o,"src",n),x(o,"alt",t[1]),x(o,"class","svelte-j4pn79"),x(a,"class","container svelte-j4pn79"),q(a,"--size",t[2]+"px")},m(e,t){f(e,a,t),$(a,o),$(a,s),r&&r.m(a,null)},p(e,[t]){1&t&&!l(o.src,n=e[0])&&x(o,"src",n),2&t&&x(o,"alt",e[1]),e[1]?r?r.p(e,t):(r=F(e),r.c(),r.m(a,null)):r&&(r.d(1),r=null),4&t&&q(a,"--size",e[2]+"px")},i:e,o:e,d(e){e&&g(a),r&&r.d()}}}function V(e,t,a){let{src:o}=t,{key:n=""}=t,{size:s=32}=t;return e.$$set=e=>{"src"in e&&a(0,o=e.src),"key"in e&&a(1,n=e.key),"size"in e&&a(2,s=e.size)},[o,n,s]}class U extends P{constructor(e){super(),I(this,e,V,J,s,{src:0,key:1,size:2})}}const Y=e=>({}),Z=e=>({}),K=e=>({}),X=e=>({});function ee(e){let t,a,o,n,s;const r=e[1].hoverable,i=c(r,e,e[0],X),l=e[1].tooltip,u=c(l,e,e[0],Z);return{c(){t=v("span"),a=v("span"),i&&i.c(),o=h(),n=v("div"),u&&u.c(),x(a,"class","hoverable svelte-6pg9cs"),x(n,"class","tooltip svelte-6pg9cs"),x(t,"class","svelte-6pg9cs")},m(e,r){f(e,t,r),$(t,a),i&&i.m(a,null),$(t,o),$(t,n),u&&u.m(n,null),s=!0},p(e,[t]){i&&i.p&&(!s||1&t)&&p(i,r,e,e[0],s?d(r,e[0],t,K):m(e[0]),X),u&&u.p&&(!s||1&t)&&p(u,l,e,e[0],s?d(l,e[0],t,Y):m(e[0]),Z)},i(e){s||(N(i,e),N(u,e),s=!0)},o(e){O(i,e),O(u,e),s=!1},d(e){e&&g(t),i&&i.d(e),u&&u.d(e)}}}function te(e,t,a){let{$$slots:o={},$$scope:n}=t;return e.$$set=e=>{"$$scope"in e&&a(0,n=e.$$scope)},[n,o]}class ae extends P{constructor(e){super(),I(this,e,te,ee,s,{})}}var oe={icon:"https://dak.gg/bser/images/assets/skill/1010100.png",name:"Concentração de Álcool no Sangue (CAS)",description:["Li Dailin pode usar Beber para encher sua barra de CAS. Quando sua CAS está acima de 40, ela fica Bêbada, dando a suas habilidades efeitos extras e ganhando Alcoolizada depois de usar uma habilidade.","Se sua CAS chegar à 100, ela fica Embriagada, é silenciada por 5 segundos e ganha Alcoolizada.","Alcoolizada: O próximo ataque normal de Li Dailin acontece 2 vezes.","Estômago Forte: Sua velocidade de ataque é aumentada por um certo tempo após o consumo de bebidas alcoólicas."],key:"T"},ne={icon:"https://dak.gg/bser/images/assets/skill/1010200.png",name:"Chute Vivaz",description:["Li Dailin avança para a frente, causando dano aos inimigos atingidos. Ela pode reativar esta habilidade mais duas vezes.","Bêbada: Aumenta o alcance e os danos causados."],key:"Q"},se={icon:"https://dak.gg/bser/images/assets/skill/1010300.png",name:"Beber",description:["Li Dailin toma um gole, ganhando Força Líquida, aumentando seu CAS, e evitando ataques normais enquanto bebe.","Força Líquida: o dano de seu próximo ataque normal e o dano de Alcoolizada são aumentados dependendo de seu CAS."],key:"W"},re={icon:"https://dak.gg/bser/images/assets/skill/1010400.png",name:"Prateleira Inferior",description:["Li Dailin cospe licor barato em uma área, com formato de cone, na sua frente, causando dano aos inimigos ao seu alcance e aplicando lentidão.","Bêbada: Aplica silenciar aos inimigos."],key:"E"},ie={icon:"https://dak.gg/bser/images/assets/skill/1010500.png",name:"Ataque do Tigre",description:["Li Dailin chuta para frente, não podendo ser impedida, suprimindo o primeiro inimigo atingido e seguindo com mais 2 chutes consecutivos, reduzindo seu tempo de recarga se atingir um inimigo.","Bêbada: Realiza 4 chutes consecutivos."],key:"R"},le={icon:"resources/skills/Glove.png",name:"Gancho",description:["Soca o seu alvo e causa dano."],key:"D"},ce={icon:"resources/skills/Nunchaku.png",name:"Bafo do Dragão",description:["Balança o nunchaku rapidamente, criando uma rajada de vento.","Balançar o nunchaku por mais de 0,8 segundo atordoa os inimigos atingidos por 1 segundo.","Depois de algum tempo, lança a rajada de vento na direção-alvo, causando dano dependendo do tempo de conjuração."],key:"D"},ue={T:oe,Q:ne,W:se,E:re,R:ie,DG:le,DN:ce},de=Object.freeze({__proto__:null,T:oe,Q:ne,W:se,E:re,R:ie,DG:le,DN:ce,default:ue});function pe(e,t,a){const o=e.slice();return o[2]=t[a],o}function me(t){let a,o,n=t[2]+"";return{c(){a=v("p"),o=k(n)},m(e,t){f(e,a,t),$(a,o)},p:e,d(e){e&&g(a)}}}function $e(e){let t,a,o,n,s,r;a=new U({props:{src:e[0].icon,size:48,key:e[0].key}});let i=e[0].description,l=[];for(let t=0;t<i.length;t+=1)l[t]=me(pe(e,i,t));return{c(){t=v("div"),W(a.$$.fragment),o=h(),n=v("span"),n.textContent=`${e[0].name}`,s=h();for(let e=0;e<l.length;e+=1)l[e].c();x(n,"class","name svelte-1xfkp92"),x(t,"class","skill svelte-1xfkp92")},m(e,i){f(e,t,i),B(a,t,null),$(t,o),$(t,n),$(t,s);for(let e=0;e<l.length;e+=1)l[e].m(t,null);r=!0},p(e,[a]){if(1&a){let o;for(i=e[0].description,o=0;o<i.length;o+=1){const n=pe(e,i,o);l[o]?l[o].p(n,a):(l[o]=me(n),l[o].c(),l[o].m(t,null))}for(;o<l.length;o+=1)l[o].d(1);l.length=i.length}},i(e){r||(N(a.$$.fragment,e),r=!0)},o(e){O(a.$$.fragment,e),r=!1},d(e){e&&g(t),R(a),b(l,e)}}}function fe(e,t,a){let{key:o}=t,n=de[o];return e.$$set=e=>{"key"in e&&a(1,o=e.key)},[n,o]}class ge extends P{constructor(e){super(),I(this,e,fe,$e,s,{key:1})}}function be(e){let t,a;return t=new U({props:{slot:"hoverable",src:e[2].icon,key:e[2].key,size:e[1]}}),{c(){W(t.$$.fragment)},m(e,o){B(t,e,o),a=!0},p(e,a){const o={};2&a&&(o.size=e[1]),t.$set(o)},i(e){a||(N(t.$$.fragment,e),a=!0)},o(e){O(t.$$.fragment,e),a=!1},d(e){R(t,e)}}}function ve(e){let t,a;return t=new ge({props:{key:e[0],slot:"tooltip"}}),{c(){W(t.$$.fragment)},m(e,o){B(t,e,o),a=!0},p(e,a){const o={};1&a&&(o.key=e[0]),t.$set(o)},i(e){a||(N(t.$$.fragment,e),a=!0)},o(e){O(t.$$.fragment,e),a=!1},d(e){R(t,e)}}}function ke(e){let t,a,o;return a=new ae({props:{$$slots:{tooltip:[ve],hoverable:[be]},$$scope:{ctx:e}}}),{c(){t=v("span"),W(a.$$.fragment),x(t,"class","skill svelte-8jj3ko")},m(e,n){f(e,t,n),B(a,t,null),o=!0},p(e,[t]){const o={};11&t&&(o.$$scope={dirty:t,ctx:e}),a.$set(o)},i(e){o||(N(a.$$.fragment,e),o=!0)},o(e){O(a.$$.fragment,e),o=!1},d(e){e&&g(t),R(a)}}}function he(e,t,a){let{key:o}=t,{size:n}=t,s=de[o];return e.$$set=e=>{"key"in e&&a(0,o=e.key),"size"in e&&a(1,n=e.size)},[o,n,s]}class xe extends P{constructor(e){super(),I(this,e,he,ke,s,{key:0,size:1})}}function ye(e,t,a){const o=e.slice();return o[2]=t[a],o}function qe(e){let t,a,o,n;return a=new xe({props:{size:e[1],key:e[2]}}),{c(){t=v("div"),W(a.$$.fragment),o=h(),x(t,"class","skill svelte-7xnvrh")},m(e,s){f(e,t,s),B(a,t,null),$(t,o),n=!0},p(e,t){const o={};2&t&&(o.size=e[1]),1&t&&(o.key=e[2]),a.$set(o)},i(e){n||(N(a.$$.fragment,e),n=!0)},o(e){O(a.$$.fragment,e),n=!1},d(e){e&&g(t),R(a)}}}function Ce(e){let t,a,n=e[0],s=[];for(let t=0;t<n.length;t+=1)s[t]=qe(ye(e,n,t));const r=e=>O(s[e],1,1,(()=>{s[e]=null}));return{c(){t=v("div");for(let e=0;e<s.length;e+=1)s[e].c();x(t,"class","combo svelte-7xnvrh")},m(e,o){f(e,t,o);for(let e=0;e<s.length;e+=1)s[e].m(t,null);a=!0},p(e,[a]){if(3&a){let i;for(n=e[0],i=0;i<n.length;i+=1){const o=ye(e,n,i);s[i]?(s[i].p(o,a),N(s[i],1)):(s[i]=qe(o),s[i].c(),N(s[i],1),s[i].m(t,null))}for(M={r:0,c:[],p:M},i=n.length;i<s.length;i+=1)r(i);M.r||o(M.c),M=M.p}},i(e){if(!a){for(let e=0;e<n.length;e+=1)N(s[e]);a=!0}},o(e){s=s.filter(Boolean);for(let e=0;e<s.length;e+=1)O(s[e]);a=!1},d(e){e&&g(t),b(s,e)}}}function we(e,t,a){let{skills:o=[]}=t,{size:n}=t;return e.$$set=e=>{"skills"in e&&a(0,o=e.skills),"size"in e&&a(1,n=e.size)},[o,n]}class ze extends P{constructor(e){super(),I(this,e,we,Ce,s,{skills:0,size:1})}}function De(t){let a,o,s,r,i;return{c(){a=v("span"),o=v("i"),s=k(t[0]),x(a,"title","Clique para copiar"),x(a,"class","svelte-e703nl")},m(e,l){var c,u,d,p;f(e,a,l),$(a,o),$(o,s),r||(u="click",d=function(){n(window.prompt("Copiar: Ctrl+C, Enter",t[0]))&&window.prompt("Copiar: Ctrl+C, Enter",t[0]).apply(this,arguments)},(c=a).addEventListener(u,d,p),i=()=>c.removeEventListener(u,d,p),r=!0)},p(e,[a]){t=e,1&a&&y(s,t[0])},i:e,o:e,d(e){e&&g(a),r=!1,i()}}}function Le(e,t,a){let{text:o}=t;return e.$$set=e=>{"text"in e&&a(0,o=e.text)},[o]}class Ae extends P{constructor(e){super(),I(this,e,Le,De,s,{text:0})}}function Te(e){let t;return{c(){t=v("span"),t.textContent="40 CAS ou mais",x(t,"slot","hoverable")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function Ee(e){let t;return{c(){t=v("span"),t.innerHTML='Use o traço branco em baixo da sua barra de mana como referência.\n              <br/> \n              <br/> \n              \n              <img src="resources/habilidades/passiva/barra.png" class="svelte-bo7kk5"/>',x(t,"slot","tooltip")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function Se(e){let t;return{c(){t=v("span"),t.textContent="Obs²: Consumir bebidas alcóolicas dá um bonus considerável de\n              velocidade de ataque e é muito importante em builds com pouca\n              velocidade de ataque ou durante Alpha/Omega/Wickeline.",x(t,"slot","hoverable")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function _e(e){let t;return{c(){t=v("span"),t.innerHTML='<video autoplay="" loop="" muted="" class="svelte-bo7kk5"><source src="resources/habilidades/passiva/SadDailin.mp4"/></video> \n              <p><small>Normal</small></p> \n              <video autoplay="" loop="" muted="" class="svelte-bo7kk5"><source src="resources/habilidades/passiva/HappyDailin.mp4"/></video> \n              <p><small>Com bêbida</small></p>',x(t,"slot","tooltip")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function je(e){let t;return{c(){t=v("span"),t.textContent="Se a primeira ativação da habilidade foi buffada por\n                alcoolizada, as duas ativações seguintes também serão",x(t,"slot","hoverable")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function Qe(e){let t;return{c(){t=v("span"),t.innerHTML='<video autoplay="" loop="" muted="" class="svelte-bo7kk5"><source src="resources/habilidades/q/WQTQTQT.mp4"/></video>',x(t,"slot","tooltip")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function He(e){let t;return{c(){t=v("span"),t.textContent="Nenhuma das ativações atravessa unidades inimigas, isso é,\n                jogadores, animais, Wickeline, etc",x(t,"slot","hoverable")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function Me(e){let t;return{c(){t=v("span"),t.innerHTML='<video autoplay="" loop="" muted="" class="svelte-bo7kk5"><source src="resources/habilidades/q/QQQ.mp4"/></video>',x(t,"slot","tooltip")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function Ne(e){let t;return{c(){t=v("span"),t.textContent="Qualquer atordoamento, empurrão ou enraizamento cancela o dash",x(t,"slot","hoverable")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function Oe(e){let t;return{c(){t=v("span"),t.innerHTML='<video autoplay="" loop="" muted="" class="svelte-bo7kk5"><source src="resources/habilidades/q/QJavas.mp4"/></video>',x(t,"slot","tooltip")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function We(e){let t;return{c(){t=v("span"),t.textContent="40",x(t,"slot","hoverable")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function Be(e){let t;return{c(){t=v("span"),t.innerHTML='<img src="resources/habilidades/passiva/barra.png" class="svelte-bo7kk5"/> \n            ',x(t,"slot","tooltip")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function Re(e){let t;return{c(){t=v("span"),t.textContent="A Li Dailin fica imparável durante o dash",x(t,"slot","hoverable")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function Ge(e){let t;return{c(){t=v("span"),t.innerHTML='<video autoplay="" loop="" muted="" class="svelte-bo7kk5"><source src="resources/habilidades/r/RAlpha2.mp4"/></video>',x(t,"slot","tooltip")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function Ie(e){let t;return{c(){t=v("span"),t.textContent="A Li Dailin não fica imparável durante a supressão",x(t,"slot","hoverable")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function Pe(e){let t;return{c(){t=v("span"),t.innerHTML='<video autoplay="" loop="" muted="" class="svelte-bo7kk5"><source src="resources/habilidades/r/RAlpha1.mp4"/></video>',x(t,"slot","tooltip")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function Fe(e){let t;return{c(){t=v("span"),t.textContent="O hitbox é estranho",x(t,"slot","hoverable")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function Je(e){let t;return{c(){t=v("span"),t.innerHTML='<video autoplay="" loop="" muted="" class="svelte-bo7kk5"><source src="resources/habilidades/r/RAlpha3.mp4"/></video>',x(t,"slot","tooltip")},m(e,a){f(e,t,a)},d(e){e&&g(t)}}}function Ve(e){let t,a,o,n,s,r,i,c,u,d,p,m,b,y,C,w,z,D,L,A,T,E,S,_,j,Q,H,M,G,I,P,F,J,V,U,Y,Z,K,X,ee,te,oe,ne,se,re,ie,le,ce,ue,de,pe,me,$e,fe,be,ve,ke,he,ye,qe,Ce,we,De,Le,Ve,Ue,Ye,Ze,Ke,Xe,et,tt,at,ot,nt,st,rt,it,lt,ct,ut,dt,pt,mt,$t,ft,gt,bt,vt,kt,ht,xt,yt,qt,Ct,wt,zt,Dt,Lt,At,Tt,Et,St,_t,jt,Qt,Ht,Mt,Nt,Ot,Wt,Bt,Rt,Gt,It,Pt,Ft,Jt,Vt,Ut,Yt,Zt,Kt,Xt,ea,ta,aa,oa,na,sa,ra,ia,la,ca,ua,da,pa,ma,$a,fa,ga,ba,va,ka,ha,xa,ya,qa,Ca,wa,za,Da,La,Aa,Ta,Ea,Sa,_a,ja,Qa,Ha,Ma,Na,Oa,Wa,Ba,Ra,Ga,Ia,Pa;return y=new Ae({props:{text:"uema#2118"}}),_=new ge({props:{key:"T"}}),I=new ae({props:{$$slots:{tooltip:[Ee],hoverable:[Te]},$$scope:{ctx:e}}}),ee=new ae({props:{$$slots:{tooltip:[_e],hoverable:[Se]},$$scope:{ctx:e}}}),re=new ge({props:{key:"Q"}}),$e=new ae({props:{$$slots:{tooltip:[Qe],hoverable:[je]},$$scope:{ctx:e}}}),ve=new ae({props:{$$slots:{tooltip:[Me],hoverable:[He]},$$scope:{ctx:e}}}),ye=new ae({props:{$$slots:{tooltip:[Oe],hoverable:[Ne]},$$scope:{ctx:e}}}),Le=new ge({props:{key:"W"}}),st=new xe({props:{key:"W"}}),it=new ae({props:{$$slots:{tooltip:[Be],hoverable:[We]},$$scope:{ctx:e}}}),pt=new xe({props:{key:"W"}}),$t=new xe({props:{key:"T"}}),vt=new ge({props:{key:"E"}}),Et=new ge({props:{key:"R"}}),Pt=new ae({props:{$$slots:{tooltip:[Ge],hoverable:[Re]},$$scope:{ctx:e}}}),Vt=new ae({props:{$$slots:{tooltip:[Pe],hoverable:[Ie]},$$scope:{ctx:e}}}),Zt=new ae({props:{$$slots:{tooltip:[Je],hoverable:[Fe]},$$scope:{ctx:e}}}),ea=new ge({props:{key:"DG"}}),ca=new ge({props:{key:"DN"}}),ga=new xe({props:{size:72,key:"T"}}),va=new xe({props:{size:72,key:"Q"}}),ha=new xe({props:{size:72,key:"W"}}),ya=new xe({props:{size:72,key:"E"}}),Ca=new xe({props:{size:72,key:"R"}}),za=new xe({props:{size:72,key:"DG"}}),La=new xe({props:{size:72,key:"DN"}}),Ia=new ze({props:{size:48,skills:["W","W","DG","T","Q","T","W","T","Q","T","Q","T","E","T","R","T","DG"]}}),{c(){t=v("div"),a=v("header"),a.innerHTML='<h1 class="svelte-bo7kk5">&quot;....Do I really have to do this?&quot;</h1> \n    \n    <img src="resources/header/Tourist_Li_Dailin.png" class="svelte-bo7kk5"/>',o=h(),n=v("main"),s=v("section"),r=v("h1"),r.textContent="Disclaimer",i=h(),c=v("p"),c.textContent="Pra quem não me conhece, meu nick é uema, e sou mono Li Dailin desde\n        novembro de 2020, não posso afirmar que sou a melhor Li Dailin do\n        servidor, mas provavelmente a com mais experiência no jogo.",u=h(),d=v("p"),d.textContent="Esse guia está longe de completo, e será atualizado sempre que eu tiver\n        tempo.",p=h(),m=v("p"),b=k("Se encontrar algum erro, tiver algum feedback, dúvida ou sugestão, pode\n        falar comigo no Discord: "),W(y.$$.fragment),C=h(),w=v("section"),w.innerHTML='<h1 class="svelte-bo7kk5">Objetivo</h1> \n      <p>O intuito desse guia, é passar um conhecimento geral sobre a personagem,\n        fugindo um pouco de coisas que variam com atualizações, como rotas e\n        builds.</p> \n      <q class="question svelte-bo7kk5">Então esse guia vai ensinar só o básico?</q> \n      <q class="answer svelte-bo7kk5">Não se engane, apesar de não abordar rotas, vou me aprofundar bastante.</q> \n      <p>A ideia é passar conhecimento teórico o suficiente pra que você entenda\n        o personagem, e seja capaz de construir e avaliar jogadas e rotas por\n        conta própria, independente do patch.</p>',z=h(),D=v("section"),D.innerHTML='<h1 class="svelte-bo7kk5">Introdução</h1> \n      <p>Li Dailin é uma personagem conhecida pela sua mobilidade e por causar\n        bastante dano em pouco tempo.</p> \n      <q class="question svelte-bo7kk5">Ok, mas por que minha Li Dailin não dá dano?!</q> \n      <small class="author svelte-bo7kk5">DE DAILIN, Novato.</small> \n      <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/r1_iuvZxx4Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="svelte-bo7kk5"></iframe> \n      <p>Pra causar dano com ela, é necessário entender e utilizar muito bem suas\n        skills, que apesar de simples têm diversas nuâncias e pequenos detalhes\n        que podem alterar e muito o seu potencial de dano.</p>',L=h(),A=v("section"),T=v("h1"),T.textContent="Habilidades",E=h(),S=v("section"),W(_.$$.fragment),j=h(),Q=v("p"),Q.textContent="Essa é a principal habilidade da Li Dailin. É o bom aproveitamento\n          dela que vai definir quanto de dano você pode causar.",H=h(),M=v("p"),G=k("Se você tiver\n          "),W(I.$$.fragment),P=k(" ao usar uma habilidade:"),F=h(),J=v("ol"),J.innerHTML='<li class="svelte-bo7kk5">Você consumirá 40 de CAS (exceto W)</li> \n          <li class="svelte-bo7kk5">A habilidade vai ganhar um efeito adicional</li> \n          <li class="svelte-bo7kk5">Seu próximo ataque normal sairá duas vezes</li>',V=h(),U=v("p"),U.textContent="Obs: o segundo ataque tem dano reduzido, mas aumenta conforme o nível\n          da passiva.",Y=h(),Z=v("p"),Z.textContent="Se você atingir 100 de CAS, ficará silenciado por 5s e todos os\n          ataques normais sairão duas vezes, são raros os momentos em que isso é\n          útil. Um exemplo é durante a Wickeline.",K=h(),X=v("p"),W(ee.$$.fragment),te=h(),oe=v("aside"),oe.innerHTML='<video autoplay="" loop="" muted="" class="svelte-bo7kk5"><source src="resources/habilidades/passiva/ataques.mp4"/></video> \n          <small><ol><li class="svelte-bo7kk5">Ataque normal</li> \n              <li class="svelte-bo7kk5">Ataque bêbada</li> \n              <li class="svelte-bo7kk5">Ataque alcoolizada</li> \n              <li class="svelte-bo7kk5">Ataque embriagada</li></ol></small> \n          <video autoplay="" loop="" muted="" class="svelte-bo7kk5"><source src="resources/habilidades/passiva/silence.mp4"/></video> \n          <p><small>Embriagada durante Wickeline</small></p>',ne=h(),se=v("section"),W(re.$$.fragment),ie=h(),le=v("p"),le.textContent="Essa habilidade é a principal mobilidade da Li Dailin, cada uso dá um\n          dash, e o terceiro dash pode atravessar paredes.",ce=h(),ue=v("p"),ue.textContent="Existem alguns detalhes importantes sobre essa habilidade:",de=h(),pe=v("ol"),me=v("li"),W($e.$$.fragment),fe=h(),be=v("li"),W(ve.$$.fragment),ke=h(),he=v("li"),W(ye.$$.fragment),qe=h(),Ce=v("aside"),Ce.innerHTML='<video autoplay="" loop="" muted="" class="svelte-bo7kk5"><source src="resources/habilidades/q/Q.mp4"/></video> \n          <p><small>Q normal</small></p> \n          <video autoplay="" loop="" muted="" class="svelte-bo7kk5"><source src="resources/habilidades/q/WQ.mp4"/></video> \n          <p><small>Q buffado</small></p>',we=h(),De=v("section"),W(Le.$$.fragment),Ve=h(),Ue=v("p"),Ue.textContent="Cada uso dessa habilidade vai te dar 45 de CAS e te deixa imune a\n          ataques básicos durante a animação.",Ye=h(),Ze=v("q"),Ze.textContent="Eu ganho mais mobilidade, mais dano e fico imune a ataque básico...\n          Vou spammar essa skill então!",Ke=h(),Xe=v("small"),Xe.innerHTML='DE DAILIN, Novato.\n          \n          <img class="center svelte-bo7kk5" src="resources/habilidades/w/WastedDailin.png"/>',et=h(),tt=v("p"),tt.textContent="É interessante sempre manter a barra acima de 40 CAS, pra caso seja\n          necessário usar uma habilidade buffada imediatamente, mas é preciso\n          controlar o uso pra não se silenciar sem querer.",at=h(),ot=v("p"),nt=k("No geral, use "),W(st.$$.fragment),rt=k(" sempre que seu CAS chegar em "),W(it.$$.fragment),lt=k("."),ct=h(),ut=v("p"),dt=k("Outro detalhe importante, é que cada ataque básico reduz o tempo de\n          recarga de "),W(pt.$$.fragment),mt=k(" em 1s, incluíndo o ataque duplo da\n          passiva "),W($t.$$.fragment),ft=k("."),gt=h(),bt=v("section"),W(vt.$$.fragment),kt=h(),ht=v("p"),ht.textContent="Esse é o famigerado silence da Li Dailin, a habilidade também dá\n          lentidão, mas na maioria das vezes é usada pelo silenciamento.",xt=h(),yt=v("p"),yt.textContent="Pra silenciar é necessário usar a skill buffada, e ela tem um tempo de\n          conjuração relativamente alto, então pense bem antes de usa-la pra\n          fugir ou perseguir alguém.",qt=h(),Ct=v("p"),Ct.textContent="O momento ideal pra usar o silenciamento varia muito do momento e da\n          match up, e será abordado mais pra frente no guia.",wt=h(),zt=v("p"),zt.textContent="Obs: Nem todo tipo de conjuração é cancelado pelo silence, varia\n          habilidade por habilidade.",Dt=h(),Lt=v("aside"),Lt.innerHTML='<video autoplay="" loop="" muted="" class="svelte-bo7kk5"><source src="resources/habilidades/e/EJavas.mp4"/></video> \n          <p><small>Silence no dash do Javali</small></p> \n          <video autoplay="" loop="" muted="" class="svelte-bo7kk5"><source src="resources/habilidades/e/EAlpha.mp4"/></video> \n          <p><small>Silence no knockback do Alpha</small></p>',At=h(),Tt=v("section"),W(Et.$$.fragment),St=h(),_t=v("p"),_t.textContent="A ultimate da Li Dailin é um dash que suprime o alvo por 0.7s (1.2s se\n          alcoolizada).",jt=h(),Qt=v("p"),Qt.textContent="O dano da habilidade aumenta conforme a vida perdida, mas não é\n          baseado na vida máxima do alvo.",Ht=h(),Mt=v("p"),Mt.textContent="Observações importantes:",Nt=h(),Ot=v("ol"),Wt=v("li"),Wt.textContent="O dash atravessa paredes",Bt=h(),Rt=v("li"),Rt.textContent="O cooldown é bem alto (180/150/115s), mas é reduzido em 40% se\n            acertar um alvo",Gt=h(),It=v("li"),W(Pt.$$.fragment),Ft=h(),Jt=v("li"),W(Vt.$$.fragment),Ut=h(),Yt=v("li"),W(Zt.$$.fragment),Kt=h(),Xt=v("section"),W(ea.$$.fragment),ta=h(),aa=v("p"),aa.textContent="É uma habilidade target, não interrompível, que funciona como um\n          ataque básico normal, mas com dano aumentado e causa dano verdadeiro\n          adicional.",oa=h(),na=v("p"),na.textContent="Não existe um momento certo pra usar ela, recomendo usar sempre que\n          sair do cooldown ou para garantir um last hit.",sa=h(),ra=v("p"),ra.textContent="Obs: o alcance dessa habilidade é maior que o alcance padrão de ataque\n          básico, então ela dá um pequeno dash.",ia=h(),la=v("section"),W(ca.$$.fragment),ua=h(),da=v("p"),da.textContent="São bem raras as situações em que é possível carregar o stun e ainda\n          assim acertar o alvo, pois é possível ouvir o Nunchaku sendo carregado\n          de muito longe.",pa=h(),ma=v("p"),ma.textContent="Então, no geral é utilizado como um pequeno dano adicional no combo,\n          para finalizar kills à distância ou para farmar.",$a=h(),fa=v("p"),W(ga.$$.fragment),ba=h(),W(va.$$.fragment),ka=h(),W(ha.$$.fragment),xa=h(),W(ya.$$.fragment),qa=h(),W(Ca.$$.fragment),wa=h(),W(za.$$.fragment),Da=h(),W(La.$$.fragment),Aa=h(),Ta=v("section"),Ea=v("h1"),Ea.textContent="Combos",Sa=h(),_a=v("q"),_a.textContent="Tá, eu já entendi as habilidades, mas você pode me falar logo como eu\n        combo?",ja=h(),Qa=v("img"),Ma=h(),Na=v("p"),Na.textContent="Como eu falei antes, é o bom aproveitamento da passiva que define quanto\n        dano você pode causar, então não existe um combo certo ou errado, tudo é\n        situacional.",Oa=h(),Wa=v("p"),Wa.textContent="Numa situacão perfeita, o combo com o maior dano é aquele que maximiza o uso da passiva, por exemplo:",Ba=h(),Ra=v("video"),Ra.innerHTML='<source src="resources/combos/Combo.mp4"/>',Ga=h(),W(Ia.$$.fragment),x(a,"class","svelte-bo7kk5"),x(r,"class","svelte-bo7kk5"),x(s,"class","svelte-bo7kk5"),x(w,"class","svelte-bo7kk5"),x(D,"class","svelte-bo7kk5"),x(T,"class","svelte-bo7kk5"),x(oe,"class","svelte-bo7kk5"),x(S,"class","svelte-bo7kk5"),x(me,"class","svelte-bo7kk5"),x(be,"class","svelte-bo7kk5"),x(he,"class","svelte-bo7kk5"),x(Ce,"class","svelte-bo7kk5"),x(se,"class","svelte-bo7kk5"),x(Ze,"class","question svelte-bo7kk5"),x(Xe,"class","author svelte-bo7kk5"),x(De,"class","svelte-bo7kk5"),x(Lt,"class","svelte-bo7kk5"),x(bt,"class","svelte-bo7kk5"),x(Wt,"class","svelte-bo7kk5"),x(Rt,"class","svelte-bo7kk5"),x(It,"class","svelte-bo7kk5"),x(Jt,"class","svelte-bo7kk5"),x(Yt,"class","svelte-bo7kk5"),x(Tt,"class","svelte-bo7kk5"),x(Xt,"class","svelte-bo7kk5"),x(la,"class","svelte-bo7kk5"),x(A,"class","svelte-bo7kk5"),x(Ea,"class","svelte-bo7kk5"),x(_a,"class","question svelte-bo7kk5"),l(Qa.src,Ha="resources/combos/Well.jpg")||x(Qa,"src","resources/combos/Well.jpg"),x(Qa,"class","svelte-bo7kk5"),q(Ra,"float","left"),q(Ra,"margin-right","1em"),Ra.autoplay=!0,Ra.loop=!0,Ra.muted=!0,x(Ra,"class","svelte-bo7kk5"),x(Ta,"class","svelte-bo7kk5"),x(n,"class","svelte-bo7kk5"),x(t,"class","container svelte-bo7kk5")},m(e,l){f(e,t,l),$(t,a),$(t,o),$(t,n),$(n,s),$(s,r),$(s,i),$(s,c),$(s,u),$(s,d),$(s,p),$(s,m),$(m,b),B(y,m,null),$(n,C),$(n,w),$(n,z),$(n,D),$(n,L),$(n,A),$(A,T),$(A,E),$(A,S),B(_,S,null),$(S,j),$(S,Q),$(S,H),$(S,M),$(M,G),B(I,M,null),$(M,P),$(S,F),$(S,J),$(S,V),$(S,U),$(S,Y),$(S,Z),$(S,K),$(S,X),B(ee,X,null),$(S,te),$(S,oe),$(A,ne),$(A,se),B(re,se,null),$(se,ie),$(se,le),$(se,ce),$(se,ue),$(se,de),$(se,pe),$(pe,me),B($e,me,null),$(pe,fe),$(pe,be),B(ve,be,null),$(pe,ke),$(pe,he),B(ye,he,null),$(se,qe),$(se,Ce),$(A,we),$(A,De),B(Le,De,null),$(De,Ve),$(De,Ue),$(De,Ye),$(De,Ze),$(De,Ke),$(De,Xe),$(De,et),$(De,tt),$(De,at),$(De,ot),$(ot,nt),B(st,ot,null),$(ot,rt),B(it,ot,null),$(ot,lt),$(De,ct),$(De,ut),$(ut,dt),B(pt,ut,null),$(ut,mt),B($t,ut,null),$(ut,ft),$(A,gt),$(A,bt),B(vt,bt,null),$(bt,kt),$(bt,ht),$(bt,xt),$(bt,yt),$(bt,qt),$(bt,Ct),$(bt,wt),$(bt,zt),$(bt,Dt),$(bt,Lt),$(A,At),$(A,Tt),B(Et,Tt,null),$(Tt,St),$(Tt,_t),$(Tt,jt),$(Tt,Qt),$(Tt,Ht),$(Tt,Mt),$(Tt,Nt),$(Tt,Ot),$(Ot,Wt),$(Ot,Bt),$(Ot,Rt),$(Ot,Gt),$(Ot,It),B(Pt,It,null),$(Ot,Ft),$(Ot,Jt),B(Vt,Jt,null),$(Ot,Ut),$(Ot,Yt),B(Zt,Yt,null),$(A,Kt),$(A,Xt),B(ea,Xt,null),$(Xt,ta),$(Xt,aa),$(Xt,oa),$(Xt,na),$(Xt,sa),$(Xt,ra),$(A,ia),$(A,la),B(ca,la,null),$(la,ua),$(la,da),$(la,pa),$(la,ma),$(A,$a),$(A,fa),B(ga,fa,null),$(fa,ba),B(va,fa,null),$(fa,ka),B(ha,fa,null),$(fa,xa),B(ya,fa,null),$(fa,qa),B(Ca,fa,null),$(fa,wa),B(za,fa,null),$(fa,Da),B(La,fa,null),$(n,Aa),$(n,Ta),$(Ta,Ea),$(Ta,Sa),$(Ta,_a),$(Ta,ja),$(Ta,Qa),$(Ta,Ma),$(Ta,Na),$(Ta,Oa),$(Ta,Wa),$(Ta,Ba),$(Ta,Ra),$(Ta,Ga),B(Ia,Ta,null),Pa=!0},p(e,[t]){const a={};1&t&&(a.$$scope={dirty:t,ctx:e}),I.$set(a);const o={};1&t&&(o.$$scope={dirty:t,ctx:e}),ee.$set(o);const n={};1&t&&(n.$$scope={dirty:t,ctx:e}),$e.$set(n);const s={};1&t&&(s.$$scope={dirty:t,ctx:e}),ve.$set(s);const r={};1&t&&(r.$$scope={dirty:t,ctx:e}),ye.$set(r);const i={};1&t&&(i.$$scope={dirty:t,ctx:e}),it.$set(i);const l={};1&t&&(l.$$scope={dirty:t,ctx:e}),Pt.$set(l);const c={};1&t&&(c.$$scope={dirty:t,ctx:e}),Vt.$set(c);const u={};1&t&&(u.$$scope={dirty:t,ctx:e}),Zt.$set(u)},i(e){Pa||(N(y.$$.fragment,e),N(_.$$.fragment,e),N(I.$$.fragment,e),N(ee.$$.fragment,e),N(re.$$.fragment,e),N($e.$$.fragment,e),N(ve.$$.fragment,e),N(ye.$$.fragment,e),N(Le.$$.fragment,e),N(st.$$.fragment,e),N(it.$$.fragment,e),N(pt.$$.fragment,e),N($t.$$.fragment,e),N(vt.$$.fragment,e),N(Et.$$.fragment,e),N(Pt.$$.fragment,e),N(Vt.$$.fragment,e),N(Zt.$$.fragment,e),N(ea.$$.fragment,e),N(ca.$$.fragment,e),N(ga.$$.fragment,e),N(va.$$.fragment,e),N(ha.$$.fragment,e),N(ya.$$.fragment,e),N(Ca.$$.fragment,e),N(za.$$.fragment,e),N(La.$$.fragment,e),N(Ia.$$.fragment,e),Pa=!0)},o(e){O(y.$$.fragment,e),O(_.$$.fragment,e),O(I.$$.fragment,e),O(ee.$$.fragment,e),O(re.$$.fragment,e),O($e.$$.fragment,e),O(ve.$$.fragment,e),O(ye.$$.fragment,e),O(Le.$$.fragment,e),O(st.$$.fragment,e),O(it.$$.fragment,e),O(pt.$$.fragment,e),O($t.$$.fragment,e),O(vt.$$.fragment,e),O(Et.$$.fragment,e),O(Pt.$$.fragment,e),O(Vt.$$.fragment,e),O(Zt.$$.fragment,e),O(ea.$$.fragment,e),O(ca.$$.fragment,e),O(ga.$$.fragment,e),O(va.$$.fragment,e),O(ha.$$.fragment,e),O(ya.$$.fragment,e),O(Ca.$$.fragment,e),O(za.$$.fragment,e),O(La.$$.fragment,e),O(Ia.$$.fragment,e),Pa=!1},d(e){e&&g(t),R(y),R(_),R(I),R(ee),R(re),R($e),R(ve),R(ye),R(Le),R(st),R(it),R(pt),R($t),R(vt),R(Et),R(Pt),R(Vt),R(Zt),R(ea),R(ca),R(ga),R(va),R(ha),R(ya),R(Ca),R(za),R(La),R(Ia)}}}return new class extends P{constructor(e){super(),I(this,e,null,Ve,s,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map

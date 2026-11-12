/* ================================================================
   INTERFACE — abertura, menu, como jogar, tutorial de fase, toque
   ================================================================ */
const tTitulo=$('tTitulo'),tMenu=$('tMenu'),tTut=$('tTut'),tComo=$('tComo');
let comoVolta=null;
function telaAberta(){return !tTitulo.hidden||!tMenu.hidden||!tTut.hidden||!tComo.hidden;}
function atualizaPausa(){
  pausa=telaAberta();teclas.clear();fk.clear();tiro=false;
  document.body.classList.toggle('pausado',pausa);document.body.classList.toggle('abertura',!tTitulo.hidden||(!tComo.hidden&&comoVolta===tTitulo));
}
atualizaPausa();
$('bComecar').addEventListener('click',()=>{tTitulo.hidden=true;atualizaPausa();});
function abreComo(de){comoVolta=de;de.hidden=true;tComo.hidden=false;atualizaPausa();}
$('bComo').addEventListener('click',()=>abreComo(tTitulo));
$('mComo').addEventListener('click',()=>abreComo(tMenu));
$('bComoOk').addEventListener('click',()=>{tComo.hidden=true;if(comoVolta)comoVolta.hidden=false;atualizaPausa();});
function abreMenu(){
  if(busy||telaAberta()||acabou)return;
  $('mCasa').hidden=mode==='house';
  tMenu.hidden=false;atualizaPausa();
}
function fechaMenu(){tMenu.hidden=true;atualizaPausa();}
$('bMenu').addEventListener('click',abreMenu);
$('mCont').addEventListener('click',fechaMenu);
$('mCasa').addEventListener('click',()=>{fechaMenu();leave();});
$('mRecomeca').addEventListener('click',()=>{fechaMenu();$('fimB').click();});
$('reset').addEventListener('click',fechaMenu);
$('ol').addEventListener('click',fechaMenu);
window.addEventListener('keydown',e=>{
  if(e.code!=='Escape'&&e.code!=='KeyM')return;
  if(!tMenu.hidden){fechaMenu();return;}
  if(!tComo.hidden){$('bComoOk').click();return;}
  if(mode==='house'&&!conversa&&!telaAberta())abreMenu();
});

/* tutorial: objetivo, como jogar e a pergunta da fase */
const TUT=[
 {o:'Chegar ao relógio da casa, no fim do cano mais alto, e fazer a leitura. No caminho, não deixar as Trenas medirem a garagem.',
  j:'Canos e o carro coberto servem de degrau. A Trena prende a fita em dois objetos e mede tudo o que fica entre eles. Água desfaz a Trena e lava o que virou planta. No relógio, segure E.',
  p:'Naná mede a água dos outros para viver. Hoje o serviço é na própria casa. O instrumento é o mesmo. Muda quem está do outro lado dele.'},
 {o:'Aguentar três levas de Etiquetadores sem deixar a sala virar vitrine. Depois, responder a Jéssica.',
  j:'Sofá, mesa e estante servem de plataforma. Derrube os Etiquetadores no ar ou lave o que eles marcaram. Etiqueta que cai em Naná conta: com três, ela é cadastrada e a casa perde um pedaço.',
  p:'A televisão sabe o CPF de todo mundo e oferece cidadania em doze vezes. Para Jéssica, crédito foi a única porta que abriram. O que se compra quando se assina?'},
 {o:'Atravessar a esteira até o estrado onde Binho trabalha e decidir com ele o que fazer do turno.',
  j:'A esteira leva para trás. As catracas só abrem na batida do relógio de ponto. Passe na batida, pule a partir do andaime ou derrube a catraca por trás. Pule os cartões que vêm rasteiros.',
  p:'Binho precisa do turno, e o turno gasta Binho. O gesto continua no braço depois que a sirene toca. De quem é o tempo dele?'},
 {o:'Subir a escadaria até Dona Marlene, no alto, e decidir o destino da obra.',
  j:'Suba andando. Quando o rolo descer, segure E num vão de porta ou pule por cima. Os cones andam atrás de você: água neles. O que o rolo mede, você lava.',
  p:'Marlene carrega balde há trinta anos e tem razão de querer escada. O traçado passa por dentro de duas casas. A pergunta não é se a obra vem. É quem decide por onde.'},
 {o:'Cortar as três mangueiras da Bomba antes que a lagoa seque. Depois, conversar com Seu Aurelino.',
  j:'O nível da lagoa é a sua Água: enquanto a Bomba puxa, ele desce. Nade, use os píeres e a canoa. Acerte as juntas laranja na ponta de cada mangueira. No fundo, as turbinas etiquetam quem encosta.',
  p:'Para Aurelino, a água é um livro que guarda o que viu. Para a Bomba, é quilowatt. É a mesma água.'}
];
let tutFn=null;
function tutorial(i,fn){
  const t=TUT[i];if(!t){fn();return;}
  $('tutN').textContent='Fase '+(i+1);$('tutT').textContent=OPS[i].t;
  $('tutO').textContent=t.o;$('tutJ').textContent=t.j;$('tutP').textContent=t.p;
  tutFn=fn;tTut.hidden=false;atualizaPausa();$('tutOk').focus();
}
$('tutOk').addEventListener('click',()=>{tTut.hidden=true;atualizaPausa();const f=tutFn;tutFn=null;f&&f();});

/* toque: botões na tela para andar, pular e interagir. Tocar na cena mira e solta água */
if(window.matchMedia&&matchMedia('(pointer:coarse)').matches)document.body.classList.add('toque');
document.querySelectorAll('#toque button').forEach(b=>{
  const k=b.dataset.k;
  b.addEventListener('pointerdown',e=>{e.preventDefault();
    if(fl){flAvanca();return;}
    if(k==='Space')pulo=true;if(k==='KeyE')usouE=true;fk.add(k);});
  ['pointerup','pointercancel','pointerleave'].forEach(n=>b.addEventListener(n,()=>fk.delete(k)));
});

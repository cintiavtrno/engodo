/* ================================================================
   INTERFACE — abertura, menu, como jogar, tutorial de fase, toque
   ================================================================ */
const tTitulo=$('tTitulo'),tMenu=$('tMenu'),tTut=$('tTut'),tComo=$('tComo');
let comoVolta=null;
const tVin=$('tVin');
function telaAberta(){return !tTitulo.hidden||!tMenu.hidden||!tTut.hidden||!tComo.hidden||!tVin.hidden;}
function atualizaPausa(){
  pausa=telaAberta();teclas.clear();fk.clear();tiro=false;
  document.body.classList.toggle('pausado',pausa);document.body.classList.toggle('abertura',!tTitulo.hidden||(!tComo.hidden&&comoVolta===tTitulo));
}
atualizaPausa();
$('bComecar').addEventListener('click',()=>{tTitulo.hidden=true;vinheta(PROLOGO);});
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
 {o:'Suba até o medidor de água da casa, no cano mais alto, para fazer a leitura. Pelo caminho, não deixe as Trenas medirem as coisas da garagem.',
  j:'Os canos e o carro coberto servem de degrau. Cada Trena estica uma fita entre dois objetos. O que fica no meio vira desenho branco. A água desfaz a Trena e limpa o que ela marcou. Quando chegar ao medidor, segure a tecla E.'},
 {o:'Aguente três ataques dos Etiquetadores. Eles querem pôr preço em tudo o que há na sala. Depois do terceiro ataque, responda ao pedido de Jéssica.',
  j:'Dá para subir no sofá, na mesa e na estante. Acerte os Etiquetadores com água no ar. Móvel marcado fica branco até você limpar. Se três etiquetas caírem em Naná, ela volta para a entrada. Nesse caso, a Medida sobe.'},
 {o:'Atravesse a esteira até o lugar onde Binho trabalha. Lá, vocês dois decidem o que fazer.',
  j:'A esteira empurra para trás quem fica parado. Três catracas fecham a passagem. Elas abrem por um instante quando o relógio de ponto bate. Fora dessa hora, pule por cima a partir das plataformas de madeira. Também dá para derrubar a catraca com água pelo lado de trás. Os cartões vêm rente ao chão. Pule.'},
 {o:'Suba a escadaria de mármore até Dona Marlene, no último degrau. Lá de cima dá para ver onde a escada termina.',
  j:'Para subir, basta andar. De tempos em tempos, um rolo compressor desce a escada. Segure E em frente a uma porta para se esconder, ou pule por cima dele. Os cones perseguem Naná até levarem água. Casa por onde o rolo passa vira desenho branco. Você pode limpar.'},
 {o:'Solte as três mangueiras da bomba antes que a água acabe. Depois, converse com Seu Aurelino.',
  j:'A altura da água aqui dentro é o seu marcador Água. Com a bomba ligada, ele desce sem parar. Você pode nadar, subir nas plataformas de madeira e na canoa. Mire na ponta laranja de cada mangueira. Fique longe das turbinas do fundo. Quem encosta nelas leva etiqueta.'},
 {o:'Proteja os três potes de feijão de Tia Cotinha até os Carimbadores pararem de descer. Depois, decida com ela o destino das sementes.',
  j:'Os Carimbadores descem do alto em direção aos potes. Acerte com água antes que encostem. Pote carimbado fica branco até você limpar. A pilha de tijolos e o caixote ajudam a alcançar os que vêm mais alto.'}
];
let tutFn=null;
function tutorial(i,fn){
  const t=TUT[i];if(!t){fn();return;}
  $('tutN').textContent='Fase '+(i+1);$('tutT').textContent=OPS[i].t;
  $('tutO').textContent=t.o;$('tutJ').textContent=t.j;
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

/* vinhetas: tela escura com uma rubrica curta antes da cena. A primeira linha é o lugar ou a hora */
const PROLOGO=['Seis da manhã','Em cada porta da rua amanheceu um aviso colado.','Na calçada, uma fila que ninguém viu começar.'];
const VIN=[
 ['Garagem','Os medidores de água nasceram na parede durante a noite.','O último deles é o da casa de Naná.'],
 ['Sala','A televisão ficou ligada sozinha.','Quando Naná entra, cada móvel já tem preço.'],
 ['Quintal','Onde havia um pé de goiaba, agora passa uma esteira.','Binho começou hoje.'],
 ['Ladeira','Homens que não falam com ninguém assentam degraus de mármore.','Dona Marlene acompanha de cima, com o balde no chão.'],
 ['Dentro da caixa d\'água','Aqui a água da rua descansa.','Seu Aurelino pesca sem pressa.'],
 ['Laje','Três potes de feijão tomam sol.','Tia Cotinha olha para o céu de vez em quando.']
];
let vinFn=null;
function vinheta(linhas,fn){
  if(!linhas){fn&&fn();return;}
  const p=$('vinT');p.innerHTML='';
  linhas.forEach((l,k)=>{const s=document.createElement('span');s.textContent=l;s.style.animationDelay=(k*.9)+'s';p.appendChild(s);});
  vinFn=fn||null;tVin.hidden=false;atualizaPausa();
}
function fechaVinheta(){if(tVin.hidden)return;tVin.hidden=true;atualizaPausa();const f=vinFn;vinFn=null;f&&f();}
tVin.addEventListener('click',fechaVinheta);
window.addEventListener('keydown',e=>{if(!tVin.hidden&&(e.code==='Space'||e.code==='Enter')){e.preventDefault();fechaVinheta();}});

/* coro dos vizinhos: o que se ouve de fundo em cada fase */
const COROS=[
 [['Seu Zé, lá fora','Marlene, a água da senhora veio fraca hoje?'],['Dona Marlene','Veio um fio. Enchi dois baldes em meia hora.'],
  ['Seu Zé','A conta do mês passado veio mais alta que a outra.'],['Dona Marlene','A minha também. E olhe que eu gastei menos.'],
  ['Seu Zé','Disseram que agora o relógio é novo.'],['Dona Marlene','Novo ele é. Corre que é uma beleza.']],
 [['Jéssica','Minha mãe comprou a geladeira dela em vinte e quatro vezes.'],['Jéssica','Quando acabou de pagar, a geladeira já tinha quebrado.'],
  ['Televisão','Aproveite. Aprovação na hora.'],['Jéssica','O carteiro não sobe aqui. Diz que a rua não está no mapa.'],
  ['Jéssica','Com uma compra no meu nome, talvez ele suba.']],
 [['Binho','Ontem choveu e eu nem vi.'],['Binho','Minha mãe guardou meu prato. Quando cheguei, ela já estava dormindo.'],
  ['Binho','O chefe disse que quem fica parado perde o vale.'],['Binho','Sábado tem baba no campinho. Não sei se meu braço deixa.'],
  ['Binho','Tu lembra quando esse quintal tinha pé de goiaba?']],
 [['Dona Marlene, lá de cima','Cuidado com o degrau molhado, Naná!'],['Dona Marlene','Eu já escorreguei aí com o balde cheio, em 98.'],
  ['Dona Marlene','Mármore, menina. Igual de igreja.'],['Dona Marlene','Os homens não falam com ninguém. Só medem e assentam.'],
  ['Dona Marlene','Tô te esperando aqui em cima. Tem uma coisa que você precisa ver.']],
 [['Seu Aurelino','Tua avó pescava aqui de tarde.'],['Seu Aurelino','Não tinha peixe. Ela dizia que vinha pra pensar.'],
  ['Seu Aurelino','Essa água já apagou fogo na casa da Cotinha.'],['Seu Aurelino','Já batizou uns três meninos também.'],
  ['Seu Aurelino','Olha como ela está baixando.']],
 [['Tia Cotinha','Minha mãe trouxe esse feijão no bolso da saia.'],['Tia Cotinha','Atravessou três secas com ele.'],
  ['Tia Cotinha','Todo ano eu guardo um punhado pra plantar de novo.'],['Tia Cotinha','O moço da prancheta pôs um número no pote ontem.'],
  ['Tia Cotinha','Disse que eu preciso de licença pra plantar o que é meu.']]
];

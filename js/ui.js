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
 {o:'Suba até o medidor de água da casa, no cano mais alto, para fazer a leitura. Pelo caminho, não deixe as Trenas medirem as coisas da garagem.',
  j:'Os canos e o carro coberto servem de degrau. Cada Trena estica uma fita entre dois objetos. O que fica no meio vira desenho branco. A água desfaz a Trena e limpa o que ela marcou. Quando chegar ao medidor, segure a tecla E.',
  p:'Naná é paga pela companhia de água para medir o consumo das casas. Em muitos bairros, a empresa entrega esse serviço a moradores contratados por fora. São eles que levam a cobrança até a porta dos vizinhos. Nesta fase, a ordem é medir a própria casa. O que vai para o registro é escolha sua.'},
 {o:'Aguente três ataques dos Etiquetadores. Eles querem pôr preço em tudo o que há na sala. Depois do terceiro ataque, responda ao pedido de Jéssica.',
  j:'Dá para subir no sofá, na mesa e na estante. Acerte os Etiquetadores com água no ar. Móvel marcado fica branco até você limpar. Se três etiquetas caírem em Naná, ela volta para a entrada. Nesse caso, a Medida sobe.',
  p:'A televisão oferece um "kit cidadã" para pagar em doze vezes. Muita gente só passa a ser bem tratada depois que vira cliente. Jéssica quer assinar porque loja nenhuma lhe deu crédito até hoje.'},
 {o:'Atravesse a esteira até o lugar onde Binho trabalha. Lá, vocês dois decidem o que fazer.',
  j:'A esteira empurra para trás quem fica parado. Três catracas fecham a passagem. Elas abrem por um instante quando o relógio de ponto bate. Fora dessa hora, pule por cima a partir das plataformas de madeira. Também dá para derrubar a catraca com água pelo lado de trás. Os cartões vêm rente ao chão. Pule.',
  p:'Binho arrumou emprego numa linha de produção. Passa o dia inteiro no mesmo movimento. Ele precisa do salário, só que o serviço machuca o braço e não deixa tempo para mais nada. Muita gente só encontra emprego desse tipo.'},
 {o:'Suba a escadaria até Dona Marlene, lá no alto. Com ela, decida o que fazer com a obra.',
  j:'Para subir, basta andar. De tempos em tempos, um rolo compressor desce a escada. Segure E em frente a uma porta para se esconder, ou pule por cima dele. Os cones perseguem Naná até levarem água. Casa por onde o rolo passa vira desenho branco. Você pode limpar.',
  p:'Dona Marlene carrega balde ladeira acima há trinta anos. Para ela, a escada faz falta de verdade. Só que o projeto foi feito sem ouvir ninguém da rua. Do jeito que foi desenhado, ele derruba duas casas.'},
 {o:'Solte as três mangueiras da bomba antes que a água acabe. Depois, converse com Seu Aurelino.',
  j:'A altura da água aqui dentro é o seu marcador Água. Com a bomba ligada, ele desce sem parar. Você pode nadar, subir nas plataformas de madeira e na canoa. Mire na ponta laranja de cada mangueira. Fique longe das turbinas do fundo. Quem encosta nelas leva etiqueta.',
  p:'Seu Aurelino cuida da caixa d\'água da rua há muitos anos. Agora instalaram uma bomba para levar essa água a outro lugar, onde ela vai gerar energia. Cada litro levado pela bomba deixa de chegar às torneiras da rua.'},
 {o:'Proteja os três potes de feijão de Tia Cotinha até os Carimbadores pararem de descer. Depois, decida com ela o destino das sementes.',
  j:'Os Carimbadores descem do alto em direção aos potes. Acerte com água antes que encostem. Pote carimbado fica branco até você limpar. A pilha de tijolos e o caixote ajudam a alcançar os que vêm mais alto.',
  p:'As sementes de Tia Cotinha estão na família há gerações. Há empresas que mudam um detalhe numa planta assim e registram a planta inteira como propriedade. Daí em diante, quem sempre plantou precisa pedir autorização. O nome da fase vem daí. A empresa diz que melhorou a semente em um por cento e, por isso, quer ser dona dela inteira.'}
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

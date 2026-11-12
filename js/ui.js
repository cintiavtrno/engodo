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
 {o:'Subir até o medidor de água da casa, no cano mais alto, e fazer a leitura. No caminho, impedir que as Trenas meçam as coisas da garagem.',
  j:'Use os canos e o carro coberto para subir. A Trena estica uma fita entre dois objetos e tudo o que fica no meio vira desenho branco. Jogue água para desfazer a Trena e para limpar o que ela marcou. No medidor, segure a tecla E.',
  p:'Naná trabalha para a companhia de água medindo o consumo das casas. Em muitos bairros esse serviço é feito por moradores contratados por fora, que acabam cobrando os próprios vizinhos. Nesta fase a empresa manda Naná medir a casa dela, e você escolhe o que ela registra.'},
 {o:'Resistir a três ataques dos Etiquetadores sem deixar que eles ponham preço em tudo. Depois, responder ao pedido de Jéssica.',
  j:'Suba no sofá, na mesa e na estante. Acerte os Etiquetadores com água enquanto voam, e limpe os móveis que eles marcarem. Se três etiquetas caírem em Naná, ela volta para a entrada e a Medida sobe.',
  p:'A televisão oferece um "kit cidadã" para pagar em doze vezes. A fase mostra o que acontece quando a pessoa só é bem tratada se puder comprar. Jéssica quer assinar porque nunca recebeu crédito de loja nenhuma.'},
 {o:'Atravessar a esteira até o lugar onde Binho trabalha e decidir com ele o que fazer.',
  j:'A esteira empurra você para trás. As catracas fecham a passagem e só abrem quando o relógio de ponto bate. Passe nessa hora, pule por cima a partir das plataformas de madeira ou derrube a catraca com água pelo lado de trás. Pule os cartões que vêm pelo chão.',
  p:'Binho arrumou emprego numa linha de produção, repetindo o mesmo movimento o dia inteiro. O salário é necessário, mas o serviço machuca o corpo e toma todo o tempo dele. A fase mostra a situação de quem só encontra esse tipo de emprego.'},
 {o:'Subir a escadaria até Dona Marlene, lá no alto, e decidir o que fazer com a obra.',
  j:'Suba andando. Quando o rolo compressor descer, segure E em frente a uma porta para se esconder, ou pule por cima dele. Os cones perseguem Naná: acerte com água. As casas por onde o rolo passa viram desenho branco, e você pode limpar.',
  p:'Dona Marlene carrega balde ladeira acima há trinta anos e precisa da escada. O projeto da obra foi feito sem ouvir os moradores e passa por cima de duas casas. A fase mostra obras que o bairro precisa, mas que chegam decididas por gente de fora.'},
 {o:'Soltar as três mangueiras da bomba antes que a água acabe. Depois, conversar com Seu Aurelino.',
  j:'A altura da água é o seu marcador Água: enquanto a bomba estiver ligada, ele desce. Você pode nadar, subir nas plataformas de madeira e na canoa. Acerte com água a ponta laranja de cada mangueira. Não encoste nas turbinas do fundo.',
  p:'Seu Aurelino cuida da caixa d\'água da rua e conhece a história dela. Uma bomba foi instalada para levar essa água e gerar energia para outro lugar. A fase mostra a disputa pela mesma água, e quem fica sem ela.'}
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

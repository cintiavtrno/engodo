/* Engodo — elenco na casa, aberturas, salas, andar e conversar */
/* ---------- elenco na casa ---------- */
const BASE={x0:-3.6,x1:3.2,z0:-2.1,z1:2.5},RUA={x0:-5.0,x1:5.2,z0:-3.2,z1:3.85},CASA={x0:-3.2,x1:2.8,z0:-1.6,z1:1.6};
const dentro=(r,x,z,m)=>x>r.x0-m&&x<r.x1+m&&z>r.z0-m&&z<r.z1+m;
/* zonas: onde cada um pode pisar e em que altura */
const CHAO={pode:(x,z)=>dentro(RUA,x,z,0)&&!dentro(CASA,x,z,.17)&&Math.hypot(x-2.75,z-2.2)>.25,y:(x,z)=>dentro(BASE,x,z,0)?0:-.1};
const VARANDA={pode:(x,z)=>x>.3&&x<2.55&&z>.05&&z<1.45,y:()=>1.92};
const TOPO={pode:(x,z)=>x>.42&&x<2.72&&z>-1.5&&z<-.28&&!(x>.6&&x<1.3&&z>-1.32&&z<-.68),y:()=>4.7};
const ELENCO=[
  {id:'nana',    nome:'Naná',         f:nana,    x:.6,   z:2.08, ry:0,    zona:CHAO,   vel:1.0},
  {id:'agente',  nome:'O Agente',     f:agente,  x:1.75, z:3.25, ry:-135, zona:CHAO,   vel:.42},
  {id:'marlene', nome:'Dona Marlene', f:marlene, x:3.85, z:.5,   ry:48,   zona:CHAO,   vel:.5},
  {id:'binho',   nome:'Binho',        f:binho,   x:1.7,  z:-2.55,ry:180,  zona:CHAO,   vel:.95},
  {id:'cotinha', nome:'Tia Cotinha',  f:cotinha, x:1.75, z:.95,  ry:0,    zona:VARANDA,vel:.4},
  {id:'ze',      nome:'Seu Zé Rádio', f:ze,      x:2.25, z:2.2,  ry:8,    zona:CHAO,   vel:.6},
  {id:'jessica', nome:'Jéssica',      f:jessica, x:-2.4, z:3.3,  ry:20,   zona:CHAO,   vel:.95},
  {id:'aurelino',nome:'Seu Aurelino', f:aurelino,x:2.15, z:-.8,  ry:20,   zona:TOPO,   vel:.4},
  {id:'dete',    nome:'Vó Dete',      f:dete,    x:-3.0, z:2.1,  ry:15,   zona:CHAO,   vel:.25}
];
ELENCO.forEach(a=>{
  a.ry=rad(a.ry);a.alvo=a.ry;a.y=a.zona.y(a.x,a.z);a.w=0;a.anda=false;a.fala=false;
  a.f.root.position.set(a.x,a.y,a.z);a.f.root.rotation.y=a.ry;scene.add(a.f.root);
});
/* a Fila atravessa a rua da frente e nunca para */
const fila=criarFila(30,{x0:-5.0,x1:5.2,z:4.35});
fila.root.position.y=-.1;scene.add(fila.root);

/* conversas: chave = os dois ids em ordem alfabética */
const OLA={nana:'Bom dia.',agente:'Bom dia. Já fez o seu cadastro na Fila?',marlene:'Bom dia, minha filha.',binho:'E aí.',cotinha:'Deus abençoe.',
  ze:'Diga aí.',jessica:'Olha o geladinho.',aurelino:'Boa tarde.',dete:'Oi, minha filha.'};
const DIAL={
  'agente+nana':[['agente','Bom dia. Vim avisar que esta rua foi incluída no programa de desenvolvimento.'],['nana','E o que muda pra gente?'],
    ['agente','Todos os moradores entram numa fila. Quem esperar a vez recebe obra, emprego e crédito.'],
    ['nana','Essa fila aí na frente não andou desde cedo.'],['agente','É só ter paciência. Enquanto isso, eu preciso medir a casa e a água de vocês.']],
  'marlene+nana':[['marlene','Naná, faz trinta anos que eu subo essa ladeira com balde na cabeça.'],['nana','Disseram que vão fazer uma escada.'],
    ['marlene','Tomara. Meu joelho não aguenta mais.']],
  'binho+nana':[['binho','Arrumei emprego, Naná. Carteira assinada.'],['nana','Fazendo o quê?'],
    ['binho','Virando balde numa esteira, o dia inteiro. Cansa, mas foi o que apareceu.']],
  'cotinha+nana':[['cotinha','Essas sementes eram da minha mãe. Eu planto todo ano.'],['nana','O homem da Fila perguntou delas?'],
    ['cotinha','Perguntou. Disse que agora precisa de registro. Tenho medo de tomarem.']],
  'nana+ze':[['ze','Naná, puseram propaganda no meu rádio. Só toca a música da Fila.'],['nana','O senhor não consegue tirar?'],
    ['ze','Sozinho não. Preciso subir no poste e pegar meu microfone de volta.']],
  'jessica+nana':[['jessica','Quer geladinho, Naná? Hoje tem muito freguês por causa dessa fila.'],['nana','Você sabe pra que é a fila?'],
    ['jessica','Dizem que no fim dela tem emprego e crédito. Eu queria conseguir um cartão.']],
  'aurelino+nana':[['aurelino','A água da caixa está baixando, Naná.'],['nana','O pessoal está gastando mais?'],
    ['aurelino','Tem alguém puxando água daqui pra outro lugar. Sobe aqui depois pra ver.']],
  'dete+nana':[['dete','Você vai medir a nossa casa pra empresa, minha filha?'],['nana','É o meu trabalho, vó. Ainda não decidi o que fazer.'],
    ['dete','Fica com a chave do registro. A água desta caixa é dos moradores da rua.']],
  'agente+marlene':[['marlene','Moço, a escada vai passar por onde?'],['agente','Pelo caminho que o projeto definiu.'],
    ['marlene','Esse caminho passa em cima da casa de alguém?'],['agente','Isso a senhora vai ver quando a obra chegar.']],
  'binho+marlene':[['marlene','Binho, teu braço não para de mexer.'],['binho','É do serviço, Dona Marlene. Fico repetindo o movimento sem perceber.'],['marlene','Vai num médico, menino.']],
  'cotinha+ze':[['ze','Cotinha, se eu recuperar o rádio, você fala das sementes pra rua?'],['cotinha','Falo. Só não vou dizer onde eu guardo.']],
  'agente+jessica':[['jessica','Moço, quem vende na rua também pode entrar na Fila?'],['agente','Pode. É só fazer o cadastro e esperar.'],
    ['jessica','E demora quanto?'],['agente','Não tenho essa informação.']],
  'aurelino+dete':[['aurelino','Dete, a caixa nunca esteve tão baixa.'],['dete','Então a gente precisa chamar a rua pra conversar hoje à noite.']],
  'agente+ze':[['ze','Quem deixou vocês usarem o meu poste pra tocar propaganda?'],['agente','A prefeitura cedeu o poste para o programa.'],['ze','Ninguém me perguntou.']],
  'agente+cotinha':[['agente','A senhora tem registro dessas sementes?'],['cotinha','Elas são da minha família há muito tempo.'],['agente','Sem registro, uma empresa pode registrar no nome dela.']],
  'binho+jessica':[['jessica','Você vai mesmo trabalhar na esteira?'],['binho','Vou. E você, vai tentar o cartão?'],['jessica','Vou.'],['binho','Tomara que dê certo pra nós dois.']]
};
function roteiro(a,b){
  const k=[a.id,b.id].sort().join('+');
  return DIAL[k]||[[a.id,OLA[a.id]],[b.id,OLA[b.id]]];
}

/* ---------- aberturas ---------- */
const V=(x,y,z)=>new T.Vector3(x,y,z);
const OPS=[
  {t:'Leitura',     w:'Portão pichado da garagem',      sz:[2.05,1.45], p:V(-1.65,.72,1.685), ry:0,           n:V(0,0,1),  d:1.0, up:.25},
  {t:'Compradora',  w:'Porta de madeira da frente',     sz:[.62,1.24],  p:V(.6,.62,1.685),    ry:0,           n:V(0,0,1),  d:.9,  up:.25},
  {t:'Tempos modernos', w:'Porta dos fundos',           sz:[.62,1.24],  p:V(1.0,.62,-1.685),  ry:Math.PI,     n:V(0,0,-1), d:.9,  up:.25},
  {t:'A obra',      w:'Borda da base, lado direito',    sz:[4.6,.32],   p:V(3.21,-.07,.2),    ry:Math.PI/2,   n:V(1,0,0),  d:1.0, up:.45},
  {t:'O livro',     w:'Tampa de madeira em cima da caixa', sz:[.58,.52], p:V(.95,5.17,-1),    rx:-Math.PI/2,   n:V(0,1,0),  d:1.0, off:V(0,0,.8)},
  {t:'Um por cento',w:'Vão escuro da varanda',          sz:[.74,.94],   p:V(1,2.45,-.14),     ry:0,           n:V(0,0,1),  d:1.25, up:0},
  {t:'Concessão',   w:'Poste na calçada',               sz:[.3,2.4],    p:V(2.75,1.45,2.2),   cyl:true,       n:V(0,0,1),  d:1.1, up:.3},
  {t:'Na minha opinião', w:'Janela gradeada da lateral esquerda', sz:[.68,.84], p:V(-3.25,2.6,.1), ry:-Math.PI/2, n:V(-1,0,0), d:1.0, up:0}
];
const hotspots=[];
OPS.forEach((o,i)=>{
  const mat=new T.MeshBasicMaterial({color:0xffb94d,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide});
  const g=o.cyl?new T.CylinderGeometry(.13,.15,o.sz[1],16,1,true):new T.PlaneGeometry(o.sz[0],o.sz[1]);
  const m=new T.Mesh(g,mat);m.position.copy(o.p);m.rotation.set(o.rx||0,o.ry||0,0);m.userData.i=i;
  scene.add(m);hotspots.push(m);o.mesh=m;o.glow=0;
});

/* ---------- interiores (cada sala ignora o tamanho de fora) ---------- */
const roomScene=new T.Scene();
roomScene.background=new T.Color(BG);
roomScene.fog=new T.Fog(BG,.05,.9);
const SPECS=[
  {wall:'#7b6a58',acc:'#e0a458',size:[18,6,13]},
  {wall:'#8a5a6a',acc:'#f2c46d',size:[16,6,12]},
  {wall:'#5d6b73',acc:'#8fd0c8',size:[22,7,14]},
  {wall:'#8f8372',acc:'#e57c3a',size:[20,6,15]},
  {wall:'#4f5c4a',acc:'#e6d08a',size:[15,8,12]},
  {wall:'#2e3440',acc:'#d9b45a',size:[24,6,16]},
  {wall:'#6a6f86',acc:'#ffd36a',size:[17,6,13]},
  {wall:'#8a4a38',acc:'#f1e2c8',size:[19,6,14]}
];
let exitMesh=null,roomSpec=null;
function clearRoom(){
  for(let k=roomScene.children.length-1;k>=0;k--){
    const o=roomScene.children[k];
    o.traverse(n=>{if(n.geometry)n.geometry.dispose();if(n.material){(Array.isArray(n.material)?n.material:[n.material]).forEach(m=>{if(m.map)m.map.dispose();m.dispose();});}});
    roomScene.remove(o);
  }
  exitMesh=null;
}
function rbox(w,h,d,x,y,z,m){const me=new T.Mesh(new T.BoxGeometry(w,h,d),m);me.position.set(x,y,z);roomScene.add(me);return me;}
function buildRoom(i){
  clearRoom();
  const s=SPECS[i],[w,h,d]=s.size,o=OPS[i];
  roomSpec=s;
  roomScene.add(new T.HemisphereLight(0xffffff,0x887766,.8));
  const pl=new T.PointLight(0xffe0b0,1.1,60);pl.position.set(0,h-1.2,0);roomScene.add(pl);
  const wm=matOf(plaster(s.wall,['rgba(0,0,0,.16)','rgba(255,255,255,.10)'],5,false,'40,30,25'));
  const wg=new T.BoxGeometry(w,h,d);wg.translate(0,h/2,0);worldUV(wg,3,0,0);
  const wall=new T.Mesh(wg,wm);wall.material.side=T.BackSide;roomScene.add(wall);
  const fm=matOf(woodTex(i%2===1),.9);
  const fg=new T.PlaneGeometry(w-.02,d-.02);fg.rotateX(-Math.PI/2);worldUV(fg,3,0,0);
  const fl=new T.Mesh(fg,fm);fl.position.y=.005;roomScene.add(fl);
  const accM=new T.MeshStandardMaterial({color:s.acc,roughness:.8});
  /* tapete, mesa, luminária */
  const rug=new T.Mesh(new T.PlaneGeometry(6,4),accM);rug.rotation.x=-Math.PI/2;rug.position.y=.015;roomScene.add(rug);
  rbox(3,.12,1.4,0,.95,0,M.wood);
  [[-1.35,-.55],[1.35,-.55],[-1.35,.55],[1.35,.55]].forEach(([x,z])=>rbox(.1,.9,.1,x,.45,z,M.dark));
  rbox(.02,h-2.2,.02,0,(h+2.2)/2,0,M.dark);
  const sh=new T.Mesh(new T.ConeGeometry(.55,.4,20,1,true),new T.MeshBasicMaterial({color:s.acc,side:T.DoubleSide}));sh.position.set(0,2.2,0);roomScene.add(sh);
  /* placa com número e título */
  const [c,x]=mk(1024,512);
  x.fillStyle='#17141c';x.fillRect(0,0,1024,512);
  x.strokeStyle=s.acc;x.lineWidth=8;x.strokeRect(18,18,988,476);
  x.fillStyle=s.acc;x.textBaseline='alphabetic';x.font='700 220px Georgia,serif';x.textAlign='left';x.fillText(String(i+1),60,290);
  x.fillStyle='#f4efe8';x.font='700 78px Georgia,serif';x.fillText(o.t,60,400);
  x.font='italic 34px Georgia,serif';x.fillStyle='rgba(244,239,232,.6)';x.fillText('sala em construção · o conteúdo entra aqui',60,452);
  const pt=new T.CanvasTexture(c);pt.encoding=T.sRGBEncoding;
  const plaque=new T.Mesh(new T.PlaneGeometry(8,4),new T.MeshBasicMaterial({map:pt}));plaque.position.set(0,3.1,-d/2+.03);roomScene.add(plaque);
  /* porta de volta (parede da frente) */
  const door=new T.Mesh(new T.PlaneGeometry(1.4,2.45),decalMat(doorTex()));door.position.set(0,1.225,d/2-.03);door.rotation.y=Math.PI;roomScene.add(door);
  const eg=new T.Mesh(new T.PlaneGeometry(1.6,2.6),new T.MeshBasicMaterial({color:0xffb94d,transparent:true,opacity:.22,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));
  eg.position.set(0,1.3,d/2-.06);eg.rotation.y=Math.PI;roomScene.add(eg);exitMesh=eg;
}

/* ---------- interface ---------- */
function resize(){
  const w=window.innerWidth,h=window.innerHeight;
  renderer.setSize(w,h,false);
  camera.aspect=w/h;
  const portrait=w/h<.9;
  camera.fov=portrait?52:38;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize',resize);resize();

const $=id=>document.getElementById(id);
const rot=$('rot'),backB=$('back'),roomTitle=$('roomTitle'),tip=$('tip'),listEl=$('list'),ol=$('ol');
let spin=true,mode='house',busy=false,current=-1,hovered=-1,listHover=-1,pauseUntil=0;
let active=scene;
const visited=new Set();
const lerp=(a,b,k)=>a+(b-a)*k;
const ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
const tweens=[];
function tween(dur,fn,done){tweens.push({t0:performance.now(),dur,fn,done});}

function setLimits(m){
  if(m==='house'){controls.minDistance=4;controls.maxDistance=24;controls.maxPolarAngle=Math.PI/2-.02;controls.minPolarAngle=0;controls.enablePan=true;}
  else if(m==='free'){controls.minDistance=0;controls.maxDistance=Infinity;controls.maxPolarAngle=Math.PI;controls.minPolarAngle=0;controls.enablePan=false;}
  else{controls.minDistance=.5;controls.maxDistance=roomSpec.size[2]/2-1.2;controls.minPolarAngle=.6;controls.maxPolarAngle=1.9;controls.enablePan=false;}
}

OPS.forEach((o,i)=>{
  const li=document.createElement('li'),b=document.createElement('button');
  b.innerHTML='<i>'+(i+1)+'.</i><span>'+o.t+'</span>';
  b.addEventListener('click',()=>enter(i));
  b.addEventListener('pointerenter',()=>{listHover=i;b.classList.add('on');});
  b.addEventListener('pointerleave',()=>{listHover=-1;b.classList.remove('on');});
  li.appendChild(b);ol.appendChild(li);o.btn=b;
});
function updateList(){
  OPS.forEach((o,i)=>o.btn.classList.toggle('seen',visited.has(i)));
  $('listSum').textContent='Aberturas · '+visited.size+'/'+OPS.length;
}
updateList();

/* duas aberturas acesas entre movimentos */
let lit=[0,1];
function pickLit(){
  const pool=OPS.map((_,i)=>i).filter(i=>!visited.has(i)&&i!==current);
  const src=pool.length>=2?pool:OPS.map((_,i)=>i);
  const a=src[(Math.random()*src.length)|0];
  let b=a;while(b===a)b=src[(Math.random()*src.length)|0];
  lit=[a,b];
}
pickLit();
setInterval(()=>{if(mode==='house'&&!busy&&hovered<0)pickLit();},5500);

/* transições */
const ZERO=V(0,0,0);
let exitCam=null,exitTgt=null;
function enter(i){
  if(busy||mode!=='house')return;
  busy=true;current=i;visited.add(i);updateList();hideTip();
  const o=OPS[i],P=o.p.clone();
  const end=P.clone().addScaledVector(o.n,o.d).add(o.off||ZERO);end.y+=o.up||0;
  exitCam=end.clone();exitTgt=P.clone();
  const sp=camera.position.clone(),st=controls.target.clone();
  setLimits('free');controls.enabled=false;controls.autoRotate=false;
  tween(2000,k=>{
    const e=ease(k),f=Math.pow(k,2.2);
    camera.position.lerpVectors(sp,end,e);controls.target.lerpVectors(st,P,e);
    scene.fog.near=lerp(28,.05,f);scene.fog.far=lerp(70,.9,f);
  },()=>openRoom(i));
}
function openRoom(i){
  if(FASES[i]){abreFase(i);return;}
  buildRoom(i);
  const [w,h,d]=roomSpec.size;
  active=roomScene;mode='room';
  setLimits('room');
  camera.position.set(0,1.7,d/2-1.5);controls.target.set(0,1.7,0);controls.update();
  roomTitle.textContent=(i+1)+'. '+OPS[i].t;roomTitle.hidden=false;backB.hidden=false;
  $('rot').hidden=true;$('reset').hidden=true;listEl.hidden=true;
  tween(1600,k=>{const e=ease(k);roomScene.fog.near=lerp(.05,10,e);roomScene.fog.far=lerp(.9,60,e);},()=>{
    controls.enabled=true;busy=false;
  });
}
function leave(){
  if(busy||(mode!=='room'&&mode!=='fase'))return;
  busy=true;controls.enabled=false;
  tween(900,k=>{const e=ease(k);roomScene.fog.near=lerp(10,.05,e);roomScene.fog.far=lerp(60,.9,e);},()=>{
    if(mode==='fase')fechaFase();
    mode='house';active=scene;
    roomTitle.hidden=true;backB.hidden=true;$('rot').hidden=false;$('reset').hidden=false;listEl.hidden=false;
    setLimits('free');
    const sp=exitCam.clone(),st=exitTgt.clone();
    camera.position.copy(sp);controls.target.copy(st);controls.update();
    scene.fog.near=.05;scene.fog.far=.9;
    pickLit();
    tween(2000,k=>{
      const e=ease(k),f=Math.pow(1-k,2.2);
      camera.position.lerpVectors(sp,HOME.pos,e);controls.target.lerpVectors(st,HOME.target,e);
      scene.fog.near=lerp(28,.05,f);scene.fog.far=lerp(70,.9,f);
    },()=>{
      scene.fog.near=28;scene.fog.far=70;
      setLimits('house');controls.enabled=true;busy=false;current=-1;
    });
  });
}
backB.addEventListener('click',leave);
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!pausa)leave();});

rot.addEventListener('click',()=>{
  spin=!spin;rot.setAttribute('aria-pressed',String(spin));
});
$('reset').addEventListener('click',()=>{
  if(busy||mode!=='house')return;
  camera.position.copy(HOME.pos);controls.target.copy(HOME.target);controls.update();
});
controls.addEventListener('start',()=>{pauseUntil=Infinity;});
controls.addEventListener('end',()=>{pauseUntil=performance.now()+2500;});

/* ponteiro: hover + clique (sem confundir com arrasto) */
const ray=new T.Raycaster(),mouse=new T.Vector2();
function pick(ev,list){
  const r=canvas.getBoundingClientRect();
  mouse.set(((ev.clientX-r.left)/r.width)*2-1,-((ev.clientY-r.top)/r.height)*2+1);
  ray.setFromCamera(mouse,camera);
  const h=ray.intersectObjects(list,false);
  return h.length?h[0].object:null;
}
function hideTip(){tip.hidden=true;hovered=-1;canvas.style.cursor='';}
canvas.addEventListener('pointermove',ev=>{
  if(busy||ev.buttons){if(ev.buttons)hideTip();return;}
  if(mode==='house'){
    const m=pick(ev,hotspots);
    if(m){
      hovered=m.userData.i;const o=OPS[hovered];
      tip.innerHTML=(hovered+1)+'. '+o.t+'<small>'+o.w+'</small>';
      tip.style.left=ev.clientX+'px';tip.style.top=ev.clientY+'px';tip.hidden=false;canvas.style.cursor='pointer';
    }else hideTip();
  }else if(mode==='room'){
    canvas.style.cursor=pick(ev,[exitMesh])?'pointer':'';
  }
});
let down=null;
canvas.addEventListener('pointerdown',ev=>{down={x:ev.clientX,y:ev.clientY};});
canvas.addEventListener('pointerup',ev=>{
  if(!down||busy)return;
  const moved=Math.hypot(ev.clientX-down.x,ev.clientY-down.y);down=null;
  if(moved>6)return;
  if(mode==='house'){const m=pick(ev,hotspots);if(m)enter(m.userData.i);}
  else if(mode==='room'){if(pick(ev,[exitMesh]))leave();}
});
canvas.addEventListener('pointerleave',()=>{if(!busy)hideTip();});


/* ---------- andar, trocar de personagem, conversar ---------- */
const elDlg=$('dlg'),elQuem=$('quem'),elTxt=$('txt'),elAviso=$('aviso'),elCtl=$('ctl');
let pausa=true;   // verdadeiro enquanto uma tela (abertura, menu, tutorial) está aberta
const teclas=new Set();
let ctl=0,conversa=null,perto=null,tAnt=0;
const porId=id=>ELENCO.find(a=>a.id===id);
function mostraCtl(){elCtl.textContent='Você: '+ELENCO[ctl].nome+' · Tab troca';}
mostraCtl();
function livre(a,x,z){
  return a.zona.pode(x,z)&&ELENCO.every(o=>o===a||o.zona!==a.zona||Math.hypot(o.x-x,o.z-z)>.3);
}
function anda(a,dx,dz,dt){
  const s=a.vel*dt,nx=a.x+dx*s,nz=a.z+dz*s;
  if(livre(a,nx,nz)){a.x=nx;a.z=nz;}
  else if(livre(a,nx,a.z))a.x=nx;
  else if(livre(a,a.x,nz))a.z=nz;
  else return false;
  return true;
}
function vizinho(a){
  let m=null,md=1e9;
  ELENCO.forEach(o=>{
    if(o===a||o.fora)return;
    /* quem está no mesmo chão tem prioridade; quem está em cima só se estiver bem perto */
    const d=Math.hypot(o.x-a.x,o.z-a.z),mesmo=o.zona===a.zona,lim=mesmo?.95:1.25,nota=d+(mesmo?0:2);
    if(d<lim&&nota<md){m=o;md=nota;}
  });
  return m;
}
function abreConversa(a,b){
  conversa={a,b,l:roteiro(a,b),i:0,n:0,t0:performance.now()};
  a.alvo=Math.atan2(b.x-a.x,b.z-a.z);b.alvo=Math.atan2(a.x-b.x,a.z-b.z);
  elDlg.hidden=false;elAviso.hidden=true;linha();
}
function linha(){
  const [id,tx]=conversa.l[conversa.i],q=porId(id);
  ELENCO.forEach(o=>o.fala=o===q);
  elQuem.textContent=q.nome;conversa.tx=tx;conversa.t0=performance.now();conversa.n=0;elTxt.textContent='';
}
function avanca(){
  if(!conversa)return;
  if(conversa.n<conversa.tx.length){conversa.t0=-1e9;return;}      // completa a linha
  if(++conversa.i>=conversa.l.length)fechaConversa();else linha();
}
function fechaConversa(){conversa=null;ELENCO.forEach(o=>o.fala=false);elDlg.hidden=true;}
const SETAS={ArrowUp:[0,1],KeyW:[0,1],ArrowDown:[0,-1],KeyS:[0,-1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]};
window.addEventListener('keydown',e=>{
  if(mode!=='house'||busy||pausa)return;
  if(SETAS[e.code]){teclas.add(e.code);e.preventDefault();if(spin){spin=false;rot.setAttribute('aria-pressed','false');}}
  else if(e.code==='Tab'){e.preventDefault();if(!conversa){ctl=(ctl+(e.shiftKey?ELENCO.length-1:1))%ELENCO.length;mostraCtl();}}
  else if(e.code==='KeyE'||e.code==='Space'||e.code==='Enter'){
    e.preventDefault();
    if(conversa)avanca();else if(perto&&e.code!=='Space')abreConversa(ELENCO[ctl],perto);
  }else if(e.code==='Escape'&&conversa){fechaConversa();e.stopImmediatePropagation();}
});
window.addEventListener('keyup',e=>teclas.delete(e.code));
window.addEventListener('blur',()=>teclas.clear());
elDlg.addEventListener('click',()=>{if(fl)flAvanca();else avanca();});
const _f=new T.Vector3(),_d=new T.Vector3();
function cena(tt){
  const dt=Math.min(.1,Math.max(0,tt-tAnt));tAnt=tt;
  const a=ELENCO[ctl],jogando=mode==='house'&&!busy;
  let mx=0,mz=0;
  if(jogando&&!conversa)teclas.forEach(k=>{mx+=SETAS[k][0];mz+=SETAS[k][1];});
  ELENCO.forEach(o=>o.anda=false);
  if(mx||mz){
    /* direção relativa à câmera: seta para cima afasta da câmera */
    _f.subVectors(controls.target,camera.position);_f.y=0;_f.normalize();
    const dx=_f.x*mz-_f.z*mx,dz=_f.z*mz+_f.x*mx,n=Math.hypot(dx,dz)||1;
    a.alvo=Math.atan2(dx/n,dz/n);
    const x0=a.x,z0=a.z;
    a.anda=anda(a,dx/n,dz/n,dt);
    /* a câmera acompanha quem anda, sem mudar o ângulo */
    _d.set(a.x-x0,0,a.z-z0);controls.target.add(_d);camera.position.add(_d);
    pauseUntil=performance.now()+4000;
  }
  ELENCO.forEach(o=>{
    if(o.fora)return;
    o.w+=((o.anda?1:0)-o.w)*Math.min(1,dt*9);
    let dr=o.alvo-o.ry;dr=Math.atan2(Math.sin(dr),Math.cos(dr));o.ry+=dr*Math.min(1,dt*8);
    o.y+=(o.zona.y(o.x,o.z)-o.y)*Math.min(1,dt*12);
    o.f.root.position.set(o.x,o.y,o.z);o.f.root.rotation.y=o.ry;
    o.f.update(tt,o.w);
    if(o.fala)o.f.head.rotation.x+=Math.sin(tt*9)*.045;
  });
  fila.update(tt,.35);
  if(conversa){
    const n=Math.min(conversa.tx.length,Math.floor((performance.now()-conversa.t0)/28));
    if(n!==conversa.n){conversa.n=n;elTxt.textContent=conversa.tx.slice(0,n);}
  }
  perto=jogando&&!conversa?vizinho(a):null;
  if(mode==='fase'){}else if(perto){elAviso.textContent='E · conversar com '+perto.nome;elAviso.hidden=false;}else elAviso.hidden=true;
  elCtl.hidden=mode!=='house';
  if(mode!=='house'&&conversa)fechaConversa();
  if(mode==='fase'){elCtl.hidden=true;return;}
}
window.__jogo={ELENCO,camera,controls,teclas,abreConversa,avanca,get conversa(){return conversa;},setCtl(i){ctl=i;mostraCtl();}};


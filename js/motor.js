/* Engodo — estado do dia, falas com escolha e motor lateral das fases */
/* ================================================================
   FASES — estado do dia, HUD, falas com escolha, motor lateral 2,5D
   ================================================================ */
const G={agua:700,medida:0,voz:new Set(),corpo:0,flags:{},feitas:new Set()};
const elOps=$('ops'),elDica=$('dica'),elHint=$('hint'),elFim=$('fim');
const HINT_CASA=elHint.textContent,HINT_FASE='A / D andam · W ou espaço pula · S desce · mouse mira · clique (ou F) atira · Shift esquiva · E interage · Esc volta à casa';
function hud(){
  $('hAgua').textContent=Math.round(G.agua)+' L';$('bAgua').style.width=(G.agua/10)+'%';
  $('hMed').textContent=Math.round(G.medida)+'%';$('bMed').style.width=G.medida+'%';
  $('hVoz').textContent=G.voz.size;
  $('hCorpo').textContent='●'.repeat(G.corpo)+'○'.repeat(3-G.corpo);$('wCorpo').hidden=mode!=='fase';
}
function soma(k,v){G[k]=Math.max(0,Math.min(k==='agua'?1000:100,G[k]+v));hud();
  if(G.agua<=0)fimDoDia('Caixa seca','A caixa foi ligada à rede. A água passa a chegar em forma de conta.');
  else if(G.medida>=100)fimDoDia('Unidade 0047','A casa se dobra em planta baixa e recebe um número.');
}
let acabou=false;
function fimDoDia(t,d){
  if(acabou)return;acabou=true;
  $('fimT').textContent=t;$('fimD').textContent=d;elFim.hidden=false;
}
$('fimB').addEventListener('click',()=>{
  G.agua=700;G.medida=0;G.voz.clear();G.corpo=0;G.flags={};G.feitas.clear();acabou=false;elFim.hidden=true;hud();
  if(mode==='fase')leave();
});

/* ---------- falas com escolha (usadas dentro das fases) ---------- */
let fl=null;
function diz(linhas,fim){fl={l:linhas,i:0,fim};elDlg.hidden=false;flLinha();}
function flLinha(){
  const [q,tx,ops]=fl.l[fl.i];
  elQuem.textContent=q||'';fl.tx=tx;fl.t0=performance.now();fl.n=0;fl.ops=ops||null;fl.posto=false;
  elTxt.textContent='';elOps.innerHTML='';elDica.hidden=!!ops;
}
function flAvanca(){
  if(!fl)return;
  if(fl.n<fl.tx.length){fl.t0=-1e9;return;}
  if(fl.ops)return;
  if(++fl.i>=fl.l.length){const f=fl.fim;fl=null;elDlg.hidden=true;elDica.hidden=false;f&&f();}else flLinha();
}
function flEscolhe(k){
  if(!fl||!fl.ops||!fl.posto||!fl.ops[k]||fl.ops[k].off)return;
  const o=fl.ops[k];fl=null;elDlg.hidden=true;elOps.innerHTML='';elDica.hidden=false;o.fn();
}
function flTick(){
  if(!fl)return;
  const n=Math.min(fl.tx.length,Math.floor((performance.now()-fl.t0)/24));
  if(n!==fl.n){fl.n=n;elTxt.textContent=fl.tx.slice(0,n);}
  if(fl.ops&&!fl.posto&&n>=fl.tx.length){
    fl.posto=true;
    fl.ops.forEach((o,k)=>{
      const b=document.createElement('button');b.textContent=(k+1)+'. '+o.t+(o.off?' ('+o.off+')':'');if(o.off)b.className='off';
      b.addEventListener('click',e=>{e.stopPropagation();flEscolhe(k);});elOps.appendChild(b);
    });
  }
}

/* ---------- materiais das fases ---------- */
function plantaTex(){
  const [c,x]=mk(256,256);
  x.fillStyle='#f2f0e9';x.fillRect(0,0,256,256);
  for(let i=0;i<=256;i+=16){x.strokeStyle=i%64===0?'rgba(85,125,170,.75)':'rgba(120,160,200,.4)';x.lineWidth=i%64===0?1.5:1;
    x.beginPath();x.moveTo(i,0);x.lineTo(i,256);x.moveTo(0,i);x.lineTo(256,i);x.stroke();}
  x.strokeStyle='rgba(40,50,65,.8)';x.lineWidth=1.5;
  [[20,40,150],[90,170,120],[30,220,70]].forEach(([x0,y,w])=>{
    x.beginPath();x.moveTo(x0,y);x.lineTo(x0+w,y);x.moveTo(x0,y-5);x.lineTo(x0,y+5);x.moveTo(x0+w,y-5);x.lineTo(x0+w,y+5);x.stroke();
    x.fillStyle='rgba(40,50,65,.8)';x.fillRect(x0+w/2-9,y-10,5,7);x.fillRect(x0+w/2-2,y-10,5,7);x.fillRect(x0+w/2+6,y-10,3,7);
  });
  return c;
}
M.planta=matOf(plantaTex(),.9);
const corLin=h=>new T.Color(h).convertSRGBToLinear();
const M_LARANJA=new T.MeshStandardMaterial({color:corLin(0xf07a1c),emissive:corLin(0xd9560a),emissiveIntensity:.6,roughness:.6,flatShading:true});
const M_GOTA=new T.MeshStandardMaterial({color:corLin(0x6f9cc6),emissive:corLin(0x2f6a9c),emissiveIntensity:.55,roughness:.25,flatShading:true});
function texto(w,h,fn){const [c,x]=mk(w,h);fn(x,w,h);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;}

/* ---------- construção de cenário dentro da sala ---------- */
function lmesh(g,m,x,y,z){const me=new T.Mesh(g,m);me.position.set(x||0,y||0,z||0);me.castShadow=true;me.receiveShadow=true;roomScene.add(me);return me;}
function lbox(w,h,d,x,y,z,m,size){
  const g=new T.BoxGeometry(w,h,d);g.translate(x,y,z);worldUV(g,size||3,R(),R());
  const me=new T.Mesh(g,m);me.castShadow=true;me.receiveShadow=true;roomScene.add(me);return me;
}
function lcyl(rt,rb,h,x,y,z,m,seg){return lmesh(new T.CylinderGeometry(rt,rb,h,seg||8),m,x,y,z);}
function lplano(tex,w,h,x,y,z,ry,emiss){
  const m=new T.MeshStandardMaterial({map:tex,roughness:.8});
  if(emiss){m.emissive=new T.Color(0xffffff);m.emissiveMap=tex;m.emissiveIntensity=emiss;}
  const me=new T.Mesh(new T.PlaneGeometry(w,h),m);me.position.set(x,y,z);me.rotation.y=ry||0;me.receiveShadow=true;roomScene.add(me);return me;
}
/* caixa de palco: chão, fundo, laterais e teto, aberta para a câmera */
function palco(x0,x1,H,mPar,mChao,mTeto){
  const W=x1-x0,cx=(x0+x1)/2;
  lbox(W+.6,.3,3.2,cx,-.15,-.3,mChao,3);
  lbox(W+.6,H+.3,.3,cx,H/2,-1.85,mPar,3);
  lbox(.3,H,3.2,x0-.15,H/2,-.3,mPar,3);
  lbox(.3,H,3.2,x1+.15,H/2,-.3,mPar,3);
  lbox(W+.6,.25,3.2,cx,H+.125,-.3,mTeto||mChao,3);
}
function luzes(x0,x1,H,cor,int,hemi){
  roomScene.add(new T.HemisphereLight(0xffffff,0x8a7f76,hemi));
  const d=new T.DirectionalLight(cor,int);d.position.set((x0+x1)/2-3,H+4,9);d.target.position.set((x0+x1)/2,H/2,-.5);
  d.castShadow=true;d.shadow.mapSize.set(2048,2048);
  const s=d.shadow.camera,w=(x1-x0)/2+2;s.left=-w;s.right=w;s.top=H+1;s.bottom=-H-1;s.near=1;s.far=30;d.shadow.bias=-.0005;
  roomScene.add(d,d.target);
}

/* ---------- estado da fase em curso ---------- */
let FS=null;                      // fase em curso
const PJ={x:0,y:0,vx:0,vy:0,chao:true,dir:1,inv:0,dash:0,dashCd:0,drop:0,ax:1,ay:0,ry:Math.PI/2};
const fk=new Set();let pulo=false,tiro=false,mouseN=null,usouE=false;
/* objeto do cenário que pode ser medido */
function prop(ms,x0,x1,y0,y1){
  const p={ms:[].concat(ms),x0,x1,y0,y1,med:false,lav:0};p.orig=p.ms.map(m=>m.material);FS.props.push(p);return p;
}
function mede(p){if(p.med)return;p.med=true;p.lav=0;p.ms.forEach(m=>m.material=M.planta);soma('medida',2);}
function lava(p){if(!p.med)return;p.med=false;p.ms.forEach((m,i)=>m.material=p.orig[i]);soma('medida',-2);}
function etiquetaCorpo(sx){
  if(PJ.inv>0||PJ.esc)return;
  G.corpo++;PJ.inv=1.3;PJ.vx=sx*4.2;PJ.vy=3;
  if(G.corpo>=3){
    G.corpo=0;soma('medida',10);PJ.x=FS.inicio;PJ.y=0;PJ.vx=PJ.vy=0;PJ.inv=2.5;
    recado('Cadastrada. Você acorda na porta, e a casa perde mais um pedaço.',3.5);
  }
  hud();
}
function recado(t,s){FS.recado=t;FS.recadoT=s||2.5;}

/* gotas da mangueira */
const NG=420,gotas={n:NG,px:new Float32Array(NG),py:new Float32Array(NG),vx:new Float32Array(NG),vy:new Float32Array(NG),vida:new Float32Array(NG),i:0,acc:0};
let gotasIM=null;const _o=new T.Object3D();
function novaGota(x,y,vx,vy){const g=gotas,i=g.i;g.i=(i+1)%g.n;g.px[i]=x;g.py[i]=y;g.vx[i]=vx;g.vy[i]=vy;g.vida[i]=1.5;}

/* inimigos */
function inimigo(tipo,x,y){
  const g=new T.Group();g.position.set(x,y,.05);roomScene.add(g);
  const e={tipo,x,y,g,hp:{trena:14,etiq:8,catraca:24,cartao:2,cone:6,junta:16,rolo:1e9}[tipo],r:{trena:.24,etiq:.22,catraca:.46,cartao:.2,cone:.27,junta:.3,rolo:.5}[tipo],cy:{trena:.19,catraca:.55,cone:.22,rolo:.5}[tipo]||0,st:'nasce',t:0,morre:0,fase:R()*6};
  const add=(geo,m,px,py,pz)=>{const me=new T.Mesh(geo,m);me.position.set(px||0,py||0,pz||0);me.castShadow=true;g.add(me);return me;};
  if(tipo==='trena'){
    const c=new T.CylinderGeometry(.19,.19,.12,10);c.rotateX(Math.PI/2);
    e.corpo=add(c,M.planta,0,.19,0);
    const b=new T.CylinderGeometry(.06,.06,.14,8);b.rotateX(Math.PI/2);add(b,M_LARANJA,0,.19,0);
    add(new T.BoxGeometry(.07,.05,.05),M_LARANJA,.2,.06,0);
    e.fita=new T.Mesh(new T.BoxGeometry(1,.025,.05),M_LARANJA);e.fita.visible=false;roomScene.add(e.fita);
  }else if(tipo==='etiq'){
    e.corpo=add(new T.BoxGeometry(.3,.16,.1),M.planta,0,0,0);
    add(new T.BoxGeometry(.08,.12,.07),M_LARANJA,-.06,-.12,0);
    add(new T.BoxGeometry(.1,.05,.06),M_LARANJA,.19,.0,0);
    e.asas=[-1,1].map(s=>{const a=add(new T.BoxGeometry(.26,.012,.16),M.planta,0,.09,s*.12);return a;});
    e.rec=1.2;
  }else if(tipo==='catraca'){
    /* poste atrás da pista e três braços que cruzam o caminho */
    add(new T.BoxGeometry(.2,1.0,.2),M.planta,0,.5,-.5);
    add(new T.BoxGeometry(.26,.08,.26),M.planta,0,1.04,-.5);
    e.luz=add(new T.BoxGeometry(.1,.1,.1),M_LARANJA,0,1.13,-.5);
    e.bra=new T.Group();e.bra.position.set(0,.78,-.38);g.add(e.bra);
    for(let k=0;k<3;k++){const b=new T.Mesh(new T.CylinderGeometry(.022,.022,.8,6),M_LARANJA);b.castShadow=true;
      const h=new T.Group();h.rotation.x=k*Math.PI*2/3+Math.PI/2;b.position.y=.4;h.add(b);e.bra.add(h);}
    e.st='fixa';
  }else if(tipo==='cartao'){
    add(new T.BoxGeometry(.3,.19,.02),M.planta,0,0,0);
    add(new T.BoxGeometry(.3,.04,.024),M_LARANJA,0,.06,0);
    e.st='vai';
  }else if(tipo==='cone'){
    add(new T.ConeGeometry(.16,.44,8),M_LARANJA,0,.26,0);
    add(new T.CylinderGeometry(.095,.115,.08,8),M.planta,0,.24,0);
    add(new T.BoxGeometry(.36,.04,.36),M_LARANJA,0,.02,0);
  }else if(tipo==='rolo'){
    const c=new T.CylinderGeometry(.5,.5,1.3,14);c.rotateX(Math.PI/2);e.corpo=add(c,M.planta,0,.5,-.1);
    const h=new T.CylinderGeometry(.16,.16,1.36,8);h.rotateX(Math.PI/2);add(h,M_LARANJA,0,.5,-.1);
  }else if(tipo==='junta'){
    add(new T.IcosahedronGeometry(.19,0),M_LARANJA,0,0,0);
    const a=new T.CylinderGeometry(.24,.24,.07,8);a.rotateZ(Math.PI/2);add(a,M.planta,.06,0,0);
  }
  FS.ini.push(e);return e;
}
function some(e){e.morre=.3;if(e.fita)e.fita.visible=false;}
function alvoTrena(e){
  const ch=FS.props.filter(p=>p.y0<.2);
  for(let k=0;k<12;k++){
    const a=ch[(R()*ch.length)|0],b=ch[(R()*ch.length)|0],d=Math.abs((a.x0+a.x1)-(b.x0+b.x1))/2;
    if(a!==b&&d>1.4&&d<5.5&&!(a.med&&b.med)){e.a=(a.x0+a.x1)/2;e.b=(b.x0+b.x1)/2;return;}
  }
  e.a=PJ.x;e.b=PJ.x+(R()<.5?-2.5:2.5);
}
function etiquetaVoadora(x,y){
  const g=new T.Mesh(new T.BoxGeometry(.14,.09,.012),M.planta);g.position.set(x,y,.1);roomScene.add(g);
  const f=new T.Mesh(new T.BoxGeometry(.012,.07,.012),M_LARANJA);f.position.y=.08;g.add(f);
  FS.tags.push({x,y,vy:0,g});
}
function atualizaInimigos(dt,t){
  const lim=(v)=>Math.max(FS.x0+.3,Math.min(FS.x1-.3,v));
  for(let k=FS.ini.length-1;k>=0;k--){
    const e=FS.ini[k];
    if(e.morre>0){e.morre-=dt;const s=Math.max(.01,e.morre/.3);e.g.scale.setScalar(s);e.g.rotation.z+=dt*14;
      if(e.morre<=0){roomScene.remove(e.g);if(e.fita)roomScene.remove(e.fita);FS.ini.splice(k,1);FS.mortos++;}continue;}
    if(e.hp<=0){some(e);continue;}
    e.t+=dt;
    if(e.tipo==='trena'){
      if(e.st==='nasce'){e.y=Math.max(0,e.y-dt*3);if(e.y<=0){e.st='irA';alvoTrena(e);}}
      else{
        const dest=lim(e.st==='irA'?e.a:e.b),d=dest-e.x,v=1.15;
        if(e.st==='prende'){if(e.t>.7){e.st='irB';e.ancora=e.x;e.fita.visible=true;}}
        else if(Math.abs(d)<.06){
          if(e.st==='irA'){e.st='prende';e.t=0;}
          else{ // fechou a fita: tudo entre as duas pontas é medido
            const a=Math.min(e.ancora,e.x),b=Math.max(e.ancora,e.x);
            FS.props.forEach(p=>{const c=(p.x0+p.x1)/2;if(c>=a-.05&&c<=b+.05)mede(p);});
            e.fita.visible=false;e.st='irA';alvoTrena(e);
          }
        }else{e.x+=Math.sign(d)*v*dt;e.corpo.rotation.z-=Math.sign(d)*v*dt/.19;}
        if(e.st==='irB'){const m=(e.ancora+e.x)/2,l=Math.abs(e.x-e.ancora);e.fita.scale.x=Math.max(.01,l);e.fita.position.set(m,.19,.05);}
      }
      if(Math.abs(e.x-PJ.x)<.36&&PJ.y<.45)etiquetaCorpo(Math.sign(PJ.x-e.x)||1);
    }else if(e.tipo==='etiq'){
      /* etiquetador: voa até um alvo e solta a etiqueta em cima dele */
      if(!e.alvo||e.alvo.med||e.t>9){
        const livres=FS.props.filter(p=>!p.med);
        e.alvo=(R()<.3||!livres.length)?null:livres[(R()*livres.length)|0];e.t=0;
      }
      const tx=e.alvo?(e.alvo.x0+e.alvo.x1)/2:PJ.x,ty=(e.alvo?e.alvo.y1:PJ.y+1.05)+.85+Math.sin(t*3+e.fase)*.12;
      const dx=tx-e.x,dy=ty-e.y,d=Math.hypot(dx,dy)||1,v=e.st==='nasce'?2.6:1.7;
      if(e.st==='nasce'&&e.t>.8)e.st='voa';
      e.x=lim(e.x+dx/d*Math.min(d,v*dt));e.y+=dy/d*Math.min(d,v*dt);
      e.g.rotation.y=dx<0?Math.PI:0;
      e.asas.forEach((a,i)=>a.rotation.x=(i?1:-1)*(.5+Math.sin(t*26+e.fase)*.6));
      e.rec-=dt;
      if(Math.abs(dx)<.22&&e.rec<=0&&e.st==='voa'){etiquetaVoadora(e.x,e.y-.15);e.rec=2.2;if(!e.alvo)e.t=99;}
    }else if(e.tipo==='catraca'){
      /* fechada: um braço atravessado na pista. aberta: gira livre */
      if(e.aberta)e.bra.rotation.x+=dt*10;
      else{const p=Math.PI*2/3,alvo=Math.round(e.bra.rotation.x/p)*p;e.bra.rotation.x+=(alvo-e.bra.rotation.x)*Math.min(1,dt*14);}
      e.luz.visible=!e.aberta;
    }else if(e.tipo==='cartao'){
      e.x-=4.2*dt;e.g.rotation.z=Math.sin(t*16+e.fase)*.25;
      if(Math.abs(e.x-PJ.x)<.28&&PJ.y<e.y+.12&&PJ.y+1.0>e.y){etiquetaCorpo(-1);e.hp=0;}
      if(e.x<FS.x0+.6)e.hp=0;
    }else if(e.tipo==='cone'){
      /* cone que anda: segue Naná pelo perfil do chão */
      const d=PJ.x-e.x;if(Math.abs(d)>.2)e.x+=Math.sign(d)*.95*dt;
      e.y=(FS.perf?FS.perf(e.x):0)+Math.abs(Math.sin(t*7+e.fase))*.06;e.g.rotation.z=Math.sin(t*7+e.fase)*.12;
      if(Math.abs(d)<.33&&Math.abs(PJ.y-e.y)<.7)etiquetaCorpo(Math.sign(d)||1);
    }else if(e.tipo==='rolo'){
      /* rolo compressor: desce a escada e mede o que achata */
      e.x-=2.4*dt;e.y=FS.perf?FS.perf(e.x):0;e.corpo.rotation.z+=2.4*dt/.5;
      FS.props.forEach(p=>{if(p.rolo&&!p.med&&e.x>p.x0&&e.x<p.x1)mede(p);});
      if(Math.abs(e.x-PJ.x)<.62&&PJ.y<e.y+.95&&PJ.y>e.y-.6)etiquetaCorpo(-1);
      if(e.x<1.0)e.hp=0;
    }else if(e.tipo==='junta'){
      e.g.scale.setScalar(1+Math.sin(t*6+e.fase)*.08);
    }
    e.g.position.set(e.x,e.y,.05);
  }
  /* etiquetas caindo */
  for(let k=FS.tags.length-1;k>=0;k--){
    const g=FS.tags[k];g.vy-=9*dt;g.y+=g.vy*dt;g.g.position.y=g.y;g.g.rotation.z=Math.sin(t*9+k)*.4;
    let fim=g.y<=.02;
    if(Math.abs(g.x-PJ.x)<.28&&g.y>PJ.y&&g.y<PJ.y+1.05){etiquetaCorpo(Math.sign(PJ.x-g.x)||1);fim=true;}
    else for(const p of FS.props)if(!p.med&&g.x>p.x0&&g.x<p.x1&&g.y<=p.y1+.02&&g.y>=p.y0-.1){mede(p);fim=true;break;}
    if(fim){roomScene.remove(g.g);FS.tags.splice(k,1);}
  }
}

/* ---------- laço da fase ---------- */
const _ray=new T.Raycaster(),_pl=new T.Plane(new T.Vector3(0,0,1),0),_pt=new T.Vector3();
function faseTick(tt,dt){
  if(!FS)return;
  flTick();
  const parado=!!fl||acabou||busy||pausa||FS.st==='fim';
  /* câmera lateral, de teatro de caixa */
  if(camera.fov!==30){camera.fov=30;camera.updateProjectionMatrix();}
  const dist=10.4,meio=Math.tan(15*Math.PI/180)*dist*camera.aspect;
  let a=FS.x0+meio-.9,b=FS.x1-meio+.9,cx=a>b?(FS.x0+FS.x1)/2:Math.max(a,Math.min(b,PJ.x));
  FS.cx+=(cx-FS.cx)*Math.min(1,dt*3.5);
  const cy=FS.alta?Math.max(2.3,Math.min(FS.H-2.6,PJ.y+1.3)):Math.max(FS.H/2-.35,Math.min(FS.H/2+.35,PJ.y+.9));FS.cy+=(cy-FS.cy)*Math.min(1,dt*2.5);
  camera.position.set(FS.cx,FS.cy+.25,dist);controls.target.set(FS.cx,FS.cy,0);

  if(!parado){
    /* mira */
    if(mouseN){_ray.setFromCamera(mouseN,camera);if(_ray.ray.intersectPlane(_pl,_pt)){PJ.ax=_pt.x-PJ.x;PJ.ay=_pt.y-(PJ.y+.74);}}
    const an=Math.hypot(PJ.ax,PJ.ay)||1,ux=PJ.ax/an,uy=PJ.ay/an;
    /* andar, pular, esquivar */
    const mv=(fk.has('KeyD')||fk.has('ArrowRight')?1:0)-(fk.has('KeyA')||fk.has('ArrowLeft')?1:0);
    PJ.dashCd-=dt;PJ.inv-=dt;PJ.drop-=dt;
    if((fk.has('ShiftLeft')||fk.has('ShiftRight'))&&PJ.dashCd<=0){PJ.dash=.17;PJ.dashCd=.75;PJ.inv=Math.max(PJ.inv,.32);PJ.dd=mv||PJ.dir;}
    if(PJ.dash>0){PJ.dash-=dt;PJ.vx=PJ.dd*8.5;}else PJ.vx+=(mv*3.3-PJ.vx)*Math.min(1,dt*(PJ.chao?16:7));
    if(pulo&&(PJ.chao||PJ.nada)){PJ.vy=PJ.nada?4.6:5.8;PJ.chao=false;}pulo=false;
    if(!FS.semDrop&&(fk.has('KeyS')||fk.has('ArrowDown')))PJ.drop=.22;
    PJ.vy-=15*dt;
    /* dentro d'água: boia, anda mais devagar e pode dar impulso */
    PJ.nada=FS.nivel!==undefined&&PJ.y+.62<FS.nivel;
    if(PJ.nada){PJ.vy+=27*dt;PJ.vy*=Math.max(0,1-3.2*dt);PJ.vx*=Math.max(0,1-2*dt);}
    PJ.x=Math.max(FS.x0+.25,Math.min(FS.x1-.25,PJ.x+PJ.vx*dt));
    let ny=PJ.y+PJ.vy*dt;PJ.chao=false;
    if(PJ.vy<=0)for(const p of FS.plat){
      if(PJ.x>p.x0-.08&&PJ.x<p.x1+.08&&PJ.y>=p.y-.001&&ny<=p.y&&!(PJ.drop>0&&p.y>0)){ny=p.y;PJ.vy=0;PJ.chao=true;PJ.sobre=p;break;}
    }
    if(ny+1.08>FS.H){ny=FS.H-1.08;PJ.vy=Math.min(0,PJ.vy);}
    PJ.y=ny;
    if(PJ.chao&&PJ.sobre&&PJ.sobre.vx)PJ.x=Math.max(FS.x0+.25,Math.min(FS.x1-.25,PJ.x+PJ.sobre.vx*dt));
    PJ.dir=mouseN?(ux>=0?1:-1):(mv||PJ.dir);
    /* mangueira */
    const atira=(tiro||fk.has('KeyF'))&&G.agua>0;
    if(atira){
      const vel=G.flags.bico?10:7.6;gotas.acc+=dt*34;
      const ox=PJ.x+ux*.4,oy=PJ.y+.74+uy*.4;
      while(gotas.acc>=1){gotas.acc-=1;novaGota(ox,oy,ux*vel+(R()-.5)*.7+PJ.vx*.3,uy*vel+(R()-.5)*.7);}
      soma('agua',-12*dt);
    }
    FS.atira=atira;
    atualizaInimigos(dt,tt);
    if(FS.tick)FS.tick(dt,tt);
  }
  /* gotas */
  const g=gotas;
  for(let i=0;i<g.n;i++){
    if(g.vida[i]>0){
      if(!parado){
        g.vida[i]-=dt;g.vy[i]-=12*dt;g.px[i]+=g.vx[i]*dt;g.py[i]+=g.vy[i]*dt;
        const x=g.px[i],y=g.py[i];
        if(y<0||x<FS.x0||x>FS.x1||y>FS.H)g.vida[i]=0;
        else{
          for(const e of FS.ini)if(e.morre<=0&&Math.hypot(e.x-x,(e.y+e.cy)-y)<e.r){if(!(e.tipo==='catraca'&&g.vx[i]>0))e.hp--;g.vida[i]=0;break;}
          if(g.vida[i]>0)for(const p of FS.props)if(p.med&&x>p.x0&&x<p.x1&&y>p.y0-.05&&y<p.y1+.05){if(++p.lav>=(G.flags.lavar?4:9))lava(p);g.vida[i]=0;break;}
        }
      }
    }
    if(g.vida[i]>0){_o.position.set(g.px[i],g.py[i],.12);const s=.6+g.vida[i]*.4;_o.scale.setScalar(s);}
    else{_o.position.set(0,-9,0);_o.scale.setScalar(.001);}
    _o.updateMatrix();gotasIM.setMatrixAt(i,_o.matrix);
  }
  gotasIM.instanceMatrix.needsUpdate=true;

  /* Naná em cena */
  const f=nana,alvoRy=PJ.dir>0?Math.PI/2:-Math.PI/2;let dr=alvoRy-PJ.ry;dr=Math.atan2(Math.sin(dr),Math.cos(dr));PJ.ry+=dr*Math.min(1,dt*14);
  f.root.position.set(PJ.x,PJ.y,PJ.z||0);f.root.rotation.y=PJ.ry;
  f.update(tt,PJ.chao?Math.min(1,Math.abs(PJ.vx)/2.6):.35);
  const el=Math.atan2(PJ.ay,Math.abs(PJ.ax));
  f.bracoE.sh.rotation.set(-(Math.PI/2+el),0,0);f.bracoE.el.rotation.x=0;
  f.head.rotation.set(-el*.5,0,0);
  f.root.visible=!(PJ.inv>0&&Math.floor(tt*14)%2===0);
  FS.figs.forEach(o=>o.update(tt,0));
  if(FS.anim)FS.anim(tt,dt);
  /* avisos */
  if(FS.recadoT>0){FS.recadoT-=dt;elAviso.textContent=FS.recado;elAviso.hidden=false;}
  else if(FS.dica&&!parado){elAviso.textContent=FS.dica;elAviso.hidden=false;}
  else elAviso.hidden=true;
  usouE=false;
}

function abreFase(i){
  clearRoom();
  const d=FASES[i];
  FS={i,x0:d.x0,x1:d.x1,H:d.H,inicio:d.inicio,props:[],plat:[{x0:d.x0,x1:d.x1,y:0}],ini:[],tags:[],figs:[],mortos:0,st:'intro',recadoT:0,cx:d.inicio,cy:d.H/2,feita:G.feitas.has(i)};
  d.monta(FS);
  if(d.tick)FS.tick=d.tick.bind(d);
  if(d.anim)FS.anim=d.anim.bind(d);
  FS.plat.sort((a,b)=>b.y-a.y);
  gotasIM=new T.InstancedMesh(new T.IcosahedronGeometry(.04,0),M_GOTA,NG);gotasIM.frustumCulled=false;roomScene.add(gotasIM);gotas.vida.fill(0);
  Object.assign(PJ,{x:d.inicio,y:d.inicioY||0,z:0,esc:false,nada:false,sobre:null,vx:0,vy:0,chao:!d.inicioY,dir:1,inv:0,dash:0,dashCd:0,drop:0,ax:1,ay:0,ry:Math.PI/2});
  porId('nana').fora=true;roomScene.add(nana.root);nana.bico.visible=true;
  fk.clear();tiro=false;pulo=false;
  active=roomScene;mode='fase';setLimits('free');controls.enabled=false;
  roomTitle.textContent=(i+1)+'. '+OPS[i].t;roomTitle.hidden=false;backB.hidden=false;
  $('rot').hidden=true;$('reset').hidden=true;listEl.hidden=true;elCtl.hidden=true;elHint.textContent=HINT_FASE;hud();
  faseTick(clock.getElapsedTime(),0);
  tween(1400,k=>{const e=ease(k);roomScene.fog.near=lerp(.05,18,e);roomScene.fog.far=lerp(.9,70,e);},()=>{
    busy=false;
    if(FS.feita)diz([['','Isso já foi resolvido hoje. O lugar está quieto.']],()=>{FS.st='livre';});
    else tutorial(i,()=>d.comeca(FS));
  });
}
function fechaFase(){
  ELENCO.forEach(a=>{if(a.fora){a.fora=false;scene.add(a.f.root);a.f.root.visible=true;}});
  nana.bico.visible=false;
  fl=null;elDlg.hidden=true;elOps.innerHTML='';elDica.hidden=false;elAviso.hidden=true;
  clearRoom();FS=null;gotasIM=null;
  elHint.textContent=HINT_CASA;resize();hud();
}
function resolve(i,linhas){
  G.feitas.add(i);FS.st='fim';FS.ini.forEach(some);
  FS.st='fala';diz(linhas,()=>{FS.st='fim';leave();});
}
/* bico da mangueira na mão livre de Naná (só aparece nas fases) */
(function(){
  const b=nana.bico=grp(nana.bracoE.hand,0,-.06,0);
  part(new T.CylinderGeometry(.014,.017,.11,6),matFig(tecido('#2f3a2f',{barra:false})),b);
  part(new T.CylinderGeometry(.009,.014,.045,6),matFig(tecido('#b08a52',{barra:false})),b,0,-.075,0);
  b.visible=false;
})();

/* ---------- entradas ---------- */
window.addEventListener('keydown',e=>{
  if(mode!=='fase'||busy||pausa)return;
  if(e.code==='Escape'||e.code==='KeyM')return;
  e.preventDefault();
  if(fl){
    if(e.code==='Space'||e.code==='Enter'||e.code==='KeyE')flAvanca();
    else if(/^Digit[1-9]$/.test(e.code)||/^Numpad[1-9]$/.test(e.code))flEscolhe(+e.code.slice(-1)-1);
    return;
  }
  if(!e.repeat&&(e.code==='Space'||e.code==='KeyW'||e.code==='ArrowUp'))pulo=true;
  if(!e.repeat&&e.code==='KeyE')usouE=true;
  fk.add(e.code);
});
window.addEventListener('keyup',e=>fk.delete(e.code));
window.addEventListener('blur',()=>{fk.clear();tiro=false;});
canvas.addEventListener('pointermove',ev=>{
  if(mode!=='fase')return;
  const r=canvas.getBoundingClientRect();
  (mouseN=mouseN||new T.Vector2()).set(((ev.clientX-r.left)/r.width)*2-1,-((ev.clientY-r.top)/r.height)*2+1);
});
canvas.addEventListener('pointerdown',ev=>{if(mode==='fase'&&!pausa&&ev.button===0){tiro=true;canvas.dispatchEvent(new PointerEvent('pointermove',ev));}});
window.addEventListener('pointerup',()=>{tiro=false;});
canvas.addEventListener('contextmenu',e=>{if(mode==='fase')e.preventDefault();});


/* ---------- registro das fases e texturas comuns ---------- */
const FASES={};
function dialTex(){
  return texto(128,128,(x)=>{
    x.fillStyle='#3a3632';x.fillRect(0,0,128,128);
    x.fillStyle='#e6dfce';x.beginPath();x.arc(64,64,52,0,7);x.fill();
    x.strokeStyle='#2a2623';x.lineWidth=3;for(let i=0;i<12;i++){const a=i/12*6.283;x.beginPath();x.moveTo(64+Math.cos(a)*40,64+Math.sin(a)*40);x.lineTo(64+Math.cos(a)*48,64+Math.sin(a)*48);x.stroke();}
    x.strokeStyle='#8c3b2d';x.lineWidth=5;x.beginPath();x.moveTo(64,64);x.lineTo(92,40);x.stroke();
    x.fillStyle='#2a2623';x.fillRect(42,78,44,14);x.fillStyle='#e6dfce';for(let i=0;i<5;i++)x.fillRect(45+i*8,81,5,8);
  });
}

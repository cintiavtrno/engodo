/* Engodo — criarFigura, os nove personagens e a Fila */
/* ---------- personagens ---------- */
const rad=d=>d*Math.PI/180;
function pele(base){
  const [c,x]=mk(128,128);
  x.fillStyle=base;x.fillRect(0,0,128,128);
  mottle(x,128,128,5);
  speckle(x,128,128,260,['#000','#fff','#5a3020'],2,.03,.12);
  return c;
}
/* pano: base desbotada, estampa pintada, manchas, barra, escorrido, grão */
function tecido(base,o){
  o=o||{};
  const [c,x]=mk(256,256);
  x.fillStyle=base;x.fillRect(0,0,256,256);
  if(o.listraV){x.fillStyle=o.listraV;for(let i=4;i<256;i+=14)x.fillRect(i,0,2,256);}
  if(o.trama){
    for(let i=0;i<256;i+=3){x.fillStyle='rgba(255,255,255,'+(.02+R()*.05).toFixed(3)+')';x.fillRect(0,i,256,1);}
    for(let i=0;i<40;i++){x.fillStyle='rgba(190,200,215,'+(.04+R()*.08).toFixed(3)+')';x.fillRect(R()*256,R()*256,2+R()*5,30+R()*90);}
  }
  mottle(x,256,256,7);
  if(o.flor){ // chita: flores grandes desbotadas
    for(let i=0;i<30;i++){
      const cx=R()*256,cy=R()*256,r=6+R()*5,col=o.flor[(R()*o.flor.length)|0];
      x.globalAlpha=.75+R()*.2;x.fillStyle=col;
      for(let k=0;k<5;k++){const a=k/5*Math.PI*2+i;x.beginPath();x.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,r*.72,0,7);x.fill();}
      x.fillStyle='rgba(60,35,25,.7)';x.beginPath();x.arc(cx,cy,r*.4,0,7);x.fill();
      x.fillStyle='rgba(95,115,70,.8)';x.beginPath();x.ellipse(cx+r*2,cy+r*1.4,r*.9,r*.35,.7+i,0,7);x.fill();
    }
    x.globalAlpha=1;
  }
  if(o.peito){ // estampa inventada e ilegível no centro da frente
    x.fillStyle='rgba(235,225,200,.7)';x.fillRect(227,58,26,40);
    x.strokeStyle='rgba(40,25,20,.75)';x.lineWidth=2.5;x.beginPath();
    x.moveTo(231,70);x.bezierCurveTo(238,58,242,84,249,68);x.moveTo(231,86);x.lineTo(249,86);x.moveTo(233,92);x.lineTo(244,92);x.stroke();
    for(let i=0;i<30;i++){x.fillStyle=base;x.globalAlpha=.6;x.fillRect(227+R()*26,58+R()*40,1+R()*4,1+R()*3);}
    x.globalAlpha=1;
  }
  if(o.aberta){ // camisa aberta: a camiseta de baixo aparece no centro da frente
    x.fillStyle=o.aberta;x.fillRect(227,0,26,256);
    x.fillStyle='rgba(20,12,8,.4)';x.fillRect(225,0,3,256);x.fillRect(252,0,3,256);
    x.fillStyle='rgba(20,12,8,.22)';x.fillRect(227,0,26,9);
  }
  if(o.listraLado){x.fillStyle=o.listraLado;x.fillRect(60,0,7,256);x.fillRect(188,0,7,256);}
  if(o.faixa){
    x.fillStyle=o.faixa;x.fillRect(0,92,256,24);
    x.fillStyle='rgba(255,255,240,.28)';x.fillRect(0,101,256,6);
    for(let i=0;i<46;i++){x.fillStyle=base;x.globalAlpha=.35+R()*.4;x.fillRect(R()*256,92+R()*24,3+R()*10,1+R()*4);}
    x.globalAlpha=1;
  }
  if(o.frente){ // abotoamento no centro da frente (u = .9375)
    x.fillStyle='rgba(20,12,8,.32)';x.fillRect(238,0,3,256);
    x.fillStyle='rgba(235,228,214,.8)';for(let y=34;y<240;y+=46){x.beginPath();x.arc(244,y,2.6,0,7);x.fill();}
  }
  if(o.bolso){x.strokeStyle='rgba(20,12,8,.4)';x.lineWidth=2;x.strokeRect(196,52,28,30);}
  if(o.gravata){
    x.fillStyle=o.gravata;
    x.beginPath();x.moveTo(232,8);x.lineTo(248,8);x.lineTo(245,28);x.lineTo(253,168);x.lineTo(240,188);x.lineTo(227,168);x.lineTo(235,28);x.closePath();x.fill();
    x.strokeStyle='rgba(15,8,6,.45)';x.lineWidth=1.5;x.stroke();
    x.fillStyle='rgba(255,230,210,.14)';for(let y=40;y<170;y+=16)x.fillRect(229,y,22,3);
  }
  if(o.top){ // top curto: abaixo da barra aparece a pele
    x.fillStyle=o.top;x.fillRect(0,150,256,106);
    x.fillStyle='rgba(20,12,8,.35)';x.fillRect(0,144,256,7);
    for(let i=0;i<5;i++){const cx=R()*256,cy=160+R()*90,r=30+R()*40,g=x.createRadialGradient(cx,cy,0,cx,cy,r);
      g.addColorStop(0,'rgba(40,25,20,.12)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(cx-r,cy-r,r*2,r*2);}
  }
  if(o.palha){x.strokeStyle='rgba(90,65,30,.35)';x.lineWidth=1.5;for(let i=-256;i<256;i+=9){x.beginPath();x.moveTo(i,0);x.lineTo(i+256,256);x.moveTo(i+256,0);x.lineTo(i,256);x.stroke();}}
  if(o.gola){x.fillStyle='rgba(20,12,8,.34)';x.fillRect(0,0,256,10);}
  if(o.barra!==false){x.fillStyle='rgba(20,12,8,.3)';x.fillRect(0,244,256,12);}
  drips(x,256,256,5,'40,30,25');
  speckle(x,256,256,800,['#000','#fff','#5a4030'],2);
  return c;
}
function matFig(c){const m=matOf(c,.95);m.flatShading=true;return m;}
function part(g,m,parent,x,y,z){
  const me=new T.Mesh(g,m);me.castShadow=true;me.receiveShadow=true;
  me.position.set(x||0,y||0,z||0);parent.add(me);return me;
}
function grp(parent,x,y,z){const g=new T.Group();g.position.set(x||0,y||0,z||0);parent.add(g);return g;}
/* membro afunilado de 6 faces, com o pivô na junta de cima */
function membroGeo(rTopo,rBase,h){
  const g=new T.CylinderGeometry(rTopo,rBase,h,6,1,false,Math.PI/6);
  g.translate(0,-h/2,0);return g;
}
function ico(r,d){return new T.IcosahedronGeometry(r,d||0);}
function cabecaGeo(r){
  const g=ico(r,1),p=g.attributes.position;
  for(let i=0;i<p.count;i++){
    const y=p.getY(i);
    if(y<0){const f=1+(y/r)*.32;p.setX(i,p.getX(i)*f);p.setZ(i,p.getZ(i)*f);}
  }
  g.scale(.9,1.12,.97);return g;
}
function peGeo(h){
  const g=new T.BoxGeometry(.07,h,.15),p=g.attributes.position;
  for(let i=0;i<p.count;i++)if(p.getZ(i)>0&&p.getY(i)>0)p.setY(i,p.getY(i)*.25-h*.12);
  g.translate(0,-h/2,.032);return g;
}

/* criarFigura(spec): monta qualquer personagem a partir de uma configuração.
   Altura de referência do boneco: 1,04. A figura olha para +z. E = lado +x, D = lado -x. */
function criarFigura(s){
  const B=Object.assign({ombro:.12,cintura:.1,quadril:.1,prof:.62,perna:.048,braco:.032,passo:.05,pescoco:.03},s.corpo||{});
  const LT=.22,LS=.21,FOOT=.045,TH=.27,UA=.17,FA=.16,HR=.08,hipY=LT+LS+FOOT;
  const root=new T.Group(),inner=grp(root);
  inner.scale.setScalar(s.altura/1.04);
  const mP=matFig(pele(s.pele)),mT=matFig(s.roupa.tronco),mM=matFig(s.roupa.manga),
        mC=s.pernaPele?mP:matFig(s.roupa.calca),mS=matFig(s.roupa.sapato),
        mH=matFig(s.cabelo.tex||tecido(s.cabelo.cor,{barra:false})),mShin=(s.bermuda||s.pernaPele||s.short||s.dobrada)?mP:mC;
  const f={root,inner,B,TH,HR,mats:{pele:mP,tronco:mT,manga:mM,calca:mC,sapato:mS,cabelo:mH}};

  /* quadril */
  const hips=f.hips=grp(inner,0,hipY,0);
  const pg=new T.CylinderGeometry(B.quadril,B.quadril*.9,.11,8,1,false,Math.PI/8);pg.scale(1,1,B.prof);
  part(pg,s.saia?mT:mC,hips,0,.03,0);
  if(s.saia){ // saia do vestido: cone aberto preso ao quadril
    const h=s.saia.h,kg=new T.CylinderGeometry(B.quadril*1.02,B.quadril*s.saia.abre,h,8,1,false,Math.PI/8);
    kg.translate(0,-h/2+.05,0);kg.scale(1,1,B.prof);
    part(kg,matFig(s.roupa.saia),hips);
  }

  /* pernas */
  function perna(side){
    const hip=grp(hips,side*B.passo,0,0);
    part(membroGeo(B.perna,B.perna*.82,LT),s.short?mP:mC,hip);
    if(s.short)part(new T.CylinderGeometry(B.perna*1.1,B.perna*1.1,.085,6,1,false,Math.PI/6),mC,hip,0,-.045,0);
    const knee=grp(hip,0,-LT,0);
    part(ico(B.perna*.84),(s.bermuda||s.dobrada)?mC:mShin,knee);
    if(s.dobrada){ // calça dobrada na canela
      part(new T.CylinderGeometry(B.perna*.86,B.perna*.8,.1,6,1,false,Math.PI/6),mC,knee,0,-.05,0);
      part(new T.CylinderGeometry(B.perna*.92,B.perna*.92,.03,6,1,false,Math.PI/6),mC,knee,0,-.1,0);
    }
    part(membroGeo(B.perna*.8,B.perna*.6,LS),mShin,knee);
    if(s.bermuda)part(new T.CylinderGeometry(B.perna*.98,B.perna*1.02,.05,6,1,false,Math.PI/6),mC,knee,0,-.02,0);
    const ankle=grp(knee,0,-LS,0);
    if(s.sandalia){
      part(peGeo(FOOT*.8),mP,ankle,0,-.004,0);
      part(new T.BoxGeometry(.078,.012,.16),mS,ankle,0,-FOOT+.006,.032);
      part(new T.BoxGeometry(.076,.014,.02),mS,ankle,0,-FOOT*.42,.055);
    }else if(s.descalco)part(peGeo(FOOT*.85),mP,ankle);
    else part(peGeo(FOOT),mS,ankle);
    if(s.bota)part(new T.CylinderGeometry(B.perna*.74,B.perna*.68,.1,6,1,false,Math.PI/6),mS,knee,0,-LS+.05,0);
    return {hip,knee,ankle};
  }
  f.pernaE=perna(1);f.pernaD=perna(-1);

  /* tronco */
  const torso=f.torso=grp(hips,0,.06,0);
  const tg=new T.CylinderGeometry(B.ombro,B.cintura,TH,8,1,false,Math.PI/8);tg.translate(0,TH/2,0);
  if(B.barriga){const p=tg.attributes.position;for(let i=0;i<p.count;i++)if(p.getZ(i)>0&&p.getY(i)<TH*.5)p.setZ(i,p.getZ(i)*(1+B.barriga));}
  tg.scale(1,1,B.prof);
  part(tg,mT,torso);
  const sg=new T.CylinderGeometry(.045,B.ombro,.04,8,1,false,Math.PI/8);sg.translate(0,TH+.02,0);sg.scale(1,1,B.prof);
  part(sg,mM,torso);
  part(new T.CylinderGeometry(.04,.05,.024,8,1,false,Math.PI/8),mM,torso,0,TH+.045,0);  // gola
  part(new T.CylinderGeometry(B.pescoco,B.pescoco*1.12,.07,6),mP,torso,0,TH+.06,0);

  /* cabeça sem rosto: a identidade vem do cabelo, da roupa e do objeto */
  const head=f.head=grp(torso,0,TH+.05,0);
  const hc=HR*1.12+.012;
  part(cabecaGeo(HR),mP,head,0,hc,0);
  if(s.cabelo.tipo==='coque'){
    const cg=ico(HR*1.07,1);cg.scale(.97,.9,1.02);part(cg,mH,head,0,hc+.02,-.022);
    part(ico(.04,1),mH,head,0,hc+.088,-.05);
  }else if(s.cabelo.tipo==='rente'){
    const cg=ico(HR*1.05,1);cg.scale(.97,.86,1);part(cg,mH,head,0,hc+.022,-.012);
  }else if(s.cabelo.tipo==='trancas'){
    const cg=ico(HR*1.06,1);cg.scale(.98,.9,1.02);part(cg,mH,head,0,hc+.02,-.016);
    const conta=matFig(tecido('#d9cdb0',{barra:false}));
    for(let i=0;i<11;i++){
      const a=rad(72+i*21.6),len=.2+R()*.07,rx=Math.sin(a)*HR*.9,rz=Math.cos(a)*HR*.93;
      const t=part(membroGeo(.0085,.006,len),mH,head,rx,hc+.03,rz);
      t.rotation.z=-Math.sin(a)*.07;t.rotation.x=Math.cos(a)*.07;
      if(i%2===0)part(ico(.009),conta,t,0,-len,0);
    }
  }else if(s.cabelo.tipo==='palha'){
    const gr=matFig(tecido('#b9b5ab',{barra:false}));
    const fg=ico(HR*1.0,1);fg.scale(1,.7,1);part(fg,gr,head,0,hc-.002,-.03);
    const ab=part(new T.CylinderGeometry(.15,.158,.008,10),mH,head,0,hc+.05,0);ab.rotation.x=rad(-5);
    const co=part(new T.CylinderGeometry(.066,.086,.072,8),mH,head,0,hc+.088,-.003);co.rotation.x=rad(-5);
    const fi=part(new T.CylinderGeometry(.088,.089,.014,8),matFig(tecido('#4a3324',{barra:false})),head,0,hc+.062,-.001);fi.rotation.x=rad(-5);
  }else if(s.cabelo.tipo==='turbante'){
    const cg=ico(HR*1.12,1);cg.scale(1,.95,1.05);part(cg,mH,head,0,hc+.03,-.016);
    const ng=ico(.046,1);ng.scale(1.25,.8,1);part(ng,mH,head,0,hc+.1,.018);
    const vg=ico(.03);part(vg,mH,head,.03,hc+.125,-.005);
  }else if(s.cabelo.tipo==='bone'){
    const gr=matFig(tecido('#8d8880',{barra:false}));
    const fg=ico(HR*1.03,1);fg.scale(1,.7,1);part(fg,gr,head,0,hc-.005,-.022);
    const cg=ico(HR*1.08,1);cg.scale(1,.7,1.04);part(cg,mH,head,0,hc+.042,-.004);
    const ab=part(new T.BoxGeometry(.105,.01,.085),mH,head,0,hc+.03,HR+.028);ab.rotation.x=rad(10);
  }else if(s.cabelo.tipo==='lenco'){
    const cg=ico(HR*1.1,1);cg.scale(1,.9,1.05);part(cg,mH,head,0,hc+.024,-.02);
    part(ico(.022),mH,head,0,hc-.035,-HR*1.05);
    [-1,1].forEach(sd=>{const r=part(new T.BoxGeometry(.022,.065,.008),mH,head,sd*.014,hc-.07,-HR*1.06);r.rotation.z=sd*rad(14);r.rotation.x=rad(12);});
  }else if(s.cabelo.tipo==='curto'){
    const cg=ico(HR*1.04,1);cg.scale(.98,.78,1);part(cg,mH,head,0,hc+.03,-.03);
  }

  /* braços */
  function braco(side){
    const sh=grp(torso,side*(B.ombro+.012),TH-.012,0);
    part(ico(B.braco*1.06),mM,sh);
    part(membroGeo(B.braco,B.braco*.86,UA),mM,sh);
    const el=grp(sh,0,-UA,0);
    const mA=s.mangaLonga?mM:mP;
    part(ico(B.braco*.86),mA,el);
    part(membroGeo(B.braco*.84,B.braco*.66,FA),mA,el);
    const hand=grp(el,0,-FA,0);
    part(new T.BoxGeometry(.04,.06,.03),mP,hand,0,-.026,0);
    return {sh,el,hand};
  }
  f.bracoE=braco(1);f.bracoD=braco(-1);

  if(s.pose.arco){ // pernas arqueadas
    [[f.pernaE,1],[f.pernaD,-1]].forEach(([L,sd])=>{L.hip.rotation.z=sd*rad(s.pose.arco);L.knee.rotation.z=-sd*rad(s.pose.arco*1.7);});
  }
  if(s.acessorios)s.acessorios(f);

  const P=s.pose,A=s.andar,fase=s.fase||0;
  f.update=function(t,w){
    const ph=t*A.vel,sn=Math.sin(ph),cs=Math.cos(ph),sw=rad(A.amp)*w,kn=rad(A.joelho)*w,u=1-w;
    /* pernas: E avança quando sn>0, dobra o joelho só na passada de ida */
    const leg=(L,base,a,k)=>{
      L.hip.rotation.x=rad(base[0])*u+a;
      L.knee.rotation.x=rad(base[1])*u+k;
      L.ankle.rotation.x=-(L.hip.rotation.x+L.knee.rotation.x)*.85;
    };
    leg(f.pernaE,P.pernaE,-sw*sn,kn*Math.max(0,cs));
    leg(f.pernaD,P.pernaD, sw*sn,kn*Math.max(0,-cs));
    hips.position.y=hipY-(LT+LS)*(1-Math.cos(sw*sn));           // pé sempre no chão
    hips.rotation.z=rad(P.quadrilZ)*u+rad(1.5)*w*sn;
    hips.rotation.y=rad(4)*w*sn;
    torso.rotation.z=rad(P.troncoZ)*u-rad(1.5)*w*sn+Math.sin(t*.7+fase)*.006;
    torso.rotation.x=rad(P.troncoX)+rad(A.inclina||0)*w;
    torso.rotation.y=-rad(6)*w*sn;
    torso.scale.y=1+.012*Math.sin(t*1.5+fase);                  // respiração
    head.rotation.x=rad(P.cabecaX);head.rotation.y=rad(P.cabecaY);head.rotation.z=-torso.rotation.z*.6;
    const arm=(Ar,base,side,livre)=>{
      const g=livre?w:0;
      Ar.sh.rotation.x=rad(base[0])*(1-g)+side*sw*.75*sn*g;
      Ar.sh.rotation.z=side*rad(base[1]);Ar.sh.rotation.y=-side*rad(base[3]||0);   // base[3]: braço fecha para dentro
      Ar.el.rotation.x=rad(base[2])*(1-g)-rad(16)*g-(livre?Math.max(0,side*sn)*rad(14)*g:0);
    };
    arm(f.bracoE,P.bracoE, 1,A.bracos[0]);
    arm(f.bracoD,P.bracoD,-1,A.bracos[1]);
    if(s.anim)s.anim(f,t,w);
  };
  return f;
}

/* ---------- Naná ---------- */
const NANA={
  nome:'Naná',altura:1.02,pele:'#6b4631',
  corpo:{ombro:.114,cintura:.104,quadril:.114,prof:.66,perna:.055,braco:.033,passo:.056},
  roupa:{
    tronco:tecido('#7f8674',{gola:true,faixa:'#c9c690',frente:true,bolso:true}),
    manga:tecido('#7f8674',{}),
    calca:tecido('#434b57',{trama:true,barra:false}),
    sapato:tecido('#2e2a27',{barra:false})
  },
  bota:true,
  cabelo:{tipo:'coque',cor:'#1f1815'},
  pose:{quadrilZ:3.5,troncoZ:-4,troncoX:3,cabecaX:16,cabecaY:-12,
        bracoE:[5,7,-10],bracoD:[-28,5,-80],pernaE:[1,0],pernaD:[-10,17]},
  andar:{vel:6.2,amp:24,joelho:44,inclina:3,bracos:[true,false]},
  fase:0,
  acessorios(f){
    const B=f.B,zc=B.ombro*B.prof;
    /* mochila */
    const mMo=matFig(tecido('#55543f',{})),mMo2=matFig(tecido('#3f3e30',{barra:false}));
    part(new T.BoxGeometry(.165,.2,.075),mMo,f.torso,0,.15,-(zc*.92+.036));
    part(new T.BoxGeometry(.172,.04,.085),mMo2,f.torso,0,.238,-(zc*.92+.036));
    part(new T.BoxGeometry(.09,.07,.02),mMo2,f.torso,0,.1,-(zc*.92+.08));
    [-1,1].forEach(sd=>{
      const a=part(new T.BoxGeometry(.022,.25,.012),mMo2,f.torso,sd*.066,.16,zc*.93+.004);a.rotation.x=rad(-2.5);
      const b=part(new T.BoxGeometry(.022,.012,zc*1.9),mMo2,f.torso,sd*.066,f.TH+.022,0);
    });
    /* coletor de leitura na mão direita, tela virada para cima */
    const col=grp(f.bracoD.hand,0,-.05,.019);
    part(new T.BoxGeometry(.052,.105,.02),matFig(tecido('#2a2c2e',{barra:false})),col);
    const [c,x]=mk(64,96);
    x.fillStyle='#aebb9c';x.fillRect(0,0,64,96);
    x.fillStyle='rgba(30,40,28,.75)';for(let i=0;i<5;i++)x.fillRect(8,12+i*15,18+((R()*30)|0),6);
    speckle(x,64,96,60,['#000','#fff'],2);
    const st=new T.CanvasTexture(c);st.encoding=T.sRGBEncoding;
    const tela=new T.Mesh(new T.PlaneGeometry(.04,.058),new T.MeshStandardMaterial({map:st,emissive:0x8fa07c,emissiveMap:st,emissiveIntensity:.35,roughness:.5}));
    tela.position.set(0,.016,.0105);col.add(tela);
    part(new T.BoxGeometry(.04,.02,.004),matFig(tecido('#6f6a5e',{barra:false})),col,0,-.034,.011);
  },
  anim(f,t,w){
    /* de vez em quando levanta os olhos do coletor */
    const g=Math.pow(Math.max(0,Math.sin(t*.42-.6)),8);
    f.head.rotation.x+=rad(-17)*g;f.head.rotation.y+=rad(26)*g;
  }
};

/* ---------- o Agente ---------- */
const AGENTE={
  nome:'O Agente',altura:1.08,pele:'#a47c5c',
  corpo:{ombro:.114,cintura:.098,quadril:.098,prof:.6,perna:.044,braco:.029,passo:.043,pescoco:.027},
  roupa:{
    tronco:tecido('#d6cdb8',{listraV:'rgba(120,110,95,.3)',gola:true,gravata:'#5d2b27',barra:false}),
    manga:tecido('#d6cdb8',{listraV:'rgba(120,110,95,.3)'}),
    calca:tecido('#8e7d5c',{barra:false}),
    sapato:tecido('#2b2420',{barra:false})
  },
  cabelo:{tipo:'curto',cor:'#5d564d'},
  pose:{quadrilZ:0,troncoZ:.8,troncoX:-1.5,cabecaX:-4,cabecaY:6,
        bracoE:[2,13,-86],bracoD:[-15,4,-70],pernaE:[0,0],pernaD:[0,0]},
  andar:{vel:3.4,amp:12,joelho:20,inclina:0,bracos:[false,false]},
  fase:1.7,
  acessorios(f){
    const B=f.B,zc=B.ombro*B.prof;
    const couro=matFig(tecido('#2b2420',{barra:false}));
    /* cinto, crachá e pasta debaixo do braço esquerdo */
    const bg=new T.CylinderGeometry(B.quadril*1.05,B.quadril*1.05,.022,8,1,false,Math.PI/8);bg.scale(1,1,B.prof);
    part(bg,couro,f.hips,0,.075,0);
    part(new T.BoxGeometry(.02,.026,.01),matFig(tecido('#9a8d6a',{barra:false})),f.hips,0,.075,B.quadril*B.prof*.97);
    const [c,x]=mk(64,96);
    x.fillStyle='#e6dfce';x.fillRect(0,0,64,96);
    x.fillStyle='#8c8674';x.fillRect(12,14,40,38);
    x.fillStyle='rgba(40,35,30,.6)';x.fillRect(12,62,40,6);x.fillRect(12,74,26,5);
    speckle(x,64,96,80,['#000','#8a7a60'],2);
    const ct=new T.CanvasTexture(c);ct.encoding=T.sRGBEncoding;
    const cr=new T.Mesh(new T.PlaneGeometry(.034,.05),new T.MeshStandardMaterial({map:ct,roughness:.8}));
    cr.position.set(.05,.165,zc*.9+.006);cr.rotation.z=rad(-4);cr.castShadow=true;f.torso.add(cr);
    part(new T.BoxGeometry(.012,.014,.008),couro,f.torso,.05,.195,zc*.9+.004);
    const pasta=part(new T.BoxGeometry(.032,.2,.16),matFig(tecido('#5a3d28',{})),f.torso,B.ombro*.9+.022,.115,.03);
    pasta.rotation.x=rad(-8);pasta.rotation.z=rad(3);
    /* vara de pescar na mão direita */
    const L=1.25,rodG=f.rodG=grp(f.bracoD.hand,0,-.03,0);
    const rg=new T.CylinderGeometry(.0035,.008,L,6);rg.translate(0,L/2-.1,0);
    part(rg,matFig(tecido('#6a4f33',{barra:false})),rodG);
    part(new T.CylinderGeometry(.011,.011,.12,6),couro,rodG,0,-.03,0);
    f.tip=grp(rodG,0,L-.1,0);
    /* a cenoura: único laranja vivo e emissivo da cena */
    const pend=f.pend=grp(f.inner);
    const lg=new T.CylinderGeometry(.0022,.0022,.26,4);lg.translate(0,-.13,0);
    part(lg,couro,pend);
    const [cc,cx]=mk(64,128);
    cx.fillStyle='#f07a1c';cx.fillRect(0,0,64,128);
    for(let y=6;y<128;y+=9+R()*8){cx.fillStyle='rgba(120,45,5,'+(.25+R()*.3).toFixed(2)+')';cx.fillRect(R()*30,y,14+R()*30,1.5);}
    speckle(cx,64,128,120,['#fff','#7a2c05'],2,.05,.2);
    const cgeo=new T.ConeGeometry(.034,.16,7);cgeo.rotateX(Math.PI);cgeo.translate(0,-.08,0);
    const ctex=new T.CanvasTexture(cc);ctex.encoding=T.sRGBEncoding;
    const cen=new T.Mesh(cgeo,new T.MeshStandardMaterial({map:ctex,emissive:0xd9560a,emissiveIntensity:.55,roughness:.7,flatShading:true}));
    cen.castShadow=true;cen.position.y=-.262;pend.add(cen);
    const folha=matFig(tecido('#6c8149',{barra:false}));
    [[-.012,0,18],[.012,.006,-16],[0,-.01,4],[.004,.012,-30]].forEach(([fx,fz,a])=>{
      const fo=part(new T.ConeGeometry(.011,.075,5),folha,pend,fx,-.235,fz);fo.rotation.z=rad(a);fo.rotation.x=rad(fz*900);
    });
    const fita=matFig(tecido('#e7dcc3',{barra:false}));
    [-1,1].forEach(sd=>{const la=part(new T.BoxGeometry(.05,.024,.006),fita,pend,sd*.022,-.262,.03);la.rotation.z=sd*rad(24);});
    part(new T.BoxGeometry(.014,.016,.01),fita,pend,0,-.264,.031);
    [-1,1].forEach(sd=>{const pt=part(new T.BoxGeometry(.012,.05,.004),fita,pend,sd*.009,-.295,.034);pt.rotation.z=sd*rad(-10);});
  },
  anim(f,t,w){
    f.head.rotation.x+=Math.sin(t*.8)*rad(1.4);
    /* a vara fica sempre no mesmo ângulo, qualquer que seja o braço */
    f.rodG.rotation.x=rad(56)-(f.bracoD.sh.rotation.x+f.bracoD.el.rotation.x+f.torso.rotation.x);
    f.root.updateMatrixWorld(true);
    f.tip.getWorldPosition(f.pend.position);f.inner.worldToLocal(f.pend.position);
    f.pend.rotation.z=Math.sin(t*1.9)*.11+Math.sin(t*A_W.vel)*.05*w;
    f.pend.rotation.x=Math.sin(t*1.3+1)*.07;
  }
};
const A_W=AGENTE.andar;


/* ---------- Dona Marlene ---------- */
const CHITA=['#e6d6b2','#cf9d58','#e9c9b4'];
const MARLENE={
  nome:'Dona Marlene',altura:.96,pele:'#5a3a29',
  corpo:{ombro:.128,cintura:.136,quadril:.142,prof:.8,perna:.05,braco:.041,passo:.066,pescoco:.034,barriga:.22},
  roupa:{
    tronco:tecido('#96564f',{flor:CHITA,gola:true,barra:false}),
    manga:tecido('#96564f',{flor:CHITA}),
    saia:tecido('#96564f',{flor:CHITA}),
    calca:null,
    sapato:tecido('#4a3324',{barra:false})
  },
  saia:{h:.33,abre:1.3},pernaPele:true,sandalia:true,
  cabelo:{tipo:'lenco',tex:tecido('#d8cfba',{listraV:'rgba(140,62,45,.55)',barra:false})},
  pose:{quadrilZ:1.5,troncoZ:0,troncoX:8,cabecaX:-6,cabecaY:-8,
        bracoE:[3,10,-8],bracoD:[3,10,-8],pernaE:[0,0],pernaD:[0,2]},
  andar:{vel:4.4,amp:13,joelho:20,inclina:3,bracos:[false,false]},
  fase:.6,
  acessorios(f){
    /* balde com água, pendurado pela alça */
    const b=f.balde=grp(f.inner);
    const plast=matFig(tecido('#5b86ae',{barra:false}));plast.side=T.DoubleSide;
    const ag=new T.TorusGeometry(.066,.0035,4,10,Math.PI);
    const alca=part(ag,matFig(tecido('#3a3632',{barra:false})),b,0,-.085,0);
    const bg=new T.CylinderGeometry(.078,.058,.125,10,1,true);
    part(bg,plast,b,0,-.148,0);
    part(new T.CylinderGeometry(.058,.058,.008,10),plast,b,0,-.207,0);
    part(new T.CylinderGeometry(.081,.081,.01,10,1,true),plast,b,0,-.087,0);
    const ag2=new T.Mesh(new T.CylinderGeometry(.072,.072,.004,10),new T.MeshStandardMaterial({color:0x7fa9cc,roughness:.25,flatShading:true}));
    ag2.position.y=-.108;b.add(ag2);
    f.va=new T.Vector3();f.vb=new T.Vector3();
  },
  anim(f,t,w){
    /* a cada oito segundos troca o balde de mão */
    const TT=8,n=Math.floor(t/TT),x=Math.max(0,(t-n*TT-(TT-2.4))/2.4);
    const g=Math.sin(Math.PI*x),k=Math.min(1,Math.max(0,(x-.35)/.3)),sm=k*k*(3-2*k);
    const de=n%2===0?f.bracoD:f.bracoE,para=n%2===0?f.bracoE:f.bracoD,lado=(n%2===0?-1:1)*(1-2*sm);
    [[f.bracoE,1],[f.bracoD,-1]].forEach(([A,sd])=>{
      A.sh.rotation.x+=rad(-24)*g;A.el.rotation.x+=rad(-52)*g;A.sh.rotation.z=sd*rad(10-31*g);
    });
    f.torso.rotation.z+=-lado*rad(3.2)*(1-g*.7);
    f.head.rotation.x+=rad(14)*g;
    f.root.updateMatrixWorld(true);
    de.hand.getWorldPosition(f.va);para.hand.getWorldPosition(f.vb);
    f.balde.position.lerpVectors(f.va,f.vb,sm);f.inner.worldToLocal(f.balde.position);
    f.balde.rotation.z=Math.sin(t*2.1)*.05+Math.sin(t*4.4)*.06*w;
    f.balde.rotation.x=Math.sin(t*1.6+.5)*.04;
  }
};

/* ---------- Binho ---------- */
const BINHO={
  nome:'Binho',altura:1.07,pele:'#70482f',
  corpo:{ombro:.116,cintura:.092,quadril:.094,prof:.58,perna:.043,braco:.028,passo:.046,pescoco:.027},
  roupa:{
    tronco:tecido('#b39450',{gola:true,peito:true}),
    manga:tecido('#b39450',{}),
    calca:tecido('#3d4145',{listraLado:'rgba(220,210,190,.5)',barra:true}),
    sapato:tecido('#b4ab99',{barra:true})
  },
  bermuda:true,
  cabelo:{tipo:'rente',cor:'#17120f'},
  pose:{quadrilZ:-3.5,troncoZ:4,troncoX:5,cabecaX:5,cabecaY:12,
        bracoE:[-4,8,-74],bracoD:[-5,5,-26],pernaE:[-9,15],pernaD:[1,0]},
  andar:{vel:5.6,amp:22,joelho:40,inclina:4,bracos:[false,false]},
  fase:2.3,
  acessorios(f){
    /* capacete de moto pendurado no cotovelo esquerdo */
    const c=grp(f.bracoE.el,.012,-.07,-.092);c.rotation.set(rad(70),rad(15),rad(8));
    const cg=ico(.088,1);cg.scale(1,.94,1.08);
    part(cg,matFig(tecido('#2a2c2e',{barra:false})),c);
    part(new T.BoxGeometry(.13,.05,.012),matFig(tecido('#7c8082',{barra:false})),c,0,.012,.09);
    part(new T.BoxGeometry(.05,.012,.19),matFig(tecido('#8c3b2d',{barra:false})),c,0,.083,0);
    part(new T.BoxGeometry(.012,.07,.012),matFig(tecido('#1c1a18',{barra:false})),f.bracoE.el,.012,-.035,-.02);
    /* meia curta */
    [f.pernaE,f.pernaD].forEach(L=>part(new T.CylinderGeometry(f.B.perna*.64,f.B.perna*.62,.035,6,1,false,Math.PI/6),matFig(tecido('#d8d2c4',{barra:false})),L.knee,0,-.195,0));
  },
  anim(f,t,w){
    /* o gesto da linha de montagem, que ele repete mesmo fora dela */
    const c=(t*1.15)%1,a=c<.35?c/.35:c<.5?1:c<.8?1-(c-.5)/.3:0,e=a*a*(3-2*a);
    f.bracoD.sh.rotation.x+=rad(-24)*e;f.bracoD.el.rotation.x+=rad(-48)*e;
    f.bracoD.hand.rotation.z=rad(40)*e;
    f.head.rotation.y+=Math.sin(t*.5)*rad(6);
  }
};

/* ---------- Tia Cotinha ---------- */
const COTINHA={
  nome:'Tia Cotinha',altura:.92,pele:'#4f3324',
  corpo:{ombro:.1,cintura:.102,quadril:.114,prof:.72,perna:.04,braco:.027,passo:.05,pescoco:.026},
  roupa:{
    tronco:tecido('#bcae8e',{gola:true,frente:true,barra:true}),
    manga:tecido('#bcae8e',{}),
    saia:tecido('#5f4a3c',{flor:['#b9a27a','#8f6a4a'],barra:true}),
    calca:null,
    sapato:tecido('#3f2c20',{barra:false})
  },
  saia:{h:.45,abre:1.38},pernaPele:true,sandalia:true,
  cabelo:{tipo:'turbante',tex:tecido('#8c3b2d',{listraV:'rgba(230,215,185,.5)',barra:false})},
  pose:{quadrilZ:0,troncoZ:1,troncoX:15,cabecaX:-2,cabecaY:8,
        bracoE:[-10,3,-96,24],bracoD:[-10,3,-96,24],pernaE:[-7,13],pernaD:[-7,13]},
  andar:{vel:4.8,amp:10,joelho:16,inclina:2,bracos:[false,false]},
  fase:3.1,
  acessorios(f){
    /* pote de barro com sementes, seguro contra o corpo */
    const B=f.B,p=f.pote=grp(f.torso,0,.085,B.ombro*B.prof+.05);p.rotation.x=rad(-13);
    const barro=matFig(tecido('#9a5a3c',{barra:true}));
    part(new T.CylinderGeometry(.064,.044,.1,8),barro,p);
    part(new T.CylinderGeometry(.046,.064,.03,8),barro,p,0,.065,0);
    part(new T.CylinderGeometry(.05,.046,.014,8),barro,p,0,.087,0);
    const [c,x]=mk(64,64);
    x.fillStyle='#3a2a1e';x.fillRect(0,0,64,64);
    for(let i=0;i<150;i++){x.fillStyle=['#d9c9a3','#5b2e22','#b08a52','#e6dcc4','#1f1612'][(R()*5)|0];x.beginPath();x.ellipse(R()*64,R()*64,3.2,2.1,R()*3,0,7);x.fill();}
    const st=new T.CanvasTexture(c);st.encoding=T.sRGBEncoding;
    const sm=new T.Mesh(new T.CylinderGeometry(.044,.044,.006,8),new T.MeshStandardMaterial({map:st,roughness:.9,flatShading:true}));
    sm.position.y=.09;sm.receiveShadow=true;p.add(sm);
  },
  anim(f,t,w){
    /* olha para dentro do pote e volta, e aperta o pote contra o peito */
    const g=Math.pow(Math.max(0,Math.sin(t*.5+1)),4);
    f.head.rotation.x+=rad(24)*g;f.head.rotation.y-=rad(8)*g;
    const a=Math.sin(t*1.5+3.1)*rad(1.5);
    f.bracoE.el.rotation.x+=a;f.bracoD.el.rotation.x+=a;
  }
};

/* ---------- Seu Zé Rádio ---------- */
const ZE={
  nome:'Seu Zé Rádio',altura:1.0,pele:'#8a5f42',
  corpo:{ombro:.122,cintura:.13,quadril:.122,prof:.78,perna:.047,braco:.034,passo:.056,pescoco:.033,barriga:.38},
  roupa:{
    tronco:tecido('#6f7d62',{listraV:'rgba(225,215,190,.42)',aberta:'#dcd5c4',barra:true}),
    manga:tecido('#6f7d62',{listraV:'rgba(225,215,190,.42)'}),
    calca:tecido('#5e5a55',{barra:false}),
    sapato:tecido('#2f2c2a',{barra:false})
  },
  sandalia:true,
  cabelo:{tipo:'bone',cor:'#8c3b2d'},
  pose:{quadrilZ:2.5,troncoZ:-3,troncoX:-3,cabecaX:2,cabecaY:-14,
        bracoE:[4,9,-12],bracoD:[-34,20,-142],pernaE:[0,0],pernaD:[-6,10]},
  andar:{vel:4.2,amp:16,joelho:26,inclina:0,bracos:[true,false]},
  fase:4.4,
  acessorios(f){
    /* rádio de pilha: fica sempre de pé, na mão direita, perto do ouvido */
    const r=f.radio=grp(f.inner);
    part(new T.BoxGeometry(.125,.078,.036),matFig(tecido('#4a3324',{barra:false})),r);
    const [c,x]=mk(128,80);
    x.fillStyle='#2a2623';x.fillRect(0,0,128,80);
    x.fillStyle='#b9b2a4';x.fillRect(4,4,120,72);
    x.fillStyle='#2a2623';for(let yy=10;yy<70;yy+=6)for(let xx=10;xx<66;xx+=6){x.beginPath();x.arc(xx,yy,1.7,0,7);x.fill();}
    x.fillStyle='#e7dcc3';x.fillRect(74,12,44,18);
    x.strokeStyle='#8c3b2d';x.lineWidth=2;x.beginPath();x.moveTo(98,12);x.lineTo(98,30);x.stroke();
    x.fillStyle='#2a2623';x.beginPath();x.arc(86,52,9,0,7);x.fill();x.beginPath();x.arc(108,52,6,0,7);x.fill();
    speckle(x,128,80,120,['#000','#fff'],2);
    const ft=new T.CanvasTexture(c);ft.encoding=T.sRGBEncoding;
    const fr=new T.Mesh(new T.PlaneGeometry(.119,.072),new T.MeshStandardMaterial({map:ft,roughness:.7}));
    fr.position.z=.0185;r.add(fr);
    const an=part(new T.CylinderGeometry(.002,.002,.16,4),matFig(tecido('#9a968c',{barra:false})),r,-.05,.11,-.01);an.rotation.z=rad(14);
    part(new T.BoxGeometry(.1,.008,.012),matFig(tecido('#2a2623',{barra:false})),r,0,.046,0);
    f.va=new T.Vector3();
  },
  anim(f,t,w){
    /* acompanha a música: cabeça no compasso e ponta do pé batendo */
    const b=Math.sin(t*4.6);
    f.head.rotation.x+=rad(3.5)*Math.max(0,b);f.head.rotation.z+=rad(3)*Math.sin(t*2.3);
    f.pernaE.ankle.rotation.x+=-rad(16)*Math.max(0,b)*(1-w);
    f.root.updateMatrixWorld(true);
    f.bracoD.hand.getWorldPosition(f.va);f.inner.worldToLocal(f.va);
    f.radio.position.set(f.va.x+.034,f.va.y+.05,f.va.z+.012);
    f.radio.rotation.y=rad(-62);f.radio.rotation.z=rad(4)+Math.sin(t*2.3)*rad(2);
  }
};

const nana=criarFigura(NANA),agente=criarFigura(AGENTE),marlene=criarFigura(MARLENE),binho=criarFigura(BINHO),cotinha=criarFigura(COTINHA),ze=criarFigura(ZE);

/* ---------- Jéssica ---------- */
const JESSICA={
  nome:'Jéssica',altura:1.03,pele:'#6f4630',
  corpo:{ombro:.108,cintura:.09,quadril:.114,prof:.64,perna:.052,braco:.029,passo:.056,pescoco:.027},
  roupa:{
    tronco:tecido('#8e7c96',{top:'#6f4630',barra:false}),
    manga:pele('#6f4630'),
    calca:tecido('#56606e',{trama:true,barra:true}),
    sapato:tecido('#b4ab99',{barra:true})
  },
  short:true,
  cabelo:{tipo:'trancas',cor:'#17120f'},
  pose:{quadrilZ:-4.5,troncoZ:5,troncoX:-1,cabecaX:-3,cabecaY:-10,
        bracoE:[2,13,-18],bracoD:[-62,9,-22],pernaE:[-8,13],pernaD:[1,0]},
  andar:{vel:6,amp:22,joelho:40,inclina:2,bracos:[false,false]},
  fase:5.2,
  acessorios(f){
    const B=f.B,zc=B.ombro*B.prof,preto=matFig(tecido('#2a2c2e',{barra:false}));
    /* pochete atravessada */
    [1,-1].forEach(k=>{const a=part(new T.BoxGeometry(.02,.27,.008),preto,f.torso,0,.14,k*(zc*.86+.003));a.rotation.z=rad(36);});
    part(new T.BoxGeometry(.09,.05,.034),preto,f.torso,.045,.062,zc*.82+.02).rotation.z=rad(-14);
    /* isopor pendurado no ombro esquerdo */
    const iso=matFig(tecido('#d6d1c3',{barra:false})),xi=B.ombro+.105;
    part(new T.BoxGeometry(.15,.15,.21),iso,f.torso,xi,-.05,.0);
    part(new T.BoxGeometry(.158,.03,.218),matFig(tecido('#c4bfb0',{barra:false})),f.torso,xi,.04,.0);
    part(new T.BoxGeometry(.152,.02,.212),matFig(tecido('#8c3b2d',{barra:false})),f.torso,xi,-.03,.0);
    [1,-1].forEach(k=>{const a=part(new T.BoxGeometry(.02,.25,.008),preto,f.torso,B.ombro*.82+.03,.16,k*(zc*.55+.012));a.rotation.z=rad(-13);a.rotation.x=k*rad(5);});
    part(new T.BoxGeometry(.02,.008,zc*1.15),preto,f.torso,B.ombro*.66,f.TH+.022,0);
    /* geladinho na mão estendida */
    const g=part(new T.CylinderGeometry(.011,.013,.11,6),matFig(tecido('#c98a7a',{barra:false})),f.bracoD.hand,0,-.035,.045);g.rotation.x=rad(90);
    part(new T.CylinderGeometry(.004,.011,.02,6),matFig(tecido('#e9e2d2',{barra:false})),f.bracoD.hand,0,-.035,.108).rotation.x=rad(90);
  },
  anim(f,t,w){
    /* oferece o geladinho e procura freguês dos dois lados */
    f.bracoD.sh.rotation.x+=Math.sin(t*1.5)*rad(7);f.bracoD.el.rotation.x+=Math.sin(t*1.5+.8)*rad(9);
    f.head.rotation.y+=Math.sin(t*.55)*rad(26);
  }
};

/* ---------- Seu Aurelino ---------- */
const AURELINO={
  nome:'Seu Aurelino',altura:.98,pele:'#4a2f20',
  corpo:{ombro:.106,cintura:.094,quadril:.096,prof:.6,perna:.04,braco:.026,passo:.05,pescoco:.025},
  roupa:{
    tronco:tecido('#a9a08a',{aberta:'#4a2f20',gola:true,barra:true}),
    manga:tecido('#a9a08a',{}),
    calca:tecido('#6b6452',{barra:false}),
    sapato:tecido('#2f2c2a',{barra:false})
  },
  mangaLonga:true,dobrada:true,descalco:true,
  cabelo:{tipo:'palha',tex:tecido('#c9b074',{palha:true,barra:false})},
  pose:{quadrilZ:0,troncoZ:-1.5,troncoX:10,cabecaX:-7,cabecaY:10,arco:7,
        bracoE:[3,8,-10],bracoD:[-25,3,-75],pernaE:[0,4],pernaD:[0,4]},
  andar:{vel:3.8,amp:12,joelho:20,inclina:2,bracos:[false,false]},
  fase:6.1,
  acessorios(f){
    const B=f.B,mad=matFig(tecido('#6a4f33',{barra:false})),palha=matFig(tecido('#b89c62',{palha:true,barra:false}));
    /* vara simples apoiada no ombro direito */
    const L=1.35,v=grp(f.torso,-B.ombro*.92,f.TH+.036,0);v.rotation.x=rad(-56);v.rotation.z=rad(4);
    const vg=new T.CylinderGeometry(.004,.0075,L,6);vg.translate(0,L/2-.31,0);
    part(vg,mad,v);
    part(ico(.014),matFig(tecido('#8c3b2d',{barra:false})),v,0,L-.42,.012);
    /* samburá na mão esquerda */
    const sb=grp(f.bracoE.hand,0,-.045,0);
    part(new T.TorusGeometry(.05,.0035,4,10,Math.PI),mad,sb,0,-.062,0);
    part(new T.CylinderGeometry(.07,.082,.105,8),palha,sb,0,-.118,0);
    part(new T.CylinderGeometry(.045,.07,.03,8),palha,sb,0,-.05,0);
    part(new T.CylinderGeometry(.047,.047,.008,8),matFig(tecido('#7a6338',{barra:false})),sb,0,-.034,0);
  },
  anim(f,t,w){
    /* olha a água devagar, de um lado ao outro */
    f.head.rotation.y+=Math.sin(t*.28)*rad(20);f.head.rotation.x+=Math.sin(t*.4+1)*rad(3);
    f.torso.rotation.z+=Math.sin(t*.6)*rad(1.2);
  }
};
const jessica=criarFigura(JESSICA),aurelino=criarFigura(AURELINO);

/* ---------- Vó Dete ---------- */
const DETE={
  nome:'Vó Dete',altura:.9,pele:'#5c3d2b',
  corpo:{ombro:.1,cintura:.112,quadril:.12,prof:.76,perna:.04,braco:.027,passo:.052,pescoco:.026,barriga:.14},
  roupa:{
    tronco:tecido('#d8cfba',{flor:['#c4b594','#b9a3a0'],gola:true,barra:false}),
    manga:tecido('#d8cfba',{flor:['#c4b594','#b9a3a0']}),
    saia:tecido('#d8cfba',{flor:['#c4b594','#b9a3a0'],barra:true}),
    calca:null,
    sapato:tecido('#4a3324',{barra:false})
  },
  saia:{h:.43,abre:1.3},pernaPele:true,sandalia:true,
  cabelo:{tipo:'coque',cor:'#d6d2c8'},
  pose:{quadrilZ:0,troncoZ:-1,troncoX:16,cabecaX:-9,cabecaY:4,
        bracoE:[4,7,-14],bracoD:[-14,7,-10],pernaE:[-6,12],pernaD:[-6,12]},
  andar:{vel:3.2,amp:8,joelho:12,inclina:1,bracos:[false,false]},
  fase:.9,
  acessorios(f){
    const B=f.B;
    /* xale sobre os ombros */
    const xm=matFig(tecido('#8d8794',{trama:true,barra:true}));
    const xg=new T.CylinderGeometry(.052,B.ombro*1.42,.15,8,1,false,Math.PI/8);xg.scale(1,1,B.prof*1.08);
    part(xg,xm,f.torso,0,f.TH-.04,0);
    [-1,1].forEach(sd=>{const p=part(new T.BoxGeometry(.045,.13,.012),xm,f.torso,sd*.034,f.TH-.16,B.ombro*B.prof+.022);p.rotation.z=sd*rad(-7);p.rotation.x=rad(-6);});
    /* chave de registro: barra em T, comprida, que ela usa de apoio */
    const k=f.chave=grp(f.inner),fe=matFig(tecido('#4c443c',{barra:false})),L=.47;
    const sg=new T.CylinderGeometry(.008,.008,L,6);sg.translate(0,-L/2+.05,0);
    part(sg,fe,k);
    part(new T.CylinderGeometry(.008,.008,.15,6),fe,k,0,.05,0).rotation.z=rad(90);
    part(new T.BoxGeometry(.03,.035,.03),fe,k,0,-L+.065,0);
    part(ico(.012),fe,k,0,.05,0);
    f.va=new T.Vector3();
  },
  anim(f,t,w){
    /* quase parada: só o olhar muda de lugar, muito devagar */
    f.head.rotation.y+=Math.sin(t*.17)*rad(9);
    f.root.updateMatrixWorld(true);
    f.bracoD.hand.getWorldPosition(f.va);f.inner.worldToLocal(f.va);
    f.chave.position.set(f.va.x,Math.max(f.va.y-.035,.37),f.va.z+.01);
  }
};
const dete=criarFigura(DETE);

/* ---------- a Fila: figura simplificada em InstancedMesh ---------- */
function junta(gs){
  const P=[],N=[],U=[];
  gs.forEach(g=>{const n=g.index?g.toNonIndexed():g;P.push(...n.attributes.position.array);N.push(...n.attributes.normal.array);U.push(...n.attributes.uv.array);});
  const o=new T.BufferGeometry();
  o.setAttribute('position',new T.Float32BufferAttribute(P,3));
  o.setAttribute('normal',new T.Float32BufferAttribute(N,3));
  o.setAttribute('uv',new T.Float32BufferAttribute(U,2));
  return o;
}
/* criarFila(n, o): n pessoas em fila indiana ao longo de +x, entre o.x0 e o.x1, em z = o.z.
   Quando anda, a fila avança e quem sai por uma ponta volta pela outra: o corredor nunca acaba. */
function criarFila(n,o){
  const root=new T.Group();
  const lg=new T.CylinderGeometry(.088,.058,.475,6,1,false,Math.PI/6);lg.scale(1,1,.62);lg.translate(0,.2375,0);
  const tg=new T.CylinderGeometry(.112,.094,.3,8,1,false,Math.PI/8);tg.scale(1,1,.62);tg.translate(0,.625,0);
  const og=new T.CylinderGeometry(.04,.112,.04,8,1,false,Math.PI/8);og.scale(1,1,.62);og.translate(0,.795,0);
  const bracos=[-1,1].map(sd=>{const b=new T.CylinderGeometry(.03,.022,.34,6,1,false,Math.PI/6);b.rotateZ(sd*rad(5));b.translate(sd*.132,.6,0);return b;});
  const hg=cabecaGeo(.08);hg.translate(0,.905,0);
  const mk3=c=>{const m=matFig(c);return m;};
  const mL=mk3(tecido('#cfc9bd',{barra:false})),mT=mk3(tecido('#d6d0c4',{gola:true,barra:true})),mH=mk3(pele('#cfc8bd'));
  const cg=ico(.084,1);cg.scale(.97,.86,1.02);cg.translate(0,.928,-.015);
  const meshes=[[lg,mL],[junta([tg,og].concat(bracos)),mT],[hg,mH],[cg,mk3(tecido('#d9d5cc',{barra:false}))]].map(([g,m])=>{
    const im=new T.InstancedMesh(g,m,n);im.castShadow=true;im.receiveShadow=true;im.frustumCulled=false;root.add(im);return im;
  });
  const CAM=['#7f8674','#96564f','#b39450','#6f7d62','#a9a08a','#8e7c96','#8c3b2d','#bcae8e','#5e5a55','#d6cdb8'],
        CAL=['#434b57','#5e5a55','#6b6452','#3d4145','#5f4a3c','#56606e'],
        PEL=['#4f3324','#6b4631','#8a5f42','#5a3a29','#a47c5c','#70482f','#4a2f20'],
        CAB=['#17120f','#1f1815','#17120f','#3a2c22','#8d8880','#d6d2c8'];
  const col=new T.Color(),ps=[];
  for(let i=0;i<n;i++){
    ps.push({h:rr(.86,1.1)/1.04,l:rr(.88,1.2),dz:rr(-.045,.045),ry:rad(90+rr(-13,13)),f:R()*6.28,in:rr(-3,5)});
    [CAL,CAM,PEL,CAB].forEach((lista,k)=>meshes[k].setColorAt(i,col.set(lista[(R()*lista.length)|0]).convertSRGBToLinear()));
  }
  meshes.forEach(m=>m.instanceColor.needsUpdate=true);
  const d=new T.Object3D(),span=o.x1-o.x0,sp=span/n;
  let avanco=0,tAnt=0;
  return {root,update(t,w){
    const dt=Math.min(.1,Math.max(0,t-tAnt));tAnt=t;avanco+=dt*.22*w;
    for(let i=0;i<n;i++){
      const p=ps[i],u=((i*sp+avanco)%span+span)%span;
      const borda=Math.min(1,Math.min(u,span-u)/.22),e=borda*borda*(3-2*borda);
      const passo=Math.abs(Math.sin(t*3.2+p.f))*.012*w;
      d.position.set(o.x0+u,passo,o.z+p.dz);
      d.rotation.set(rad(p.in)+Math.sin(t*1.3+p.f)*.012,p.ry+Math.sin(t*.4+p.f)*.08,Math.sin(t*.8+p.f)*.02);
      d.scale.set(p.l*e,p.h*e*(1+.01*Math.sin(t*1.5+p.f)),p.l*e);
      d.updateMatrix();
      meshes.forEach(m=>m.setMatrixAt(i,d.matrix));
    }
    meshes.forEach(m=>m.instanceMatrix.needsUpdate=true);
  }};
}



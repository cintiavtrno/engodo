/* Engodo — utilidades, texturas procedurais, cena, luz e o modelo da casa */
const T=THREE;

/* ---------- utilidades ---------- */
let seed=20241110;
const R=()=>(seed=(seed*16807)%2147483647)/2147483647;
const rr=(a,b)=>a+R()*(b-a);
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')];};

function speckle(x,w,h,n,cols,maxS,a0,a1){
  a0=a0===undefined?.05:a0; a1=a1===undefined?.2:a1;
  for(let i=0;i<n;i++){
    x.fillStyle=cols[(R()*cols.length)|0];
    x.globalAlpha=a0+R()*(a1-a0);
    const s=1+R()*maxS;
    x.fillRect(R()*w,R()*h,s,s*(.5+R()*2));
  }
  x.globalAlpha=1;
}
function drips(x,w,h,n,rgb){
  for(let i=0;i<n;i++){
    const px=R()*w,len=30+R()*h*.5,wd=2+R()*7;
    const g=x.createLinearGradient(0,0,0,len);
    g.addColorStop(0,'rgba('+rgb+','+(.22+R()*.2).toFixed(2)+')');
    g.addColorStop(1,'rgba('+rgb+',0)');
    x.save();x.translate(px,R()*h*.4);x.fillStyle=g;x.fillRect(0,0,wd,len);x.restore();
  }
}
function blobPts(cx,cy,r){
  const n=10+((R()*6)|0),p=[];
  for(let i=0;i<n;i++){
    const a=i/n*Math.PI*2,rad=r*(.55+R()*.75);
    p.push([cx+Math.cos(a)*rad*(1+R()*.4),cy+Math.sin(a)*rad*(.7+R()*.4)]);
  }
  return p;
}
function pathOf(x,p){x.beginPath();p.forEach((q,i)=>i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]));x.closePath();}
function mottle(x,w,h,n){
  for(let i=0;i<n;i++){
    const cx=R()*w,cy=R()*h,r=40+R()*90,dark=R()<.5;
    const g=x.createRadialGradient(cx,cy,0,cx,cy,r);
    g.addColorStop(0,dark?'rgba(40,25,20,.15)':'rgba(255,240,225,.12)');
    g.addColorStop(1,'rgba(0,0,0,0)');
    x.fillStyle=g;x.fillRect(cx-r,cy-r,r*2,r*2);
  }
}

/* ---------- texturas procedurais ---------- */
function plaster(base,patchCols,np,bricks,dripRGB){
  const [c,x]=mk(512,512);
  x.fillStyle=base;x.fillRect(0,0,512,512);
  mottle(x,512,512,32);
  for(let i=0;i<np;i++){
    const cx=rr(90,420),cy=rr(90,420),r=rr(28,75),p=blobPts(cx,cy,r);
    x.save();pathOf(x,p);x.clip();
    x.fillStyle=patchCols[(R()*patchCols.length)|0];
    x.fillRect(cx-r*2,cy-r*2,r*4,r*4);
    if(bricks){
      x.strokeStyle='rgba(55,35,28,.55)';x.lineWidth=2;
      for(let by=cy-r*2,row=0;by<cy+r*2;by+=16,row++){
        x.beginPath();x.moveTo(cx-r*2,by);x.lineTo(cx+r*2,by);x.stroke();
        for(let bx=cx-r*2+(row%2)*20;bx<cx+r*2;bx+=40){x.beginPath();x.moveTo(bx,by);x.lineTo(bx,by+16);x.stroke();}
      }
    }
    x.restore();
    pathOf(x,p);x.strokeStyle='rgba(255,235,215,.4)';x.lineWidth=3;x.stroke();
    x.save();x.translate(2,2);pathOf(x,p);x.strokeStyle='rgba(30,15,10,.35)';x.lineWidth=2;x.stroke();x.restore();
  }
  drips(x,512,512,22,dripRGB||'60,40,30');
  speckle(x,512,512,2200,['#000','#fff','#5a4030'],3);
  return c;
}
function stoneTex(){
  const [c,x]=mk(512,512);
  x.fillStyle='#3e3b37';x.fillRect(0,0,512,512);
  let y=0;
  while(y<512){
    const h=rr(46,74);let xx=-rr(0,60);
    while(xx<512){
      const w=rr(70,140),v=(rr(105,150))|0;
      x.fillStyle='rgb('+v+','+(v-3)+','+(v-9)+')';x.fillRect(xx+3,y+3,w-6,h-6);
      x.fillStyle='rgba(255,255,255,.08)';x.fillRect(xx+3,y+3,w-6,5);
      x.fillStyle='rgba(0,0,0,.14)';x.fillRect(xx+3,y+h-9,w-6,6);
      xx+=w;
    }
    y+=h;
  }
  mottle(x,512,512,18);
  drips(x,512,512,18,'25,22,20');
  speckle(x,512,512,2500,['#000','#fff','#6a6258'],3);
  return c;
}
function rustTex(){
  const [c,x]=mk(512,512);
  x.fillStyle='#8f5636';x.fillRect(0,0,512,512);
  const cols=['190,105,55','110,55,35','205,170,130','125,128,122','160,80,45'];
  for(let i=0;i<80;i++){
    const cx=R()*512,cy=R()*512,r=20+R()*70,k=cols[(R()*cols.length)|0];
    const g=x.createRadialGradient(cx,cy,0,cx,cy,r);
    g.addColorStop(0,'rgba('+k+','+(.28+R()*.3).toFixed(2)+')');
    g.addColorStop(1,'rgba('+k+',0)');
    x.fillStyle=g;x.fillRect(cx-r,cy-r,r*2,r*2);
  }
  for(let i=0;i<150;i++){
    const x0=R()*512,dark=R()<.6;
    x.strokeStyle='rgba('+(dark?'60,30,20':'200,150,110')+','+(.1+R()*.2).toFixed(2)+')';
    x.lineWidth=.5+R()*2;x.beginPath();
    const y0=R()*512;x.moveTo(x0,y0);x.lineTo(x0+rr(-3,3),y0+rr(60,300));x.stroke();
  }
  speckle(x,512,512,3000,['#000','#e8c8a0','#3a1a10'],3,.05,.3);
  return c;
}
function woodTex(dark){
  const [c,x]=mk(512,512),ph=64;
  for(let i=0;i<8;i++){
    const v=rr(.75,1.05);
    x.fillStyle='rgb('+((165*v)|0)+','+((102*v)|0)+','+((54*v)|0)+')';
    x.fillRect(0,i*ph,512,ph);
    for(let k=0;k<14;k++){
      x.strokeStyle='rgba(50,28,12,'+(.08+R()*.15).toFixed(2)+')';x.lineWidth=1;
      const yy=i*ph+rr(4,ph-4);
      x.beginPath();x.moveTo(0,yy);x.bezierCurveTo(150,yy+rr(-4,4),350,yy+rr(-4,4),512,yy+rr(-3,3));x.stroke();
    }
    x.fillStyle='rgba(20,10,4,.75)';x.fillRect(0,i*ph,512,2);x.fillRect(0,i*ph+ph-1,512,2);
    x.fillStyle='rgba(30,20,12,.7)';
    for(let n=0;n<2;n++){x.beginPath();x.arc(30+n*400+rr(-3,3),i*ph+ph/2,2.2,0,7);x.fill();}
  }
  speckle(x,512,512,1800,['#fff','#000','#c8c0b0'],3);
  if(dark){x.fillStyle='rgba(8,5,3,.62)';x.fillRect(0,0,512,512);}
  return c;
}
function doorTex(){
  const [c,x]=mk(256,448);
  x.fillStyle='#3d2616';x.fillRect(0,0,256,448);
  for(let i=0;i<6;i++){
    const v=rr(.8,1.15);
    x.fillStyle='rgb('+((78*v)|0)+','+((48*v)|0)+','+((28*v)|0)+')';x.fillRect(i*43+2,2,39,444);
    x.fillStyle='rgba(0,0,0,.4)';x.fillRect(i*43,0,3,448);
  }
  x.strokeStyle='rgba(20,10,5,.7)';x.lineWidth=5;x.strokeRect(28,36,200,160);x.strokeRect(28,230,200,170);
  x.fillStyle='#b9b2a4';x.beginPath();x.arc(214,230,9,0,7);x.fill();
  drips(x,256,448,10,'20,10,5');
  speckle(x,256,448,300,['#000','#c9b79a'],3);
  return c;
}
function garageTex(){
  const W=512,H=358,[c,x]=mk(W,H);
  x.fillStyle='#8c3b2d';x.fillRect(0,0,W,H);
  const cols=['162,74,53','107,42,32','179,106,74'];
  for(let i=0;i<60;i++){
    const cx=R()*W,cy=R()*H,r=20+R()*60,k=cols[(R()*3)|0];
    const g=x.createRadialGradient(cx,cy,0,cx,cy,r);
    g.addColorStop(0,'rgba('+k+',.4)');g.addColorStop(1,'rgba('+k+',0)');
    x.fillStyle=g;x.fillRect(cx-r,cy-r,r*2,r*2);
  }
  for(let y=0;y<H;y+=36){
    x.fillStyle='rgba(0,0,0,.28)';x.fillRect(0,y,W,3);
    x.fillStyle='rgba(255,200,170,.12)';x.fillRect(0,y+3,W,2);
  }
  drips(x,W,H,25,'40,15,10');
  speckle(x,W,H,1500,['#000','#e0b090'],3);
  x.lineCap='round';x.lineJoin='round';
  function tag(){
    x.beginPath();
    x.moveTo(190,150);x.bezierCurveTo(130,105,105,190,170,208);x.bezierCurveTo(235,225,190,295,115,262);
    x.moveTo(252,292);x.lineTo(252,138);x.bezierCurveTo(335,115,345,212,262,216);x.lineTo(345,292);
    x.moveTo(300,222);x.bezierCurveTo(365,165,440,195,405,250);x.bezierCurveTo(385,280,330,270,345,240);
    x.stroke();
  }
  x.save();x.translate(4,4);x.strokeStyle='rgba(40,15,12,.5)';x.lineWidth=13;tag();x.restore();
  x.strokeStyle='rgba(238,232,224,.95)';x.lineWidth=9;tag();
  const g=x.createLinearGradient(0,H*.7,0,H);
  g.addColorStop(0,'rgba(30,18,10,0)');g.addColorStop(1,'rgba(30,18,10,.5)');
  x.fillStyle=g;x.fillRect(0,H*.7,W,H*.3);
  return c;
}
function windowBarred(){
  const [c,x]=mk(256,320);
  x.fillStyle='#6b4a3a';x.fillRect(0,0,256,320);
  x.fillStyle='rgba(255,230,200,.18)';x.fillRect(0,0,256,6);
  const g=x.createLinearGradient(0,16,0,304);g.addColorStop(0,'#33424f');g.addColorStop(1,'#141c24');
  x.fillStyle=g;x.fillRect(16,16,224,288);
  x.fillStyle='rgba(255,255,255,.09)';x.beginPath();x.moveTo(16,16);x.lineTo(120,16);x.lineTo(16,150);x.fill();
  x.strokeStyle='#2a2522';x.lineWidth=7;
  for(let i=0;i<=6;i++){x.beginPath();x.moveTo(16+i*37.3,16);x.lineTo(16+i*37.3,304);x.stroke();}
  for(let i=0;i<2;i++){x.beginPath();x.moveTo(16,110+i*100);x.lineTo(240,110+i*100);x.stroke();}
  x.strokeStyle='rgba(20,10,5,.7)';x.lineWidth=6;x.strokeRect(3,3,250,314);
  speckle(x,256,320,300,['#000','#c9b79a'],2);
  return c;
}
function windowCurtain(){
  const [c,x]=mk(256,256);
  x.fillStyle='#cfc8b8';x.fillRect(0,0,256,256);
  const g=x.createLinearGradient(0,14,0,242);g.addColorStop(0,'#5d7688');g.addColorStop(1,'#27323b');
  x.fillStyle=g;x.fillRect(14,14,228,228);
  x.fillStyle='#e6dfce';x.fillRect(14,14,228,150);
  for(let i=0;i<14;i++){
    x.fillStyle='rgba(120,105,85,'+(.08+R()*.12).toFixed(2)+')';
    x.fillRect(14+i*16.3,14,5+R()*5,150);
  }
  x.fillStyle='rgba(60,40,30,.5)';x.fillRect(120,14,4,228);
  x.strokeStyle='rgba(60,50,40,.7)';x.lineWidth=6;x.strokeRect(3,3,250,250);
  speckle(x,256,256,300,['#000','#8a7a60'],2);
  return c;
}
function doorwayTex(){
  const [c,x]=mk(256,320);
  const g=x.createLinearGradient(0,0,0,320);g.addColorStop(0,'#0e0907');g.addColorStop(1,'#241710');
  x.fillStyle=g;x.fillRect(0,0,256,320);
  x.fillStyle='rgba(255,196,120,.16)';x.fillRect(150,60,70,110);
  x.fillStyle='rgba(0,0,0,.5)';x.fillRect(184,60,3,110);
  x.strokeStyle='#5a3b24';x.lineWidth=12;x.strokeRect(6,6,244,308);
  return c;
}

/* ---------- cena ---------- */
const BG=0xefece8;
const canvas=document.getElementById('c');
const renderer=new T.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=T.PCFSoftShadowMap;
renderer.outputEncoding=T.sRGBEncoding;
const scene=new T.Scene();
scene.background=new T.Color(BG);
const FN=17,FF=46;   // neblina da rua: começa perto para o chão sumir no horizonte
scene.fog=new T.Fog(BG,FN,FF);
const camera=new T.PerspectiveCamera(38,1,.1,200);
const HOME={pos:new T.Vector3(8.2,5.2,9.6),target:new T.Vector3(-.1,2.3,0)};
camera.position.copy(HOME.pos);

const controls=new T.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;
controls.target.copy(HOME.target);
controls.minDistance=7;controls.maxDistance=19;controls.enablePan=false;
controls.maxPolarAngle=1.36;controls.minPolarAngle=.5;
controls.autoRotateSpeed=1.1;controls.enableKeys=false;
controls.update();

scene.add(new T.HemisphereLight(0xffffff,0x9a8f85,.75));
const sun=new T.DirectionalLight(0xfff1de,1.05);
sun.position.set(7,10,8);
sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);
const sc=sun.shadow.camera;sc.left=-9;sc.right=9;sc.top=9;sc.bottom=-9;sc.near=1;sc.far=40;
sun.shadow.bias=-.0004;
scene.add(sun);
const fill=new T.DirectionalLight(0xbcd0ff,.3);fill.position.set(-8,4,-6);scene.add(fill);

function matOf(canvasEl,rough,metal){
  const t=new T.CanvasTexture(canvasEl);
  t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;
  t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  return new T.MeshStandardMaterial({map:t,roughness:rough===undefined?.95:rough,metalness:metal||0});
}
function decalMat(canvasEl){
  const t=new T.CanvasTexture(canvasEl);
  t.encoding=T.sRGBEncoding;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  return new T.MeshStandardMaterial({map:t,roughness:.75});
}

const M={
  pink:  matOf(plaster('#a8766a',['#8a4a38'],8,true,'70,40,35')),
  tan:   matOf(plaster('#a89170',['#8a4f3a','#c7b28b'],7,true,'70,50,35')),
  tank:  matOf(plaster('#5b86ae',['#c9985a','#d2c09a','#d9ad52','#3d5f82'],10,false,'30,50,75')),
  conc:  matOf(plaster('#8b8883',['#6f6c68','#a39f98'],6,false,'40,38,35')),
  stone: matOf(stoneTex()),
  wood:  matOf(woodTex(false),.9),
  dark:  matOf(woodTex(true),.95),
  rust:  matOf(rustTex(),.7,.35),
  top:   new T.MeshStandardMaterial({color:0x3b3d40,roughness:.9})
};
M.rust.side=T.DoubleSide;

function worldUV(g,size,ox,oy){
  const p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv;
  for(let i=0;i<p.count;i++){
    const ax=Math.abs(n.getX(i)),ay=Math.abs(n.getY(i)),az=Math.abs(n.getZ(i));
    let u,v;
    if(ax>=ay&&ax>=az){u=p.getZ(i);v=p.getY(i);}
    else if(ay>=az){u=p.getX(i);v=p.getZ(i);}
    else{u=p.getX(i);v=p.getY(i);}
    uv.setXY(i,u/size+ox,v/size+oy);
  }
  uv.needsUpdate=true;
}
function finish(g,m){const me=new T.Mesh(g,m);me.castShadow=true;me.receiveShadow=true;scene.add(me);return me;}
function box(w,h,d,x,y,z,m,size){
  const g=new T.BoxGeometry(w,h,d);g.translate(x,y,z);
  worldUV(g,size||3,R(),R());
  return finish(g,m);
}
function wedge(x0,x1,zf,zb,y0,yf,yb,m,size){
  const P=[];
  const q=(a,b,c,d)=>{P.push(...a,...b,...c,...a,...c,...d);};
  q([x0,y0,zf],[x1,y0,zf],[x1,yf,zf],[x0,yf,zf]);
  q([x1,y0,zb],[x0,y0,zb],[x0,yb,zb],[x1,yb,zb]);
  q([x1,y0,zf],[x1,y0,zb],[x1,yb,zb],[x1,yf,zf]);
  q([x0,y0,zb],[x0,y0,zf],[x0,yf,zf],[x0,yb,zb]);
  q([x0,yf,zf],[x1,yf,zf],[x1,yb,zb],[x0,yb,zb]);
  const g=new T.BufferGeometry();
  g.setAttribute('position',new T.Float32BufferAttribute(P,3));
  g.setAttribute('uv',new T.Float32BufferAttribute(new Array(P.length/3*2).fill(0),2));
  g.computeVertexNormals();
  worldUV(g,size||3,R(),R());
  return finish(g,m);
}
function decal(c,w,h,x,y,z,ry){
  const me=new T.Mesh(new T.PlaneGeometry(w,h),decalMat(c));
  me.position.set(x,y,z);me.rotation.y=ry||0;me.receiveShadow=true;scene.add(me);return me;
}
function roofSheet(W,L,ridges,x,y,z,angle){
  const g=new T.PlaneGeometry(W,L,ridges*8,1);
  g.rotateX(-Math.PI/2);
  const p=g.attributes.position;
  for(let i=0;i<p.count;i++)p.setY(i,Math.sin(p.getX(i)/W*ridges*Math.PI*2)*.04);
  g.computeVertexNormals();
  const uv=g.attributes.uv;
  for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*W/3,uv.getY(i)*L/3);
  const me=finish(g,M.rust);
  me.position.set(x,y,z);me.rotation.x=angle;
  return me;
}

/* base e sombra */
box(6.8,.2,4.6,-.2,-.1,.2,M.conc,3);
const shadowPlane=new T.Mesh(new T.PlaneGeometry(80,80),new T.ShadowMaterial({opacity:.22}));
shadowPlane.rotation.x=-Math.PI/2;shadowPlane.position.y=-.305;shadowPlane.receiveShadow=true;scene.add(shadowPlane);

/* térreo */
box(3.2,1.8,3.2,-1.6,.9,0,M.stone,2.2);
box(2.8,1.8,3.2,1.4,.9,0,M.tan,3);
box(3.3,.12,3.3,-1.6,1.8,0,M.conc,3);           // cornija

/* andar de cima (esquerda) com topo inclinado */
wedge(-3.2,0,1.6,-1.6,1.86,3.46,4.06,M.pink,3);

/* caixa d'água e topo */
box(2.5,2.7,1.4,1.55,3.15,-.9,M.tank,3);
box(2.8,.16,1.7,1.55,4.58,-.85,M.wood,1.5);
box(2.8,.12,.1,1.55,4.72,-.05,M.wood,1.5);
box(2.8,.12,.1,1.55,4.72,-1.65,M.wood,1.5);
box(.1,.12,1.7,.2,4.72,-.85,M.wood,1.5);
box(.1,.12,1.7,2.9,4.72,-.85,M.wood,1.5);
box(2.6,.04,1.5,1.55,4.68,-.85,M.top,3);
box(.45,.38,.4,.95,4.9,-1,M.wood,1);
box(.54,.06,.48,.95,5.12,-1,M.wood,1);

/* varanda */
box(2.8,.12,1.9,1.4,1.86,.75,M.wood,1.5);
box(2.8,1.55,.04,1.4,2.7,-.18,M.dark,2);
decal(doorwayTex(),.7,.9,1,2.45,-.15,0);
const roofY=z=>3.3-(z-.75)*.263;
function post(x,z){const h=roofY(z)-1.92-.03;box(.08,h,.08,x,1.92+h/2,z,M.wood,1);}
[.12,.98,1.85,2.72].forEach(x=>post(x,1.62));
post(2.72,.7);post(2.72,-.12);
box(2.7,.06,.06,1.42,2.45,1.62,M.wood,1);
box(2.7,.06,.06,1.42,2.12,1.62,M.wood,1);
box(.06,.06,1.8,2.72,2.45,.75,M.wood,1);
box(.06,.06,1.8,2.72,2.12,.75,M.wood,1);
for(let i=0;i<9;i++)box(.035,.55,.035,.2+i*.3,2.2,1.62,M.wood,1);

/* telhados */
const A1=Math.atan(.6/3.2);
roofSheet(3.5,3.9,19,-1.55,3.8,0,A1);
roofSheet(3.2,2.0,17,-1.8,4.1,-1.15,A1);
roofSheet(3.0,2.3,16,1.55,3.3,.75,Math.atan(.263));
// blocos sobre o telhado
[[-2.6,.4],[-1.1,.9],[-2.0,-.5],[-.6,-.9],[-2.9,1.2]].forEach(([x,z])=>{
  const b=box(.34,.15,.2,0,0,0,M.conc,1);
  b.position.set(x,3.8-z*.1875+.1,z);b.rotation.set(A1,R()*1,0);
});

/* portas e janelas — frente */
box(2.2,1.5,.08,-1.65,.75,1.62,M.conc,3);
decal(garageTex(),2,1.4,-1.65,.72,1.665,0);
box(.7,1.3,.08,.6,.65,1.62,M.conc,3);
decal(doorTex(),.56,1.18,.6,.62,1.665,0);
box(.8,.9,.08,1.85,1,1.62,M.conc,3);
decal(windowCurtain(),.68,.78,1.85,1,1.665,0);
box(.92,.06,.18,1.85,.55,1.66,M.conc,3);
[-2.45,-1].forEach(x=>{
  box(.76,.92,.06,x,2.6,1.62,M.conc,3);
  decal(windowBarred(),.62,.78,x,2.6,1.655,0);
  box(.82,.06,.16,x,2.12,1.66,M.conc,3);
});
/* janela lateral esquerda */
box(.06,.92,.76,-3.2,2.6,.1,M.conc,3);
decal(windowBarred(),.62,.78,-3.235,2.6,.1,-Math.PI/2);

/* ---------- acréscimos ao modelo ---------- */
/* fachada dos fundos: porta para o quintal */
box(.7,1.3,.08,1.0,.65,-1.62,M.conc,3);
decal(doorTex(),.56,1.18,1.0,.62,-1.665,Math.PI);
box(1.1,.1,.4,1.0,.05,-1.88,M.conc,2);           // degrau
box(.3,.12,.14,1.0,1.5,-1.7,M.dark,1);            // luminária
/* poste na calçada */
const poleMat=new T.MeshStandardMaterial({color:0x6b5a48,roughness:.95});
function cyl(rt,rb,h,x,y,z,m){const g=new T.CylinderGeometry(rt,rb,h,12);const me=new T.Mesh(g,m);me.position.set(x,y,z);me.castShadow=true;me.receiveShadow=true;scene.add(me);return me;}
cyl(.07,.095,4,2.75,2,2.2,poleMat);
box(1.0,.07,.07,2.75,3.78,2.2,M.wood,1);
[2.35,2.75,3.15].forEach(x=>cyl(.025,.025,.1,x,3.86,2.2,new T.MeshStandardMaterial({color:0xcfc6b4})));
cyl(.17,.17,.45,2.75,3.2,2.2,new T.MeshStandardMaterial({color:0x7d8286,roughness:.6,metalness:.4}));
const lamp=new T.Mesh(new T.SphereGeometry(.09,12,8),new T.MeshStandardMaterial({color:0xffe2a8,emissive:0xffcf7a,emissiveIntensity:.8}));
lamp.position.set(2.75,3.98,2.45);scene.add(lamp);
box(.04,.04,.28,2.75,3.98,2.32,M.wood,1);
const wireMat=new T.LineBasicMaterial({color:0x1f1d1b});
[[2.4,2.72],[3.1,2.72]].forEach(([sx,ex])=>{
  const c=new T.QuadraticBezierCurve3(new T.Vector3(sx,3.8,2.2),new T.Vector3((sx+ex)/2,3.0,1.9),new T.Vector3(ex,3.03,1.62));
  scene.add(new T.Line(new T.BufferGeometry().setFromPoints(c.getPoints(24)),wireMat));
});
/* tubo de nível na frente da caixa azul */
const TUBE={y0:3.66,len:.76,x:2.45,z:-.14};
box(.17,.92,.03,TUBE.x,TUBE.y0+TUBE.len/2,-.185,M.wood,1);
const glass=new T.Mesh(new T.CylinderGeometry(.045,.045,TUBE.len,14,1,true),new T.MeshStandardMaterial({color:0xcfe8f5,transparent:true,opacity:.28,roughness:.1,side:T.DoubleSide,depthWrite:false}));
glass.position.set(TUBE.x,TUBE.y0+TUBE.len/2,TUBE.z);scene.add(glass);
const wg=new T.CylinderGeometry(.034,.034,TUBE.len,14);wg.translate(0,TUBE.len/2,0);
const water=new T.Mesh(wg,new T.MeshStandardMaterial({color:0x3aa0ff,emissive:0x1b5fa8,emissiveIntensity:.5,roughness:.2}));
water.position.set(TUBE.x,TUBE.y0,TUBE.z);scene.add(water);
for(let i=0;i<=4;i++)box(.05,.012,.012,TUBE.x-.08,TUBE.y0+i*TUBE.len/4,-.16,M.dark,1);
cyl(.052,.052,.03,TUBE.x,TUBE.y0-.01,TUBE.z,M.dark);cyl(.052,.052,.03,TUBE.x,TUBE.y0+TUBE.len+.01,TUBE.z,M.dark);
(function(){
  const [c,x]=mk(256,96);
  x.fillStyle='#14202c';x.fillRect(0,0,256,96);x.strokeStyle='#e8dcc4';x.lineWidth=4;x.strokeRect(5,5,246,86);
  x.fillStyle='#e8dcc4';x.font='700 52px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('ÁGUA',128,50);
  decal(c,.5,.19,1.95,TUBE.y0+TUBE.len/2,-.19,0);
})();

/* ---------- a rua: chão maior em volta da base, um degrau abaixo ---------- */
M.rua=matOf(plaster('#77736d',['#615e5a','#8b8780'],9,false,'35,33,30'));
box(10.6,.2,8.4,.1,-.2,.8,M.rua,3);
/* chão sem fim: a rua deixa de ser uma maquete solta e se perde na neblina */
function chaoInfinito(cena){
  const m=new T.Mesh(new T.PlaneGeometry(260,260),new T.MeshStandardMaterial({color:new T.Color(0xcfc8bd).convertSRGBToLinear(),roughness:1}));
  m.rotation.x=-Math.PI/2;m.position.y=-.302;m.receiveShadow=true;cena.add(m);return m;
}
chaoInfinito(scene);


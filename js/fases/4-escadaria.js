/* ================================================================
   FASE 4 — A OBRA (Escadaria)
   ================================================================ */
FASES[3]={x0:0,x1:13.6,H:7.8,inicio:.6,
  monta(F){
    F.alta=true;F.semDrop=true;
    const N=14,sx=1.2,run=.8,rise=.3,W=F.x1,topo=N*rise;
    F.topo=topo;
    F.perf=x=>x<sx?0:Math.min(N,Math.floor((x-sx)/run)+1)*rise;
    lbox(W+.6,.3,3.4,W/2,-.15,-.3,M.rua,3);
    roomScene.add(new T.HemisphereLight(0xffffff,0x9a8f85,.8));
    const d=new T.DirectionalLight(0xfff1de,1.0);d.position.set(W/2+4,12,9);d.target.position.set(W/2,3,-.5);d.castShadow=true;d.shadow.mapSize.set(2048,2048);
    const s=d.shadow.camera;s.left=-10;s.right=10;s.top=9;s.bottom=-7;s.near=1;s.far=36;d.shadow.bias=-.0005;roomScene.add(d,d.target);
    /* degraus: lajes empilhadas */
    for(let i=0;i<N;i++){const x0=sx+i*run,y=(i+1)*rise;lbox(W-x0+.3,rise,1.5,(x0+W+.3)/2,y-rise/2,-.05,M.conc,3);F.plat.push({x0,x1:i===N-1?W:x0+run,y});}
    /* casas da rua, subindo com a escada. O traçado laranja passa por dentro da 12 e da 14 */
    const ocre=matOf(plaster('#b08f58',['#8a4f3a','#d0b98a'],7,true,'70,50,35')),verde=matOf(plaster('#7f8a6a',['#8a4a38','#a9b08f'],7,true,'50,55,40')),
          barro=matFig(tecido('#9a5a3c',{})),folha=matFig(tecido('#5f7a4a',{barra:false}));
    F.vaos=[];F.casas=[];
    [[1.3,M.pink,'10'],[4.4,ocre,'12'],[7.5,verde,'14'],[10.6,M.tan,'16']].forEach(([x0,m,num])=>{
      const x1=x0+2.9,base=F.perf(x0+1.45),h=base+3.3,dx=x0+.85,dy=F.perf(dx),wx=x0+2.05,wy=F.perf(wx)+1.75;
      const ms=[lbox(2.9,h,.6,(x0+x1)/2,h/2,-1.15,m,3),lbox(3.05,.12,.75,(x0+x1)/2,h+.06,-1.1,M.conc,3),
                lbox(.82,1.3,.08,dx,dy+.65,-.84,M.conc,3),lbox(.76,.92,.06,wx,wy,-.84,M.conc,3)];
      lplano(new T.CanvasTexture(doorwayTex()),.68,1.18,dx,dy+.6,-.795,0);
      lplano(new T.CanvasTexture(windowBarred()),.62,.78,wx,wy,-.805,0);
      lplano(texto(96,64,(c)=>{c.fillStyle='#14202c';c.fillRect(0,0,96,64);c.fillStyle='#e8dcc4';c.font='700 40px system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(num,48,34);}),.3,.2,dx,dy+1.5,-.8,0);
      const p=prop(ms,x0,x1,0,h);p.rolo=true;F.vaos.push(dx);
      if(num==='12'||num==='14'){F.casas.push(p);const f=lmesh(new T.BoxGeometry(3.1,.13,.02),M_LARANJA,(x0+x1)/2,base+1.2,-.83);f.rotation.z=Math.atan(rise/run);f.castShadow=false;}
    });
    for(let i=4;i<12;i++)lmesh(new T.BoxGeometry(.5,.012,.14),M_LARANJA,sx+i*run+.4,(i+1)*rise+.008,-.5).castShadow=false;
    [3.05,6.25,9.45].forEach(x=>{const y=F.perf(x),ms=[lcyl(.14,.1,.26,x,y+.13,-.6,barro,8)];
      [[-.04,.42,.3],[.05,.36,-.4],[0,.5,0]].forEach(([ox,hh,a])=>{const l=lmesh(new T.ConeGeometry(.06,hh,5),folha,x+ox,y+.26+hh/2,-.6);l.rotation.z=a*.5;ms.push(l);});
      const p=prop(ms,x-.2,x+.2,y,y+.75);p.rolo=true;});
    /* frente de obra no alto */
    lbox(.55,.5,.55,12.2,topo+.25,-.85,M.planta,1);
    const bt=lmesh(new T.CylinderGeometry(.3,.38,.6,10),M.planta,12.2,topo+.8,-.85);bt.rotation.z=.5;F.bet=bt;
    lmesh(new T.BoxGeometry(.62,.08,.62),M_LARANJA,12.2,topo+.52,-.85);
    const mm=porId('marlene');mm.fora=true;roomScene.add(marlene.root);marlene.root.position.set(13.05,topo,-.25);marlene.root.rotation.y=rad(-55);F.figs.push(marlene);
    F.tRolo=6;F.tCone=3;F.px=F.inicio;F.pz=0;
  },
  comeca(F){
    diz([['','As máquinas da Fila estão concretando a escadaria da rua. Um risco laranja no chão mostra por onde ela vai passar.'],
         ['Dona Marlene','Sobe, Naná! Vem ver. Trinta anos de balde e agora tem degrau.'],
         ['','O risco atravessa a casa 12 e a casa 14.']],()=>{F.st='jogo';});
  },
  anim(tt){FS.bet.rotation.y=tt*2;},
  tick(dt){
    const F=FS;if(F.st!=='jogo'&&F.st!=='livre')return;
    /* subir degrau andando; não atravessar a escada por baixo */
    const h=F.perf(PJ.x);
    if(PJ.y<h-.001){if(h-PJ.y<=.36&&PJ.vy<=.6){PJ.y=h;PJ.vy=0;PJ.chao=true;}else PJ.x=F.px;}
    F.px=PJ.x;
    /* vão de porta: segurando E, Naná entra e o rolo passa */
    const vao=F.vaos.find(v=>Math.abs(PJ.x-v)<.42),noAlto=PJ.x>12.5&&PJ.y>=F.topo-.01;
    PJ.esc=!!vao&&!noAlto&&PJ.chao&&fk.has('KeyE');
    if(PJ.esc)PJ.vx=0;
    F.pz+=((PJ.esc?-.6:0)-F.pz)*Math.min(1,dt*14);PJ.z=F.pz;
    if(F.st!=='jogo'){F.dica=null;return;}
    F.tRolo-=dt;F.tCone-=dt;
    const vivos=F.ini.filter(e=>e.morre<=0);
    if(F.tRolo<=0){F.tRolo=9;inimigo('rolo',12.3,F.topo);recado('O rolo vem descendo. Segure E num vão de porta ou pule por cima.',2.6);}
    if(F.tCone<=0&&vivos.filter(e=>e.tipo==='cone').length<3){F.tCone=6;inimigo('cone',11.9,F.topo);}
    if(noAlto){F.dica='E · falar com Dona Marlene';if(usouE)this.decide(F);}
    else F.dica=vao?'Segure E para entrar no vão da porta':null;
  },
  decide(F){
    F.st='decisao';
    diz([['Dona Marlene','Tá vendo? Agora vem. Só que o risco passa por dentro da 12 e da 14, e o moço diz que é o traçado mais adequado.',[
      {t:'Negociar o trajeto com a rua.',off:G.voz.size<1?'ninguém está com você ainda; precisa de Voz 1':null,fn:()=>{G.flags.acordo=true;G.voz.add('marlene');hud();resolve(3,[
        ['','Quem veio com Naná para na frente da máquina. O risco é apagado com o pé e refeito mais à esquerda, entre os muros.'],
        ['Dona Marlene','Escada por onde a rua quis. Eu subo pra laje pra garantir.']]);}},
      {t:'Bloquear a obra.',fn:()=>{G.flags.marleneDesce=true;soma('medida',-10);resolve(3,[
        ['','Naná fecha o registro da betoneira. O concreto endurece no tambor.'],['Dona Marlene','Então tu me deve trinta anos de balde. Na laje eu não piso.']]);}},
      {t:'Deixar passar.',fn:()=>{G.voz.add('marlene');F.casas.forEach(p=>{if(!p.med){p.med=true;p.ms.forEach(m=>m.material=M.planta);}});soma('medida',25);resolve(3,[
        ['','O rolo desce uma última vez. A 12 e a 14 ficam no chão, desenhadas em escala.'],['Dona Marlene','Vai ter escada. Eu queria que fosse de outro jeito, mas vai ter.']]);}},
      {t:'Ainda não. Descer de volta.',fn:()=>{F.st='jogo';}}
    ]]]);
  }
};

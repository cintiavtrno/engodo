/* ================================================================
   FASE 4 — A OBRA (Escadaria)
   Uma escada de mármore que não chega em porta nenhuma.
   ================================================================ */
function marmoreTex(){
  const [c,x]=mk(512,512);
  x.fillStyle='#ebe8e1';x.fillRect(0,0,512,512);mottle(x,512,512,14);
  for(let i=0;i<26;i++){
    x.strokeStyle='rgba(120,125,135,'+(.12+R()*.25).toFixed(2)+')';x.lineWidth=.6+R()*2.2;x.beginPath();
    let px=R()*512,py=R()*512;x.moveTo(px,py);for(let k=0;k<6;k++){px+=rr(-90,90);py+=rr(20,90);x.lineTo(px,py);}x.stroke();
  }
  speckle(x,512,512,900,['#fff','#8a8f98'],2,.03,.12);
  return c;
}
FASES[3]={x0:0,x1:13.6,H:7.8,inicio:.6,
  monta(F){
    F.alta=true;F.semDrop=true;F.margemD=3.2;
    const N=14,sx=1.2,run=.8,rise=.3,W=F.x1,topo=N*rise,FIM=11.6;
    F.topo=topo;
    F.perf=x=>x<sx?0:Math.min(N,Math.floor((x-sx)/run)+1)*rise;
    lbox(19,.3,3.4,8.5,-.15,-.3,M.rua,3);
    roomScene.add(new T.HemisphereLight(0xffffff,0x9a8f85,.8));
    const d=new T.DirectionalLight(0xfff1de,1.0);d.position.set(W/2+4,12,9);d.target.position.set(W/2,3,-.5);d.castShadow=true;d.shadow.mapSize.set(2048,2048);
    const s=d.shadow.camera;s.left=-11;s.right=11;s.top=9;s.bottom=-7;s.near=1;s.far=36;d.shadow.bias=-.0005;roomScene.add(d,d.target);
    /* escada de mármore. Até FIM ela tem corpo; os três últimos degraus ficam soltos no ar */
    const marm=matOf(marmoreTex(),.32);
    for(let i=0;i<N;i++){
      const x0=sx+i*run,y=(i+1)*rise,x1=i===N-1?W:x0+run;
      if(x0<FIM-.01)lbox(FIM-x0,rise,1.5,(x0+FIM)/2,y-rise/2,-.05,marm,3);
      else lbox(x1-x0+.02,.12,1.5,(x0+x1)/2,y-.06,-.05,marm,3);
      lbox(x1-x0,.035,1.56,(x0+x1)/2,y+.0175,-.05,marm,3);
      F.plat.push({x0,x1,y});
    }
    /* casas da ladeira: as portas ficam ao lado da escada, sem ligação com ela */
    const ocre=matOf(plaster('#b08f58',['#8a4f3a','#d0b98a'],7,true,'70,50,35')),verde=matOf(plaster('#7f8a6a',['#8a4a38','#a9b08f'],7,true,'50,55,40')),
          barro=matFig(tecido('#9a5a3c',{})),folha=matFig(tecido('#5f7a4a',{barra:false}));
    const placa=n=>texto(96,64,(c)=>{c.fillStyle='#14202c';c.fillRect(0,0,96,64);c.fillStyle='#e8dcc4';c.font='700 40px system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(n,48,34);});
    F.vaos=[];F.casas=[];
    [[1.3,M.pink,'10'],[4.4,ocre,'12'],[7.5,verde,'14']].forEach(([x0,m,num])=>{
      const x1=x0+2.9,base=F.perf(x0+1.45),h=base+3.3,dx=x0+.85,dy=F.perf(dx),wx=x0+2.05,wy=F.perf(wx)+1.75;
      const ms=[lbox(2.9,h,.6,(x0+x1)/2,h/2,-1.15,m,3),lbox(3.05,.12,.75,(x0+x1)/2,h+.06,-1.1,M.conc,3),
                lbox(.82,1.3,.08,dx,dy+.65,-.84,M.conc,3),lbox(.76,.92,.06,wx,wy,-.84,M.conc,3)];
      lplano(new T.CanvasTexture(doorwayTex()),.68,1.18,dx,dy+.6,-.795,0);
      lplano(new T.CanvasTexture(windowBarred()),.62,.78,wx,wy,-.805,0);
      lplano(placa(num),.3,.2,dx,dy+1.5,-.8,0);
      const p=prop(ms,x0,x1,0,h);p.rolo=true;F.vaos.push(dx);F.casas.push(p);
    });
    [3.05,6.25,9.45].forEach(x=>{const y=F.perf(x),ms=[lcyl(.14,.1,.26,x,y+.13,-.6,barro,8)];
      [[-.04,.42,.3],[.05,.36,-.4],[0,.5,0]].forEach(([ox,hh,a])=>{const l=lmesh(new T.ConeGeometry(.06,hh,5),folha,x+ox,y+.26+hh/2,-.6);l.rotation.z=a*.5;ms.push(l);});
      const p=prop(ms,x-.2,x+.2,y,y+.75);p.rolo=true;});
    /* a casa de Dona Marlene: adiante e lá embaixo, sem degrau que chegue nela */
    lbox(2.6,3.0,.7,15.5,1.5,-1.1,M.pink,3);lbox(2.75,.12,.85,15.5,3.06,-1.05,M.conc,3);
    lbox(.82,1.3,.08,15.0,.65,-.74,M.conc,3);lplano(new T.CanvasTexture(doorTex()),.66,1.18,15.0,.62,-.695,0);
    lbox(.76,.92,.06,16.1,1.7,-.74,M.conc,3);lplano(new T.CanvasTexture(windowCurtain()),.62,.78,16.1,1.7,-.705,0);
    lplano(placa('16'),.3,.2,15.0,1.5,-.7,0);
    /* os homens da Fila, a betoneira e o mármore que ainda vai subir */
    lbox(.55,.5,.55,12.6,.25,-.9,M.planta,1);
    const bt=lmesh(new T.CylinderGeometry(.3,.38,.6,10),M.planta,12.6,.8,-.9);bt.rotation.z=.5;F.bet=bt;
    lmesh(new T.BoxGeometry(.62,.08,.62),M_LARANJA,12.6,.52,-.9);
    [0,1,2].forEach(k=>lbox(.8,.12,.5,13.6,.06+k*.13,-.2,marm,3));
    F.ops=criarFila(3,{x0:11.9,x1:14.3,z:.25});roomScene.add(F.ops.root);F.figs.push(F.ops);
    const mm=porId('marlene');mm.fora=true;roomScene.add(marlene.root);marlene.root.position.set(13.2,topo,-.3);marlene.root.rotation.y=rad(60);F.figs.push(marlene);
    F.tRolo=6;F.tCone=3;F.px=F.inicio;F.pz=0;
  },
  comeca(F){
    diz([['','Os homens da Fila estão fazendo uma escada de mármore na ladeira. É a escada mais bonita que a rua já viu.'],
         ['Dona Marlene','Sobe, Naná! Vem ver de perto. Trinta anos de balde nessa ladeira.']],()=>{F.st='jogo';});
  },
  anim(tt){FS.bet.rotation.y=tt*2;},
  tick(dt){
    const F=FS;if(F.st!=='jogo'&&F.st!=='livre')return;
    /* subir degrau andando; não atravessar a escada por baixo */
    const h=F.perf(PJ.x);
    if(PJ.y<h-.001){if(h-PJ.y<=.36&&PJ.vy<=.6){PJ.y=h;PJ.vy=0;PJ.chao=true;}else PJ.x=F.px;}
    F.px=PJ.x;
    /* porta: segurando E, Naná se esconde e o rolo passa */
    const vao=F.vaos.find(v=>Math.abs(PJ.x-v)<.42),noAlto=PJ.x>12.4&&PJ.y>=F.topo-.01;
    PJ.esc=!!vao&&!noAlto&&PJ.chao&&fk.has('KeyE');
    if(PJ.esc)PJ.vx=0;
    F.pz+=((PJ.esc?-.6:0)-F.pz)*Math.min(1,dt*14);PJ.z=F.pz;
    if(F.st!=='jogo'){F.dica=null;return;}
    F.tRolo-=dt;F.tCone-=dt;
    const vivos=F.ini.filter(e=>e.morre<=0);
    if(F.tRolo<=0){F.tRolo=9;inimigo('rolo',11.4,F.perf(11.4));recado('O rolo compressor vem descendo. Segure E em frente a uma porta para se esconder, ou pule por cima.',2.8);}
    if(F.tCone<=0&&vivos.filter(e=>e.tipo==='cone').length<3){F.tCone=6;inimigo('cone',11.2,F.perf(11.2));}
    if(noAlto){F.dica='E · falar com Dona Marlene';if(usouE)this.decide(F);}
    else F.dica=vao?'Segure E para se esconder na porta':null;
  },
  decide(F){
    F.st='decisao';
    diz([['','A escada acaba aqui. O último degrau fica solto no ar. A porta de Dona Marlene está adiante, lá embaixo, e nenhum degrau chega nela.'],
      ['Dona Marlene','É linda, né? Mármore, igual de igreja. O desenho veio pronto de longe. Quem desenhou nunca subiu esta ladeira.',[
      {t:'Chamar os vizinhos para emendar a escada até as portas.',c:"Pede pelo menos um vizinho com você. A escada passa a chegar nas portas e Dona Marlene vai à reunião.",off:G.voz.size<1?'você ainda não tem nenhum vizinho do seu lado':null,fn:()=>{G.flags.acordo=true;G.voz.add('marlene');hud();resolve(3,[
        ['','Os vizinhos trazem tábua, tijolo e um resto de cimento. A emenda sai torta e de outra cor, mas chega na porta de cada casa.'],
        ['Dona Marlene','Agora dá pra subir com o balde. Eu vou pra reunião.']],"A rua terminou por conta própria a escada que veio pela metade. Dona Marlene sobe sem balde na cabeça e vai à reunião.",["EMENDADA", "A rua terminou a escada sozinha. Para a Fila, o projeto original continua sendo o mais bonito."]);}},
      {t:'Parar a obra.',c:"A Medida cai 10. Dona Marlene fica sem escada e não vai à reunião.",fn:()=>{G.flags.marleneDesce=true;soma('medida',-10);resolve(3,[
        ['','Naná desliga a betoneira. Os homens da Fila guardam as ferramentas e descem sem dizer nada. A escada fica como está.'],
        ['Dona Marlene','E eu volto pro balde. Hoje eu não vou pra reunião, não.']],"Sem obra, o rolo não mede mais nenhuma casa. Dona Marlene continua com o balde na ladeira e ficou magoada com Naná.",["PARADA", "A obra parou a pedido. O mármore volta para o depósito."]);}},
      {t:'Deixar a obra seguir.',c:"Dona Marlene vai à reunião. A Medida sobe 25, porque o rolo continua passando pelas casas.",fn:()=>{G.voz.add('marlene');F.casas.forEach(p=>{if(!p.med){p.med=true;p.ms.forEach(m=>m.material=M.planta);}});soma('medida',25);resolve(3,[
        ['','A obra segue. O rolo desce mais uma vez pela ladeira. A escada de mármore fica pronta e continua sem chegar em porta nenhuma.'],
        ['Dona Marlene','Pelo menos é bonita de olhar. Eu vou pra reunião. Quero perguntar pra que ela serve.']],"A escada foi entregue e não leva a porta nenhuma. O rolo mediu as casas da ladeira pelo caminho. Dona Marlene vai à reunião para perguntar pra que serve o mármore.",["ENTREGUE", "Escada entregue no prazo. A porta fica para a próxima etapa."]);}},
      {t:'Ainda não. Descer de volta.',fn:()=>{F.st='jogo';}}
    ]]]);
  }
};

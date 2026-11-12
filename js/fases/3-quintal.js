/* ================================================================
   FASE 3 — TEMPOS MODERNOS (Quintal)
   ================================================================ */
function lzinco(W,Hh,cx,y0,z){
  const g=new T.PlaneGeometry(W,Hh,Math.round(W*12),1),p=g.attributes.position;
  for(let i=0;i<p.count;i++)p.setZ(i,Math.sin(p.getX(i)*18)*.03);
  g.computeVertexNormals();
  const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*W/3,uv.getY(i)*Hh/3);
  return lmesh(g,M.rust,cx,y0+Hh/2,z);
}
FASES[2]={x0:0,x1:13.2,H:4.8,inicio:.9,
  monta(F){
    const terra=matOf(plaster('#8a7558',['#75624a','#a08b6a'],8,false,'50,40,30')),borr=matFig(tecido('#2b2a29',{barra:false})),
          balde=matFig(tecido('#5b86ae',{barra:false})),ferro=matOf(rustTex(),.7,.35);
    balde.side=T.DoubleSide;
    const W=F.x1-F.x0,cx=W/2,EY=.4,E0=2.1,E1=10.3;
    F.EY=EY;F.E0=E0;F.E1=E1;F.vEst=G.flags.esteiraTravada?0:1.5;
    /* quintal a céu aberto: chão de terra, muro de zinco, parede da casa à esquerda, muro de bloco à direita */
    lbox(W+.6,.3,3.4,cx,-.15,-.3,terra,3);
    lzinco(W+.6,2.7,cx,0,-1.9);
    for(let x=.2;x<W;x+=2.1)lbox(.1,2.9,.1,x,1.45,-1.82,M.dark,1);
    lbox(W+.6,.08,.1,cx,2.55,-1.82,M.dark,1);
    lbox(.3,3.4,3.4,-.15,1.7,-.3,M.tan,3);
    lbox(.08,1.6,.86,.04,.8,-.5,M.conc,3);
    lplano(new T.CanvasTexture(doorTex()),.7,1.45,.09,.78,-.5,Math.PI/2);
    lbox(.3,2.5,3.4,W+.15,1.25,-.3,M.stone,2.2);
    roomScene.add(new T.HemisphereLight(0xffffff,0x9a8f85,.8));
    const d=new T.DirectionalLight(0xfff1de,1.0);d.position.set(cx+4,9,8);d.target.position.set(cx,1,-.5);d.castShadow=true;d.shadow.mapSize.set(2048,2048);
    const s=d.shadow.camera;s.left=-9;s.right=9;s.top=7;s.bottom=-5;s.near=1;s.far=32;d.shadow.bias=-.0005;roomScene.add(d,d.target);
    /* a esteira: o chão anda para trás */
    lbox(E1-E0,.3,1.1,(E0+E1)/2,EY-.17,-.05,borr,2);
    for(let x=E0+.4;x<E1;x+=1.3){lbox(.08,EY-.3,.08,x,(EY-.3)/2,.42,ferro,1);lbox(.08,EY-.3,.08,x,(EY-.3)/2,-.52,ferro,1);}
    [E0,E1].forEach(x=>{const g=new T.CylinderGeometry(.19,.19,1.14,10);g.rotateX(Math.PI/2);lmesh(g,ferro,x,EY-.19,-.05);});
    F.estT=texto(128,128,(x)=>{x.fillStyle='#34322f';x.fillRect(0,0,128,128);x.strokeStyle='rgba(215,205,185,.5)';x.lineWidth=7;
      x.beginPath();x.moveTo(84,10);x.lineTo(44,64);x.lineTo(84,118);x.stroke();speckle(x,128,128,260,['#000','#fff'],2);});
    F.estT.wrapS=F.estT.wrapT=T.RepeatWrapping;F.estT.repeat.set(E1-E0,1);
    const eg=new T.PlaneGeometry(E1-E0,1.08);eg.rotateX(-Math.PI/2);
    const em=new T.Mesh(eg,new T.MeshStandardMaterial({map:F.estT,roughness:.85}));em.position.set((E0+E1)/2,EY-.018,-.05);em.receiveShadow=true;roomScene.add(em);
    F.est={x0:E0,x1:E1,y:EY,vx:-F.vEst};F.plat.push(F.est);
    /* estrado do turno, no fim da esteira, onde Binho trabalha */
    lbox(1.5,.08,1.5,11.05,EY-.04,-.3,M.wood,1.5);
    [[10.4,.38],[11.7,.38],[10.4,-.98],[11.7,-.98]].forEach(([x,z])=>lbox(.09,EY-.08,.09,x,(EY-.08)/2,z,M.dark,1));
    F.plat.push({x0:E1,x1:11.8,y:EY});
    /* baldes que vêm pela esteira e servem de degrau móvel */
    F.baldes=[];
    for(let k=0;k<5;k++){
      const g=new T.Group();roomScene.add(g);
      const b=new T.Mesh(new T.CylinderGeometry(.2,.15,.3,10,1,true),balde);b.position.y=.15;b.castShadow=true;g.add(b);
      const f=new T.Mesh(new T.CylinderGeometry(.15,.15,.012,10),balde);f.position.y=.006;g.add(f);
      /* os baldes da esteira andam vazios */
      const p={x0:0,x1:0,y:EY+.3,vx:-F.vEst};F.plat.push(p);F.baldes.push({x:E0+.6+k*(E1-E0)/5,g,p});
    }
    /* andaimes de carga: plataformas fixas por cima da esteira, antes de cada catraca */
    [[3.2,4.1],[5.7,6.6],[8.1,9.0]].forEach(([a,b])=>{
      const ms=[lbox(b-a,.07,1.3,(a+b)/2,1.015,-.35,M.wood,1.5)];
      [a+.05,b-.05].forEach(x=>{ms.push(lbox(.07,1.0,.07,x,.5,-.95,M.dark,1));});
      ms.push(lbox(b-a,.06,.06,(a+b)/2,.6,-.95,M.dark,1),lbox(.34,.26,.34,a+.3,1.18,-.7,M.wood,1));
      prop(ms,a,b,.95,1.35);F.plat.push({x0:a,x1:b,y:1.05});
    });
    /* tanque de lavar, pilha de baldes, varal, caixa d'água pequena */
    { const ms=[lbox(1.0,.42,.6,1.0,.66,-.95,M.conc,2),lbox(.9,.06,.5,1.0,.9,-.95,M.conc,2)];[[.58],[1.42]].forEach(([x])=>ms.push(lbox(.1,.45,.5,x,.225,-.95,M.conc,2)));
      ms.push(lcyl(.02,.02,.3,1.35,1.05,-1.15,ferro,6));prop(ms,.5,1.5,0,1.0); }
    { const ms=[0,1,2].map(k=>{const b=lmesh(new T.CylinderGeometry(.2,.15,.3,10,1,true),balde,1.82,.15+k*.1,-.75);return b;});prop(ms,1.6,2.04,0,.55); }
    { const ms=[lbox(.08,3.0,.08,2.4,1.5,-1.35,M.dark,1),lbox(.08,3.0,.08,6.2,1.5,-1.35,M.dark,1),lbox(3.8,.012,.012,4.3,2.92,-1.35,borr,1)];
      F.roupas=[];
      [['#96564f',2.9,.5,.62],['#d8cfba',3.55,.42,.5],['#7f8674',4.2,.55,.7],['#b39450',4.95,.4,.45],['#8e7c96',5.6,.5,.58]].forEach(([c,x,w,h],k)=>{
        const m=matFig(tecido(c,k%2?{flor:CHITA}:{listraV:'rgba(235,225,205,.35)'}));m.side=T.DoubleSide;
        const g=new T.Group();g.position.set(x,2.92,-1.35);roomScene.add(g);
        const r=new T.Mesh(new T.PlaneGeometry(w,h),m);r.position.y=-h/2;r.castShadow=true;g.add(r);F.roupas.push(g);ms.push(r);
      });
      prop(ms,2.4,6.2,2.2,3.0);
    }
    { const ms=[lbox(.8,.7,.8,7.4,1.75,-1.3,M.tank,3),lbox(.9,.06,.9,7.4,2.13,-1.3,M.wood,1.5),lbox(.95,.07,.95,7.4,1.37,-1.3,M.wood,1.5)];
      [[7.0,-.9],[7.8,-.9],[7.0,-1.7],[7.8,-1.7]].forEach(([x,z])=>ms.push(lbox(.08,1.35,.08,x,.675,z,M.dark,1)));prop(ms,6.95,7.85,0,2.2); }
    /* relógio de ponto: marca a batida e cospe cartões */
    lbox(.8,2.1,.5,12.45,1.05,-.6,M.planta,2);
    lmesh(new T.BoxGeometry(.84,.14,.54),M_LARANJA,12.45,2.17,-.6);
    /* boca dos cartões, no fim da esteira: quem está no estrado fica fora da linha de tiro */
    lbox(.16,.5,.2,E1,EY+.25,-.62,M.planta,1);lmesh(new T.BoxGeometry(.05,.05,.3),M_LARANJA,E1-.09,EY+.3,-.5);
    const dg=new T.CylinderGeometry(.28,.28,.05,14);dg.rotateX(Math.PI/2);
    lmesh(dg,[M.dark,new T.MeshStandardMaterial({map:texto(128,128,(x)=>{x.fillStyle='#f2f0e9';x.fillRect(0,0,128,128);x.strokeStyle='#2a2623';x.lineWidth=4;
      for(let i=0;i<12;i++){const a=i/12*6.283;x.beginPath();x.moveTo(64+Math.cos(a)*44,64+Math.sin(a)*44);x.lineTo(64+Math.cos(a)*56,64+Math.sin(a)*56);x.stroke();}}),roughness:.6}),M.dark],12.45,1.55,-.33);
    F.pont=new T.Group();F.pont.position.set(12.45,1.55,-.29);roomScene.add(F.pont);
    const pm=new T.Mesh(new T.BoxGeometry(.03,.24,.012),M_LARANJA);pm.position.y=.1;F.pont.add(pm);
    /* catracas na esteira */
    F.cats=F.feita?[]:[4.4,6.9,9.3].map(x=>inimigo('catraca',x,EY));
    /* Binho na linha */
    const bn=porId('binho');bn.fora=true;roomScene.add(binho.root);binho.root.position.set(10.95,EY,-.72);binho.root.rotation.y=rad(-35);F.figs.push(binho);
    F.bt=0;F.nb=0;F.px=F.inicio;F.etq=0;
  },
  comeca(F){
    diz([['','O quintal virou uma fábrica. A esteira carrega os baldes e empurra para trás quem pisa nela.'],
         ['Binho','Consegui emprego aqui, Naná. Meu serviço é passar a água de um balde pro outro. Chega vazio no fim, que o balde é furado. O relógio conta do mesmo jeito.'],
         ['','Para chegar até Binho, passe pelas catracas. Elas abrem quando o relógio de ponto bate. Você também pode pular por cima ou derrubar com água pelo lado de trás.']],
      ()=>{F.st='jogo';});
  },
  anim(tt,dt){
    const F=FS;
    F.roupas.forEach((g,k)=>{g.rotation.x=Math.sin(tt*1.3+k*.9)*.16;});
    F.baldes.forEach(b=>b.g.position.set(b.x,F.EY,0));
  },
  tick(dt,tt){
    const F=FS;if(F.st!=='jogo'&&F.st!=='livre')return;
    const v=F.vEst,L=F.E1-F.E0;
    /* esteira e baldes */
    F.estT.offset.x+=v*dt;F.est.vx=-v;
    F.baldes.forEach(b=>{b.x-=v*dt;if(b.x<F.E0+.25)b.x+=L-.5;b.p.x0=b.x-.2;b.p.x1=b.x+.2;b.p.vx=-v;});
    if(F.st!=='jogo')return;
    /* batida do relógio de ponto */
    const T0=2.2;F.bt+=dt;
    if(F.bt>=T0){
      F.bt-=T0;F.nb++;F.pont.rotation.z-=Math.PI/6;
      const vivos=F.ini.filter(e=>e.morre<=0);
      if(F.nb>=2&&vivos.filter(e=>e.tipo==='cartao').length<3)inimigo('cartao',F.E1-.15,F.EY+.3);
      if(F.nb%5===0&&F.etq<5&&vivos.filter(e=>e.tipo==='etiq').length<2){inimigo('etiq',12.3,1.9);F.etq++;}
    }
    const aberta=F.bt<.8;
    F.cats.forEach(c=>{
      c.aberta=aberta;
      if(c.morre<=0&&c.hp>0&&!aberta){const lim=c.x-.3;if(F.px<=lim+.001&&PJ.x>lim&&PJ.y<c.y+1.0){PJ.x=lim;PJ.vx=Math.min(0,PJ.vx);}}
    });
    F.px=PJ.x;
    /* falar com Binho */
    if(Math.abs(PJ.x-10.95)<.8&&PJ.y>=F.EY-.01&&PJ.y<F.EY+.2){
      F.dica='E · falar com Binho';
      if(usouE)this.decide(F);
    }else F.dica=aberta?null:null;
  },
  decide(F){
    F.st='decisao';
    const presas=F.cats.filter(c=>c.hp>0&&c.morre<=0).length;
    diz([['Binho','Naná, meu braço já está doendo. Mas se eu sair antes da hora, não recebo o dia.',[
      {t:'Tirar Binho da linha.',c:"Binho vai à reunião. Ele perde o pagamento do dia.",off:presas?'as catracas não deixam ele sair; derrube todas por trás':null,fn:()=>{G.voz.add('binho');G.flags.binhoSemDia=true;hud();resolve(2,[
        ['Binho','Saí. Perdi o pagamento de hoje. Disso eu vou falar na reunião.'],['','O braço de Binho ainda repete o movimento sozinho por um tempo.']],"Binho saiu da esteira e vai à reunião. Ficou sem o dia de salário e talvez sem a vaga. Ele vai falar disso na frente de todo mundo.",["SAIU", "Binho largou o balde. Já tem outro rapaz no lugar dele."]);}},
      {t:'Trabalhar um turno ao lado dele.',c:"A caixa ganha 200 litros. O dia fica uma hora mais curto e Binho continua na esteira.",fn:()=>{G.flags.turno=true;soma('agua',200);resolve(2,[
        ['','Naná trabalha um turno na esteira. Recebe duzentos litros de água como pagamento e perde uma hora do dia.'],['Binho','Com esse emprego dá pra pagar as contas. O ruim é que não sobra tempo nem força pra mais nada.']],"O turno rendeu 200 litros para a caixa da rua. Binho continua na esteira e não vai à reunião. O dia de Naná ficou uma hora mais curto.",["META", "Duzentos litros por um turno de trabalho. Sobre o braço de Binho, a Fila não tem registro."]);}},
      {t:'Travar a esteira.',c:"Ninguém se machuca hoje. Binho fica sem turno e não vai à reunião.",fn:()=>{G.flags.esteiraTravada=true;F.vEst=0;resolve(2,[
        ['','Naná trava a engrenagem e a esteira para.'],['Binho','Amanhã eles consertam.'],['Naná','Pelo menos hoje ninguém se machuca nela.']],"A esteira parou por hoje. Binho ficou sem turno, sem salário e sem motivo para ir à reunião. Amanhã ela volta a rodar.",["PAROU", "A esteira descansa hoje. No domingo, ela desconta."]);}},
      {t:'Ainda não. Voltar para a esteira.',fn:()=>{F.st='jogo';}}
    ]]]);
  }
};

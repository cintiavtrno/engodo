/* ================================================================
   FASE 2 — COMPRADORA (Sala)
   ================================================================ */
FASES[1]={x0:0,x1:10.8,H:3.9,inicio:.8,
  monta(F){
    const H=F.H,piso=new T.MeshStandardMaterial({map:texto(256,256,(x)=>{x.fillStyle='#d9d2c0';x.fillRect(0,0,256,256);mottle(x,256,256,8);
            x.strokeStyle='rgba(90,80,65,.5)';x.lineWidth=2;for(let i=0;i<=256;i+=64){x.beginPath();x.moveTo(i,0);x.lineTo(i,256);x.moveTo(0,i);x.lineTo(256,i);x.stroke();}speckle(x,256,256,500,['#000','#fff'],2);}),roughness:.28,metalness:.05});
    piso.map.wrapS=piso.map.wrapT=T.RepeatWrapping;
    const estofo=matFig(tecido('#a88a52',{trama:true})),estofo2=matFig(tecido('#8f7446',{})),verde=matFig(tecido('#5f7a4a',{barra:false})),
          barro=matFig(tecido('#9a5a3c',{})),metal=new T.MeshStandardMaterial({color:corLin(0x8a8d8f),roughness:.45,metalness:.6}),
          preto=matFig(tecido('#232425',{barra:false})),creme=matFig(tecido('#d8cfba',{barra:false})),tap=matFig(tecido('#8c3b2d',{listraV:'rgba(230,215,185,.35)'}));
    palco(F.x0,F.x1,H,M.pink,piso,M.conc);
    luzes(F.x0,F.x1,H,0xf4f6ff,.8,.85);
    /* luz branca de loja */
    [1.8,4.6,7.4,9.6].forEach(x=>{const p=new T.PointLight(0xffffff,.5,7);p.position.set(x,H-.5,.6);roomScene.add(p);
      lcyl(.09,.14,.14,x,H-.07,.2,metal,8);});
    const z=-.75;
    /* etiquetas de preço penduradas */
    const tt=texto(64,96,(x)=>{x.fillStyle='#f2f0e9';x.fillRect(0,0,64,96);x.fillStyle='#f07a1c';x.fillRect(0,0,64,16);
      x.fillStyle='#2a2623';x.fillRect(10,30,12,20);x.fillRect(26,30,28,8);x.fillRect(26,42,20,8);x.fillRect(10,62,44,5);x.fillRect(10,72,30,5);});
    F.etq=[];const etq=(x,y,zz)=>{const g=new T.Group();g.position.set(x,y,zz);roomScene.add(g);
      const m=new T.Mesh(new T.PlaneGeometry(.11,.165),new T.MeshStandardMaterial({map:tt,side:T.DoubleSide,roughness:.8}));m.position.y=-.14;g.add(m);
      const f=new T.Mesh(new T.BoxGeometry(.004,.07,.004),preto);f.position.y=-.035;g.add(f);F.etq.push(g);};
    { // mesinha com telefone
      prop([lbox(.6,.05,.5,.5,.58,z,M.wood,1),lbox(.06,.56,.06,.5,.28,z,M.dark,1),lbox(.36,.04,.36,.5,.02,z,M.dark,1),lbox(.22,.09,.16,.5,.65,z,preto,1)],.2,.8,0,.72);etq(.78,.6,z+.26);
    }
    { // sofá
      const ms=[lbox(2.2,.3,.85,2.1,.3,z,estofo,2),lbox(2.2,.55,.22,2.1,.68,z-.33,estofo,2),lbox(.2,.5,.85,1.1,.4,z,estofo2,2),lbox(.2,.5,.85,3.1,.4,z,estofo2,2),
        lbox(.95,.12,.6,1.65,.5,z+.05,estofo2,2),lbox(.95,.12,.6,2.6,.5,z+.05,estofo2,2)];
      [1.1,3.1].forEach(x=>ms.push(lbox(.12,.14,.12,x,.07,z+.3,M.dark,1)));
      prop(ms,1.0,3.2,0,.95);F.plat.push({x0:1.0,x1:3.2,y:.95});etq(3.2,.62,z+.44);
    }
    { prop([lcyl(.16,.2,.04,3.6,.02,z,metal,10),lcyl(.018,.018,1.45,3.6,.75,z,metal,6),lcyl(.14,.24,.3,3.6,1.55,z,creme,10)],3.38,3.82,0,1.7);etq(3.6,1.4,z+.2); }
    { prop(lbox(2.2,.025,1.3,4.6,.013,-.35,tap,2),3.5,5.7,0,.05); }
    { const ms=[lbox(1.2,.06,.6,4.6,.4,z+.35,M.wood,1)];[[4.08,.1],[5.12,.1],[4.08,.6],[5.12,.6]].forEach(([x,dz])=>ms.push(lbox(.06,.38,.06,x,.19,z+dz,M.dark,1)));
      prop(ms,4.0,5.2,0,.43);F.plat.push({x0:4.0,x1:5.2,y:.43});etq(5.2,.4,z+.66); }
    { const ms=[lcyl(.17,.12,.34,5.65,.17,z,barro,8)];[[-.06,.7,.3],[.08,.62,-.4],[0,.78,0],[.1,.5,.7],[-.1,.52,-.8]].forEach(([dx,h,a])=>{const l=lmesh(new T.ConeGeometry(.07,h,5),verde,5.65+dx,.34+h/2,z);l.rotation.z=a*.5;ms.push(l);});
      prop(ms,5.42,5.88,0,1.1);etq(5.84,.36,z+.14); }
    { // estante: duas prateleiras servem de plataforma
      const ms=[lbox(.07,2.3,.5,6.03,1.15,z,M.dark,1),lbox(.07,2.3,.5,7.57,1.15,z,M.dark,1),lbox(1.6,.06,.5,6.8,2.3,z,M.wood,1)];
      [.25,1.05,1.85].forEach(y=>ms.push(lbox(1.5,.06,.9,6.8,y-.03,z+.2,M.wood,1)));
      [[6.3,1.05,.3],[6.55,1.05,.24],[6.72,1.05,.34],[7.2,1.85,.22],[7.38,1.85,.3],[6.4,.25,.26]].forEach(([x,y,h],k)=>ms.push(lbox(.12,h,.3,x,y+h/2,z-.05,k%2?creme:tap,1)));
      prop(ms,6.0,7.6,0,2.35);F.plat.push({x0:6.0,x1:7.6,y:1.05},{x0:6.0,x1:7.6,y:1.85});etq(7.62,1.7,z+.3);etq(6.0,.95,z+.3);
    }
    { const ms=[lcyl(.2,.24,.05,8.08,.025,z,metal,10),lcyl(.02,.02,1.1,8.08,.58,z,metal,6)];const g=new T.CylinderGeometry(.24,.24,.07,12);g.rotateX(Math.PI/2);ms.push(lmesh(g,metal,8.08,1.2,z+.05));
      F.helice=lmesh(new T.BoxGeometry(.4,.07,.02),creme,8.08,1.2,z+.1);ms.push(F.helice);prop(ms,7.84,8.32,0,1.45);etq(8.3,1.0,z+.15); }
    { prop([lbox(1.5,.5,.5,9.4,.3,z,M.wood,1),lbox(1.56,.05,.56,9.4,.575,z,M.dark,1),lbox(.6,.3,.02,9.05,.3,z+.26,M.dark,1),lbox(.6,.3,.02,9.75,.3,z+.26,M.dark,1)],8.6,10.2,0,.6);F.plat.push({x0:8.62,x1:10.18,y:.6});etq(8.62,.5,z+.3); }
    { const t=texto(256,180,(x)=>{x.fillStyle='#bfae8a';x.fillRect(0,0,256,180);x.fillStyle='#6f8a6a';x.fillRect(0,110,256,70);x.fillStyle='#8c3b2d';x.beginPath();x.arc(180,60,30,0,7);x.fill();
        x.fillStyle='#3d5f82';x.fillRect(0,96,256,16);mottle(x,256,180,6);speckle(x,256,180,500,['#000','#fff'],2);});
      prop([lbox(1.1,.8,.05,2.5,2.2,-1.67,M.dark,1),lplano(t,.98,.68,2.5,2.2,-1.64,0)],1.95,3.05,1.8,2.6);etq(3.02,1.85,-1.6); }
    { prop([lbox(1.0,1.0,.06,4.65,2.0,-1.67,M.conc,1),lplano(new T.CanvasTexture(windowCurtain()),.88,.88,4.65,2.0,-1.63,0)],4.15,5.15,1.5,2.5); }
    { const g=new T.CylinderGeometry(.2,.2,.05,12);g.rotateX(Math.PI/2);prop([lmesh(g,[M.dark,new T.MeshStandardMaterial({map:dialTex(),roughness:.6}),M.dark],6.8,3.1,-1.66)],6.58,7.02,2.88,3.32); }
    /* faixa da promoção */
    lplano(texto(512,96,(x)=>{x.fillStyle='#f07a1c';x.fillRect(0,0,512,96);x.fillStyle='#fff6ea';x.font='800 54px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('KIT CIDADÃ · 12×',256,50);}),2.4,.45,9.3,3.2,-1.68,0,.5);
    /* televisão: a porta dos Etiquetadores */
    lbox(1.5,.95,.1,9.4,1.25,z-.1,preto,1);lbox(.5,.1,.3,9.4,.66,z-.1,preto,1);
    const [tc,tx]=mk(256,160);F.tvx=tx;F.tvt=new T.CanvasTexture(tc);F.tvt.encoding=T.sRGBEncoding;
    F.tv=new T.Mesh(new T.PlaneGeometry(1.38,.83),new T.MeshStandardMaterial({map:F.tvt,emissive:0xffffff,emissiveMap:F.tvt,emissiveIntensity:.9,roughness:.4}));
    F.tv.position.set(9.4,1.25,z-.04);roomScene.add(F.tv);
    F.tvLuz=new T.PointLight(0xffb070,.9,6);F.tvLuz.position.set(9.3,1.3,.3);roomScene.add(F.tvLuz);
    F.tvOn=true;F.onda=-1;F.tOnda=0;F.fila=0;F.tSolta=0;
    /* Jéssica, em pé na frente do sofá */
    const j=porId('jessica');j.fora=true;roomScene.add(jessica.root);jessica.root.position.set(2.1,0,-.3);jessica.root.rotation.y=rad(70);F.figs.push(jessica);
  },
  comeca(F){
    diz([['','A sala da casa virou uma loja. Todos os móveis estão com etiqueta de preço.'],
         ['Televisão','Naná, seu CPF foi pré-aprovado. Leve o kit cidadã em doze vezes.'],
         ['Jéssica','Olha, Naná, meu nome apareceu na tela também. Nunca nenhuma loja me deu crédito.'],
         ['Naná','Eu não passei meu CPF pra ninguém. Como é que a televisão sabe?'],
         ['','Os Etiquetadores vão sair da televisão e pôr preço nas coisas da casa. Derrube com água e limpe o que eles marcarem.']],
      ()=>{F.st='jogo';F.onda=0;F.fila=2;F.tSolta=.5;});
  },
  anim(tt,dt){
    const F=FS,x=F.tvx;
    /* tela redesenhada a cada quadro */
    if(F.tvOn){
      x.fillStyle='#1c1410';x.fillRect(0,0,256,160);
      const g=x.createLinearGradient(0,0,256,160);g.addColorStop(0,'#f07a1c');g.addColorStop(1,'#8c3b2d');x.fillStyle=g;x.fillRect(6,6,244,148);
      x.fillStyle='#fff6ea';x.textAlign='center';x.textBaseline='middle';
      const k=Math.floor(tt*.7)%3;
      x.font='800 34px system-ui,sans-serif';x.fillText(['NANÁ','KIT CIDADÃ','SUA VEZ'][k],128,56);
      x.font='700 20px system-ui,sans-serif';x.fillText(['CPF ●●●.●●●.●47-●●','12× SEM ENTRADA','VAI CHEGAR'][k],128,100);
      x.fillStyle='rgba(0,0,0,.18)';for(let y=(tt*40)%6;y<160;y+=6)x.fillRect(0,y,256,2);
      F.tvLuz.intensity=.75+Math.sin(tt*11)*.15;
    }else{x.fillStyle='#0b0a09';x.fillRect(0,0,256,160);F.tvLuz.intensity=0;F.tv.material.emissiveIntensity=.05;}
    F.tvt.needsUpdate=true;
    F.etq.forEach((g,k)=>{g.rotation.z=Math.sin(tt*1.6+k*1.3)*.22;g.rotation.x=Math.sin(tt*1.1+k)*.1;});
    F.helice.rotation.z=tt*9;
  },
  tick(dt,tt){
    const F=FS;if(F.st!=='jogo')return;
    const vivos=F.ini.filter(e=>e.morre<=0).length;
    if(F.fila>0){F.tSolta-=dt;if(F.tSolta<=0){inimigo('etiq',9.4,1.25);F.fila--;F.tSolta=1.1;}}
    else if(vivos===0&&F.ini.length===0){
      F.tOnda+=dt;
      if(F.tOnda>1.6){
        F.tOnda=0;F.onda++;
        if(F.onda>=3){this.decide(F);return;}
        F.fila=[2,3,4][F.onda];F.tSolta=.3;recado('Saíram mais Etiquetadores da televisão.',1.8);
      }
    }
    F.dica=null;
  },
  decide(F){
    F.st='decisao';
    diz([['','A televisão parou de soltar etiquetas. Agora ela espera uma resposta.'],
      ['Jéssica','E aí, Naná, assina comigo? Sozinha eles não aprovam meu cadastro.',[
      {t:'Assinar o crediário junto com ela.',fn:()=>{G.voz.add('jessica');soma('medida',15);resolve(1,[
        ['Jéssica','Assinado. Hoje à noite eu vou pra reunião na laje com você.'],['Televisão','Parabéns. Agora vocês têm uma dívida de doze meses.']]);}},
      {t:'Desligar a televisão.',fn:()=>{F.tvOn=false;G.flags.radio=true;G.flags.zeConfia=true;G.flags.jessicaContra=true;hud();resolve(1,[
        ['','A televisão apaga. O rádio de Seu Zé volta a funcionar no lugar da propaganda.'],['Jéssica','Você tirou a chance que eu tinha de comprar alguma coisa. Fiquei chateada.']]);}},
      {t:'Chamar Jéssica para vender geladinho para o povo da Fila.',fn:()=>{G.voz.add('jessica');soma('agua',-100);resolve(1,[
        ['Jéssica','Fechado. Você entra com cem litros de água e eu com o isopor.'],['Naná','Tem muita gente parada nessa fila. Dá pra ganhar um dinheiro sem ficar devendo.']]);}}
    ]]]);
  }
};


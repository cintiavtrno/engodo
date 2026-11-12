/* ================================================================
   FASE 1 — LEITURA (Garagem)
   ================================================================ */
FASES[0]={x0:0,x1:12.4,H:4.5,inicio:.9,
  monta(F){
    const H=F.H,ferro=matOf(rustTex(),.7,.35),lona=matFig(tecido('#6f6a5e',{trama:true})),
          pap=matOf(plaster('#a08a63',['#8a744f','#b9a47c'],4,false,'60,45,30')),
          branco=matOf(plaster('#c9c5b8',['#a9a59a','#8f6a4a'],6,false,'70,50,35')),
          borr=matFig(tecido('#2b2a29',{barra:false}));
    palco(F.x0,F.x1,H,M.stone,M.conc,M.conc);
    luzes(F.x0,F.x1,H,0xffe8c8,.75,.55);
    [[3,3.6],[9.2,3.6]].forEach(([x,y])=>{const p=new T.PointLight(0xffc98a,.7,9);p.position.set(x,y,.4);roomScene.add(p);
      lcyl(.008,.008,H-y-.1,x,(H+y)/2+.05,.0,borr,4);lmesh(new T.IcosahedronGeometry(.06,1),new T.MeshStandardMaterial({color:0xffe2a8,emissive:0xffcf7a,emissiveIntensity:.9}),x,y,.0);});
    /* portão por dentro, na parede da esquerda, com a luz da rua nas frestas */
    lplano(new T.CanvasTexture(garageTex()),2.6,1.9,.012,.95,-.35,Math.PI/2);
    /* canos: três linhas que servem de plataforma */
    const cano=(x0,x1,y)=>{
      const g=new T.CylinderGeometry(.085,.085,x1-x0,8);g.rotateZ(Math.PI/2);lmesh(g,ferro,(x0+x1)/2,y-.085,0);
      for(let x=x0+.3;x<x1;x+=1.1){lbox(.06,.06,1.75,x,y-.085,-.85,ferro,1);lcyl(.11,.11,.05,x,y-.085,0,ferro,8).rotation.z=Math.PI/2;}
      lcyl(.07,.07,.5,x0+.05,y-.33,0,ferro,8);lcyl(.12,.12,.06,x0+.05,y-.085,0,borr,8).rotation.z=Math.PI/2;
      F.plat.push({x0,x1,y});
    };
    cano(1.5,4.6,1.05);cano(5.6,8.4,1.8);cano(8.9,12.1,2.55);
    lcyl(.085,.085,H-2.5,12.0,(H+2.47)/2,-.0,ferro,8);
    /* objetos da garagem (todos podem ser medidos) */
    const z=-.75;
    { // prateleira com latas
      const ms=[lbox(.06,1.5,.4,.75,.75,z,M.dark,1),lbox(.06,1.5,.4,1.85,.75,z,M.dark,1)];
      [.45,.95,1.45].forEach(y=>ms.push(lbox(1.16,.05,.42,1.3,y,z,M.wood,1)));
      [[.95,.48],[1.25,.48],[1.6,.48],[1.05,.98],[1.5,.98],[1.3,1.48]].forEach(([x,y],k)=>ms.push(lcyl(.09,.09,.2,x,y+.1,z,k%2?ferro:branco,8)));
      prop(ms,.7,1.9,0,1.7);
    }
    { const ms=[0,1,2].map(k=>{const g=new T.CylinderGeometry(.36,.36,.22,10);const m=lmesh(g,borr,2.75+(k%2)*.05,.11+k*.23,z+.1);return m;});prop(ms,2.38,3.14,0,.72); }
    prop(lbox(.7,.55,.6,3.85,.275,z,M.wood,1),3.5,4.2,0,.55);
    { // escada de mão encostada
      const ms=[];[-.17,.17].forEach(s=>{const r=lbox(.05,2.2,.05,0,0,0,M.wood,1);r.position.set(4.75+s,1.05,z-.35);r.rotation.x=-.2;ms.push(r);});
      for(let k=0;k<6;k++){const r=lbox(.34,.04,.04,0,0,0,M.wood,1);r.position.set(4.75,.25+k*.33,z-.14-k*.066);ms.push(r);}
      prop(ms,4.5,5.0,0,2.1);
    }
    { // carro debaixo da lona: abrigo e degrau
      const ms=[lbox(2.6,.62,1.2,6.3,.42,-.45,lona,2),lbox(1.4,.42,1.1,6.25,.93,-.45,lona,2)];
      [5.45,7.15].forEach(x=>{const g=new T.CylinderGeometry(.2,.2,1.24,10);g.rotateX(Math.PI/2);ms.push(lmesh(g,borr,x,.2,-.45));});
      prop(ms,5.0,7.6,0,1.14);F.plat.push({x0:5.02,x1:7.58,y:.73},{x0:5.55,x1:6.95,y:1.14});
    }
    prop(lcyl(.3,.28,.85,8.3,.425,z,ferro,10),8.0,8.6,0,.85);
    { const ms=[lbox(1.4,.07,.6,9.6,.78,z,M.wood,1)];[[8.98,z-.22],[10.22,z-.22],[8.98,z+.22],[10.22,z+.22]].forEach(([x,zz])=>ms.push(lbox(.07,.75,.07,x,.375,zz,M.dark,1)));
      ms.push(lbox(.22,.16,.16,9.25,.9,z,ferro,1),lbox(.5,.1,.3,9.95,.87,z,branco,1));prop(ms,8.9,10.3,0,1.0); }
    { const ms=[lcyl(.17,.17,.42,10.78,.21,z+.15,ferro,10),lmesh(new T.IcosahedronGeometry(.17,1),ferro,10.78,.42,z+.15),lcyl(.05,.05,.1,10.78,.62,z+.15,borr,6)];prop(ms,10.58,10.98,0,.68); }
    { const ms=[lbox(.66,1.55,.6,11.45,.775,z,branco,2),lbox(.04,.3,.04,11.14,1.05,z+.31,borr,1)];prop(ms,11.1,11.8,0,1.55); }
    prop([lbox(.42,.34,.4,3.2,1.22,z+.55,pap,1),lbox(.36,.26,.36,3.62,1.18,z+.55,pap,1),lbox(.34,.22,.34,3.25,1.5,z+.55,pap,1)],2.98,3.82,1.05,1.62);
    { const g=new T.TorusGeometry(.3,.05,6,14);prop([lmesh(g,matFig(tecido('#3f5a3a',{barra:false})),1.5,2.5,-1.62),lbox(.1,.1,.14,1.5,2.82,-1.62,ferro,1)],1.15,1.85,2.15,2.9); }
    { const t=texto(256,128,(x)=>{x.fillStyle='#6a4f33';x.fillRect(0,0,256,128);x.fillStyle='rgba(20,12,8,.75)';
        [[20,20,12,80],[50,25,40,10],[55,25,8,70],[110,20,10,90],[100,20,30,14],[150,30,60,8],[150,30,8,50],[202,30,8,50],[160,95,50,10]].forEach(r=>x.fillRect(...r));speckle(x,256,128,300,['#000','#fff'],2);});
      prop([lbox(1.5,.75,.05,6.7,2.6,-1.67,M.wood,1),lplano(t,1.4,.66,6.7,2.6,-1.64,0)],5.95,7.45,2.2,3.0); }
    /* o relógio da casa, no fim do cano mais alto */
    const dt=dialTex();
    lbox(.46,.56,.2,11.35,3.02,-.35,ferro,1);
    const dg=new T.CylinderGeometry(.17,.17,.06,12);dg.rotateX(Math.PI/2);
    F.relogio=lmesh(dg,[ferro,new T.MeshStandardMaterial({map:dt,roughness:.5,emissive:0xffffff,emissiveMap:dt,emissiveIntensity:.25}),ferro],11.35,3.05,-.22);
    lcyl(.05,.05,.3,11.35,2.62,-.35,ferro,8);
    lplano(texto(128,48,(x)=>{x.fillStyle='#14202c';x.fillRect(0,0,128,48);x.strokeStyle='#e8dcc4';x.lineWidth=3;x.strokeRect(3,3,122,42);x.fillStyle='#e8dcc4';x.font='700 26px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('CASA',64,25);}),.34,.13,11.35,3.42,-.24,0);
    /* hidrômetros que brotam na parede */
    const hg=new T.CylinderGeometry(.1,.1,.07,10);hg.rotateX(Math.PI/2);
    F.hid=new T.InstancedMesh(hg,[ferro,new T.MeshStandardMaterial({map:dt,roughness:.6}),ferro],70);F.hid.frustumCulled=false;F.hid.castShadow=true;roomScene.add(F.hid);
    F.hp=[];for(let k=0;k<70;k++)F.hp.push({x:rr(.5,11.9),y:rr(.5,H-.4),s:rr(.6,1.5),t:k<8?0:8+k*1.1+R()});
    F.bocas=[[1.55,1.05],[5.65,1.8],[.4,.4],[12.0,.4],[8.95,2.55]];
    F.leitura=0;F.tSpawn=3;F.tt=0;
    /* barra de leitura acima do relógio */
    F.barra=lmesh(new T.BoxGeometry(1,.05,.02),M_GOTA,11.35,3.62,-.2);F.barra.castShadow=false;F.barra.scale.x=.001;
  },
  comeca(F){
    diz([['','Atrás do portão fica o quadro de hidrômetros da rua. Eles brotam na parede como cogumelo.'],
         ['Naná','O relógio da casa é o último, lá em cima. Leitura de hoje: a minha.'],
         ['','As Trenas saem dos canos. O que ficar entre as duas pontas da fita é medido. Água lava.']],
      ()=>{F.st='jogo';const a=inimigo('trena',.4,.4),b=inimigo('trena',12.0,.4);});
  },
  anim(tt,dt){
    const F=FS;F.tt+=(fl||acabou)?0:dt;
    F.hp.forEach((h,k)=>{const s=Math.max(0,Math.min(1,(F.tt-h.t)*2.5))*h.s;_o.position.set(h.x,h.y,-1.66);_o.scale.setScalar(Math.max(.001,s*(1+.25*Math.max(0,1-(F.tt-h.t)*2.5))));_o.updateMatrix();F.hid.setMatrixAt(k,_o.matrix);});
    F.hid.instanceMatrix.needsUpdate=true;
    F.relogio.rotation.z=Math.sin(tt*2)*.05;
  },
  tick(dt,tt){
    const F=FS;if(F.st!=='jogo')return;
    F.tSpawn-=dt;
    if(F.tSpawn<=0&&F.ini.filter(e=>e.morre<=0).length<3){const b=F.bocas[(R()*F.bocas.length)|0];inimigo('trena',b[0],b[1]);F.tSpawn=7;}
    const perto=Math.abs(PJ.x-11.35)<.7&&PJ.y>2.4;
    if(perto){
      F.dica='Segure E para ler o relógio da casa';
      if(fk.has('KeyE'))F.leitura+=dt/3;else F.leitura=Math.max(0,F.leitura-dt*.5);
      if(F.leitura>=1){F.leitura=0;this.decide(F);}
    }else{F.dica=null;F.leitura=Math.max(0,F.leitura-dt);}
    F.barra.scale.x=Math.max(.001,F.leitura*.9);
  },
  decide(F){
    F.st='decisao';
    diz([['Coletor','LEITURA DO IMÓVEL 0047. CONFIRMAR?',[
      {t:'Registrar a leitura real.',fn:()=>{soma('medida',15);G.flags.bico=true;resolve(0,[
        ['Coletor','Leitura registrada. Bico de pressão liberado para a agente.'],['Naná','Medi a minha casa do mesmo jeito que meço a dos outros.']]);}},
      {t:'Registrar zero.',fn:()=>{G.flags.fraude=true;resolve(0,[
        ['Coletor','Consumo: zero. Leitura aceita.'],['Naná','Hoje passa. Amanhã o aviso vai saber.']]);}},
      {t:'Quebrar o relógio.',fn:()=>{soma('medida',-10);G.flags.prancheta=true;F.relogio.visible=false;resolve(0,[
        ['','O vidro cede no terceiro golpe. Em algum lugar, uma prancheta se levanta da mesa.'],['Naná','Agora tem alguém vindo atrás de mim.']]);}}
    ]]]);
  }
};


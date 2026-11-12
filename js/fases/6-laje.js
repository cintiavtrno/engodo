/* ================================================================
   FASE 6 — UM POR CENTO (Laje das Sementes)
   ================================================================ */
FASES[5]={x0:0,x1:11.2,H:4.8,inicio:.8,
  monta(F){
    const W=F.x1,barro=matFig(tecido('#9a5a3c',{})),terra=matFig(tecido('#4a382a',{barra:false})),ferro=matOf(rustTex(),.7,.35),
          tij=matOf(plaster('#8a4a38',['#74402f','#a05a44'],5,true,'50,30,25'));
    /* laje a céu aberto, com mureta, vergalhões de espera e os telhados da rua ao fundo */
    lbox(W+.6,.3,3.4,W/2,-.15,-.3,M.conc,3);
    lbox(W+.6,.5,.16,W/2,.25,-1.9,M.tan,3);
    [.1,3.7,7.4,W-.1].forEach(x=>{lbox(.2,.7,.2,x,.35,-1.9,M.conc,2);[-.05,.05].forEach(d=>lcyl(.012,.012,.9,x+d,1.1,-1.9+d,ferro,5));});
    roomScene.add(new T.HemisphereLight(0xffffff,0x9a8f85,.8));
    const d=new T.DirectionalLight(0xfff1de,1.0);d.position.set(W/2+4,9,8);d.target.position.set(W/2,1,-.5);d.castShadow=true;d.shadow.mapSize.set(2048,2048);
    const s=d.shadow.camera;s.left=-9;s.right=9;s.top=7;s.bottom=-5;s.near=1;s.far=32;d.shadow.bias=-.0005;roomScene.add(d,d.target);
    const mats=[M.pink,M.tan,M.conc,M.stone];
    for(let k=0;k<12;k++){const w=rr(1.6,3),h=rr(.6,2.2),x=rr(-2,W+2),z=rr(-4,-11);lbox(w,h,rr(1.5,2.5),x,h/2-1.6,z,mats[k%4],3);
      const t=lmesh(new T.BoxGeometry(w+.2,.06,2.4),M.rust,x,h-1.55,z);t.rotation.x=.12;}
    lbox(1.1,.9,.9,1.0,1.75,-1.3,M.tank,3);[[.55,-.95],[1.45,-.95],[.55,-1.65],[1.45,-1.65]].forEach(([x,z])=>lbox(.08,1.3,.08,x,.65,z,M.dark,1));
    /* degraus: pilha de tijolos e caixote */
    lbox(.8,.5,.6,1.3,.25,-.2,tij,1.2);F.plat.push({x0:.9,x1:1.7,y:.5});
    lbox(.8,.55,.6,7.0,.275,-.2,M.wood,1);F.plat.push({x0:6.6,x1:7.4,y:.55});
    /* os três potes de feijão: festa, luto e todo dia */
    F.potes=[[2.9,'#d9c9a3'],[5.4,'#3f4a36'],[8.6,'#6f8a4a']].map(([x,cor])=>{
      const fol=matFig(tecido(cor,{barra:false})),ms=[lcyl(.34,.24,.5,x,.25,-.45,barro,10),lcyl(.36,.34,.06,x,.5,-.45,barro,10),lcyl(.31,.31,.02,x,.51,-.45,terra,10)];
      for(let k=0;k<7;k++){const a=k/7*6.28,h=rr(.45,.85),l=lmesh(new T.ConeGeometry(.07,h,5),fol,x+Math.cos(a)*.14,.52+h/2,-.45+Math.sin(a)*.14);l.rotation.z=-Math.cos(a)*.35;l.rotation.x=Math.sin(a)*.35;ms.push(l);}
      ms.push(lcyl(.012,.012,1.1,x,1.05,-.45,M.dark,5));
      const p=prop(ms,x-.38,x+.38,0,1.45);p.pote=true;return p;});
    /* banco de Tia Cotinha */
    lbox(.9,.06,.4,10.2,.45,-1.0,M.wood,1);[[9.85],[10.55]].forEach(([x])=>lbox(.06,.42,.36,x,.21,-1.0,M.dark,1));
    [9.95,10.2,10.45].forEach(x=>lcyl(.07,.05,.12,x,.54,-1.0,barro,8));
    const c=porId('cotinha');c.fora=true;roomScene.add(cotinha.root);cotinha.root.position.set(10.25,0,-.4);cotinha.root.rotation.y=rad(-60);F.figs.push(cotinha);
    F.onda=-1;F.fila=0;F.tSolta=0;F.tOnda=0;
  },
  comeca(F){
    diz([['','Esta é a laje onde Tia Cotinha planta feijão em três potes. As sementes vieram da mãe dela.'],
         ['Tia Cotinha','Um pote é o feijão das festas. Outro a gente cozinha quando morre alguém. O terceiro é o de todo dia.'],
         ['','Uma empresa quer registrar essas plantas no nome dela. Os Carimbadores vão descer do céu para carimbar os potes. Acerte os Carimbadores com água. Pote carimbado, você limpa.']],
      ()=>{F.st='jogo';F.onda=0;F.fila=3;F.tSolta=.6;});
  },
  tick(dt){
    const F=FS;
    if(F.st==='jogo'){
      F.dica=null;
      if(F.fila>0){F.tSolta-=dt;if(F.tSolta<=0){inimigo('carimbo',rr(1.6,9.4),F.H+.3);F.fila--;F.tSolta=1.4;}}
      else if(F.ini.length===0){
        F.tOnda+=dt;
        if(F.tOnda>1.6){F.tOnda=0;F.onda++;
          if(F.onda>=3){F.st='calmo';recado('Os Carimbadores pararam de descer. Fale com Tia Cotinha.',3);}
          else{F.fila=[3,4,5][F.onda];F.tSolta=.3;recado('Mais Carimbadores no céu.',1.8);}}
      }
    }else if(F.st==='calmo'){
      if(Math.abs(PJ.x-10.2)<.9&&PJ.y<.3){F.dica='E · falar com Tia Cotinha';if(usouE)this.decide(F);}else F.dica=null;
    }
  },
  decide(F){
    F.st='decisao';
    const limpos=F.potes.filter(p=>!p.med).length;
    diz([['Tia Cotinha','A empresa diz que melhorou a semente em um por cento. Por isso, quer ser dona dela inteira. O que a gente faz com as que sobraram?',[
      {t:'Dividir as sementes e plantar nos potes dos vizinhos.',off:limpos?null:'os três potes foram carimbados; limpe pelo menos um',fn:()=>{G.voz.add('cotinha');G.flags.sementesRua=true;soma('agua',-40);resolve(5,[
        ['','Cotinha separa as sementes em saquinhos. Cada vizinho planta um pouco em casa. A rega de tantos potes gasta água da caixa até o fim do dia.'],
        ['Tia Cotinha','Com semente em toda casa, fica difícil registrar tudo. Eu vou pra reunião.']]);}},
      {t:'Esconder as sementes.',fn:()=>{G.voz.add('cotinha');G.flags.cotinhaCalada=true;hud();resolve(5,[
        ['','Naná e Cotinha guardam as sementes num lugar que só as duas conhecem. Ficam seguras. Este ano, ninguém planta.'],
        ['Tia Cotinha','Eu vou pra reunião. Das sementes eu não falo com ninguém.']]);}},
      {t:'Deixar a empresa registrar um dos potes.',fn:()=>{G.flags.cesta=true;G.flags.cotinhaDesce=true;resolve(5,[
        ['','A empresa registra um pote no nome dela. Em troca, manda uma cesta básica para cada casa da rua.'],
        ['Tia Cotinha','Essa semente era da minha mãe. Agora tem outro dono. Não me chame pra reunião.']]);}},
      {t:'Ainda não.',fn:()=>{F.st='calmo';}}
    ]]]);
  }
};

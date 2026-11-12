/* ================================================================
   FASE 5 — O LIVRO (Dentro da Caixa)
   ================================================================ */
FASES[4]={x0:0,x1:12,H:5.6,inicio:1.2,inicioY:4.0,
  monta(F){
    const W=F.x1,H=F.H;
    palco(0,W,H,M.tank,M.tank,M.tank);
    luzes(0,W,H,0xdfeeff,.7,.7);
    /* a tampa: um quadrado de luz no teto */
    const tp=new T.Mesh(new T.PlaneGeometry(1.3,1.3),new T.MeshBasicMaterial({color:0xfff6e0}));tp.rotation.x=Math.PI/2;tp.position.set(1.2,H-.005,-.3);roomScene.add(tp);
    const pl=new T.PointLight(0xfff0d0,1.1,9);pl.position.set(1.2,H-.6,.2);roomScene.add(pl);
    /* píeres */
    [[.2,2.4,1.3],[3.5,5.3,2.0],[6.6,8.4,2.7],[9.6,10.6,3.3]].forEach(([a,b,y])=>{
      lbox(b-a,.08,1.2,(a+b)/2,y-.04,-.3,M.wood,1.5);
      for(let x=a+.15;x<b;x+=.75){lbox(.08,y-.08,.08,x,(y-.08)/2,.22,M.dark,1);lbox(.08,y-.08,.08,x,(y-.08)/2,-.82,M.dark,1);}
      F.plat.push({x0:a,x1:b,y});
    });
    /* a lagoa: o nível é a Água do jogo */
    F.nivelDe=a=>.35+a/1000*2.6;F.nivel=F.nivelDe(G.agua);
    const ma=new T.MeshStandardMaterial({color:corLin(0x5b86ae),transparent:true,opacity:.6,roughness:.12,depthWrite:false});
    const sg=new T.PlaneGeometry(W,3.1);sg.rotateX(-Math.PI/2);F.sup=new T.Mesh(sg,ma);F.sup.position.set(W/2,F.nivel,-.3);roomScene.add(F.sup);
    const fg=new T.PlaneGeometry(W,1);fg.translate(0,.5,0);
    F.frente=new T.Mesh(fg,new T.MeshStandardMaterial({color:corLin(0x5b86ae),transparent:true,opacity:.3,roughness:.2,depthWrite:false}));F.frente.position.set(W/2,0,1.24);roomScene.add(F.frente);
    /* canoa de Seu Aurelino */
    const cg=new T.BoxGeometry(1.8,.2,.56,6,1,1),cp=cg.attributes.position;
    for(let i=0;i<cp.count;i++){const ax=Math.abs(cp.getX(i));if(ax>.55){cp.setZ(i,cp.getZ(i)*(1-(ax-.55)/.35*.75));if(cp.getY(i)>0)cp.setY(i,cp.getY(i)+(ax-.55)*.25);}}
    cg.computeVertexNormals();
    F.canoa={x:5.6,g:new T.Mesh(cg,M.wood),p:{x0:0,x1:0,y:0}};F.canoa.g.castShadow=true;roomScene.add(F.canoa.g);F.plat.push(F.canoa.p);
    const au=porId('aurelino');au.fora=true;roomScene.add(aurelino.root);aurelino.root.rotation.y=rad(60);F.figs.push(aurelino);
    /* turbinas no fundo */
    F.turb=[4.4,7.6].map(x=>{const g=new T.Group();g.position.set(x,.32,-.3);roomScene.add(g);
      const hub=new T.Mesh(new T.CylinderGeometry(.14,.14,.3,8),M.planta);hub.rotation.x=Math.PI/2;g.add(hub);
      for(let k=0;k<4;k++){const b=new T.Mesh(new T.BoxGeometry(.5,.12,.03),M_LARANJA);b.position.x=.3;const hh=new T.Group();hh.rotation.z=k*Math.PI/2;hh.add(b);g.add(hh);}
      lbox(.5,.1,.5,x,.05,-.3,M.planta,1);return g;});
    /* a Bomba e as três mangueiras */
    lbox(.9,3.6,1.1,W-.5,1.8,-.6,M.planta,2);
    lmesh(new T.BoxGeometry(.94,.16,1.14),M_LARANJA,W-.5,3.68,-.6);
    F.pts=[[10.9,4.2,3.4],[9.3,1.7,1.9],[5.9,.55,.7]];
    F.mang=F.pts.map(([x,y,ym])=>{
      const c=new T.CatmullRomCurve3([new T.Vector3(W-.95,ym,-.4),new T.Vector3((x+W-.95)/2+.2,(y+ym)/2-.25,-.25),new T.Vector3(x,y,-.1)]);
      const m=new T.Mesh(new T.TubeGeometry(c,16,.05,6),M_LARANJA);m.visible=false;m.castShadow=true;roomScene.add(m);return m;});
    F.juntas=[];F.gira=false;F.t=0;
  },
  comeca(F){
    diz([['','Este é o lado de dentro da caixa d\'água da rua. A altura da água aqui é a mesma do marcador Água lá em cima.'],
         ['Seu Aurelino','Eu cuido dessa água desde que tua avó construiu a caixa. Todas as casas da rua bebem daqui.'],
         ['','Uma bomba foi ligada na parede. Ela puxa a água da rua por três mangueiras laranja.'],
         ['Seu Aurelino','Estão levando nossa água pra gerar energia pra outro bairro. Acerta a ponta das mangueiras com água pra soltar.']],
      ()=>{F.st='jogo';F.gira=true;F.mang.forEach(m=>m.visible=true);F.juntas=F.pts.map(([x,y])=>inimigo('junta',x,y));});
  },
  anim(tt,dt){
    const F=FS;F.t=tt;
    F.nivel+=(F.nivelDe(G.agua)-F.nivel)*Math.min(1,dt*2);
    const y=F.nivel+Math.sin(tt*1.2)*.02;
    F.sup.position.y=y;F.frente.scale.y=Math.max(.01,y);
    const c=F.canoa;c.x=5.6+Math.sin(tt*.25)*.9;c.g.position.set(c.x,y+.02,-.25);c.g.rotation.z=Math.sin(tt*1.1)*.03;
    c.p.x0=c.x-.8;c.p.x1=c.x+.8;c.p.y=y+.1;
    aurelino.root.position.set(c.x-.45,y+.1,-.3);
    if(F.gira)F.turb.forEach((g,k)=>g.rotation.z+=dt*(7+k));
    F.mang.forEach((m,k)=>{const j=F.juntas[k];if(j&&j.hp<=0)m.visible=false;});
  },
  tick(dt){
    const F=FS;if(F.st!=='jogo'&&F.st!=='calmo'&&F.st!=='livre')return;
    const c=F.canoa;
    if(PJ.chao&&PJ.sobre===c.p)PJ.y=c.p.y;
    if(F.gira)F.turb.forEach(g=>{if(Math.abs(PJ.x-g.position.x)<.6&&PJ.y<.75)etiquetaCorpo(Math.sign(PJ.x-g.position.x)||1);});
    if(F.st==='jogo'){
      const n=F.juntas.filter(j=>j.hp>0).length;
      if(n){soma('agua',-2.5*n*dt);F.dica=null;}
      else{F.st='calmo';F.gira=false;recado('A bomba parou. Fale com Seu Aurelino na canoa.',3);}
    }
    if(F.st==='calmo'){
      if(Math.abs(PJ.x-c.x)<1.3&&Math.abs(PJ.y-c.p.y)<.9){F.dica='E · falar com Seu Aurelino';if(usouE)this.decide(F);}else F.dica=null;
    }
  },
  decide(F){
    F.st='decisao';
    const volta=()=>{F.st='calmo';};
    diz([['Seu Aurelino','A bomba desligou. E agora, o que a gente faz com a água que sobrou?',[
      {t:'Pedir a ele para contar a história da caixa.',fn:()=>{
        diz([['Seu Aurelino','Quem construiu esta caixa foi tua avó, Dete, pra rua não depender de ninguém. Você sabe onde ela está hoje?',[
          {t:'Ela morreu. Fui eu que paguei o enterro.',fn:()=>fim('campo','Seu Aurelino conta como Dete juntou os vizinhos e levantou a caixa em mutirão.')},
          {t:'Ela mora aqui dentro da caixa até hoje.',fn:()=>fim('caixa','No fundo da caixa, uma senhora varre o chão devagar. É Dete.')},
          {t:'Ela entrou na Fila em 1994 e nunca voltou.',fn:()=>fim('fila','Seu Aurelino conta que Dete acreditou na promessa da Fila. Foi embora para esperar a vez dela.')}
        ]]]);
        function fim(k,l){G.flags.dete=k;G.flags.lavar=true;resolve(4,[['',l],['Seu Aurelino','Tua avó me ensinou a lavar com pouca água. Vou te ensinar.'],['','Naná aprendeu a Lavar. A partir de agora ela gasta menos água para limpar o que foi medido.']]);}
      }},
      {t:'Pescar com ele.',fn:()=>{G.voz.add('aurelino');G.flags.horas=(G.flags.horas||0)+1;hud();resolve(4,[
        ['','Naná passa uma hora na pescaria com Seu Aurelino. Os dois conversam sobre a rua.'],['Seu Aurelino','Gostei da conversa. Eu vou com você pra reunião na laje.']]);}},
      {t:'Abrir o registro e mandar água para as casas.',fn:()=>{G.flags.registro=true;soma('agua',-150);resolve(4,[
        ['','Naná abre o registro. Cento e cinquenta litros saem da caixa e chegam às torneiras dos vizinhos.'],['Seu Aurelino','Os vizinhos vão lembrar que foi você quem mandou a água.']]);}},
      {t:'Ainda não.',fn:volta}
    ]]]);
  }
};

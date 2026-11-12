/* Engodo — laço de animação */
hud();
window.__f={get FS(){return FS;},PJ,G,fk,get fl(){return fl;}};

/* laço de animação */
const clock=new T.Clock();
let level=.12;
renderer.setAnimationLoop(()=>{
  if(document.body.dataset.modo!==mode)document.body.dataset.modo=mode;
  const now=performance.now(),tt=clock.getElapsedTime();
  for(const tw of tweens.slice()){
    const k=Math.min(1,(now-tw.t0)/tw.dur);tw.fn(k);
    if(k>=1){tweens.splice(tweens.indexOf(tw),1);tw.done&&tw.done();}
  }
  controls.autoRotate=spin&&mode==='house'&&!busy&&hovered<0&&now>pauseUntil;
  if(mode==='house'){
    OPS.forEach((o,i)=>{
      const isH=(i===hovered||i===listHover);
      const target=isH?.8:(lit.includes(i)?.38+.22*Math.sin(tt*2.4+i):0);
      o.glow+=(target-o.glow)*.08;
      o.mesh.material.opacity=Math.max(0,o.glow);
    });
    const goal=G.agua/1000;
    level+=(goal-level)*.03;
    const wob=Math.sin(tt*1.7)*.012;
    water.scale.y=Math.max(.02,Math.min(1,level+wob));
  }
  cena(tt);
  if(mode==='fase'){const d=Math.min(.05,Math.max(0,tt-(faseTick.t||tt)));faseTick.t=tt;faseTick(tt,d);}else faseTick.t=tt;
  controls.update();
  renderer.render(active,camera);
});

(()=>{
  'use strict';

  const CLASS_TO_FILE_KEY={
    red:'fire',
    blue:'water',
    green:'wind',
    yellow:'light',
    earth:'earth',
    any:'any'
  };
  const ASSET_BASE='img/cards/mana/';
  const preloadCache=new Map();

  function manaClassFrom(el){
    const source=el.classList.contains('flying-front')?el.closest('.flying-mana'):el;
    if(!source)return null;
    return Object.keys(CLASS_TO_FILE_KEY).find(key=>source.classList.contains(key))||null;
  }

  function manaValueFrom(el,manaClass){
    if(manaClass==='any'){
      const raw=el.classList.contains('mana-card')?el.getAttribute('aria-label'):el.querySelector('span')?.textContent;
      const match=String(raw||'').match(/[123]/);
      return match?Number(match[0]):3;
    }
    if(el.classList.contains('mana-card')){
      const match=String(el.getAttribute('aria-label')||'').match(/([123])\s*$/);
      return match?Number(match[1]):null;
    }
    const raw=el.querySelector('span')?.textContent;
    const value=Number.parseInt(raw,10);
    return value>=1&&value<=3?value:null;
  }

  function preload(path){
    if(!preloadCache.has(path)){
      preloadCache.set(path,new Promise(resolve=>{
        const img=new Image();
        img.onload=()=>resolve(true);
        img.onerror=()=>resolve(false);
        img.src=path;
      }));
    }
    return preloadCache.get(path);
  }

  async function applyManaAsset(el){
    if(!(el instanceof Element)||el.dataset.manaAssetBound==='1')return;
    const manaClass=manaClassFrom(el);
    if(!manaClass)return;
    const value=manaValueFrom(el,manaClass);
    if(!value)return;
    el.dataset.manaAssetBound='1';
    const path=`${ASSET_BASE}mana_${CLASS_TO_FILE_KEY[manaClass]}_${value}.png`;
    if(await preload(path)){
      el.style.setProperty('--mana-png',`url("${path}")`);
      el.classList.add('mana-png');
    }else{
      delete el.dataset.manaAssetBound;
    }
  }

  function replaceFlyingPath(el){
    if(!(el instanceof Element)||!el.classList.contains('flying-mana')||el.dataset.straightPathFixed==='1')return;
    const manaClass=manaClassFrom(el);
    if(!manaClass)return;
    const row=document.querySelector(`.mana-row.${manaClass}`);
    const stack=row?.querySelector('.mana-row-stack');
    if(!row||!stack)return;

    el.dataset.straightPathFixed='1';
    requestAnimationFrame(()=>{
      const stackRect=stack.getBoundingClientRect();
      const leftmost=stack.querySelector('.mana-card:last-child');
      const leftmostRect=leftmost?.getBoundingClientRect();
      const cardWidth=56;
      const overlap=10;
      const step=cardWidth-overlap;
      const targetLeft=leftmostRect?leftmostRect.left-step:stackRect.right-2-cardWidth;
      const targetTop=leftmostRect?leftmostRect.top:stackRect.top+Math.max(0,(stackRect.height-cardWidth)/2);
      const sourceLeft=Number.parseFloat(el.style.left)||el.getBoundingClientRect().left;
      const sourceTop=Number.parseFloat(el.style.top)||el.getBoundingClientRect().top;
      const dx=targetLeft-sourceLeft;
      const dy=targetTop-sourceTop;

      const original=el.getAnimations()[0];
      if(!original?.effect?.setKeyframes)return;

      const sourceWidth=Number.parseFloat(el.style.width)||el.getBoundingClientRect().width||48;
      const scale=Math.max(.72,Math.min(1.15,cardWidth/sourceWidth));

      // 元のAnimationオブジェクトを生かしたまま軌跡だけ差し替える。
      // animateOneMana() が待っている finished Promise を維持するため、
      // cancelして別アニメーションを作り直さない。
      original.effect.setKeyframes([
        {transform:'translate(0,0) scale(1)'},
        {transform:`translate(${dx}px,${dy}px) scale(${scale})`}
      ]);
    });
  }

  function fixPerfectLabel(el){
    if(!(el instanceof Element)||!el.classList.contains('perfect-label')||el.dataset.edgeClamped==='1')return;
    if(!el.style.left)return;
    el.dataset.edgeClamped='1';
    requestAnimationFrame(()=>{
      const layer=document.querySelector('#effect-layer');
      if(!layer)return;
      const center=Number.parseFloat(el.style.left);
      if(!Number.isFinite(center))return;
      const half=el.offsetWidth/2;
      const min=half+6;
      const max=Math.max(min,layer.clientWidth-half-6);
      el.style.left=`${Math.min(max,Math.max(min,center))}px`;
    });
  }

  function scan(root=document){
    if(root instanceof Element&&root.matches('.mana-card,.mini-mana,.flying-front'))applyManaAsset(root);
    root.querySelectorAll?.('.mana-card,.mini-mana,.flying-front').forEach(applyManaAsset);
    if(root instanceof Element&&root.classList.contains('flying-mana'))replaceFlyingPath(root);
    root.querySelectorAll?.('.flying-mana').forEach(replaceFlyingPath);
    if(root instanceof Element&&root.classList.contains('perfect-label'))fixPerfectLabel(root);
    root.querySelectorAll?.('.perfect-label').forEach(fixPerfectLabel);
  }

  document.addEventListener('click',event=>{
    const deliver=event.target.closest?.('.quest-deliver');
    if(!deliver||deliver.disabled)return;
    deliver.closest('.quest-slot')?.classList.add('delivery-resolving');
  },true);

  const observer=new MutationObserver(records=>{
    for(const record of records){
      for(const node of record.addedNodes){
        if(node.nodeType===Node.ELEMENT_NODE)scan(node);
      }
    }
  });

  scan();
  observer.observe(document.body,{childList:true,subtree:true});
})();

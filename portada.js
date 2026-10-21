// Filtros sobre el catálogo íntegro del portal; ninguna entrada se elimina del HTML.
(()=>{const cards=[...document.querySelectorAll('.news-latest-grid>[data-news-category]')];const buttons=[...document.querySelectorAll('[data-news-filter]')];const more=document.querySelector('#news-load-more');const status=document.querySelector('#news-visible-count');if(!cards.length||!more)return;let category='',limit=3;function render(){const selected=cards.filter(c=>!category||c.dataset.newsCategory===category);cards.forEach(c=>c.hidden=true);selected.slice(0,limit).forEach(c=>c.hidden=false);more.hidden=limit>=selected.length;status.textContent=`${Math.min(limit,selected.length)} de ${selected.length} publicaciones${category?' en '+category:' del archivo'}`;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.newsFilter===category)))}buttons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.newsFilter;limit=3;render()}));more.addEventListener('click',()=>{limit+=3;render()});render()})();


 document.querySelectorAll("[data-open-lupa]").forEach(a=>a.addEventListener("click",()=>document.querySelector('[data-news-filter="Bajo la Lupa"]')?.click()));

// Shared, keyboard-accessible rows: three works on desktop, one on mobile.
document.querySelectorAll('.editorial-track').forEach(track=>{
 const buttons=[...document.querySelectorAll('[data-editorial-scroll]')].filter(b=>b.getAttribute('aria-controls')===track.id);
 const update=()=>buttons.forEach(b=>b.disabled=Number(b.dataset.editorialScroll)<0?track.scrollLeft<=2:track.scrollLeft+track.clientWidth>=track.scrollWidth-2);
 buttons.forEach(button=>button.addEventListener('click',()=>{
  const gap=parseFloat(getComputedStyle(track).columnGap)||0;
  const step=track.firstElementChild.getBoundingClientRect().width+gap;
  const count=Math.max(1,Math.round(track.clientWidth/step));
  track.scrollBy({left:Number(button.dataset.editorialScroll)*step*count,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }));
 track.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(track);update();
});

// Filtros sobre el catálogo íntegro del portal; ninguna entrada se elimina del HTML.
(()=>{const cards=[...document.querySelectorAll('.news-latest-grid>[data-news-category]')];const buttons=[...document.querySelectorAll('[data-news-filter]')];const more=document.querySelector('#news-load-more');const status=document.querySelector('#news-visible-count');if(!cards.length||!more)return;let category='',limit=3;function render(){const selected=cards.filter(c=>!category||c.dataset.newsCategory===category);cards.forEach(c=>c.hidden=true);selected.slice(0,limit).forEach(c=>c.hidden=false);more.hidden=limit>=selected.length;status.textContent=`${Math.min(limit,selected.length)} de ${selected.length} publicaciones${category?' en '+category:' del archivo'}`;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.newsFilter===category)))}buttons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.newsFilter;limit=3;render()}));more.addEventListener('click',()=>{limit+=3;render()});render()})();


 document.querySelectorAll("[data-open-lupa]").forEach(a=>a.addEventListener("click",()=>document.querySelector('[data-news-filter="Bajo la Lupa"]')?.click()));

//proto:start
// Carrusel de reportajes protagonistas: flechas, puntos, teclado y swipe. Sin autoplay.
(()=>{const root=document.getElementById('fila-reportajes');if(!root||!root.classList.contains('proto-carousel'))return;
const viewport=root.querySelector('.proto-viewport'),track=root.querySelector('.proto-track');
const slides=[...root.querySelectorAll('.proto-slide')],dots=[...root.querySelectorAll('.proto-dot')];
const counter=root.querySelector('.proto-counter'),prev=root.querySelector('[data-proto-prev]'),next=root.querySelector('[data-proto-next]');
const n=slides.length;if(!n)return;let i=0;
const focusables=s=>[...s.querySelectorAll('a,button')];
function go(k){const from=slides.findIndex(s=>s.contains(document.activeElement));const old=focusables(slides[i]).indexOf(document.activeElement);
i=((k%n)+n)%n;track.style.transform='translateX(-'+i*100+'%)';
dots.forEach((d,j)=>{if(j===i)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current')});
counter.textContent=(i+1)+' / '+n;
slides.forEach((s,j)=>{const off=j!==i;s.setAttribute('aria-hidden',String(off));focusables(s).forEach(el=>{if(off)el.setAttribute('tabindex','-1');else el.removeAttribute('tabindex')})});
if(from>=0&&from!==i){const list=focusables(slides[i]);const t=list[Math.max(0,Math.min(old,list.length-1))]||viewport;t.focus({preventScroll:true})}}
prev.addEventListener('click',()=>go(i-1));next.addEventListener('click',()=>go(i+1));
dots.forEach((d,j)=>d.addEventListener('click',()=>go(j)));
root.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey)return;
if(e.key==='ArrowRight'){e.preventDefault();go(i+1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(i-1)}else if(e.key==='Home'){e.preventDefault();go(0)}else if(e.key==='End'){e.preventDefault();go(n-1)}});
let pid=null,sx=0,sy=0,dx=0,drag=false,suppress=false;
viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.target.closest('a,button'))return;
pid=e.pointerId;sx=e.clientX;sy=e.clientY;dx=0;drag=false;suppress=false});
viewport.addEventListener('pointermove',e=>{if(pid!==e.pointerId)return;
const mx=e.clientX-sx,my=e.clientY-sy;
if(!drag){if(Math.abs(mx)<10||Math.abs(mx)<Math.abs(my))return;drag=true;root.classList.add('proto-dragging');viewport.setPointerCapture(pid)}
dx=mx;e.preventDefault();track.style.transform='translateX(calc(-'+i*100+'% + '+dx+'px))'});
function endDrag(e){if(pid!==e.pointerId)return;pid=null;root.classList.remove('proto-dragging');
if(!drag)return;drag=false;suppress=Math.abs(dx)>10;
if(dx<-60)go(i+1);else if(dx>60)go(i-1);else go(i);dx=0}
viewport.addEventListener('pointerup',endDrag);viewport.addEventListener('pointercancel',endDrag);
viewport.addEventListener('click',e=>{if(suppress){e.preventDefault();e.stopPropagation();suppress=false}},true);
root.classList.add('proto-ready');go(0)})();
//proto:end

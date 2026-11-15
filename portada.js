// Filtros sobre el catálogo íntegro del portal; ninguna entrada se elimina del HTML.
(()=>{const cards=[...document.querySelectorAll('.news-latest-grid>[data-news-category]')];const buttons=[...document.querySelectorAll('[data-news-filter]')];const more=document.querySelector('#news-load-more');const status=document.querySelector('#news-visible-count');if(!cards.length||!more)return;let category='',limit=3;function render(){const selected=cards.filter(c=>!category||c.dataset.newsCategory===category);cards.forEach(c=>c.hidden=true);selected.slice(0,limit).forEach(c=>c.hidden=false);more.hidden=limit>=selected.length;status.textContent=`${Math.min(limit,selected.length)} de ${selected.length} publicaciones${category?' en '+category:' del archivo'}`;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.newsFilter===category)))}buttons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.newsFilter;limit=3;render()}));more.addEventListener('click',()=>{limit+=3;render()});render()})();


 document.querySelectorAll("[data-open-lupa]").forEach(a=>a.addEventListener("click",()=>document.querySelector('[data-news-filter="Bajo la Lupa"]')?.click()));

//proto:start
// Carrusel editorial: 3 tarjetas visibles en escritorio y 1 en móvil; flechas exteriores,
// puntos por posición, teclado y swipe. Sin autoplay; trasplantes abre siempre primero.
(()=>{const root=document.getElementById('fila-reportajes');if(!root||!root.classList.contains('proto-carousel'))return;
const viewport=root.querySelector('.proto-viewport'),track=root.querySelector('.proto-track');
const slides=[...root.querySelectorAll('.proto-slide')],dotsBox=root.querySelector('.proto-dots');
const counter=root.querySelector('.proto-counter'),prev=root.querySelector('[data-proto-prev]'),next=root.querySelector('[data-proto-next]');
const n=slides.length;if(!n)return;
const mq=window.matchMedia('(max-width:1000px)');
const visible=()=>mq.matches?1:3;
const titles=slides.map(s=>{const h=s.querySelector('h3');return h?h.textContent.trim():''});
let i=0,step=0,max=0,dots=[];
const focusables=s=>[...s.querySelectorAll('a,button')];
function measure(){max=Math.max(0,n-visible());i=Math.min(i,max)}
function buildDots(){dotsBox.textContent='';dots=[];for(let j=0;j<=max;j++){const b=document.createElement('button');b.type='button';b.className='proto-dot';b.setAttribute('aria-label','Ir a la posición '+(j+1)+': '+titles[Math.min(j,n-1)]);b.addEventListener('click',()=>go(j));dotsBox.appendChild(b);dots.push(b)}}
function apply(){const gap=parseFloat(getComputedStyle(track).columnGap)||20;step=slides[0].getBoundingClientRect().width+gap;
track.style.transform='translateX(-'+(i*step)+'px)';
dots.forEach((d,j)=>{if(j===i)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current')});
counter.textContent=(i+1)+' / '+(max+1);
prev.disabled=i===0;next.disabled=i===max;
const v=visible();
slides.forEach((s,j)=>{const off=j<i||j>=i+v;s.setAttribute('aria-hidden',String(off));focusables(s).forEach(el=>{if(off)el.setAttribute('tabindex','-1');else el.removeAttribute('tabindex')})})}
function go(k){const from=slides.findIndex(s=>s.contains(document.activeElement));const old=from>=0?focusables(slides[from]).indexOf(document.activeElement):-1;
i=Math.max(0,Math.min(max,k));apply();
if(from>=0&&(from<i||from>=i+visible())){const list=focusables(slides[i]);const t=list[Math.max(0,Math.min(old<0?0:old,list.length-1))]||viewport;t.focus({preventScroll:true})}}
prev.addEventListener('click',()=>go(i-1));next.addEventListener('click',()=>go(i+1));
root.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey)return;
if(e.key==='ArrowRight'){e.preventDefault();go(i+1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(i-1)}else if(e.key==='Home'){e.preventDefault();go(0)}else if(e.key==='End'){e.preventDefault();go(max)}});
let pid=null,sx=0,sy=0,dx=0,drag=false,suppress=false;
viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.target.closest('a,button'))return;
pid=e.pointerId;sx=e.clientX;sy=e.clientY;dx=0;drag=false;suppress=false});
viewport.addEventListener('pointermove',e=>{if(pid!==e.pointerId)return;
const mx=e.clientX-sx,my=e.clientY-sy;
if(!drag){if(Math.abs(mx)<10||Math.abs(mx)<Math.abs(my))return;drag=true;root.classList.add('proto-dragging');viewport.setPointerCapture(pid)}
dx=mx;e.preventDefault();
const x=Math.max(-max*step,Math.min(0,-i*step+dx));track.style.transform='translateX('+x+'px)'});
function endDrag(e){if(pid!==e.pointerId)return;pid=null;root.classList.remove('proto-dragging');
if(!drag)return;drag=false;suppress=Math.abs(dx)>10;
if(dx<-60)go(i+1);else if(dx>60)go(i-1);else go(i);dx=0}
viewport.addEventListener('pointerup',endDrag);viewport.addEventListener('pointercancel',endDrag);
viewport.addEventListener('click',e=>{if(suppress){e.preventDefault();e.stopPropagation();suppress=false}},true);
function sync(){measure();if(dots.length!==max+1)buildDots();apply()}
if(mq.addEventListener)mq.addEventListener('change',sync);else mq.addListener(sync);
let raf=0;window.addEventListener('resize',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(sync)});
root.classList.add('proto-ready');measure();buildDots();apply()})();
//proto:end

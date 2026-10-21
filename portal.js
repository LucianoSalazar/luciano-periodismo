const typeChoice=new URLSearchParams(location.search).get('tipografia');if(['spectral','source'].includes(typeChoice))document.body.classList.add('type-'+typeChoice);
const form=document.querySelector('.search');
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if(form){let catalog;const input=document.querySelector('#news-search'),results=document.querySelector('#search-results'),status=document.querySelector('#search-status');
const search=async()=>{const q=normalize(input.value.trim());if(!q){results.hidden=true;results.innerHTML='';status.textContent='';return}try{catalog??=await fetch('/luciano-periodismo/noticias.json?v=bc4239cafdeb').then(r=>{if(!r.ok)throw Error();return r.json()});const found=catalog.filter(w=>normalize(w.title+' '+w.category+' '+w.synopsis+' '+w.text).includes(q));status.textContent=found.length+' '+(found.length===1?'resultado':'resultados');results.hidden=false;results.innerHTML=found.map(w=>`<article class="story">${w.image ? `<a class="story-image" href="${escape(w.url)}"><img src="${escape(w.image)}" alt="" loading="lazy"></a>` : ""}<p class="eyebrow">${escape(w.category)}</p><h3><a href="${escape(w.url)}">${escape(w.title)}</a></h3></article>`).join('')}catch{status.textContent='No se pudo cargar la búsqueda. Puedes navegar por las secciones.'}};
form.addEventListener('submit',e=>{e.preventDefault();search()});input.addEventListener('input',search)}
// Preserve old shared links while moving reading to permanent static pages.
const old=location.hash.match(/^#obra\/([a-z0-9-]+)$/);if(old)location.replace('/luciano-periodismo/noticias/'+old[1]+'/');

// Recover the original ISP series and interactions without an external chart dependency.
document.querySelectorAll('[data-transplant-chart]').forEach(widget=>{
 const rows=JSON.parse(widget.dataset.stats),ns='http://www.w3.org/2000/svg';
 const labels={espera:'Pacientes en lista de espera',trasplantes:'Cantidad de trasplantes realizados',resolucion:'Porcentaje de resolución (%)'};
 const number=v=>v.toLocaleString('es-CL',{maximumFractionDigits:1});
 const draw=key=>{
  const status=widget.querySelector('.chart-status');status.textContent=labels[key];
  widget.querySelectorAll('[data-indicator]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.indicator===key?'true':'false'));
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 640 370');svg.setAttribute('role','img');svg.setAttribute('aria-label',labels[key]+'. Datos de 2018 a 2025, consultables también en la tabla.');
  const add=(tag,attrs,text)=>{const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([a,v])=>n.setAttribute(a,v));if(text!==undefined)n.textContent=text;svg.append(n);return n};
  const max=Math.max(...rows.map(r=>r[key]));
  rows.forEach((r,i)=>{const y=16+i*43;add('text',{x:0,y:y+22},r.Año);const bar=add('rect',{x:52,y,width:460*r[key]/max,height:29,rx:2,fill:key==='resolucion'?'#217568':key==='trasplantes'?'#976a30':'#28647c'});const title=document.createElementNS(ns,'title');title.textContent=r.Año+': '+number(r[key]);bar.append(title);add('text',{x:64+460*r[key]/max,y:y+21,class:'bar-value'},number(r[key])+(key==='resolucion'?' %':''))});
  widget.querySelector('.chart-plot').replaceChildren(svg);
 };
 widget.querySelectorAll('[data-indicator]').forEach(b=>b.addEventListener('click',()=>draw(b.dataset.indicator)));draw('espera');
});
document.querySelectorAll('.ine-layout').forEach(widget=>{
 const output=widget.querySelector('.ine-dynamic-content');output.setAttribute('aria-live','polite');
 widget.querySelectorAll('[data-ine-value]').forEach(button=>button.addEventListener('click',()=>{
  output.querySelector('h3').textContent=button.dataset.ineValue;
  output.querySelector('p').textContent=button.dataset.ineLabel+' · '+button.closest('.ine-year-group').querySelector('.ine-year-label').textContent;
 }));
});
document.querySelectorAll('.audio-card audio').forEach(audio=>audio.addEventListener('play',()=>{
 document.querySelectorAll('.audio-card audio').forEach(other=>{if(other!==audio)other.pause()});
}));

// Reveal an archive only when its destination is requested, preserving native details behavior.
function revealEditorialTarget(hash){if(!hash||!hash.startsWith('#'))return;const target=document.getElementById(hash.slice(1));const detail=target?.closest('details');if(detail)detail.open=true;}
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>revealEditorialTarget(link.hash)));
revealEditorialTarget(location.hash);

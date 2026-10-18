const typeChoice=new URLSearchParams(location.search).get('tipografia');if(['spectral','source'].includes(typeChoice))document.body.classList.add('type-'+typeChoice);
const form=document.querySelector('.search');
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if(form){let catalog;const input=document.querySelector('#news-search'),results=document.querySelector('#search-results'),status=document.querySelector('#search-status');
const search=async()=>{const q=normalize(input.value.trim());if(!q){results.hidden=true;results.innerHTML='';status.textContent='';return}try{catalog??=await fetch('/luciano-periodismo/noticias.json?v=5').then(r=>{if(!r.ok)throw Error();return r.json()});const found=catalog.filter(w=>normalize(w.title+' '+w.category+' '+w.synopsis+' '+w.text).includes(q));status.textContent=found.length+' '+(found.length===1?'resultado':'resultados');results.hidden=false;results.innerHTML=found.map(w=>`<article class="story"><a class="story-image" href="${escape(w.url)}"><img src="${escape(w.image)}" alt="" loading="lazy"></a><p class="eyebrow">${escape(w.category)}</p><h3><a href="${escape(w.url)}">${escape(w.title)}</a></h3></article>`).join('')}catch{status.textContent='No se pudo cargar la búsqueda. Puedes navegar por las secciones.'}};
form.addEventListener('submit',e=>{e.preventDefault();search()});input.addEventListener('input',search)}
// Preserve old shared links while moving reading to permanent static pages.
const old=location.hash.match(/^#obra\/([a-z0-9-]+)$/);if(old)location.replace('/luciano-periodismo/noticias/'+old[1]+'/');

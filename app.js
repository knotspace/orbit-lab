const $=s=>document.querySelector(s);
$('#year').textContent=new Date().getFullYear();
const saved=localStorage.getItem('orbit-journal-theme');if(saved==='dark')document.body.classList.add('dark');
$('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('orbit-journal-theme',document.body.classList.contains('dark')?'dark':'light')});
let category='all';const cards=[...document.querySelectorAll('.article-card')];const search=$('#searchInput');function filter(){const q=search.value.trim().toLowerCase();let count=0;cards.forEach(card=>{const ok=(category==='all'||card.dataset.category===category)&&(!q||(card.dataset.search+' '+card.textContent).toLowerCase().includes(q));card.hidden=!ok;if(ok)count++});$('#resultCount').textContent=String(count).padStart(2,'0')+' ARTICLES';$('#emptyState').hidden=count!==0}
$('#categoryFilters').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b));filter()});search.addEventListener('input',filter);
document.querySelectorAll('[data-topic]').forEach(a=>a.addEventListener('click',()=>{category=a.dataset.topic;document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x.dataset.category===category));filter()}));

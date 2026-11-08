const $=(s,r=document)=>r.querySelector(s);
$('#year').textContent=new Date().getFullYear();
const menu=$('#menuButton'),nav=$('.header nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
const filters=[...document.querySelectorAll('[data-filter]')],features=[...document.querySelectorAll('.feature')],empty=$('#filterEmpty');
filters.forEach(button=>button.addEventListener('click',()=>{const kind=button.dataset.filter;filters.forEach(b=>b.classList.toggle('active',b===button));let shown=0;features.forEach(card=>{const visible=kind==='all'||card.dataset.kind===kind;card.hidden=!visible;if(visible)shown++});empty.hidden=shown!==0}));
const now=new Date();$('#todayLabel').textContent=now.toLocaleDateString('ja-JP',{year:'numeric',month:'long',day:'numeric'})+' / SCHOOL EDITION';

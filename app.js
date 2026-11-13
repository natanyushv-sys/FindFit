const themeBtn=document.getElementById('themeBtn');const langBtn=document.getElementById('langBtn');const notice=document.getElementById('notice');
if(localStorage.getItem('findfit-theme')==='dark')document.body.classList.add('dark');
themeBtn?.addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('findfit-theme',document.body.classList.contains('dark')?'dark':'light')});
langBtn?.addEventListener('click',()=>showNotice('תמיכה מלאה באנגלית תתווסף בהמשך.'));
function showNotice(msg){if(!notice)return;notice.textContent=msg;notice.classList.add('show');setTimeout(()=>notice.classList.remove('show'),2300)}
document.querySelectorAll('[data-search]').forEach(b=>b.addEventListener('click',()=>{const input=document.getElementById('searchInput');if(input){input.value=b.dataset.search;input.focus()}}));
document.getElementById('searchForm')?.addEventListener('submit',e=>{e.preventDefault();const q=document.getElementById('searchInput').value.trim();showNotice(q?'מנוע החיפוש עדיין בפיתוח — עוד מעט יהיה אפשר לחפש מוצרים.':'כתוב שם של מוצר כדי להתחיל.')});

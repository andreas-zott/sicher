// ASiC Handel 2.0 — gemeinsame Sicherung in der Begehung
(function(){
 document.addEventListener('DOMContentLoaded',()=>{
   const saveNas=document.getElementById('btn-save-nas');
   if(saveNas){saveNas.textContent='☁️ Markt auf NAS speichern';saveNas.onclick=async()=>{try{if(typeof saveState==='function')saveState();const r=await ASiCMarket.saveServer();showToast('Markt gespeichert: '+(r.fileName||'OK'))}catch(e){showToast('NAS-Speichern fehlgeschlagen: '+e.message,'error')}}}
   const menu=saveNas?.parentElement;
   if(menu&&!document.getElementById('btn-market-export')){const b=document.createElement('button');b.className='menu-item';b.id='btn-market-export';b.type='button';b.textContent='💾 Gesamtsicherung Markt';b.onclick=()=>{if(typeof saveState==='function')saveState();ASiCMarket.download()};saveNas.insertAdjacentElement('afterend',b)}
 });
})();
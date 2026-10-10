// ASiC Handel 2.0 — gemeinsamer Markt-/Standortcontainer
(function(){
  const AUDIT_KEY='begehungState', GBO_KEY='asicGboStateV1', FORMAT='ASiC-Marktcontainer', VERSION=2;
  const read=(k,f={})=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  function baseUrl(){try{return (localStorage.getItem('nasBaseUrl')||'').trim()}catch(e){return ''}}
  function apiKey(){try{return localStorage.getItem('nasApiKey')||''}catch(e){return ''}}
  function url(path){const b=baseUrl();return b?b.replace(/\/+$/,'')+'/'+path:'./'+path}
  function opts(o={}){const k=apiKey();return k?{...o,headers:{...(o.headers||{}),'X-Api-Key':k}}:o}
  async function json(res){try{return await res.json()}catch(e){throw new Error('Ungültige Serverantwort (kein JSON).')}}
  function audit(){return read(AUDIT_KEY,{})}
  function gbo(){return read(GBO_KEY,{})}
  function marketNo(){return audit().companyInfo?.marktnummer||gbo().meta?.marktnummer||''}
  function container(){const a=audit(),g=gbo();return {format:FORMAT,formatVersion:VERSION,appVersion:(typeof APP_REVISION!=='undefined'?APP_REVISION:'2.0.25'),savedAt:new Date().toISOString(),market:{marktnummer:marketNo(),plzOrt:a.companyInfo?.plzOrt||g.meta?.plzOrt||'',strasse:a.companyInfo?.strasse||g.meta?.strasse||''},companyInfo:a.companyInfo||{},audit:a,gbo:g,links:read('asicMarketLinksV2',[])} }
  function isContainer(x){return !!x&&x.format===FORMAT&&Number(x.formatVersion)>=2}
  function apply(x,scope='all'){
    if(isContainer(x)){
      if(scope!=='gbo'&&x.audit)write(AUDIT_KEY,x.audit);
      if(scope!=='audit'&&x.gbo)write(GBO_KEY,x.gbo);
      if(scope==='all'&&Array.isArray(x.links))write('asicMarketLinksV2',x.links);
      return 'market';
    }
    if(x?.format==='ASiC-GBO'||x?.state?.answers||x?.answers){if(scope!=='audit')write(GBO_KEY,x.state||x);return 'gbo'}
    if(x?.companyInfo||x?.ratings||x?.measures){if(scope!=='gbo')write(AUDIT_KEY,x);return 'audit'}
    throw new Error('Unbekanntes ASiC-Datenformat.');
  }
  async function saveServer(){const payload=container();const res=await fetch(url('save.php'),opts({method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',body:JSON.stringify(payload)}));const r=await json(res);if(!res.ok||!r.ok)throw new Error(r.message||`Fehler beim Speichern (HTTP ${res.status}).`);return r}
  async function listServer(){const res=await fetch(url('list.php'),opts({cache:'no-store'}));const r=await json(res);if(!res.ok||!r.ok)throw new Error(r.message||`Fehler beim Abrufen (HTTP ${res.status}).`);return r.files||[]}
  async function loadServer(filename){const res=await fetch(url('load.php')+'?filename='+encodeURIComponent(filename),opts({cache:'no-store'}));const r=await json(res);if(!res.ok)throw new Error(r?.message||`Fehler beim Laden (HTTP ${res.status}).`);apply(r,'all');return r}
  function safe(v,f='ohne-Marktnummer'){return String(v||f).trim().replace(/[^a-z0-9äöüß_-]+/gi,'-').replace(/^-+|-+$/g,'')||f}
  function filename(){return `ASiC_Markt_${safe(marketNo())}_${(typeof todayIsoLocal==='function'?todayIsoLocal():new Date().toISOString().slice(0,10))}.json`}
  function download(){const data=JSON.stringify(container(),null,2),blob=new Blob([data],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename();a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  window.ASiCMarket={FORMAT,VERSION,container,isContainer,apply,saveServer,listServer,loadServer,download,filename,baseUrl};
})();
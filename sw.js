// Keeps a copy of the arcade page for offline play. Never touches downloads or big files.
const C='pa-v2',KEEP=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(KEEP)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin||u.pathname.includes('/downloads/'))return;
 const page=r.mode==='navigate';
 if(!page&&!KEEP.some(k=>u.pathname.endsWith(k.replace('./',''))&&k!=='./'))return;
 e.respondWith(fetch(r).then(res=>{if(res.ok&&page){const cp=res.clone();caches.open(C).then(c=>c.put('index.html',cp))}return res})
  .catch(()=>caches.match(page?'index.html':r).then(m=>m||caches.match('index.html'))))});

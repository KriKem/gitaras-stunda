// Offline support. Pages and files come from the network when online (so updates arrive at once)
// and from this cache when offline. Fonts are cache-first. Raise VERSION when the file list changes.
const VERSION='gs-app-1';
const FILES=["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "img/app-icon.webp", "img/badge-1.webp", "img/badge-2.webp", "img/badge-3.webp", "img/badge-4.webp", "img/badge-5.webp", "img/badge-6.webp", "img/ebony.webp", "img/hero-tall.webp", "img/hero-wide.webp", "img/ico-comp.webp", "img/ico-fret.webp", "img/ico-rep.webp", "img/ico-tech.webp", "img/ico-theory.webp", "img/tubes.webp"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp))}return res})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(hit=>hit||caches.match('index.html'))));
  }else if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));return res})));
  }});

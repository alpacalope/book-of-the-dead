// Offline app cache for The Book of the Dead. Your family data is never stored here:
// it lives in this browser's own storage and in your Supabase account.
const V='bod-shell-1793034913', RT='bod-runtime';
const SHELL=['./','index.html','config.js','library.json','lessons.json','manifest.webmanifest','vendor/supabase.js','vendor/591.supabase.js','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())) });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==RT).map(k=>caches.delete(k)))).then(()=>self.clients.claim())) });
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(/supabase\.(co|in)$/.test(u.hostname)) return;                       // live data and files: always straight to your account
  if(r.mode==='navigate'){                                                 // the app itself: newest when online, cached copy when not
    e.respondWith(fetch(r).then(res=>{ const copy=res.clone(); caches.open(V).then(c=>c.put('index.html',copy)); return res }).catch(()=>caches.match('index.html')));
    return }
  if(u.origin===location.origin){                                          // app files: cached copy at once, refreshed in the background
    e.respondWith(caches.match(r).then(hit=>{ const net=fetch(r).then(res=>{ if(res.ok){ const copy=res.clone(); caches.open(V).then(c=>c.put(r,copy)) } return res }).catch(()=>hit); return hit||net }));
    return }
  if(/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){            // fonts: kept once fetched
    e.respondWith(caches.open(RT).then(c=>c.match(r).then(hit=>hit||fetch(r).then(res=>{ c.put(r,res.clone()); return res }))));
  }
});

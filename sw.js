const CACHE='lecturaveloz-v2';
const BASE='/Aplicacion-de-prueba-Cloude-/';
const ASSETS=[BASE,BASE+'index.html',BASE+'css/styles.css',BASE+'js/app.js',BASE+'js/exercises.js',BASE+'js/storage.js',BASE+'data/gospels-mateo.js',BASE+'data/gospels-marcos.js',BASE+'data/gospels-lucas.js',BASE+'data/gospels-juan.js',BASE+'data/comprehension-questions.js',BASE+'manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(nr=>{if(nr&&nr.status===200){const c=nr.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c))}return nr}).catch(()=>e.request.mode==='navigate'?caches.match(BASE+'index.html'):undefined)))});

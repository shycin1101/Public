/**
 * Service Worker —— 只干一件事：让页面离线也能打开。
 *
 * 策略：导航请求 network-first（有网就拿最新版，改版刷新即得），失败回退缓存。
 * 整个应用是单文件，缓存就一个 index.html + 图标，简单到不需要库。
 */
const CACHE = 'dingtou-v3'
const ASSETS = ['./index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  // 只管自己的源；Gist API、Server酱 等跨域请求一律直连
  if (url.origin !== self.location.origin) return
  if (e.request.mode !== 'navigate') return

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // 顺手更新缓存
        const copy = res.clone()
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {})
        return res
      })
      .catch(() => caches.match(e.request).then((hit) => hit || caches.match('./index.html'))),
  )
})

/**
 * Service Worker —— 只干一件事：让页面离线也能打开。
 *
 * 策略：导航请求 network-first（有网就拿最新版），失败回退缓存。
 * 整个应用是单文件，缓存就一个 index.html + 图标，简单到不需要库。
 *
 * ── 版本号的坑（这里踩过） ──────────────────────────
 * 浏览器判断"SW 要不要更新"靠的是 sw.js 文件的**字节是否变化**。
 * 以前 CACHE 写死成 'dingtou-v3'，于是 sw.js 永远一个字节都不变：
 *   → 浏览器永远不重装 SW
 *   → install / activate 永远不重跑
 *   → 那个缓存桶永远不换名字、永远不清
 * 结果就是：浏览器直接打开是新版本，而"添加到桌面"的应用一直停在旧版。
 *
 * 修法：CACHE 名里带上构建号，构建时由 vite.config.js 把 20260922151638 替换掉。
 * 每次构建 sw.js 字节必变 → 浏览器一定会发现新版本 → 页面提示"点击更新"。
 */
const CACHE = 'dingtou-20260922151638'
const ASSETS = ['./index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png']

self.addEventListener('install', (e) => {
  // 预缓存失败不能让安装卡死：图标 404 是常事，页面本身能离线就够了
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(ASSETS).catch(() => {}))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

// 页面点"立即更新"时发这条消息：让等待中的新 SW 立刻接管
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  // 只管自己的源；Gist API、Server酱 等跨域请求一律直连
  if (url.origin !== self.location.origin) return
  if (e.request.mode !== 'navigate') return

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // 顺手更新缓存。只缓存 200 —— 把 404/500 存进去等于把故障钉死在缓存里
        if (res && res.ok) {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {})
        }
        return res
      })
      .catch(() =>
        caches.match(e.request).then((hit) => hit || caches.match('./index.html')),
      ),
  )
})

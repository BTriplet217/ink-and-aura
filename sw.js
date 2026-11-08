// Ink & Aura offline cache. Network first: whenever you're online you get the newest build that was pushed,
// and the copy is saved so the game still opens with no signal.
var CACHE = "ink-and-aura";
var CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png",
  "music/joy.mp3", "music/hope.mp3", "music/fear.mp3", "music/shame.mp3", "music/sadness.mp3", "music/surprise.mp3"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function (e) {
  var req = e.request; if (req.method !== "GET") return;
  e.respondWith(fetch(req).then(function (res) {
    if (res && (res.ok || res.type === "opaque")) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () { return caches.match(req, { ignoreSearch: true }).then(function (r) { return r || caches.match("index.html"); }); }));
});

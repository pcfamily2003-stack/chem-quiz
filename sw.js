// اسم الكاش — غيّره لرقم جديد (v2, v3...) في كل مرة تحدّث فيها التطبيق
// حتى يجبر المتصفح على تنزيل النسخة الجديدة بدل القديمة المخزّنة
const CACHE_NAME = 'zarra-chem-app-v1';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// عند أول تثبيت: نزّل وخزّن كل ملفات التطبيق
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

// عند التفعيل: احذف أي نسخ كاش قديمة من إصدارات سابقة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// عند كل طلب: إذا كان الملف مخزّنًا في الكاش أعطه فورًا (يعمل بدون نت)
// وإن لم يكن مخزنًا حاول تحميله من الإنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("tarein-cache").then((cache) => {
            return cache.addAll([
                "/",
                "/index.html",
                "/Icons/Tareín-fondo_transparente.png",
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("push", (event) => {
    const data = event.data.json();
    const options = {
        body: data.task,
        icon: "/icons/Tareín-fondo_blanco.jpg",
        badge: "/icons/Tareín-badge.png"
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});
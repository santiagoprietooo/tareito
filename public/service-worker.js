self.addEventListener("push", (event) => {
    const data = event.data.json();
    const options = {
        body: data.task,
        icon: "/icons/Tareín-fondo_blanco.jpg",
        badge: "/icons/Tareín-badge.png"
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (const client of clientList) {
                if (client.url.includes('/') && 'focus' in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

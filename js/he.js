document.addEventListener('DOMContentLoaded', function() {
    // Térkép inicializálása
    const map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Bejegyzések betöltése
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById('postsContainer');
            postsContainer.innerHTML = '';
           
            posts.forEach(post => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                `;
                postsContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Hiba a bejegyzések betöltésekor:', error);
            document.getElementById('postsContainer').innerHTML =
                '<div class="error">Hiba történt a bejegyzések betöltésekor.</div>';
        });

    // Felhasználók betöltése és megjelenítése a térképen
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(users => {
            const markers = [];
           
            users.forEach(user => {
                const lat = parseFloat(user.address.geo.lat);
                const lng = parseFloat(user.address.geo.lng);
               
                if (!isNaN(lat) && !isNaN(lng)) {
                    const marker = L.marker([lat, lng]).addTo(map);
                    marker.bindPopup(`<b>${user.name}</b><br>${user.email}`);
                    markers.push(marker);
                }
            });
           
            // Térkép középre állítása a marker-ek alapján
            if (markers.length > 0) {
                const group = new L.featureGroup(markers);
                map.fitBounds(group.getBounds());
            }
        })
        .catch(error => {
            console.error('Hiba a felhasználók betöltésekor:', error);
        });
});
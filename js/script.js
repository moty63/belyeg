document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts'),
        fetch('https://jsonplaceholder.typicode.com/users')
    ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(([posts, users]) => {
        const userPostsContainer = document.getElementById('userPostsContainer');
        userPostsContainer.innerHTML = '';

        const usersWithPosts = users.map(user => {
            return {
                ...user,
                posts: posts.filter(post => post.userId === user.id)
            };
        });

        usersWithPosts.forEach(user => {
            if (user.posts.length > 0) {
                const userSection = document.createElement('div');
                userSection.className = 'user-valami';
                
                const userName = document.createElement('h3');
                userName.className = 'user-nev';
                userName.textContent = user.name;
                
                const postsContainer = document.createElement('div');
                postsContainer.className = 'user-posts';
                
                user.posts.forEach(post => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <h2>${post.title}</h2>
                        <p>${post.body}</p>
                    `;
                    postsContainer.appendChild(card);
                });
                
                userSection.appendChild(userName);
                userSection.appendChild(postsContainer);
                userPostsContainer.appendChild(userSection);
            }
        });

        const markers = [];
        users.forEach(user => {
            const lat = parseFloat(user.address.geo.lat);
            const lng = parseFloat(user.address.geo.lng);
           
            if (!isNaN(lat) && !isNaN(lng)) {
                const marker = L.marker([lat, lng]).addTo(map);
                marker.bindPopup(`
                    <b>${user.name}</b><br>
                    <small>${user.email}</small><br>
                    <i>${user.posts?.length || 0} bejegyzés</i>
                `);
                markers.push(marker);
            }
        });
       
        if (markers.length > 0) {
            const group = new L.featureGroup(markers);
            map.fitBounds(group.getBounds());
        }
    })
    .catch(error => {
        console.error('Hiba az adatok betöltésekor:', error);
        document.getElementById('userPostsContainer').innerHTML =
            '<div class="error">Hiba történt az adatok betöltésekor.</div>';
    });
});
const API_KEY = '3f38bc39ylKXHyVWWRZLFRg6efC5HUFsnmXYW1Jd'; 
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

// Elementos del DOM
const datePicker = document.getElementById('date-picker');
const mediaContainer = document.getElementById('media-container');
const titleElem = document.getElementById('apod-title');
const dateElem = document.getElementById('apod-date');
const expElem = document.getElementById('apod-explanation');
const btnSave = document.getElementById('btn-save');
const favsListElem = document.getElementById('favorites-list');
const loader = document.getElementById('loader');

let currentApodData = null;

// 1. Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Establecer fecha máxima (hoy)
    const today = new Date().toISOString().split('T')[0];
    datePicker.max = today;
    datePicker.value = today;

    fetchApod(today);
    renderFavorites();
});

// 2. Obtener datos de la NASA
async function fetchApod(date) {
    showLoader(true);
    try {
        const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&date=${date}`);
        const data = await response.json();
        currentApodData = data;
        displayApod(data);
    } catch (error) {
        console.error("Error al obtener APOD:", error);
        mediaContainer.innerHTML = `<p class="text-danger">Error al cargar la imagen. Intenta de nuevo.</p>`;
    } finally {
        showLoader(false);
    }
}

// 3. Mostrar en pantalla
function displayApod(data) {
    titleElem.textContent = data.title;
    dateElem.textContent = data.date;
    expElem.textContent = data.explanation;
    
    mediaContainer.innerHTML = '';
    if (data.media_type === 'image') {
        mediaContainer.innerHTML = `<img src="${data.url}" id="apod-image" alt="${data.title}" class="shadow">`;
    } else {
        mediaContainer.innerHTML = `
            <div class="ratio ratio-16x9">
                <iframe src="${data.url}" allowfullscreen class="rounded shadow"></iframe>
            </div>`;
    }
}

// 4. Sistema de Favoritos (LocalStorage)
btnSave.addEventListener('click', () => {
    if (!currentApodData) return;

    let favs = JSON.parse(localStorage.getItem('nasa_favs')) || [];
    
    // Evitar duplicados
    if (!favs.find(f => f.date === currentApodData.date)) {
        favs.push({
            date: currentApodData.date,
            title: currentApodData.title
        });
        localStorage.setItem('nasa_favs', JSON.stringify(favs));
        renderFavorites();
        alert('¡Guardado en favoritos!');
    }
});

function renderFavorites() {
    const favs = JSON.parse(localStorage.getItem('nasa_favs')) || [];
    favsListElem.innerHTML = favs.length === 0 ? '<p class="text-muted small">No tienes favoritos aún.</p>' : '';

    favs.forEach(fav => {
        const item = document.createElement('div');
        item.className = 'list-group-item bg-transparent text-white border-secondary fav-item d-flex justify-content-between align-items-center';
        item.innerHTML = `
            <span onclick="fetchApod('${fav.date}')">${fav.title} <br><small class="text-info">${fav.date}</small></span>
            <i class="bi bi-x-circle text-danger" onclick="removeFavorite('${fav.date}')"></i>
        `;
        favsListElem.appendChild(item);
    });
}

function removeFavorite(date) {
    let favs = JSON.parse(localStorage.getItem('nasa_favs')) || [];
    favs = favs.filter(f => f.date !== date);
    localStorage.setItem('nasa_favs', JSON.stringify(favs));
    renderFavorites();
}

// 5. Manejo de eventos
datePicker.addEventListener('change', (e) => fetchApod(e.target.value));

function showLoader(show) {
    loader.classList.toggle('d-none', !show);
    mediaContainer.classList.toggle('d-none', show);
}
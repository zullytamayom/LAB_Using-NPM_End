
const API_KEY = '3f38bc39ylKXHyVWWRZLFRg6efC5HUFsnmXYW1Jd'; 
const URL = 'https://api.nasa.gov/planetary/apod';

const buscadorFecha = document.getElementById('date-picker');
const titulo = document.getElementById('apod-title');
const description = document.getElementById('apod-explanation');
const date = document.getElementById('apod-date');
const imagenContenedor = document.getElementById('media-container');
const hoy = new Date().toISOString().split('T')[0];
const loader = document.getElementById('loader');  //agregamos ya que el loader estaba permanentemente activo.
const btnGuardar = document.getElementById('btn-save');
const listaFavs = document.getElementById('favorites-list')


function buscarFoto(fecha) {
    loader.style.display = 'block';
    fetch(`${URL}?api_key=${API_KEY}&date=${fecha}`)
        .then(respuesta => respuesta.json()) 
        .then(datos => {

            titulo.innerText = datos.title;
            description.innerText = datos.explanation;
            date.innerText = datos.date;
            imagenContenedor.innerHTML = `<img src="${datos.url}" width="100%">`;
            loader.style.display = 'none'; 
        });
}

buscadorFecha.addEventListener('change', () => {
    buscarFoto(buscadorFecha.value); 
});

buscadorFecha.max = hoy;
buscadorFecha.value = hoy;  
buscarFoto(hoy); 

btnGuardar.addEventListener('click', () => {
    let favoritos = JSON.parse(localStorage.getItem('nasaFavs')) || [];
    const nuevaFoto = { title: titulo.innerText, date: date.innerText };

    if (!favoritos.some(f => f.date === nuevaFoto.date)) {
        favoritos.push(nuevaFoto);
        localStorage.setItem('nasaFavs', JSON.stringify(favoritos));
        renderizarFavs();
    }
});
function renderizarFavs() {
    const favoritos = JSON.parse(localStorage.getItem('nasaFavs')) || [];
    listaFavs.innerHTML = favoritos.map((f, i) => `
        <li>
            ${f.date} - ${f.title} 
            <button onclick="eliminarFav(${i})">❌</button>
        </li>
    `).join('');
}

window.eliminarFav = (index) => {
    let favoritos = JSON.parse(localStorage.getItem('nasaFavs'));
    favoritos.splice(index, 1);
    localStorage.setItem('nasaFavs', JSON.stringify(favoritos));
    renderizarFavs();
};
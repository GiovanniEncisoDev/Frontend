const API_URL = 'https://backend-lh75.onrender.com/peliculas';

async function cargarPeliculas() {
  try {
    const res = await fetch(API_URL);
    const peliculas = await res.json();

    const tbody = document.querySelector('#tablaPeliculas tbody');
    tbody.innerHTML = '';

    peliculas.forEach(p => {
      const id = p.idPelicula;
      if (!id) {
        console.warn('Película con ID inválido:', p);
        return; // Salta esta película
      }

      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${id}</td>
        <td>${p.titulo}</td>
        <td>${p.director}</td>
        <td>${p.genero}</td>
        <td>${p.anio}</td>
        <td><img src="${p.imagen || ''}" alt="img" width="50"></td>
        <td><a href="${p.url || '#'}" target="_blank">Ver</a></td>
        <td><button class="btn-eliminar" data-id="${id}">Eliminar</button></td>
      `;
      tbody.appendChild(fila);
    });
  } catch (err) {
    console.error('Error al cargar películas:', err);
    alert('Error al cargar películas');
  }
}


// Delegación de evento para eliminar
document.querySelector('#tablaPeliculas tbody').addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-eliminar')) {
    const id = e.target.dataset.id;
    if (!id) {
      alert('ID no válido para eliminar');
      return;
    }
    if (confirm('¿Estás seguro de eliminar esta película?')) {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        cargarPeliculas();
      } else {
        alert('Error al eliminar la película');
      }
    }
  }
});

document.getElementById('formAgregar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    titulo: document.getElementById('titulo').value.trim(),
    director: document.getElementById('director').value.trim(),
    genero: document.getElementById('genero').value.trim(),
    anio: parseInt(document.getElementById('anio').value),
    imagen: document.getElementById('imagen').value.trim(),
    url: document.getElementById('url').value.trim(),
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    cargarPeliculas();
    e.target.reset();
  } else {
    alert('Error al agregar la película');
  }
});

/* Método de respaldo para asignar IDs secuenciales si vienen como undefined
function corregirIdsFallback() {
  const botones = document.querySelectorAll('.btn-eliminar');
  botones.forEach((btn, index) => {
    if (!btn.dataset.id || btn.dataset.id === 'undefined') {
      btn.dataset.id = index + 1; // Asume que los IDs empiezan en 1 y son secuenciales
    }
  });
}
*/

cargarPeliculas();
// corregirIdsFallback(); // Descomenta solo para pruebas si los IDs llegan como undefined
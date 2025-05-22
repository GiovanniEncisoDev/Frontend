const API_URL = 'https://backend-lh75.onrender.com/peliculas';

async function cargarPeliculas() {
  const res = await fetch(API_URL);
  const peliculas = await res.json();

  const tbody = document.querySelector('#tablaPeliculas tbody');
  tbody.innerHTML = '';

  peliculas.forEach(p => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.id}</td>
      <td>${p.titulo}</td>
      <td>${p.director}</td>
      <td>${p.genero}</td>
      <td>${p.anio}</td>
      <td><img src="${p.imagen || ''}" alt="img" width="50"></td>
      <td><a href="${p.url || '#'}" target="_blank">Ver</a></td>
      <td><button onclick="eliminar(${p.id})">Eliminar</button></td>
      `;
    tbody.appendChild(fila);
  });
}

document.getElementById('formAgregar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    titulo: document.getElementById('titulo').value,
    director: document.getElementById('director').value,
    genero: document.getElementById('genero').value,
    anio: document.getElementById('anio').value,
    imagen: document.getElementById('imagen').value,
    url: document.getElementById('url').value,
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

async function eliminar(id) {
  if (!confirm('¿Estás seguro de eliminar esta película?')) return;
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (res.ok) cargarPeliculas();
}

cargarPeliculas();

let mapaIniciado = false;
let mapa;

async function geocodificarEndereco(endereco) {
  const resposta = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco + ", Petrópolis, RJ")}`);
  const dados = await resposta.json();
  if (dados && dados.length > 0) {
    return [parseFloat(dados[0].lat), parseFloat(dados[0].lon)];
  }
  return null;
}

async function mostrarMapa() {
  const modal = document.getElementById('mapModal');
  const mapaDiv = document.getElementById('map');

  modal.style.display = 'flex';

  // Aguarda o DOM atualizar o display
  setTimeout(async () => {
    if (!mapaIniciado) {
      mapaIniciado = true;

      mapa = L.map('map').setView([-22.505999, -43.178394], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapa);

      const escolas = document.querySelectorAll('li[data-endereco]');

      for (const escola of escolas) {
        const nome = escola.getAttribute('data-nome');
        const endereco = escola.getAttribute('data-endereco');
        const vagas = escola.getAttribute('data-vagas');

        const coords = await geocodificarEndereco(endereco);
        if (coords) {
          L.marker(coords).addTo(mapa).bindPopup(`<b>${nome}</b><br>${endereco}<br>${vagas} vagas disponíveis`);
        }
      }
    } else {
      mapa.invalidateSize(); // força o Leaflet a recarregar corretamente
    }
  }, 100); // espera 100ms pro DOM renderizar antes de iniciar o mapa
}

function fecharMapa() {
  const modal = document.getElementById('mapModal');
  modal.style.display = 'none';
}

window.onload = () => {
  window.mostrarMapa = mostrarMapa;
  window.fecharMapa = fecharMapa;
};

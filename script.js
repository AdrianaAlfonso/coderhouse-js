// Definir las proporciones de los diferentes materiales
const materialRatios = {
  concreto: { cemento: 1, arena: 2, grava: 3 }, // 1:2:3
  mamposteria: { cemento: 1, arena: 4, grava: 0.5 }, // 1:4:0.5
  revoque: { cemento: 1, arena: 6, grava: 0 }, // 1:6:0
};

// Función para actualizar el ratio mostrado
function updateRatios() {
  const materialType = document.getElementById('materialType').value;
  const ratios = materialRatios[materialType];

  const ratioText = `Cemento: ${ratios.cemento}, Arena: ${ratios.arena}, Grava: ${ratios.grava}`;
  const materialRatiosDiv = document.getElementById('materialRatios');
  materialRatiosDiv.innerHTML = `<strong>Proporción actual:</strong> ${ratioText}`;
}


// Función para calcular los materiales y sus costos
function calculateMaterials() {
  const materialType = document.getElementById('materialType').value;
  const volumeInput = document.getElementById('volume');
  const cementPriceInput = document.getElementById('cementPrice');
  const sandPriceInput = document.getElementById('sandPrice');
  const gravelPriceInput = document.getElementById('gravelPrice');

  const volume = parseFloat(volumeInput.value);
  const cementPrice = parseFloat(cementPriceInput.value);
  const sandPrice = parseFloat(sandPriceInput.value);
  const gravelPrice = parseFloat(gravelPriceInput.value);

  // Validar entradas
  if (
    isNaN(volume) ||
    volume <= 0 ||
    isNaN(cementPrice) ||
    isNaN(sandPrice) ||
    isNaN(gravelPrice)
  ) {
    alert('Por favor, ingrese valores válidos.');
    return;
  }

  // Obtener proporciones del material seleccionado
  const ratios = materialRatios[materialType];
  const totalRatio = ratios.cemento + ratios.arena + ratios.grava;

  // Calcular volúmenes de materiales
  const materials = {
    cemento: (ratios.cemento / totalRatio) * volume,
    arena: (ratios.arena / totalRatio) * volume,
    grava: (ratios.grava / totalRatio) * volume,
  };

  // Calcular costos
  const unitPrices = {
    cemento: cementPrice,
    arena: sandPrice,
    grava: gravelPrice,
  };
  let totalCost = 0;

  for (const material in materials) {
    const materialVolume = materials[material];
    const materialCost = materialVolume * unitPrices[material];
    totalCost += materialCost;
  }

  // Mostrar resultados
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `
      <h3>Materiales necesarios para ${materialType}:</h3>
      <p><strong>Cemento:</strong> ${materials.cemento.toFixed(2)} m³ (${(
    materials.cemento * cementPrice
  ).toFixed(2)} $)</p>
      <p><strong>Arena:</strong> ${materials.arena.toFixed(2)} m³ (${(
    materials.arena * sandPrice
  ).toFixed(2)} $)</p>
      ${
        materials.grava > 0
          ? `<p><strong>Grava:</strong> ${materials.grava.toFixed(2)} m³ (${(
              materials.grava * gravelPrice
            ).toFixed(2)} $)</p>`
          : ''
      }
      <hr>
      <h4><strong>Costo total:</strong> ${totalCost.toFixed(2)} $</h4>
  `;
}

// Inicializar el ratio mostrado al cargar la página
updateRatios();

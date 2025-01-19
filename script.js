// Definir las proporciones de los diferentes materiales
const storagesTypes = {
  MATERIALES_BASICOS: 'materiales-basicos',
  MATERIALES_AVANZADOS: 'materiales-avanzados',
};
const storageName = `coderhouse-adri-:STORAGE_NAME`;

// Función para crear un nuevo botón
function newButtonComponent({
  id,
  texto,
  clase = 'btn btn-primary w-100',
  action,
}) {
  const newButton = document.createElement('button');
  newButton.id = id;
  newButton.className = clase;
  newButton.textContent = texto;
  newButton.addEventListener('click', action);

  return newButton;
}

// Función para crear un nuevo input de precio de material
function inputMaterialPriceComponent(material, price, unit) {
  const materialInputStringTemplate = `<div class="mb-3">
              <label for=":material" class="form-label capitalize"
                >:material x :unit:</label
              >
              <input
                type="number"
                id=":material"
                class="form-control"
                placeholder="Ingrese el precio"
                min="0"
                step="0.01"/>
                <p class="text-muted">Precio actual: $:price </p>
            </div>`;
  return materialInputStringTemplate
    .replace(/:material/g, material)
    .replace(/:unit/g, unit)
    .replace(/:price/g, price);
}

// Funciones para leer y escribir en el localStorage
function readStorage(tableName) {
  const name = storageName.replace(':STORAGE_NAME', tableName);
  const storage = localStorage.getItem(name);
  if (storage) {
    return JSON.parse(storage);
  }
  return {};
}

function writeStorage(tableName, data) {
  const name = storageName.replace(':STORAGE_NAME', tableName);
  localStorage.setItem(name, JSON.stringify(data));
}

// Función para inicializar el localStorage con datos de prueba

function initiateStorage() {
  // Inicialmente cargamos estos datos en el localStorage para tener datos de prueba
  const materialDataStorage = {
    [storagesTypes.MATERIALES_AVANZADOS]: {
      // Proporciones de los materiales avanzados, "Cuanto necesito de cada material para hacer 1 m³ de mezcla"
      concreto: { cemento: 1, arena: 2, grava: 3 }, // 1:2:3
      mamposteria: { cemento: 1, arena: 4, grava: 0.5 }, // 1:4:0.5
      revoque: { cemento: 1, arena: 6, grava: 0 }, // 1:6:0
    },
    [storagesTypes.MATERIALES_BASICOS]: {
      // Materiales basicos y sus precios
      cemento: {
        precio: 10,
        unidad: 'm³',
      },
      arena: {
        precio: 5,
        unidad: 'm³',
      },
      grava: {
        precio: 7,
        unidad: 'm³',
      },
    },
  };

  const advancedMaterials = readStorage(storagesTypes.MATERIALES_AVANZADOS);
  if (Object.keys(advancedMaterials).length === 0) {
    writeStorage(
      storagesTypes.MATERIALES_AVANZADOS,
      materialDataStorage[storagesTypes.MATERIALES_AVANZADOS]
    );
  }

  const basicMaterials = readStorage(storagesTypes.MATERIALES_BASICOS);

  if (Object.keys(basicMaterials).length === 0) {
    writeStorage(
      storagesTypes.MATERIALES_BASICOS,
      materialDataStorage[storagesTypes.MATERIALES_BASICOS]
    );
  }
}

// Función para actualizar el ratio mostrado
function updateRatios() {
  const advancedMaterials = readStorage(storagesTypes.MATERIALES_AVANZADOS);

  const materialType = document.getElementById('materialType').value;

  const ratios = advancedMaterials[materialType];

  // const ratioText = `Cemento: ${ratios.cemento}, Arena: ${ratios.arena}, Grava: ${ratios.grava}`;
  const ratioText = Object.keys(ratios)
    .map((key) => `${key}: ${ratios[key]}`)
    .join(', ');
  const materialRatiosDiv = document.getElementById('materialRatios');
  materialRatiosDiv.innerHTML = `<strong>Proporción actual:</strong> ${ratioText}`;
}

// Función para calcular los materiales y sus costos
function calculateMaterials() {
  const advancedMaterials = readStorage(storagesTypes.MATERIALES_AVANZADOS);
  const basicMaterials = readStorage(storagesTypes.MATERIALES_BASICOS);

  const materialType = document.getElementById('materialType').value;
  const volumeInput = document.getElementById('volume');

  if (!volumeInput.value) {
    return;
  }

  const volume = parseFloat(volumeInput.value);

  // Validar entradas
  if (isNaN(volume) || volume <= 0) {
    alert('Por favor, ingrese valores válidos.');
    return;
  }

  // Obtener proporciones del material seleccionado
  const ratios = advancedMaterials[materialType];
  // sustituir los valores de los materiales avanzados por los valores del localStorage
  // const totalRatio = ratios.cemento + ratios.arena + ratios.grava;
  const totalRatio = Object.keys(ratios).reduce(
    (acc, key) => ratios[key] + acc,
    0
  );

  // Calcular volúmenes de materiales
  const materialsAmount = (() => {
    let result = {};
    for (const key in ratios) {
      result[key] = (ratios[key] / totalRatio) * volume;
    }
    return result;
  })();

  // Calcular costos
  let totalCost = 0;

  const materialData = Object.keys(materialsAmount).map((material) => {
    const volumeOfMaterial = materialsAmount[material];
    const basicMaterial = basicMaterials[material];
    const materialCost = volumeOfMaterial * basicMaterial.precio;
    totalCost += materialCost;

    return `<p><strong class="materialName">${material}:</strong> ${volumeOfMaterial.toFixed(
      2
    )} ${basicMaterial.unidad} ($${materialCost.toFixed(2)})</p>`;
  });

  // Mostrar resultados
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML =
    `
      <h3>Materiales necesarios para <strong style="text-transform: capitalize;">${materialType}</strong>:</h3>` +
    materialData.join('') +
    `<hr>
      <h4><strong>Costo total:</strong> $${totalCost.toFixed(2)} </h4>
  `;
}

/* Funciones para renderizar los componentes */
// Función para renderizar las opciones de tipo de material
function renderMaterialTypeOptions() {
  const advancedMaterials = readStorage(storagesTypes.MATERIALES_AVANZADOS);
  const materialTypeSelect = document.getElementById('materialType');

  const options = Object.keys(advancedMaterials).map((materialType) => {
    return `<option value="${materialType}">${materialType}</option>`;
  });

  materialTypeSelect.innerHTML = options.join('');
  materialTypeSelect.addEventListener('change', updateRatios);
}

// Función para inicializar el botón de calcular
function initializeCalculateButton() {
  const calculateButton = document.getElementById('calculateButton');
  calculateButton.addEventListener('click', calculateMaterials);
}

// Función para renderizar el formulario de precios de materiales
function renderCostInputsForm() {
  const basicMaterials = readStorage(storagesTypes.MATERIALES_BASICOS);
  const costsForm = document.getElementById('materialsFormPrices');

  const materialInputs = Object.keys(basicMaterials)
    .map((material) => {
      const materialData = basicMaterials[material];
      return inputMaterialPriceComponent(
        material,
        materialData.precio,
        materialData.unidad
      );
    })
    .join('');

  costsForm.innerHTML = materialInputs;


  // crear el boton de guardar precios y agregarlo al formulario
  const saveButton = newButtonComponent({
    id: 'saveMaterialPrices',
    texto: 'Guardar precios',
    action: storePricesFromMaterialsInput,
  });
  costsForm.appendChild(saveButton);

}

// Función para renderizar los componentes
function renderComponents() {
  renderMaterialTypeOptions();
  renderCostInputsForm();
}

// Función para guardar los precios de los materiales provenientes del formulario
function storePricesFromMaterialsInput() {
  const basicMaterials = readStorage(storagesTypes.MATERIALES_BASICOS);
  const materialInputs = document
    .getElementById('materialsFormPrices')
    .querySelectorAll('input');
  materialInputs.forEach((input) => {
    const material = input.id;
    const inputPrice = parseFloat(input.value);

    if (!isNaN(inputPrice)) {
      basicMaterials[material].precio = inputPrice;
    }
  });
  writeStorage(storagesTypes.MATERIALES_BASICOS, basicMaterials);
  Swal.fire({
      title: "Guardaste tus precios con exito",
      text: "Sigamos trabajando",
      icon: "success"
    });
  renderComponents();
  calculateMaterials();
}







// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
  initiateStorage();
  // Inicializar el ratio mostrado al cargar la página
  updateRatios();
  initializeCalculateButton();
  renderComponents();
});

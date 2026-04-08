const ciudades = [
  { nombre: "Santiago", temp: "22°", estado: "Despejado" },
  { nombre: "Curicó", temp: "19°", estado: "Nublado" },
  { nombre: "Peñaflor", temp: "26°", estado: "Despejado" },
  { nombre: "Temuco", temp: "18°", estado: "Lluvia" },
  { nombre: "La Serena", temp: "25°", estado: "Despejado" },
  { nombre: "Coquimbo", temp: "30°", estado: "Soleado" },
  { nombre: "Concepción", temp: "22°", estado: "Despejado" },
  { nombre: "Chillán", temp: "20°", estado: "Nublado" },
  { nombre: "Los Andes", temp: "22°", estado: "Despejado" },
  { nombre: "Rancagua", temp: "24°", estado: "Soleado" }
];

function caragarHome(){
  const contenedor = document.getElementById("lista-ciudades");
  if (!contenedor) return;

    contenedor.innerHTML = ""; 
    ciudades.forEach(c => {
      contenedor.innerHTML += `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-body text-center">
              <h5 class="card-title">${c.nombre}</h5>
              <p class="card-text display-6">${c.temp}</p>
              <span class="badge bg-primary mb-3">${c.estado}</span>
              <button class="btn btn-outline-dark btn-detalle d-block w-100" onclick="verDetalle('${c.nombre}')">
                Ver detalle
              </button>
            </div>
          </div>
        </div>`;
    });
  }

  function verDetalle(nombre){
    localStorage.setItem("ciudadSeleccionada", nombre);
    window.location.href = "detalle.html";
  }
  function cargaDetalle(){
   const titulo = document.getElementById("nombre-ciudad");
  if (!titulo)return;

    const ciudadGuardada = localStorage.getItem("ciudadSeleccionada");
    const datos = ciudades.find(c => c.nombre === ciudadGuardada);

    if (datos){
      titulo.innerText = datos.nombre;

      document.querySelector(".display-6").innerText = datos.temp;
      document.querySelector(".badge").innerText = datos.estado;
    }
  }
    document.addEventListener("DOMContentLoaded",() => {
      caragarHome();
      cargaDetalle();
    });

 





  
 
 

  
    
    
  

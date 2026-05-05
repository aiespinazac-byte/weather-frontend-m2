const ciudades = [
  {
    id: 1,
    nombre: "Santiago",
    tempActual: 22,
    estadoActual: "Despejado",
    pronosticoSemanal: [
      { dia: "Lunes", min:15, max : 24, estado: "Despejado" },
      { dia: "Martes", min: 16, max: 26 , estado: "Soleado" },
      { dia: "Miércoles", min: 17, max: 23 , estado: "Nublado" },
      { dia: "Jueves", min: 18, max: 21 , estado: "Lluvia" },
      { dia: "Viernes", min: 19, max: 25 , estado: "Despejado" },
      { dia: "Sábado", min: 20, max: 28   , estado: "Soleado" },
      { dia: "Domingo", min: 21, max: 20  , estado: "Nublado" },
    ],
  },
  {
    id: 2,
    nombre: "Temuco",
    tempActual: 18,
    estadoActual: "Lluvia",
    pronosticoSemanal: [
      { dia: "Lunes", min:15, max : 24,  estado: "Lluvia" },
      { dia: "Martes", min: 16, max: 26, estado: "Soleado" },
      { dia: "Miércoles", min: 17, max: 23, estado: "Nublado" },
      { dia: "Jueves", min: 18, max: 21, estado: "Lluvia" },
      { dia: "Viernes", min: 19, max: 25, estado: "Despejado" },
      { dia: "Sábado", min: 20, max: 28, estado: "Soleado" },
      { dia: "Domingo", min: 21, max: 20, estado: "Nublado" },
    ],
  },

  {
    id: 3,
    nombre: "Curicó",
    tempActual: 19,
    estadoActual: "Nublado",
    pronosticoSemanal: [
      { dia: "Lunes", min:15, max : 24, estado: "Despejado" },
      { dia: "Martes", min: 16, max: 26, estado: "Soleado" },
      { dia: "Miércoles", min: 17, max: 23, estado: "Nublado" },
      { dia: "Jueves", min: 18, max: 21, estado: "Lluvia" },
      { dia: "Viernes", min: 19, max: 25, estado: "Despejado" },
      { dia: "Sábado", min: 20, max: 28, estado: "Soleado" },
      { dia: "Domingo", min: 21, max: 20, estado: "Nublado" },
    ],
  },
  {
    id: 4,
    nombre: "Valparaíso",
    tempActual: 21,
    estadoActual: "Despejado",
    pronosticoSemanal: [
      { dia: "Lunes", min:15, max : 24, estado: "Despejado" },
      { dia: "Martes", min: 16, max: 26, estado: "Soleado" },
      { dia: "Miércoles", min: 17, max: 23, estado: "Nublado" },
      { dia: "Jueves", min: 18, max: 21, estado: "Lluvia" },
      { dia: "Viernes", min: 19, max: 25, estado: "Despejado" },
      { dia: "Sábado", min: 20, max: 28, estado: "Soleado" },
      { dia: "Domingo", min: 21, max: 20, estado: "Nublado" },
    ],
  },
  {
    id: 5,
    nombre: "Penaflor",
    tempActual: 21,
    estadoActual: "Despejado",
    pronosticoSemanal: [
      { dia: "Lunes", min:15, max : 24, estado: "Despejado" },
      { dia: "Martes", min: 16, max: 26, estado: "Soleado" },
      { dia: "Miércoles", min: 17, max: 23, estado: "Nublado" },
      { dia: "Jueves", min: 18, max: 21, estado: "Lluvia" },
      { dia: "Viernes", min: 19, max: 25, estado: "Despejado" },
      { dia: "Sábado", min: 20, max: 28, estado: "Soleado" },
      { dia: "Domingo", min: 21, max: 20, estado: "Nublado" },
    ],
  },
];

function calcularEstadisticas(pronostico) {
  let suma= 0;
  let minSemanal= pronostico[0].min;
  let maxSemanal= pronostico[0].max;
  let conteoClima = {Soleado: 0, Nublado: 0, Lluvia: 0, Despejado: 0};

  pronostico.forEach((dia) => {
    suma += (dia.min + dia.max) / 2;
    if (dia.min < minSemanal) minSemanal = dia.min;
    if (dia.max > maxSemanal) maxSemanal = dia.max;
    if (conteoClima[dia.estado]!==undefined) conteoClima[dia.estado]++;
  
  });
    
  const promedio = (suma / pronostico.length).toFixed(1);
  let resumen = (conteoClima.Soleado+conteoClima.Despejado>=4)
  ?"Semana mayormente soleada"
  :"Semana con clima variado";

  return { promedio, minSemanal, maxSemanal, resumen, conteoClima };
}

function cargarHome() {
  const contenedor = document.getElementById("lista-ciudades");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  ciudades.forEach((c) => {
    const esCaluroso = c.tempActual >= 25 ? "weather-card--hot" : "";
    contenedor.innerHTML += `
    <div clas="col-12 col-md-6 col-lg-4">
    <div class="weather-card ${esCaluroso}">
    <div class="weather-card__body">
    <h5 clas="weather-card__title">${c.nombre}</h5>
    <!--°C-->
     <p class="weather-card__status">${c.tempActual}° </p>
    <span class="weather-card__status badge bg-primary">${c.estadoActual}</span>
    <button class="btn btn-outline-dark w-100 mt-3" onclick="verDetalle(${c.id})">
    Ver detalle
    </button>
   
    </div>
    </div>
    </div>`;
  });
}

function verDetalle(id) {
  localStorage.setItem("ciudadSeleccionadaId", id);
  window.location.href = "detalle.html";
}
function cargaDetalle() {
  const titulo = document.getElementById("nombre-ciudad");
  if (!titulo) return;

  const idGuardado = localStorage.getItem("ciudadSeleccionadaId");
  const datos = ciudades.find((c) => c.id == idGuardado);

  if (datos) {
    titulo.innerText = datos.nombre;
     document.getElementById("temp-detalle").innerText = `${datos.tempActual}°C`;
      document.getElementById("estado-detalle").innerText = datos.estadoActual;

    

    const stats = calcularEstadisticas(datos.pronosticoSemanal);
    const contenedorStats = document.getElementById("estadisticas-semanales");
    

    const lista = document.getElementById("pronostico-lista");
    if (lista){
      lista.innerHTML = datos.pronosticoSemanal.map(d=>{

        let icono = "☁️";
        if (d.estado==="Soleado"|| d.estado==="Despejado")icono="☀️";
        if (d.estado.toLowerCase()==="lluvia") icono = "🌧️";

        return `
        <div class="col-12 col-sm-6 col-md-4 col-lg-2">
        <div class="card h-100 text-center shadow-sm">
        <div class="card-header bg-light fw-bold">${d.dia}</div>
        <div class="card-body">
        <span class="fs-1">${icono}</span> 
        <p class="card-text mb-0">${d.min}°|${d.max}°</p>
        <small class="text-muted">${d.estado}</small>
        </div>
        </div>
        </div>
        `
      }).join("");
    }
    if (contenedorStats) {
      contenedorStats.innerHTML = `
 
  <div class="card p-3 mt-4">
  <h4>Estadisticas de la semana</h4> 
  <p>Mínima: ${stats.minSemanal}°| Máxima: ${stats.maxSemanal}°|Promedio: ${stats.promedio}°</p>
  <p><strong>Resumen:</strong> ${stats.resumen}</p>

  <ul>
 <li>Días Soleados: ${stats.conteoClima.Soleado || 0}</li>
 <li>Días Nublados: ${stats.conteoClima.Nublado || 0}</li>
 <li>Días de Lluvia: ${stats.conteoClima.Lluvia || 0}</li>
  </ul>
 
     </div>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarHome();
  cargaDetalle();
});

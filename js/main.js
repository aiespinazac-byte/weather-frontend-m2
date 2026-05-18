class ApiClient {
  constructor() {
    this.urlBase = "https://api.open-meteo.com";
  }

  /**
   * 
   * @param {number} lat 
   * @param {number} lon 
   * @returns {Promise<Object>} 
   */
  async obtenerClima(lat, lon) {
    try {
      const url =`${this.urlBase}/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=America/Santiago`;
      const respuesta = await fetch(url);
      
      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }
      
      const datos = await respuesta.json();
      return datos;
    } catch (error) {
      console.error("Error al consumir la API de clima:", error);
      throw error; 
    }
  }

  /**
   * 
   * @param {number} code 
   * @returns {string} 
   */
  mapearCodigoClima(code) {
    if (code === 0 || code === 1) return "Despejado";
    if (code === 2 || code === 3) return "Nublado";
    if (code >= 51 && code <= 67) return "Lluvia";
    if (code >= 80 && code <= 82) return "Lluvia";
    return "Despejado"; 
  }
}



class WeatherApp {
  constructor(apiClient) {
    this.apiClient = apiClient;
    
    this.lugares = [
      { id: 1, nombre: "Santiago", lat: -33.4489, lon: -70.6693 },
      { id: 2, nombre: "Temuco", lat: -38.7359, lon: -72.5904 },
      { id: 3, nombre: "Curicó", lat: -34.9855, lon: -71.2394 },
      { id: 4, nombre: "Valparaíso", lat: -33.0472, lon: -71.6127 },
      { id: 5, nombre: "Peñaflor", lat: -33.6062, lon: -70.8764 }
    ];
  }

  
  async cargarLugares() {
    const contenedor = document.getElementById("lista-ciudades");
    if (!contenedor) return;

    contenedor.innerHTML = `<div class="text-center w-100"><p class="fs-5 text-muted">Cargando estados del clima...</p></div>`;

    try {
      let htmlCards = "";
      
      
      for (const lugar of this.lugares) {
        const datosApi = await this.apiClient.obtenerClima(lugar.lat, lugar.lon);
        const tempActual = Math.round(datosApi.current_weather.temperature);
        const estadoActual = this.apiClient.mapearCodigoClima(datosApi.current_weather.weathercode);
        
        
        const esCaluroso = tempActual >= 25 ? "weather-card--hot" : "";

        htmlCards += `
          <div class="col-12 col-md-6 col-lg-4">
            <div class="weather-card ${esCaluroso}">
              <div class="weather-card__body w-100">
                <h5 class="weather-card__title">${lugar.nombre}</h5>
                <p class="weather-card__temp">${tempActual}°C</p>
                <span class="weather-card__status badge bg-primary mb-3">${estadoActual}</span>
                <button class="btn btn-outline-dark w-100 mt-2" onclick="app.verDetalle(${lugar.id})">
                  Ver detalle
                </button>
              </div>
            </div>
          </div>`;
      }
      contenedor.innerHTML = htmlCards;
    } catch (error) {
      contenedor.innerHTML = `
        <div class="alert alert-danger text-center w-100" role="alert">
          Hubo un problema al conectar con el servicio meteorológico. Por favor, inténtelo de nuevo más tarde.
        </div>`;
    }
  }

  
  verDetalle(id) {
    localStorage.setItem("ciudadSeleccionadaId", id);
    window.location.href = "detalle.html";
  }

  
  async cargarDetalleLugar() {
    const titulo = document.getElementById("nombre-ciudad");
    if (!titulo) return; 

    const idGuardado = localStorage.getItem("ciudadSeleccionadaId");
    const lugar = this.lugares.find(l => l.id == idGuardado);

    if (!lugar) {
      titulo.innerText = "Lugar no encontrado";
      return;
    }

    try {
      const datosApi = await this.apiClient.obtenerClima(lugar.lat, lugar.lon);
      
      
      const tempActual = Math.round(datosApi.current_weather.temperature);
      const estadoActual = this.apiClient.mapearCodigoClima(datosApi.current_weather.weathercode);

      
      titulo.innerText = lugar.nombre;
      document.getElementById("temp-detalle").innerText = `${tempActual}°C`;
      document.getElementById("estado-detalle").innerText = estadoActual;

      const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
      const pronosticoSemanal = datosApi.daily.time.map((fecha, index) => {
        return {
          dia: diasSemana[index] || "Próximo",
          min: Math.round(datosApi.daily.temperature_2m_min[index]),
          max: Math.round(datosApi.daily.temperature_2m_max[index]),
          estado: this.apiClient.mapearCodigoClima(datosApi.daily.weathercode[index])
        };
      });

    
      const listaHTML = document.getElementById("pronostico-lista");
      if (listaHTML) {
        listaHTML.innerHTML = pronosticoSemanal.map(d => {
          let icono = "☁️";
          if (d.estado === "Despejado") icono = "☀️";
          if (d.estado === "Lluvia") icono = "🌧️";

          return `
            <div class="col-12 col-sm-6 col-md-4 col-lg-2">
              <div class="card h-100 text-center shadow-sm">
                <div class="card-header bg-light fw-bold py-2">${d.dia}</div>
                <div class="card-body p-3">
                  <span class="fs-1 d-block mb-2">${icono}</span> 
                  <p class="card-text fw-bold mb-0 text-dark">${d.min}° | ${d.max}°</p>
                  <small class="text-muted d-block mt-1">${d.estado}</small>
                </div>
              </div>
            </div>`;
        }).join("");
      }

     
      const stats = this.calcularEstadisticas(pronosticoSemanal);
      this.renderizarEstadisticasYAlertas(stats);

    } catch (error) {
      titulo.innerText = "Error";
      document.getElementById("temp-detalle").innerText = "--";
      document.getElementById("estado-detalle").innerText = "No se pudieron obtener los datos";
      
      const contenedorStats = document.getElementById("estadisticas-semanales");
      if (contenedorStats) {
        contenedorStats.innerHTML = `
          <div class="alert alert-danger text-center" role="alert">
            No se pudo procesar el pronóstico extendido.
          </div>`;
      }
    }
  }

  
  calcularEstadisticas(pronostico) {
    let sumaMedias = 0;
    let minSemanal = pronostico[0].min;
    let maxSemanal = pronostico[0].max;
    let conteoClima = { Despejado: 0, Nublado: 0, Lluvia: 0 };

    pronostico.forEach(dia => {
      sumaMedias += (dia.min + dia.max) / 2;
      if (dia.min < minSemanal) minSemanal = dia.min;
      if (dia.max > maxSemanal) maxSemanal = dia.max;
      if (conteoClima[dia.estado] !== undefined) conteoClima[dia.estado]++;
    });

    const promedio = (sumaMedias / pronostico.length).toFixed(1);
    
    
    let alertaClima = null;
    if (promedio > 20) {
      alertaClima = { tipo: "danger", mensaje: "⚠️ Alerta de Calor: El promedio semanal supera los 20°C. Mantente hidratado." };
    } else if (conteoClima.Lluvia >= 2) {
      alertaClima = { tipo: "warning", mensaje: "🌧️ Alerta por Lluvias: Se registran múltiples días con precipitaciones esta semana." };
    } else {
      alertaClima = { tipo: "success", mensaje: "✅ Clima Estable: No se registran condiciones extremas para esta semana." };
    }

    return { promedio, minSemanal, maxSemanal, conteoClima, alertaClima };
  }

 
  renderizarEstadisticasYAlertas(stats) {
    const contenedorStats = document.getElementById("estadisticas-semanales");
    if (!contenedorStats) return;

    contenedorStats.innerHTML = `
      <div class="row g-4 mt-2">
        <!-- Tarjeta de Métricas -->
        <div class="col-12 col-md-6">
          <div class="card p-4 shadow-sm h-100">
            <h4 class="border-bottom pb-2 mb-3">Estadísticas de la semana</h4> 
            <p class="fs-5"><strong>Mínima Extrema:</strong> ${stats.minSemanal}°C</p>
            <p class="fs-5"><strong>Máxima Extrema:</strong> ${stats.maxSemanal}°C</p>
            <p class="fs-5"><strong>Temperatura Promedio:</strong> ${stats.promedio}°C</p>
            
            <h5 class="mt-4">Frecuencia de climas:</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center">☀️ Días Despejados <span class="badge bg-secondary rounded-pill">${stats.conteoClima.Despejado}</span></li>
              <li class="list-group-item d-flex justify-content-between align-items-center">☁️ Días Nublados <span class="badge bg-secondary rounded-pill">${stats.conteoClima.Nublado}</span></li>
              <li class="list-group-item d-flex justify-content-between align-items-center">🌧️ Días de Lluvia <span class="badge bg-secondary rounded-pill">${stats.conteoClima.Lluvia}</span></li>
            </ul>
          </div>
        </div>

        <!-- REQUISITO: Nueva sección "Alertas de clima" en el detalle -->
        <div class="col-12 col-md-6">
          <div class="card p-4 shadow-sm h-100 d-flex flex-column justify-content-between">
            <div>
              <h4 class="border-bottom pb-2 mb-3">Alertas de Clima</h4>
              <p class="text-muted">Análisis automático basado en los umbrales meteorológicos de la semana en curso:</p>
              <div class="alert alert-${stats.alertaClima.tipo} fw-bold mt-3" role="alert">
                ${stats.alertaClima.mensaje}
              </div>
            </div>
            <div class="text-center mt-4">
              <a href="index.html" class="btn btn-dark px-4">Volver al Inicio</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}


const client = new ApiClient();
const app = new WeatherApp(client);
const verDetalle = (id) => app.verDetalle(id);


document.addEventListener("DOMContentLoaded", () => {
  app.cargarLugares();
  app.cargarDetalleLugar();
});
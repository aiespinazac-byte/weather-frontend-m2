// === 1. BASE DE LUGARES ===
const lugaresBase = [
  { id: 1, nombre: "Santiago", lat: -33.4489, lon: -70.6693 },
  { id: 2, nombre: "Temuco", lat: -38.7359, lon: -72.5904 },
  { id: 3, nombre: "Curicó", lat: -34.9855, lon: -71.2394 },
  { id: 4, nombre: "Valparaíso", lat: -33.0472, lon: -71.6127 },
  { id: 5, nombre: "Peñaflor", lat: -33.6062, lon: -70.8764 }
];

// === 2. CLIENTE API ===
class ApiClient {
  constructor() {
    this.urlBase = "https://api.open-meteo.com/v1/forecast";
  }

  async obtenerClima(lat, lon) {
    try {
       const url = `${this.urlBase}?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America/Santiago`;
      const respuesta = await fetch(url);

      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }
      return await respuesta.json();
    } catch (error) {
      console.error("Error al consumir la API de clima:", error);
      throw error;
    }
  }

  mapearCodigoClima(code) {
    if (code === 0 || code === 1) return "Despejado";
    if (code === 2 || code === 3) return "Nublado";
    if (code >= 51 && code <= 67) return "Lluvia";
    if (code >= 80 && code <= 82) return "Lluvia";
    return "Despejado";
  }
}

const api = new ApiClient();

// === 3. ESTADO GLOBAL (Vuex) ===
const store = Vuex.createStore({
  state() {
    return {
      isAuthenticated: false,
      user: null
    };
  },
  mutations: {
    SET_USER(state, payload) {
      state.isAuthenticated = true;
      state.user = payload;
    },
    CLEAR_USER(state) {
      state.isAuthenticated = false;
      state.user = null;
    }
  },
  actions: {
    loginUser({ commit }, credentials) {
      const mockUser = { email: "user@clima.com", password: "123", name: "Juan Pérez" };

      if (credentials.email === mockUser.email && credentials.password === mockUser.password) {
        commit('SET_USER', { 
          name: mockUser.name, 
          email: mockUser.email, 
          favorites: [1, 4, 5] // IDs correspondientes a Santiago, Valparaíso y Peñaflor
        });
        return true;
      }
      return false;
    },
    logoutUser({ commit }) {
      commit('CLEAR_USER');
    }
  }
});

// === 4. COMPONENTE VISTA: HOME ===
const Home = {
  template: `
    <div>
      <h1 class="text-center mb-4">Estado del Clima</h1>
      <div class="row justify-content-center mb-4">
        <div class="col-md-6">
          <input
            type="text"
            v-model="busqueda"
            class="form-control shadow-sm"
            placeholder="🔍 Buscar una ciudad por nombre..."
          />
        </div>
      </div>

      <div v-if="cargando" class="text-center w-100">
        <p class="fs-5 text-muted">Cargando estados del clima...</p>
      </div>

      <div v-if="error" class="alert alert-danger text-center w-100" role="alert">
        {{ error }}
      </div>

      <div v-if="!cargando && !error" class="row g-4">
        <div v-if="lugaresFiltrados.length === 0" class="text-center text-muted fs-5 my-4">
          ❌ No se encontró el lugar "{{ busqueda }}"
        </div>

        <div v-for="lugar in lugaresFiltrados" :key="lugar.id" class="col-12 col-md-6 col-lg-4">
          <div class="weather-card p-4 bg-white rounded shadow-sm" :class="{'weather-card--hot': lugar.tempActual >= 25}">
            <div class="weather-card__body w-100 text-center">
              <h5 class="weather-card__title">{{ lugar.nombre }}</h5>
              <p class="weather-card__temp fs-2 fw-bold text-primary">{{ lugar.tempActual }}°C</p>
              <span class="weather-card__status badge bg-primary mb-3">{{ lugar.estadoActual }}</span>
             
              <router-link :to="'/lugar/' + lugar.id" class="btn btn-outline-dark w-100 mt-2">
                Ver Detalle
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      busqueda: "",
      lugares: [],
      cargando: true,
      error: null,
    };
  },
  computed: {
    lugaresFiltrados() {
      return this.lugares.filter((lugar) =>
        lugar.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    },
  },
  async mounted() {
    try {
      const listaPromesas = lugaresBase.map(async (lugar) => {
        const datosApi = await api.obtenerClima(lugar.lat, lugar.lon);
        return {
          ...lugar,
          tempActual: Math.round(datosApi.current_weather.temperature),
          estadoActual: api.mapearCodigoClima(
            datosApi.current_weather.weathercode,
          ),
        };
      });
      this.lugares = await Promise.all(listaPromesas);
    } catch (error) {
      this.error =
        "Error al cargar los datos del clima. Por favor, intenta nuevamente.";
    } finally {
      this.cargando = false;
    }
  },
};

// === 5. COMPONENTE VISTA: DETALLE ===
const Detalle = {
  props: ["id"],
  template: `
    <div>
      <div v-if="cargando" class="text-center m-5">
        <p class="fs-5 text-muted">Cargando detalles del clima...</p>
      </div>

      <div v-if="error" class="alert alert-danger text-center m-5" role="alert">
        {{ error }}
        <div class="mt-3">
          <router-link to="/" class="btn btn-dark">← Volver al Inicio</router-link>
        </div>
      </div>

      <div v-if="!cargando && !error">
        <div class="mb-3">
          <router-link to="/" class="btn btn-secondary btn-sm">← Volver</router-link>
        </div>

        <div class="weather-details shadow-sm mb-4 p-4 bg-white rounded text-center">
          <h1 class="weather-details__city text-dark fs-2 mb-2">{{ infoLugar.nombre }}</h1>
          <p class="weather-details__temp mb-2 fs-1 fw-bold">{{ tempActual }}°C</p>
          <span class="weather-details__status badge bg-info px-3 py-2 text-wrap text-dark">{{ estadoActual }}</span>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      cargando: true,
      error: null,
      infoLugar: null,
      tempActual: "--",
      estadoActual: "--"
    };
  },
  async mounted() {
    const lugarId = parseInt(this.id);
    this.infoLugar = lugaresBase.find((l) => l.id === lugarId);

    if (!this.infoLugar) {
      this.error = "Lugar no encontrado";
      this.cargando = false;
      return;
    }

    try {
      const datosApi = await api.obtenerClima(
        this.infoLugar.lat,
        this.infoLugar.lon,
      );

      this.tempActual = Math.round(datosApi.current_weather.temperature);
      this.estadoActual = api.mapearCodigoClima(
        datosApi.current_weather.weathercode,
      );
    } catch (err) {
      this.error =
        "No se pudieron obtener los datos o procesar el pronóstico extendido.";
    } finally {
      this.cargando = false;
    }
  }
};

// === 6. COMPONENTE VISTA: LOGIN ===
const Login = {
  template: `
    <div class="container d-flex justify-content-center align-items-center" style="min-height: 60vh;">
      <div class="card p-4 shadow-sm" style="width: 100%; max-width: 400px;">
        <h3 class="text-center mb-4">Iniciar Sesión</h3>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">Correo electrónico</label>
            <input type="email" class="form-control" v-model="email" placeholder="user@clima.com" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <input type="password" class="form-control" v-model="password" placeholder="123" required>
          </div>
          <button type="submit" class="btn btn-primary w-100">Ingresar</button>
        </form>
        <div v-if="errorMessage" class="alert alert-danger mt-3 py-2 text-center" role="alert">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = '';
      const success = await this.$store.dispatch('loginUser', { email: this.email, password: this.password });
      
      if (success) {
        this.$router.push('/'); 
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos'; 
      }
    }
  }
};

// === 7. COMPONENTE VISTA: FAVORITOS (Sección Protegida) ===
const Favoritos = {
  template: `
    <div class="container">
      <div class="card p-4 shadow-sm">
        <h3 class="mb-4">⭐ Mis Lugares Favoritos</h3>
        <p class="text-muted">Sección personalizada. Datos leídos dinámicamente desde el estado global de Vuex.</p>
        <div v-if="lugaresFavoritos.length === 0" class="text-muted">No tienes ciudades favoritas asignadas.</div>
        <ul class="list-group" v-else>
          <li v-for="lugar in lugaresFavoritos" :key="lugar.id" class="list-group-item d-flex justify-content-between align-items-center">
            <strong>{{ lugar.nombre }}</strong>
            <router-link :to="'/lugar/' + lugar.id" class="btn btn-sm btn-primary">Ver clima</router-link>
          </li>
        </ul>
      </div>
    </div>
  `,
  computed: {
    lugaresFavoritos() {
      const user = this.$store.state.user;
      if (!user || !user.favorites) return [];
      // CORREGIDO: lugaresBase con 'l' minúscula para evitar errores de consola
      return lugaresBase.filter(l => user.favorites.includes(l.id));
    }
  }
};

// === 8. CONFIGURACIÓN DE VUE ROUTER ===
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/lugar/:id', component: Detalle, props: true },
  { path: '/favoritos', component: Favoritos, meta: { requiresAuth: true } }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuth = store.state.isAuthenticated;
  if (to.meta.requiresAuth && !isAuth) {
    next('/login'); 
  } else {
    next();
  }
});

const App = {
  template: `
    <div class="d-flex flex-column min-vh-100 bg-light">
      <header>
        <!-- Navbar Adaptable con Bootstrap -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
          <div class="container">
            <router-link class="navbar-brand fw-bold" to="/">🌤️ MundoClima</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul class="navbar-nav align-items-center">
                <li class="nav-item">
                  <router-link class="nav-link" to="/">Inicio</router-link>
                </li>
                <li class="nav-item" v-if="isAuthenticated">
                  <router-link class="nav-link" to="/favoritos">Mis Favoritos</router-link>
                </li>
                
                <!-- Elementos condicionales basados en el Estado Autenticado (Vuex) -->
                <li class="nav-item ms-lg-3" v-if="!isAuthenticated">
                  <router-link class="btn btn-outline-light btn-sm" to="/login">Iniciar Sesión</router-link>
                </li>
                <li class="nav-item ms-lg-3 d-flex align-items-center gap-2" v-else>
                  <span class="text-light small">Bienvenido, <strong>{{ currentUser.name }}</strong></span>
                  <button class="btn btn-danger btn-sm" @click="logout">Cerrar Sesión</button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <!-- Inyección Dinámica de Vistas -->
      <main class="container my-5">
        <router-view></router-view>
      </main>

      <footer class="bg-light py-4 mt-auto border-top">
        <div class="container text-center">
          <p>&copy; 2026 WeatherApp SPA - Proyecto Vue.js</p>
        </div>
      </footer>
    </div>
  `,
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    currentUser() {
      return this.$store.state.user;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logoutUser');
      this.$router.push('/login');
    }
  }
};

// === 10. ENRUTADO, STORE Y MONTAJE FINAL ===
const app = Vue.createApp(App);
app.use(store);
app.use(router);
app.mount('#app');
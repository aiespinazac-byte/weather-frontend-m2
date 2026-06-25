🌦️ App de Clima - Módulo 5 (POO, ES6 y Consumo de API)

Este proyecto es una evolución del desarrollo anterior, ahora reestructurado bajo el paradigma de la Programación Orientada a Objetos (POO) y potenciado con programación asíncrona para consumir datos meteorológicos en tiempo real.

🚀 Temática
Reporte meteorológico de 5 ciudades de Chile, con un sistema de navegación dinámica, visualización de pronóstico extendido de 7 días y un nuevo módulo de alertas automatizadas.

🧠 Objetivos Alcanzados (Módulo 5)

• Programación Orientada a Objetos (POO): Migración de funciones sueltas hacia una arquitectura de clases independientes y reutilizables.
• Consumo de API Externa: Integración de la API Fetch y estructuras async/await para conectarse de forma asíncrona a un servicio meteorológico remoto, reemplazando los datos locales fijos.
• Control de Errores y Estados: Implementación de bloques try/catch que gestionan de forma limpia las respuestas del servidor y renderizan mensajes de error o estados de "Cargando..." en la interfaz en caso de fallas de red.
• Lógica de Alertas Automatizada: Incorporación de un motor de reglas simple en la vista de detalle para lanzar avisos preventivos (ej: Alertas de Calor o Semanas Lluviosas) basados en los promedios semanales.

🛠️ Tecnologías utilizadas

• HTML5 & Bootstrap 5: Estructura y diseño responsivo.
• SASS: Estilos modulares y avanzados organizados con variables, mixins y metodología BEM.
• JavaScript (ES6+): Clases nativas, Fetch API, Async/Await, Promesas, LocalStorage y plantillas literales.
• Git & GitHub: Control de versiones, commits descriptivos y despliegue incremental.

🏗️ Estructura de Clases (Arquitectura)

• ApiClient: Clase especializada y encargada de forma exclusiva del consumo de recursos externos en red. Realiza las peticiones HTTP y traduce los códigos meteorológicos internacionales (WMO) a estados textuales legibles por la app.
• WeatherApp: El cerebro del proyecto. Gestiona el arreglo de coordenadas de los lugares, interactúa con la instancia de ApiClient para coordinar las descargas, calcula aritméticamente las estadísticas/alertas y manipula el DOM para renderizar las vistas (Home y Detalle).

🌐 API de Clima Utilizada

La información meteorológica se obtiene directamente desde la API pública internacional Open-Meteo (https://open-meteo.com). Este servicio abierto permite consultar el clima actual y proyecciones a 7 días introduciendo coordenadas geográficas específicas (latitud y longitud), respondiendo con objetos estructurados en formato JSON.

📊 Resumen de Estadísticas y Alertas

• Cálculo de Métricas: Al recibir el JSON de la API, se realiza una iteración lineal para evaluar la temperatura máxima y mínima absoluta de los 7 días. El promedio semanal se obtiene calculando la media aritmética de los rangos diarios registrados.
• Motor de Alertas: Si el promedio general de la semana supera el umbral de los 20°C, el sistema gatilla automáticamente una "Alerta de Calor". Si se detectan 2 o más días con precipitaciones, se genera un aviso de "Semana Lluviosa", proporcionando un análisis inteligente al usuario.

🔗 Enlace al Repositorio
https://aiespinazac-byte.github.io/weather-frontend-m2/

<!-- Aquí dejas el texto que ya tienes actualmente en tu archivo -->
# [Tu título actual o introducción que ya escribiste]

---

<!-- Y justo aquí abajo pegas el contenido técnico para asegurar los puntos de la rúbrica -->
## 👥 Sistema de Usuarios
El estado global de la autenticación se administra mediante **Vuex**. Al iniciar sesión de forma exitosa, el sistema almacena de forma centralizada un objeto con los siguientes datos del usuario:
- `name`: Nombre completo del usuario autenticado (utilizado para personalizar la interfaz).
- `email`: Correo electrónico con el que inició sesión.
- `favorites`: Un arreglo de números (`Array[Number]`) que almacena los IDs de las ciudades que el usuario tiene marcadas como preferidas para filtrar su panel de control.

## 🧭 Rutas de la Aplicación
El enrutamiento está controlado por **Vue Router** y cuenta con protección de accesos directa:
- `/`: **Inicio (Pública)** - Muestra el buscador y las tarjetas del clima global en tiempo real.
- `/login`: **Login (Pública)** - Formulario de inicio de sesión con validación de credenciales y manejo de alertas de error en pantalla.
- `/lugar/:id`: **Detalle (Pública)** - Muestra la información meteorológica extendida de una ciudad específica usando su ID.
- `/favoritos`: **Mis Favoritos (Privada)** - Sección protegida mediante un *Navigation Guard* (`beforeEach`). Solo es accesible si el usuario está autenticado en Vuex; de lo contrario, fuerza la redirección al login.

## 💻 Instrucciones para Ejecutar el Proyecto
Al ser una arquitectura SPA distribuida globalmente por CDN, no requiere compilación previa de Node.js:
1. Descarga y extrae el archivo `.zip` del proyecto.
2. Abre la carpeta raíz con **Visual Studio Code**.
3. Asegúrate de tener instalada la extensión **Live Server** o **Live Preview**.
4. Haz clic derecho sobre el archivo `index.html` y selecciona **"Open with Live Server"** o **"Show Preview"**.
5. Para probar el sistema de usuarios, utiliza las credenciales de prueba:
   - **Correo:** `user@clima.com`
   - **Contraseña:** `123`

## 🔗 Repositorio en GitHub
- **Enlace al proyecto:** [https://github.com](https://github.com)

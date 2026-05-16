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
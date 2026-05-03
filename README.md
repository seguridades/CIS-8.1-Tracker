# CIS Controls v8.1 Compliance Tracker

![CIS Controls](https://img.shields.io/badge/Framework-CIS%20Controls%20v8.1-blue?style=for-the-badge)
![Vue 3](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)
![Offline First](https://img.shields.io/badge/Offline-First-success?style=for-the-badge)
![Privacy](https://img.shields.io/badge/Privacy-Total-blueviolet?style=for-the-badge)

Una herramienta de auditoría **CIS Critical Security Controls v8.1**, moderna y segura para el seguimiento de cumplimiento con el estándar CIS v 8.1.

**Demo en vivo:** [cis-tracker.seguridades.org](https://cis-tracker.seguridades.org)

---

## Características Principales

### Privacidad Total y Cifrado

- **Zero-Server Architecture**: Todos los datos residen exclusivamente en su navegador.
- **Cifrado de Grado Militar**: Los datos se cifran utilizando la **Web Crypto API (AES-GCM 256-bit)** con una clave derivada de su contraseña personal (**PBKDF2**).
- **Pantalla de Desbloqueo**: Sus evaluaciones están protegidas contra acceso no autorizado local.

### Evaluación y Reporting

- **Gestión de IGs**: Filtrado dinámico por Implementation Groups (IG1, IG2, IG3).
- **Mapa de Calor**: Visualización 6x7 de cumplimiento cruzando _Security Functions_ vs _Asset Types_.
- **Adjuntos Binarios**: Soporte para subir evidencias reales (PDF, Imágenes) almacenadas en **IndexedDB**.
- **Remediación Automatizada**: Generación de planes de acción basados en las brechas identificadas.

### Distribución y Portabilidad

- **Distribución ZIP**: Exporte la carpeta `dist` y ejecútela directamente desde `file://` en cualquier PC sin necesidad de servidor web.
- **Backup JSON**: Exporte e importe sus proyectos cifrados para respaldo o transferencia entre equipos.

---

## Instalación y Desarrollo

### Requisitos

- Node.js (v18+)
- NPM

### Pasos para Desarrollo

1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

### Construcción para Distribución

Para generar la versión portable:

```bash
npm run build
```

La carpeta `dist/` resultante contiene todo lo necesario para funcionar de forma autónoma.

---

## Generación de la Semilla (Datos de CIS)

Para actualizar los datos normativos desde el XLSX oficial de CIS:

1. Coloque el archivo oficial en `tools/seed-build/input/CIS_Controls_v8.1.xlsx`.
2. Ejecute el script de generación:
   ```bash
   node tools/seed-build/build-seed.mjs
   ```

---

## Licencia y Atribución

Este software está diseñado para facilitar el uso de los **CIS Critical Security Controls®**.

- **Atribución**: CIS Controls® v8.1 Copyright © 2024 Center for Internet Security, Inc. (CIS).
- **Uso**: El contenido de los controles se presenta _verbatim_ en inglés para asegurar la integridad del framework y cumplir con los términos de uso de CIS.
- **Software**: El código de esta aplicación está bajo licencia MIT.

---

Desarrollado con 🍺 para la comunidad.

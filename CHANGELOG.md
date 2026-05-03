# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo siguiendo el formato de [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y versionado semántico [SemVer](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-02

### Añadido
- **Arquitectura Base**: Proyecto Vue 3 + Vite + Tailwind CSS v4 configurado para funcionamiento portable (`file://`).
- **Cifrado de Datos**: Implementación de Web Crypto API (AES-GCM) para cifrado de evaluaciones en `localStorage`.
- **Adjuntos Binarios**: Soporte para almacenamiento de evidencias en IndexedDB.
- **Sistema de Semilla**: Script ETL para procesar XLSX oficial de CIS v8.1 a JSON.
- **Vistas Principales**:
    - Dashboard con Heatmap dinámico.
    - Setup de proyecto con IG Target (IG1, IG2, IG3).
    - Editor de Salvaguardas con estados de cumplimiento, notas de gap y remediación.
    - Reporte Ejecutivo imprimible con atribución obligatoria de CIS.
- **UI/UX**: Diseño "Bento Grid" premium con soporte para modo oscuro y animaciones fluidas.

### Cambiado
- Optimización de `main.css` para compatibilidad con Tailwind v4 PostCSS.

### Corregido
- Error de importación en Pinia stores (`defineStore` missing).
- Error de referencia en `project.js` (`updateProject` missing).
- Compatibilidad de iconos Lucide entre versiones.

---
*Fin de la versión inicial.*

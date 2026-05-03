# Roadmap de Mejoras Futuras - CIS Controls Tracker

Este documento detalla las funcionalidades y mejoras de auditoría avanzada planificadas para versiones futuras de la herramienta.

## 🚀 Mejoras de Auditoría Enterprise

### 1. Integridad de la Evidencia (Evidence Hashing)
- **Descripción**: Calcular automáticamente el Hash SHA-256 de cada archivo adjunto.
- **Valor**: Garantiza ante auditores externos que las evidencias no han sido manipuladas tras su carga original.

### 2. Registro de Auditoría (Audit Trail / Logs)
- **Descripción**: Crear un log inmutable (dentro del JSON cifrado) de todos los cambios realizados.
- **Campos**: Fecha, Usuario (Admin), Salvaguarda, Cambio realizado (Estado A -> Estado B).
- **Valor**: Trazabilidad total de la evaluación.

### 3. Mapeo Cruzado (Cross-Framework Mapping)
- **Descripción**: Integrar referencias cruzadas con NIST CSF 2.0, ISO 27001:2022 y SOC2.
- **Valor**: Permite usar la evaluación de CIS para demostrar cumplimiento en otros marcos regulatorios.

### 4. Auto-Bloqueo de Sesión (Inactivity Timeout)
- **Descripción**: Implementar un temporizador (ej. 15 min) que limpie la clave de memoria y bloquee la app si no hay actividad.
- **Valor**: Seguridad física contra acceso no autorizado en equipos compartidos o desatendidos.

### 5. Repositorio Central de Políticas
- **Descripción**: Una sección para cargar documentos de política global y vincularlos a múltiples salvaguardas simultáneamente.
- **Valor**: Evita la duplicidad de información y asegura consistencia en las referencias.

### 6. Reporte de Gap Analysis y Riesgos
- **Descripción**: Generar un reporte específico de brechas que incluya:
    - Justificaciones de riesgo aceptado.
    - Estimación de esfuerzo/coste de remediación.
    - Priorización basada en el impacto al negocio.

---
*Documento generado para la versión v1.0.0*

# CIS Controls v8.1 Seed Builder

Este script procesa el archivo XLSX oficial de CIS para generar los archivos JSON que alimentan la aplicación.

## Requisitos

1. Descargar el archivo **"CIS Controls v8.1 + Mapping"** (XLSX) desde el sitio oficial de CIS: [https://www.cisecurity.org/controls/v8-1](https://www.cisecurity.org/controls/v8-1).
2. Colocar el archivo en `tools/seed-build/input/CIS_Controls_v8.1.xlsx`.

## Uso

Ejecute el siguiente comando desde la raíz del proyecto:

```bash
node tools/seed-build/build-seed.mjs
```

El script generará:
- `public/seed/controls.json`
- `public/seed/safeguards.json`

## Notas de Licencia

El archivo XLSX original de CIS está bajo licencia **CC BY-NC-ND 4.0** (No Derivados). Por esta razón, el archivo XLSX **NO** debe ser incluido en el repositorio. Los archivos JSON generados son una representación de los datos necesaria para el funcionamiento de la herramienta y cumplen con los requisitos de atribución de la aplicación.

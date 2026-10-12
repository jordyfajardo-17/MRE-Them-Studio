# MRE Theme Studio

Base web del editor de temas de MusicMultiExperience, separada de
[MRE Player](https://github.com/jordyfajardo-17/MRE-Player). React + TypeScript + Vite.

## Instalar y ejecutar

Requisitos: Node 24 LTS y npm. Desde la raíz del repositorio:

```bash
npm ci
npm run dev
```

Abre la URL local que indique Vite. `npm run build` genera `dist` y `npm run preview`
permite comprobar ese resultado. No se ha publicado ninguna web.

## Qué funciona

- Editor con tres presets, nombre, ID, colores, radio, densidad y navegación.
- Vista previa móvil con metadata de demostración.
- Guardado de un borrador en el navegador.
- Importación, validación y exportación de archivos `.mmetheme.json`.
- El JSON exportado puede pegarse en Temas de Player.

Blur, opacidad y variante de player se exportan como parámetros; no equivalen a renderizadores
nativos terminados. Liquid Glass es una referencia visual. Publicación, cuentas, estadísticas,
preview remoto y venta están pendientes.

## Contrato compartido

`packages/theme-core` es una copia controlada del paquete canónico de Player.
`docs/theme-core-source.json` fija commit y hashes para evitar divergencias silenciosas.
Cada repositorio se instala solo; no requiere carpetas hermanas ni paquetes privados inexistentes.

```bash
npm run theme:sync -- SHA_COMPLETO_DEL_COMMIT_REVISADO_DE_PLAYER
npm ci
npm run check
```

No edites otro esquema dentro de Studio. Cuando se configure un registro común,
ambos productos consumirán el mismo paquete publicado y versionado.

## Comprobaciones

```bash
npm run check
npm run build
```

`check` verifica el snapshot del contrato, TypeScript, ESLint y los casos de validación.
Los archivos de recursos y el contenedor ZIP `.mmetheme` se añadirán después.

# Cobblemon Breeding Planner

Una aplicación web diseñada para planificar la crianza de Pokémon (con reglas de PokeMMO) utilizando árboles visuales y sprites pixel-art tipo Gen 5.

## Características

- 🌲 **Árbol Visual de Crianza**: Usa React Flow para visualizar los cruces necesarios.
- ⚡ **Crianza de PokeMMO**: Los padres utilizados en cada paso se "consumen".
- 📦 **Local y Estático**: Todo funciona en el navegador, sin backend ni base de datos, usando localStorage para persistencia.
- 🖼️ **Mini Sprites**: Utiliza iconos de Gen 5/8 (compactos) en lugar de sprites grandes de batalla.
- 🌓 **Modo Oscuro**: Interfaz moderna y adaptable al color del sistema.

## Desarrollo Local

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Arranca el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Construye para producción:
   ```bash
   npm run build
   ```

## Despliegue en GitHub Pages

Este repositorio está configurado para desplegarse automáticamente a través de **GitHub Actions**.

1. Sube tu código a GitHub.
2. En GitHub, ve a `Settings -> Pages`.
3. Configura `Source` como **GitHub Actions**.
4. ¡Cada vez que hagas push a `main` o `master`, la aplicación se construirá y publicará en tu enlace de GitHub Pages!

## Estructura del Proyecto

- `src/breeding/`: Motor lógico aislado (reglas de crianza, solver).
- `src/components/`: Componentes UI de React (Tarjetas, Árbol visual, Formulario de Objetivo).
- `src/data/`: Base de datos estática (JSON/TS) de especies y rutas de sprites.
- `src/store/`: Manejador de estado global con Zustand para el inventario de Pokémon.
- `src/types/`: Interfaces de TypeScript compartidas en toda la aplicación.

## Créditos y Sprites

- Los mini sprites utilizados provienen del repositorio público de iconos de [PokeAPI](https://pokeapi.co/).

# every-end IDE

A browser-based development environment with an immersive 3D landing page, a fully functional in-browser IDE, and built-in compilation support for JavaScript, TypeScript, React, Vue, and Svelte.

## Features

- **Interactive 3D Landing Page**: Vanilla Three.js scene with mouse-reactive parallax and smooth animations
- **In-Browser IDE**: Monaco Editor with syntax highlighting, file explorer, tabs, and resizable panels
- **Built-in Compilers**: Compile JS, TS, JSX, TSX, Vue SFC, and Svelte directly in the browser
- **Live Preview**: Sandboxed iframe preview with console capture
- **Persistent Files**: localStorage-backed virtual file system

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Project Structure

```
src/
├── components/
│   ├── Landing/
│   │   ├── LandingPage.tsx
│   │   ├── Hero3D.tsx
│   │   └── ErrorBoundary.tsx
│   └── IDE/
│       ├── IDE.tsx
│       ├── EditorPanel.tsx
│       ├── FileExplorer.tsx
│       ├── TabsBar.tsx
│       ├── OutputPanel.tsx
│       ├── StatusBar.tsx
│       └── ResizeHandle.tsx
├── hooks/
│   ├── useFileSystem.ts
│   └── useCompiler.ts
├── services/
│   ├── fileSystem.ts
│   └── compilers.ts
├── utils/
│   └── sandbox.ts
├── styles/
│   └── global.css
├── App.tsx
└── main.tsx
```

## Compiler Integration

- **JavaScript / TypeScript / JSX / TSX**: Babel standalone with `@babel/preset-typescript` and `@babel/preset-react`
- **Vue SFC**: `@vue/compiler-sfc` with Babel script transform
- **Svelte**: `svelte/compiler` for DOM generation
- **CSS / HTML**: Pass-through

## Keyboard Shortcuts

- `Ctrl + Enter` / `Cmd + Enter`: Run code

## Tech Stack

- React 18 + Vite 5 + TypeScript
- Three.js for 3D landing scene
- Monaco Editor for code editing
- Babel standalone, Vue compiler, Svelte compiler for transpilation
- Sandboxed iframe for live preview

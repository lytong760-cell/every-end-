# Plan: Browser-Based IDE with 3D Landing Page

## Tech Stack Decisions
- **Framework**: React 18 + Vite 5
- **3D**: React Three Fiber (@react-three/fiber) + @react-three/drei, lazy-loaded
- **Editor**: Monaco Editor (@monaco-editor/react)
- **State**: React Context + useReducer (no extra dependency)
- **Persistence**: localStorage for virtual file system
- **Compilers**: Bundled upfront — Babel standalone (JS/TS/JSX/TSX/React), Vue 3 compiler, Svelte compiler, esbuild-wasm, plus WASM ports for Python (Pyodide), Go, Rust, Java, etc.
- **UI**: CSS Grid + native resizable panels (no extra library)
- **Preview**: Sandboxed iframe with srcdoc

## Project Structure

```
/content/every-end-/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
│   └── preview-sandbox.html          # Sandboxed preview iframe template
├── src/
│   ├── main.tsx                       # App entry
│   ├── App.tsx                        # Route between Landing and IDE
│   ├── styles/
│   │   └── global.css                 # Global dark theme, layout
│   ├── components/
│   │   ├── Landing/
│   │   │   ├── LandingPage.tsx
│   │   │   └── Hero3D.tsx             # Lazy-loaded Three.js scene
│   │   └── IDE/
│   │       ├── IDE.tsx
│   │       ├── FileExplorer.tsx
│   │       ├── EditorPanel.tsx
│   │       ├── TabsBar.tsx
│   │       ├── OutputPanel.tsx
│   │       ├── StatusBar.tsx
│   │       └── ResizeHandle.tsx
│   ├── services/
│   │   ├── fileSystem.ts              # localStorage CRUD, virtual FS
│   │   └── compilers.ts               # Compiler registry and dispatch
│   ├── hooks/
│   │   ├── useFileSystem.ts
│   │   └── useCompiler.ts
│   └── utils/
│       └── sandbox.ts                 # iframe srcdoc generation
└── .kilo/plans/
```

## Dependencies (package.json)

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@monaco-editor/react": "^4.6.0",
    "@babel/standalone": "^7.25.0",
    "@babel/preset-typescript": "^7.24.0",
    "esbuild-wasm": "^0.21.0",
    "vue": "^3.4.0",
    "@vue/compiler-sfc": "^3.4.0",
    "svelte": "^4.2.0",
    "svelte-compiler": "^4.2.0",
    "@babel/plugin-transform-typescript": "^7.24.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0"
  },
  "optionalDependencies": {
    "pyodide": "^0.25.0"
  }
}
```

## Architecture

### 1. Landing Page (Lazy-loaded 3D)
- `LandingPage.tsx` is mounted at `/` and rendered via React.lazy
- `Hero3D.tsx` uses React Three Fiber with a Canvas component
- Scene: floating geometric shapes (icosahedrons, torus knots) with wireframe + solid materials
- Mouse interaction: camera parallax via mouse position → orbit camera target offset
- GSAP or direct lerp for smooth damping (no extra dependency — use requestAnimationFrame lerp)
- CTA button triggers `navigateToIDE()` which swaps to the IDE view via state

### 2. IDE Layout
```
┌──────────────┬────────────────────────────┐
│ File Explorer│ Tabs Bar                   │
│ (240px)      ├────────────────────────────┤
│              │ Editor (Monaco)            │
│              │                            │
│              │                            │
├──────────────┴────────────────────────────┤
│ Output / Console Panel (200px, resizable) │
└───────────────────────────────────────────┘
```

- `IDE.tsx` manages the layout state (panel widths, which panels are open)
- `ResizeHandle` components between panels allow drag-to-resize
- Tabs: flat list of open files, click to switch, X to close
- Status bar: current file language, compile status spinner, error count

### 3. File System (localStorage-backed)
- `fileSystem.ts` exposes:
  - `readFile(path)`, `writeFile(path, content)`, `deleteFile(path)`, `listFiles()`
  - `renameFile(oldPath, newPath)`, `createFile(path)`
- Files stored as JSON: `{ "path": "App.jsx", "content": "...", "language": "javascript" }`
- Auto-persist on every write with debounce (300ms)
- Default starter project files on first load

### 4. Compiler Service
- `compilers.ts` exports a `compile(code, language, filename)` function
- Language detection by file extension and/or manual selection
- Compiler mapping:

| Language | Compiler | Output |
|---|---|---|
| JavaScript | Babel standalone (no transform) | JS |
| TypeScript | Babel + @babel/preset-typescript | JS |
| JSX/React | Babel + preset-react | JS |
| Vue SFC | @vue/compiler-sfc | JS + CSS |
| Svelte | svelte-compiler | JS + CSS |
| Python | Pyodide (load via dynamic import) | JS (runs in Pyodide) |
| Go | Yaegi (pure JS Go interpreter) | Executed |
| Ruby | Opal (Ruby → JS) | JS |
| Lua | Fengari (Lua VM in JS) | Executed |
| C/C++/Rust | WASI + wasmtime/wasi-sdk | WASM |
| Java | TeaVM/GWT (limited) or skip | WASM/JS |
| Shell | xterm.js + eval fallback | Executed |

- For languages with no viable WASM port (MATLAB, COBOL, ABAP, SAS, Fortran, Assembly): show "Not supported" message, still allow file editing
- Compilation errors/warnings surfaced to OutputPanel

### 5. Preview Sandbox
- Output HTML injected into a sandboxed iframe via `srcdoc`
- `public/preview-sandbox.html` is a blank template with `null` for initial content
- Generated HTML wraps compiled output in a safe container:
  - React/Vue/Svelte: mount to a div with Babel-runtime or framework runtime included
  - Python/Go/Ruby/Lua: run via respective WASM runtime with stdout captured
  - C/C++/Rust WASM: instantiate WASM module, hook stdout
- `sandbox.ts` generates the full HTML string and handles communication (postMessage for console output)

### 6. State Management
- `IDEContext.tsx` + `ideReducer.ts` manage:
  - `files: Record<string, FileNode>`
  - `openTabs: string[]`
  - `activeTab: string | null`
  - `panelSizes: { explorer: number; editor: number; output: number }`
  - `compileStatus: 'idle' | 'compiling' | 'success' | 'error'`
  - `output: string[]`
  - `view: 'landing' | 'ide'`

## Setup Instructions

1. `npm create vite@latest . -- --template react-ts`
2. `npm install` (dependencies above)
3. Configure `vite.config.ts` with React plugin
4. Configure `tsconfig.json` for strict mode
5. Create `src/` directory structure
6. Implement components top-down (Landing → IDE shell → panels → services)
7. Test compiler integration with each language

## Compiler Integration Notes
- Babel standalone handles JS/TS/JSX/TSX/React out of the box
- Vue SFC compiler requires `@vue/compiler-sfc` and runtime (`vue`)
- Svelte compiler (`svelte-compiler`) outputs JS that needs `svelte` runtime bundled
- Pyodide loads a ~6MB WASM file — lazy-load only when Python file is compiled
- For WASM compilers (C/C++/Rust), use `esbuild-wasm` to generate WASM binary, then `WebAssembly.instantiate`
- All compiler outputs rendered in sandboxed iframe — never `eval()` in main page

## Performance Considerations
- `Hero3D.tsx` is React.lazy + Suspense — only loaded on landing page
- Monaco Editor uses `monaco-editor` core (not full editor package) to reduce bundle
- Compilers bundled but only invoked on demand
- esbuild-wasm for JS bundling is fast (~10-50ms for small files)
- For Pyodide: lazy-load WASM (~6MB) only on first Python compile
- File auto-save debounced at 300ms

## Security Considerations
- User previews run in sandboxed iframes with `sandbox="allow-scripts"` (no same-origin, no form access)
- No `eval()` in main application context
- Monaco editor runs in safe mode (no arbitrary code execution from editor itself)
- localStorage content is user-generated only — no server-side injection possible
- All WASM compilers loaded from trusted npm packages, not arbitrary URLs
- Output panel renders text only — no HTML injection

## Validation
- Landing page: 3D scene renders, responds to mouse, CTA navigates to IDE
- IDE: file explorer CRUD works, tabs switch, Monaco editor loads, dark theme applied
- Compilers: each supported language compiles and shows output or errors
- Preview: sandboxed iframe renders correct output for JS, React, Vue, Svelte
- Persistence: files survive page refresh via localStorage
- Layout: panels resize, responsive on desktop/tablet

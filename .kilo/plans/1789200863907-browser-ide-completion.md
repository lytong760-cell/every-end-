# Plan: Complete Browser IDE — Vanilla Three.js Landing + Bug Fixes + Polish

## Decision: Replace React Three Fiber with Vanilla Three.js

Switch `Hero3D.tsx` from `@react-three/fiber` / `@react-three/drei` to a plain Three.js `useEffect` scene.
This removes the heavy R3F dependency tree and gives direct control over the renderer.

## Current State

- Landing page has lazy-loaded `Hero3D.tsx` using R3F.
- IDE shell is functional but has known bugs.
- Compilers partially working: Babel JS/TS/JSX, Vue SFC, Svelte.
- localStorage-backed file system with auto-save.

## Critical Bugs to Fix

1. **Svelte compiler result parsing**: `result.js` is `{ code: string }` in svelte@4, not an array. Fix `compileSvelte()`.
2. **Vue SFC preview mounting**: Ensure generated preview HTML mounts Vue properly and sets `framework: 'vue'`.
3. **Debounce file auto-save**: `useEffect(() => saveFiles(files), [files])` saves on every keystroke. Add 300ms debounce.
4. **Wire up language selector**: `onChange` is empty in IDE toolbar.
5. **Console capture from preview iframe**: Use `postMessage` so console.log from preview appears in OutputPanel.

## Three.js Landing Implementation

Replace `src/components/Landing/Hero3D.tsx`:
- Remove `@react-three/fiber`, `@react-three/drei` imports.
- Use `useRef` for `div` container, `useEffect` to init Three.js scene.
- Scene content: same floating geometries (sphere, torus knot, boxes) with wireframe/solid materials.
- Mouse parallax: map cursor position to camera/group position with lerp in `requestAnimationFrame`.
- Cleanup on unmount: dispose geometries, materials, renderer, cancel rAF.
- Keep `LandingPage.tsx` lazy-loading and ErrorBoundary intact.

## IDE Polish

- Add smooth fade/slide transition from landing to IDE in `App.tsx`.
- Add Ctrl+Enter keyboard shortcut to run code in `EditorPanel.tsx` or `IDE.tsx`.
- Show loading state while compilers load (lazy import).
- Add basic error boundary around IDE.

## Validation

1. `npm run build` succeeds.
2. Landing: 3D scene renders, follows mouse, no console errors.
3. IDE: file CRUD, tabs, Monaco, dark theme.
4. Compilers: JS/TS/JSX/React, Vue SFC, Svelte compile and preview renders.
5. Console logs from preview appear in OutputPanel.
6. Files persist after refresh.
7. Panels resize.
8. Responsive on tablet.

## Dependencies

Keep:
- react, react-dom
- @monaco-editor/react
- @babel/standalone
- @babel/preset-typescript
- @vue/compiler-sfc
- svelte
- three

Remove:
- @react-three/fiber
- @react-three/drei

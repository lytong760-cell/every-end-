# React Bits Integration Plan — every-end-ide

## 1. Project Architecture (Phase 1 findings)

| Aspect | Detail |
|--------|--------|
| **Framework** | React 18.3.1 |
| **Language** | TypeScript 5.5 (strict mode) |
| **Build system** | Vite 5.4 (`tsc -b && vite build`) |
| **Styling** | Plain CSS with CSS custom properties (`src/styles/global.css`) |
| **Routing** | No router — state-based view switch: `'landing' \| 'ide'` in `App.tsx` |
| **Animation** | None currently (only CSS transitions + `pulse` keyframe) |
| **3D** | Three.js already in `dependencies` (`Hero3D.tsx`) |
| **Entry** | `src/main.tsx` → `App.tsx` → `LandingPage` or `IDE` |
| **Validation** | `npm run build` only. No `test` or `lint` script in `package.json` |

**Key source files inspected:**
- `src/App.tsx` — view switch between landing and IDE
- `src/components/Landing/LandingPage.tsx` — static title, subtitle, CTA button
- `src/components/Landing/Hero3D.tsx` — Three.js animated background
- `src/components/Landing/ErrorBoundary.tsx` — class error boundary
- `src/components/IDE/IDE.tsx` — main IDE layout with tabs, explorer, editor, output
- `src/components/IDE/FileExplorer.tsx` — file tree with context menu
- `src/components/IDE/TabsBar.tsx` — tab bar
- `src/components/IDE/EditorPanel.tsx` — Monaco editor wrapper
- `src/components/IDE/OutputPanel.tsx` — console + preview iframe
- `src/components/IDE/StatusBar.tsx` — status indicator bar
- `src/components/IDE/ResizeHandle.tsx` — drag-to-resize handles
- `src/styles/global.css` — all CSS custom properties and class styles

## 2. React Bits Inspection (Phase 2 findings)

**Repository:** `/opt/react-bits`
**Variant inspected:** `src/ts-default/` (TypeScript + plain CSS — matches this project)
**Not inspected:** `src/ts-tailwind/` (Tailwind variant — incompatible with this project)

**Components read in full:**
- `TextAnimations/BlurText/BlurText.tsx`
- `Animations/FadeContent/FadeContent.tsx`
- `Animations/AnimatedContent/AnimatedContent.tsx`
- `Components/BorderGlow/BorderGlow.tsx` + `BorderGlow.css`
- `Animations/GlareHover/GlareHover.tsx` + `GlareHover.css`
- `Animations/StarBorder/StarBorder.tsx` + `StarBorder.css`
- `Components/BounceCards/BounceCards.tsx`

## 3. Component Selection (Phase 3)

### Selected: 3 components

| Component | Dependency cost | Why selected |
|-----------|----------------|--------------|
| **BlurText** | Requires `framer-motion` (`motion/react`) | Landing page title entrance animation. Most visually impactful enhancement. `framer-motion` is a single well-known package. |
| **BorderGlow** | Zero new JS deps (pure CSS + vanilla mouse tracking) | Wrap IDE panels with interactive cursor-following glow. Adds premium feel without touching the existing architecture. |
| **GlareHover** | Zero new JS deps (pure CSS) | Replace CTA button hover with a glossy glare sweep. Also applicable to toolbar buttons. |

### Why NOT the others

| Component | Reason rejected |
|-----------|-----------------|
| **FadeContent / AnimatedContent** | Require `gsap` + `gsap/ScrollTrigger`. Two heavy dependencies for scroll-triggered fades that this app doesn't need (no scrollable landing content). |
| **StarBorder** | Pure CSS, but its `border-radius: 20px` and fixed sizing model clash with the IDE's compact `--radius: 6px` aesthetic. GlareHover is more flexible. |
| **BounceCards** | Requires `gsap`. Designed for image carousels, not applicable to an IDE. |
| **Text animations (ScrambledText, GlitchText, etc.)** | Mostly require `motion/react`. Too noisy for a productivity IDE landing page. |
| **Background animations (Aurora, Plasma, etc.)** | Would conflict with the existing Three.js `Hero3D` background. |

## 4. Integration Steps (Phase 4)

### Step 1: Install `framer-motion`

```bash
npm install framer-motion
```

Only `BlurText` requires a new dependency. `BorderGlow` and `GlareHover` are pure CSS/vanilla JS.

### Step 2: Copy React Bits source into the project

Create a local `src/react-bits/` directory and copy:

```
src/react-bits/
  BlurText/
    BlurText.tsx
  BorderGlow/
    BorderGlow.tsx
    BorderGlow.css
  GlareHover/
    GlareHover.tsx
    GlareHover.css
```

No package import needed — files are copied directly to avoid depending on the React Bits npm package.

### Step 3: Integrate `BlurText` into `LandingPage.tsx`

Replace the static `<h1 className="landing-title">every-end</h1>` with:

```tsx
import BlurText from '../react-bits/BlurText/BlurText';

// inside LandingPage:
<BlurText
  text="every-end"
  delay={150}
  animateBy="letters"
  direction="top"
  className="landing-title"
/>
```

Keep existing CSS class `landing-title` so gradient text styles remain intact.

### Step 4: Integrate `GlareHover` into CTA button

Wrap the CTA button in `LandingPage.tsx`:

```tsx
import GlareHover from '../react-bits/GlareHover/GlareHover';

// inside LandingPage:
<GlareHover
  width="auto"
  height="auto"
  background="var(--accent)"
  borderRadius="var(--radius)"
  borderColor="var(--accent)"
  glareColor="#ffffff"
  glareOpacity={0.3}
  transitionDuration={600}
  className="cta-button-wrapper"
>
  <button className="cta-button" onClick={onLaunch}>
    Open IDE
  </button>
</GlareHover>
```

Adjust `GlareHover.css` or wrapper styles so the inner button retains its padding and shadow.

### Step 5: Integrate `BorderGlow` into IDE panels

Wrap the major IDE panels in `IDE.tsx`:

```tsx
import BorderGlow from '../react-bits/BorderGlow/BorderGlow';
import '../react-bits/BorderGlow/BorderGlow.css';

// FileExplorer wrapper:
<BorderGlow
  backgroundColor="var(--bg-secondary)"
  glowColor="40 80 80"
  borderRadius={8}
  glowIntensity={0.6}
  edgeSensitivity={25}
  className="ide-panel"
>
  <FileExplorer ... />
</BorderGlow>

// EditorPanel wrapper:
<BorderGlow
  backgroundColor="var(--bg-primary)"
  glowColor="40 80 80"
  borderRadius={0}
  glowIntensity={0.4}
  edgeSensitivity={30}
  className="ide-panel"
>
  <EditorPanel ... />
</BorderGlow>

// OutputPanel wrapper:
<BorderGlow
  backgroundColor="var(--bg-secondary)"
  glowColor="40 80 80"
  borderRadius={0}
  glowIntensity={0.4}
  edgeSensitivity={30}
  className="ide-panel"
>
  <OutputPanel ... />
</BorderGlow>
```

Remove conflicting `border` and `box-shadow` from the existing panel CSS classes so `BorderGlow`'s styles take precedence.

### Step 6: Import CSS files

In `src/main.tsx` or component-level imports:
- `import '../react-bits/BorderGlow/BorderGlow.css';`
- `import '../react-bits/GlareHover/GlareHover.css';`

`BlurText` needs no CSS import (uses inline `motion` styles).

### Step 7: Verify build

```bash
npm run build
```

Expected result: TypeScript compiles cleanly, Vite bundles successfully, no missing module errors.

## 5. Quality Check Targets (Phase 5)

- [ ] No broken imports (`motion/react`, copied files, CSS imports)
- [ ] No TypeScript errors (`tsc -b` passes)
- [ ] No CSS conflicts between `BorderGlow`/`GlareHover` and existing panel styles
- [ ] `BlurText` `className` merges with existing `.landing-title` gradient styles
- [ ] `GlareHover` wrapper doesn't break CTA button click target or layout
- [ ] `BorderGlow` doesn't add unwanted scrollbars or overflow clipping to IDE panels
- [ ] No hydration mismatches (all animation libs use client-side effects safely)
- [ ] Responsive layout preserved (IDE panels still resize correctly)
- [ ] No accessibility regressions (focus states, button semantics intact)

## 6. Rollback Plan

If any component causes issues:
1. Revert `src/react-bits/` directory
2. Revert modified files (`LandingPage.tsx`, `IDE.tsx`, `main.tsx`)
3. `npm uninstall framer-motion` if BlurText is the problem
4. BorderGlow and GlareHover can be independently removed since they're pure CSS

## 7. Open Questions / Decisions Needed

1. **framer-motion version** — should pin to a specific minor version to avoid future breakage. Recommend `framer-motion@^11.0.0` (latest stable as of 2025).
2. **BorderGlow on StatusBar** — StatusBar is thin and may look odd with glow. Recommend omitting.
3. **BlurText on subtitle** — Could animate subtitle too, but may feel slow. Recommend title only for v1.

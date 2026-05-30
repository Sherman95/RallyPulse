# 🎟️ Ticket — Sistema de Color RallyPulse (Modo Claro + Oscuro)

**Proyecto:** RallyPulse / FEDAK  
**Área:** Frontend — Design System  
**Prioridad:** Alta  
**Estimado:** 2–3 horas  

---

## Contexto

El modo claro actual usa `bg-white` y `bg-gray-50` puros, lo que genera una interfaz plana sin profundidad visual. Este ticket reemplaza ese sistema por una paleta de **3 capas de fondo con tinte**, que da contraste y personalidad sin necesitar sombras ni degradados.

Se implementan dos paletas aprobadas:
- **Slate** (modo claro) — fondos azul pizarra suave, topbar azul marino
- **WRC Dark** (modo oscuro) — negro carbón cálido, acento amarillo WRC

---

## Cambios requeridos

### 1. `tailwind.config.ts` — Definir tokens semánticos

Reemplazar los colores hardcodeados (`white`, `gray-50`, `gray-900`, `red-600`) por tokens propios del proyecto:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rally: {
          bg:        'hsl(var(--rally-bg))',
          surface:   'hsl(var(--rally-surface))',
          surface2:  'hsl(var(--rally-surface2))',
          nav:       'hsl(var(--rally-nav))',
          'nav-txt': 'hsl(var(--rally-nav-txt))',
          accent:    'hsl(var(--rally-accent))',
          txt:       'hsl(var(--rally-txt))',
          muted:     'hsl(var(--rally-muted))',
          hint:      'hsl(var(--rally-hint))',
          gold:      'hsl(var(--rally-gold))',
          silver:    'hsl(var(--rally-silver))',
          bronze:    'hsl(var(--rally-bronze))',
          gap:       'hsl(var(--rally-gap))',
        }
      }
    }
  }
}
export default config
```

---

### 2. `globals.css` — Variables por modo

```css
/* ─── MODO CLARO — Paleta "Slate" ─── */
:root {
  --rally-bg:         220 18% 88%;   /* #E8ECF2 — página base, azul pizarra */
  --rally-surface:    220 20% 95%;   /* #F4F6FA — cards y paneles */
  --rally-surface2:   0   0%  100%;  /* #FFFFFF — elemento más elevado */
  --rally-nav:        225 30% 15%;   /* #1C2333 — topbar azul marino */
  --rally-nav-txt:    220 18% 88%;   /* igual que bg para invertir */
  --rally-accent:     10  83% 50%;   /* #E8391A — rojo racing */
  --rally-txt:        225 30% 15%;   /* #1C2333 */
  --rally-muted:      220 10% 40%;   /* #5A6475 */
  --rally-hint:       220  8% 63%;   /* #9AA0AE */
  --rally-gold:       42  100% 30%;  /* #9C6C00 */
  --rally-silver:     220 10% 36%;   /* #4A5568 */
  --rally-bronze:     22  80% 26%;   /* #7A3F10 */
  --rally-gap:        14  72% 40%;   /* #C03010 */
}

/* ─── MODO OSCURO — Paleta "WRC Dark" ─── */
.dark {
  --rally-bg:         0   0%   4%;   /* #0A0A0A — negro carbón */
  --rally-surface:    0   0%   8%;   /* #141414 — superficie */
  --rally-surface2:   0   0%  11%;   /* #1C1C1C — elevado */
  --rally-nav:        0   0%   4%;   /* mismo que bg en oscuro */
  --rally-nav-txt:    0   0%  94%;   /* #F0F0F0 */
  --rally-accent:     48  91% 60%;   /* #F5C800 — amarillo WRC */
  --rally-txt:        0   0%  94%;   /* #F0F0F0 */
  --rally-muted:      0   0%  53%;   /* #888888 */
  --rally-hint:       0   0%  27%;   /* #444444 */
  --rally-gold:       48  91% 60%;   /* #F5C800 — mismo que accent en dark */
  --rally-silver:     210  8% 72%;   /* #B0BAC4 */
  --rally-bronze:     28  65% 52%;   /* #C87830 */
  --rally-gap:        48  91% 60%;   /* #F5C800 — diferencias en amarillo */
}
```

---

### 3. Migración de clases en componentes

Buscar y reemplazar las clases hardcodeadas en todos los componentes:

| Clase actual | Clase nueva |
|---|---|
| `bg-white` | `bg-rally-surface2` |
| `bg-gray-50` | `bg-rally-surface` |
| `bg-gray-100` | `bg-rally-bg` |
| `text-gray-900` | `text-rally-txt` |
| `text-gray-500` | `text-rally-muted` |
| `text-gray-400` | `text-rally-hint` |
| `border-gray-100` | `border-rally-bg` |
| `border-gray-200` | `border-rally-surface` |
| `text-red-600` | `text-rally-accent` |
| `bg-red-600` | `bg-rally-accent` |

---

### 4. `Header.tsx` — Topbar con fondo oscuro en ambos modos

El topbar **siempre** usa fondo oscuro (`bg-rally-nav`), independientemente del modo. Esto ancla la página visualmente.

```tsx
// Header.tsx
<header className="bg-rally-nav border-b border-white/[0.08]">
  <div className="flex items-center gap-2 h-11 px-4">

    {/* Logo dot — color acento */}
    <span className="w-2 h-2 rounded-full bg-rally-accent" />

    {/* Nombre — texto invertido siempre claro */}
    <span className="text-rally-nav-txt text-sm font-medium tracking-wide">
      Rally<span className="text-rally-accent">Pulse</span>
    </span>
    <span className="text-white/40 text-xs ml-0.5">FEDAK 2025</span>

    {/* Chip EN VIVO */}
    <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-sm
                     bg-rally-accent text-rally-nav tracking-wide">
      EN VIVO
    </span>

    {/* Pulso animado */}
    <span className="relative flex h-2 w-2 ml-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full
                       rounded-full bg-rally-accent opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-rally-accent" />
    </span>

    {/* Toggle tema */}
    <ThemeToggle />
  </div>
</header>
```

---

### 5. `StageNav.tsx` — Tabs sobre fondo intermedio

```tsx
// StageNav.tsx
<nav className="bg-rally-surface border-b border-rally-bg
                flex overflow-x-auto [&::-webkit-scrollbar]:hidden
                lg:[&::-webkit-scrollbar]:block">
  {stages.map(stage => (
    <button
      key={stage}
      className={cn(
        'px-3 py-2.5 text-xs font-medium whitespace-nowrap flex-shrink-0',
        'border-b-2 transition-colors',
        isActive(stage)
          ? 'text-rally-accent border-rally-accent bg-rally-surface2'
          : 'text-rally-muted border-transparent hover:text-rally-txt'
      )}
    >
      {stage}
    </button>
  ))}
</nav>
```

---

### 6. `TopThree.tsx` — Podio sin degradados

Las 3 tarjetas usan **fondo sólido semitransparente + borde de color de medalla + franja superior de 3px**.

```tsx
// TopThree.tsx
const MEDAL = {
  1: {
    border:  'border-rally-gold',
    strip:   'bg-rally-gold',
    numCol:  'text-rally-gold',
    cardBg:  'bg-amber-50   dark:bg-amber-900/10',
  },
  2: {
    border:  'border-rally-silver/50',
    strip:   'bg-rally-silver',
    numCol:  'text-rally-silver',
    cardBg:  'bg-slate-100  dark:bg-slate-800/20',
  },
  3: {
    border:  'border-rally-bronze/50',
    strip:   'bg-rally-bronze',
    numCol:  'text-rally-bronze',
    cardBg:  'bg-orange-50  dark:bg-orange-900/10',
  },
}

function PodiumCard({ entry, position }: Props) {
  const m = MEDAL[position]
  return (
    <div className={cn(
      'relative rounded-lg border overflow-hidden flex flex-col items-center gap-1 p-3',
      m.cardBg,
      m.border,
      position === 1 ? 'border-2' : 'border'
    )}>
      {/* franja superior de color */}
      <div className={cn('absolute top-0 inset-x-0 h-0.5', m.strip)} />

      <span className={cn('text-3xl font-medium leading-none mt-1', m.numCol)}>
        {position}
      </span>
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm
                       bg-black/5 dark:bg-white/8 text-rally-muted">
        {entry.number}
      </span>
      <p className="text-xs font-medium text-rally-txt text-center uppercase tracking-wide leading-tight">
        {entry.driver}
      </p>
      <p className="text-[10px] text-rally-muted text-center">{entry.codriver}</p>

      <div className="w-4/5 h-px bg-rally-txt/10 my-0.5" />

      <span className="text-sm font-medium text-rally-txt tabular-nums font-mono">
        {entry.totalTime}
      </span>
      <span className={cn(
        'text-[10px] font-mono tabular-nums',
        position === 1 ? 'text-rally-hint' : 'text-rally-gap'
      )}>
        {position === 1 ? 'LÍDER' : entry.gap}
      </span>
      <CategoryBadge category={entry.category} />
    </div>
  )
}
```

---

### 7. `Leaderboard.tsx` — Fila dorada para el 1°

```tsx
// Leaderboard.tsx
<tr className={cn(
  'border-b border-rally-bg transition-colors',
  position === 1
    ? 'bg-amber-50 dark:bg-amber-900/[0.06]'   // fondo dorado suave
    : 'hover:bg-rally-surface'
)}>
  <td className={cn('text-sm font-medium w-7', {
    'text-rally-gold':   position === 1,
    'text-rally-silver': position === 2,
    'text-rally-bronze': position === 3,
    'text-rally-hint':   position > 3,
  })}>
    {position}
  </td>
  <td className="text-[11px] text-rally-muted font-mono">{entry.number}</td>
  <td>
    <span className="text-sm font-medium text-rally-txt">{entry.driver}</span>
    <CategoryBadge category={entry.category} />
  </td>
  {/* Ocultar en móvil */}
  <td className="hidden md:table-cell text-xs text-rally-muted">{entry.codriver}</td>
  <td className="text-right text-sm text-rally-txt font-mono tabular-nums">{entry.time}</td>
  <td className={cn(
    'text-right text-xs font-mono tabular-nums',
    position === 1 ? 'text-rally-hint' : 'text-rally-gap'
  )}>
    {position === 1 ? '—' : entry.gap}
  </td>
</tr>
```

---

### 8. `components/ui/CategoryBadge.tsx` — Archivo nuevo

Crear este componente una sola vez. Centraliza todos los colores de categoría.

```tsx
// components/ui/CategoryBadge.tsx
const STYLES: Record<string, string> = {
  'Rally 2 / R5': 'bg-blue-50    text-blue-800   dark:bg-blue-900/25   dark:text-blue-300',
  'N5 Prototipos':'bg-purple-50  text-purple-800 dark:bg-purple-900/25 dark:text-purple-300',
  'RC3':          'bg-sky-50     text-sky-800    dark:bg-sky-900/25    dark:text-sky-300',
  'RC4':          'bg-green-50   text-green-800  dark:bg-green-900/25  dark:text-green-300',
  'RC5':          'bg-amber-50   text-amber-800  dark:bg-amber-900/25  dark:text-amber-300',
  'RC2N':         'bg-teal-50    text-teal-800   dark:bg-teal-900/25   dark:text-teal-300',
  'T4':           'bg-orange-50  text-orange-800 dark:bg-orange-900/25 dark:text-orange-300',
  'T3':           'bg-rose-50    text-rose-800   dark:bg-rose-900/25   dark:text-rose-300',
  'T1':           'bg-red-50     text-red-800    dark:bg-red-900/25    dark:text-red-300',
  'TODO TERRENO': 'bg-lime-50    text-lime-800   dark:bg-lime-900/25   dark:text-lime-300',
  'UTV-R':        'bg-red-50     text-red-800    dark:bg-red-900/25    dark:text-red-300',
  'UTV-T':        'bg-orange-50  text-orange-800 dark:bg-orange-900/25 dark:text-orange-300',
  'CAMIONETAS':   'bg-violet-50  text-violet-800 dark:bg-violet-900/25 dark:text-violet-300',
}

export function CategoryBadge({ category }: { category: string }) {
  const styles = STYLES[category] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  return (
    <span className={`inline-block text-[9px] font-medium px-1.5 py-0.5 rounded-sm ${styles}`}>
      {category}
    </span>
  )
}
```

---

### 9. `hooks/useTheme.ts` — Toggle persistente

```ts
// hooks/useTheme.ts
import { useEffect, useState } from 'react'

export function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('rally-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('rally-theme', dark ? 'dark' : 'light')
  }, [dark])

  return { dark, toggle: () => setDark(d => !d) }
}
```

```tsx
// En Header.tsx — botón de toggle
function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      className="ml-2 w-7 h-7 flex items-center justify-center rounded
                 border border-white/20 text-white/60 hover:text-white
                 hover:border-white/40 transition-colors"
    >
      {dark ? <SunIcon size={14} /> : <MoonIcon size={14} />}
    </button>
  )
}
```

---

### 10. `StageInfo.tsx` — Barra de estado con fondo intermedio

```tsx
// StageInfo.tsx
<div className="bg-rally-surface border-b border-rally-bg px-4 py-2
                flex items-center gap-3 flex-wrap">
  <span className="text-xs font-medium text-rally-accent tracking-wider uppercase">
    {stage.code}
  </span>
  <span className="text-xs text-rally-muted">·</span>
  <span className="text-sm font-medium text-rally-txt">{stage.name}</span>
  <span className="text-xs text-rally-muted">{stage.distance} km</span>

  <StatusBadge status={stage.status} className="ml-auto" />
</div>
```

```tsx
// StatusBadge — 3 estados
const STATUS_STYLES = {
  'Próximo':    'bg-rally-surface2 text-rally-muted  border border-rally-bg',
  'En Curso':   'bg-rally-accent   text-rally-nav',
  'Finalizado': 'bg-green-100      text-green-800    dark:bg-green-900/30 dark:text-green-300',
}
```

---

## Archivos afectados

```
tailwind.config.ts          ← tokens nuevos
app/globals.css             ← variables CSS por modo
hooks/useTheme.ts           ← nuevo
components/ui/CategoryBadge.tsx  ← nuevo
components/Header.tsx
components/LiveDashboard.tsx
components/StageNav.tsx
components/StageInfo.tsx
components/CategoryTabs.tsx
components/TopThree.tsx
components/Leaderboard.tsx
```

---

## Criterios de aceptación

- [ ] El fondo de la página en modo claro **no es blanco puro** — tiene tinte azul pizarra visible
- [ ] El topbar es siempre oscuro (`#1C2333`) independientemente del modo
- [ ] El toggle de tema persiste entre recargas de página
- [ ] Las 3 tarjetas del podio usan borde de color de medalla, sin degradados
- [ ] El 1° en el leaderboard tiene fondo dorado suave
- [ ] Los tiempos usan `font-mono` + `tabular-nums` en toda la app
- [ ] `CategoryBadge` es el único lugar donde se definen colores de categoría
- [ ] En móvil las columnas de copiloto y vehículo están ocultas (`hidden md:table-cell`)
- [ ] No existe ningún `bg-white` ni `text-gray-900` suelto en componentes


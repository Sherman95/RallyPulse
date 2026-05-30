# 🐛 Fix urgente — Modo claro aparece negro

## Diagnóstico

El fondo negro en modo claro tiene una de estas 3 causas (revisar en orden):

---

## Fix 1 — Verificar el script anti-FOUC en `app/layout.tsx`

El script que detecta el tema inicial puede estar forzando `.dark` por error.

```tsx
// ❌ Problema común — falla si localStorage está vacío Y prefers-color-scheme es dark
// en la máquina del dev, pero en producción el usuario ve claro

// ✅ Reemplazar el script en app/layout.tsx por este:
<script dangerouslySetInnerHTML={{__html: `
  (function(){
    try {
      const saved = localStorage.getItem('rally-theme');
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (saved === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // Sin preferencia guardada: respetar sistema operativo
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        }
        // Si el SO es claro, NO hacer nada — dejar sin clase .dark
      }
    } catch(e) {}
  })()
`}} />
```

**Luego:** abrir DevTools → Application → Local Storage → borrar `rally-theme` → recargar.
Si el fondo sigue negro, el problema es el Fix 2.

---

## Fix 2 — Orden de variables en `globals.css` (causa más probable)

En Tailwind v4 con `@theme inline`, si las variables del `.dark` están definidas
**antes** que las de `:root`, o si `:root` no existe explícitamente, el modo oscuro
gana por defecto.

```css
/* ❌ Orden incorrecto — .dark antes que :root */
.dark {
  --rally-bg: 0 0% 4%;
}
:root {
  --rally-bg: 220 18% 88%;
}

/* ✅ Orden correcto — :root SIEMPRE primero */
:root {
  --rally-bg:        220 18% 88%;   /* #E8ECF2 */
  --rally-surface:   220 20% 95%;   /* #F4F6FA */
  --rally-surface2:  0   0%  100%;  /* #FFFFFF */
  --rally-nav:       225 30% 15%;   /* #1C2333 */
  --rally-nav-txt:   220 18% 88%;
  --rally-accent:    10  83% 50%;   /* #E8391A */
  --rally-txt:       225 30% 15%;   /* #1C2333 */
  --rally-muted:     220 10% 40%;   /* #5A6475 */
  --rally-hint:      220  8% 63%;   /* #9AA0AE */
  --rally-gold:      42  100% 30%;  /* #9C6C00 */
  --rally-silver:    220 10% 36%;   /* #4A5568 */
  --rally-bronze:    22  80% 26%;   /* #7A3F10 */
  --rally-gap:       14  72% 40%;   /* #C03010 */
}

.dark {
  --rally-bg:        0   0%   4%;   /* #0A0A0A */
  --rally-surface:   0   0%   8%;   /* #141414 */
  --rally-surface2:  0   0%  11%;   /* #1C1C1C */
  --rally-nav:       0   0%   4%;
  --rally-nav-txt:   0   0%  94%;   /* #F0F0F0 */
  --rally-accent:    48  91% 60%;   /* #F5C800 */
  --rally-txt:       0   0%  94%;
  --rally-muted:     0   0%  53%;   /* #888888 */
  --rally-hint:      0   0%  27%;   /* #444444 */
  --rally-gold:      48  91% 60%;
  --rally-silver:    210  8% 72%;
  --rally-bronze:    28  65% 52%;
  --rally-gap:       48  91% 60%;
}

/* Tailwind v4 — @theme inline va DESPUÉS de las variables */
@theme inline {
  --color-rally-bg:       hsl(var(--rally-bg));
  --color-rally-surface:  hsl(var(--rally-surface));
  --color-rally-surface2: hsl(var(--rally-surface2));
  --color-rally-nav:      hsl(var(--rally-nav));
  --color-rally-nav-txt:  hsl(var(--rally-nav-txt));
  --color-rally-accent:   hsl(var(--rally-accent));
  --color-rally-txt:      hsl(var(--rally-txt));
  --color-rally-muted:    hsl(var(--rally-muted));
  --color-rally-hint:     hsl(var(--rally-hint));
  --color-rally-gold:     hsl(var(--rally-gold));
  --color-rally-silver:   hsl(var(--rally-silver));
  --color-rally-bronze:   hsl(var(--rally-bronze));
  --color-rally-gap:      hsl(var(--rally-gap));
}
```

---

## Fix 3 — `useTheme.ts` inicializa en dark sin querer

Si el hook inicializa `dark = true` por defecto antes de leer localStorage,
React renderiza el componente con modo oscuro en el primer frame.

```ts
// ❌ Puede leer mal en SSR (Next.js) — window no existe en servidor
const [dark, setDark] = useState(() => {
  return localStorage.getItem('rally-theme') === 'dark' // 💥 error en SSR
})

// ✅ Correcto para Next.js — lazy init con guard
const [dark, setDark] = useState(false) // empieza en claro siempre

useEffect(() => {
  // Este código solo corre en el cliente, nunca en el servidor
  const saved = localStorage.getItem('rally-theme')
  if (saved === 'dark') {
    setDark(true)
    document.documentElement.classList.add('dark')
  } else if (!saved) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(prefersDark)
    document.documentElement.classList.toggle('dark', prefersDark)
  }
}, [])

const toggle = () => {
  setDark(d => {
    const next = !d
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('rally-theme', next ? 'dark' : 'light')
    return next
  })
}
```

---

## Verificación rápida en DevTools

1. Abrir DevTools → Elements
2. Verificar que `<html>` **no tenga** la clase `dark`
3. Si la tiene y no debería: el bug es el Fix 1 (script FOUC) o Fix 3 (useTheme SSR)
4. Si `<html>` no tiene `.dark` pero el fondo sigue negro: el bug es el Fix 2 (globals.css)

---

## Checklist antes de dar por cerrado

- [ ] `localStorage.rally-theme` borrado para probar estado fresco
- [ ] `<html>` sin clase `.dark` en modo claro (verificar en Elements)
- [ ] `:root` definido ANTES que `.dark` en globals.css
- [ ] `@theme inline` definido DESPUÉS de `:root` y `.dark`
- [ ] `useTheme` inicializa en `false` y corre el efecto solo en cliente


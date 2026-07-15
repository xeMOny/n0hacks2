# Landing Page · Universidad Malta

> ⚠️ **Archivado, contenido desactualizado.** Describe la primera versión del scaffold
> (tema azul, cursos hardcodeados, sin i18n). El diseño actual usa paleta esmeralda/ámbar,
> textos vía `react-i18next` (`src/i18n/locales/*.json`) y RGPD real. Se conserva solo como
> referencia histórica — no seguir estas instrucciones para editar la landing actual.

**Estado:** ✅ Completado (listo para editar)  
**Ubicación:** `apps/web-lms/src/pages/Home.tsx`

## Qué tiene

- ✅ Hero section con título + CTA
- ✅ 3 características (Cursos, Comunidad, Certificados)
- ✅ Grid de 3 cursos (name, desc, precio, botón)
- ✅ CTA section
- ✅ Header sticky + Footer
- ✅ Responsive (mobile + desktop)
- ✅ Animaciones suaves (framer-motion)
- ✅ Tema oscuro profesional

## Cambiar contenido fácil

En el archivo `Home.tsx`:

```typescript
const courses = [
  { id: 1, title: 'AQUÍ', desc: 'AQUÍ', price: '€XXX' },
  // ...
];
```

- Cambia títulos, descripciones, precios
- Añade/quita cursos duplicando el objeto
- Colores en las clases `text-blue-400` (buscar y reemplazar)
- Email/teléfono en footer

## Para usar ahora

1. Copiar `Home.tsx` a tu proyecto
2. Importar en tu router: `import Home from './pages/Home'`
3. Asegurar que `framer-motion` + `lucide-react` estén instalados:
   ```bash
   npm install framer-motion lucide-react
   ```
4. Servir con `npm run dev`

## Para el final de mes

- Cambiar títulos/cursos/precios según decidáis
- Agregar logo real (reemplaza 🎓)
- Cambiar email/teléfono
- (Opcional) agregar imagen hero, testimonios, más secciones

Listo para presentable verano. 👍

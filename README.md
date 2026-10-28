# Cloud Practitioner en 20 días

Web interactiva en **React + Vite** para prepararte para el examen **AWS Certified Cloud Practitioner (CLF-C02)**.
Cada día se abre **una sola pregunta**, solo puedes responderla **una vez**, y al enviar se explica por qué
cada opción es correcta o incorrecta.

## Requisitos

- [Node.js](https://nodejs.org) 18 o superior (incluye `npm`)

## Instalación y uso

```bash
cd cloud-practitioner-20   # 1. entra a la carpeta
npm install                # 2. instala dependencias
npm run dev                # 3. arranca el servidor de desarrollo
```

Abre la URL que muestra la terminal (normalmente http://localhost:5173).

### Versión de producción

```bash
npm run build      # genera la carpeta dist/
npm run preview    # sirve dist/ para probarla
```

Sube el contenido de `dist/` a cualquier hosting estático (Netlify, Vercel, GitHub Pages, S3 + CloudFront...).

## Cómo funciona el reto de 20 días

- La primera vez que abres la web se guarda esa fecha como **Día 1**.
- Cada día a la **medianoche (hora local)** se abre la siguiente pregunta.
- Solo se puede responder la pregunta **de hoy**, una vez. No hay segundo intento.
- Los días futuros están **bloqueados** y los que no respondas quedan **perdidos**.
- Los días ya respondidos se pueden repasar tocando su círculo en "Tu ruta".
- El progreso se guarda en el `localStorage` del navegador (sin servidor ni cuentas). Si borras los datos
  del navegador o cambias de dispositivo, el reto empieza de nuevo.
- El botón **Reiniciar reto** (al final de la página) borra el progreso y empieza otra vez hoy.

### Probar sin esperar 20 días

Añade `?day=N` a la URL para simular que hoy es el día N: `http://localhost:5173/?day=7`

## Estructura

```
src/
├─ data/questions.js        ← las 20 preguntas (edítalas aquí)
├─ hooks/useProgress.js     ← lógica de días, bloqueo y guardado
├─ components/
│  ├─ Hero.jsx              ← título y abanico de tarjetas con parallax
│  ├─ MagneticText.jsx      ← letras magnéticas (efecto tipo bencho.dev)
│  ├─ QuestionCard.jsx      ← pregunta, opciones y explicaciones
│  ├─ Timeline.jsx          ← ruta de 20 días
│  ├─ Confetti.jsx          ← confeti al acertar
│  ├─ Reveal.jsx            ← entrada "text rise" al hacer scroll
│  └─ Eyebrow.jsx, Icons.jsx
├─ styles.css               ← tokens y estilos del design.md (Authkit)
├─ App.jsx
└─ main.jsx
```

## Editar preguntas

En `src/data/questions.js` cada pregunta tiene este formato:

```js
{
  day: 1,
  domain: 'Seguridad y cumplimiento',
  pick: 1,                       // 1 = una respuesta, 2 = "elige dos"
  text: 'Enunciado...',
  options: [
    { id: 'a', text: 'Opción A', why: 'Correcta. Porque...' },
    { id: 'b', text: 'Opción B', why: 'Incorrecta. Porque...' },
  ],
  correct: ['a'],                // ids correctos (2 si pick = 2)
}
```

Deben estar en orden (`day` 1 a 20). El texto de `why` debe empezar con "Correcta." o "Incorrecta.".

## Nota sobre las preguntas

AWS Skill Builder exige iniciar sesión, así que las preguntas oficiales no se pudieron importar. Las 20
incluidas son **originales**, alineadas con los 4 dominios del CLF-C02. Para usar las oficiales, cópialas
en `questions.js` con el formato de arriba.

## Animaciones (inspiradas en bencho.dev)

Letras magnéticas en el título, parallax en las tarjetas, spotlight que sigue al cursor en las opciones,
entrada "text rise" con desenfoque, confeti al acertar y vibración al fallar. Respeta `prefers-reduced-motion`.
"# cloud-practitioner" 

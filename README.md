# 🗳️ Simulador electoral de Valencia

Web interactiva para simular la **asignación de diputados al Congreso por la provincia de Valencia** mediante el **método D'Hondt**.

## Funcionalidades

- Editar el nombre y el número de votos de cada partido.
- Añadir o eliminar partidos políticos.
- Ajustar los escaños a repartir (por defecto, **16**, como configuración de ejemplo para Valencia).
- Introducir votos en blanco.
- Aplicar la barrera electoral del **3 % de los votos válidos**, incluyendo los votos en blanco.
- Mostrar el reparto de escaños, los porcentajes y los cocientes ganadores.
- Diseño adaptable a móviles y ordenadores.

> **Aviso:** Los partidos y votos iniciales son ficticios. El número de escaños de una circunscripción puede variar entre convocatorias; comprueba el número oficial de la elección que desees simular.

## ¿Cómo funciona D'Hondt?

1. Se suman los votos a candidaturas y los votos en blanco para obtener los votos válidos.
2. Solo participan en el reparto los partidos con al menos un 3 % de los votos válidos.
3. Los votos de cada partido participante se dividen por 1, 2, 3, etc.
4. Se adjudican los escaños a los cocientes mayores hasta agotarlos.
5. En caso de empate exacto de cocientes, la legislación prioriza a la candidatura con más votos; si también empatan los votos, la primera adjudicación se decide por sorteo y las siguientes se alternan. **Esta demo no implementa el sorteo:** para empates totales usa el orden de introducción de los partidos como criterio determinista.

## Ejecutar en local

No requiere instalación ni dependencias: abre `index.html` en tu navegador.

## Publicar en GitHub Pages

1. Crea un repositorio público en GitHub (por ejemplo, `simulador-electoral-valencia`).
2. Sube `index.html`, `styles.css`, `script.js` y `README.md` a la rama `main`.
3. Ve a **Settings → Pages → Build and deployment**.
4. Selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
5. La dirección habitual será `https://TU_USUARIO.github.io/simulador-electoral-valencia/`.

## Tecnologías

HTML5, CSS3 y JavaScript (sin frameworks).

## Referencia legal

[Ley Orgánica 5/1985, del Régimen Electoral General (LOREG)](https://www.boe.es/buscar/act.php?id=BOE-A-1985-11672), artículos 162 y 163.

## Estructura

```
simulador-electoral-valencia/
├── index.html
├── styles.css
├── script.js
└── README.md
```

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

## Mejoras de la beta

- Color predeterminado por partido y selector circular para cambiarlo.
- Filas teñidas suavemente según el color seleccionado, también en resultados.
- Tabla D'Hondt horizontal: partidos en filas, divisores (1 hasta el número de escaños) en columnas.
- Cocientes adjudicatarios resaltados. La tabla se desplaza horizontalmente en pantallas pequeñas.
- Los nombres y votos siguen siendo editables y el reparto se recalcula al instante.


## Tabla horizontal D'Hondt

La tabla muestra cada partido en una fila y los divisores (÷1 hasta ÷N) en columnas. Las celdas de cocientes que obtienen escaño aparecen destacadas. La tabla se recalcula al modificar nombres, votos, colores, votos en blanco o escaños.

Si GitHub Pages muestra la versión anterior, confirma que has sustituido los cuatro archivos en la raíz de `main`, espera al despliegue y recarga con Ctrl+F5.


## Beta 4 — Ordenación animada y fondo valenciano

- Los partidos se ordenan de mayor a menor número de votos. Tras editar los votos, se espera brevemente (550 ms) para permitir terminar de escribir y las filas se desplazan mediante animación FLIP de 570 ms. El partido conserva su identidad, nombre y color.
- El movimiento se desactiva cuando el dispositivo solicita movimiento reducido.
- Fondo ornamental con ilustraciones SVG de un hemiciclo vacío, una representación estilizada de la Ciutat de les Arts i les Ciències y una silueta **decorativa no cartográfica**. No es un mapa geográfico oficial.
- Se incluyen los archivos SVG en la carpeta `assets/`: hay que subirla también a GitHub.


## Beta 5: fondo y gráficos dinámicos

- El fondo gris incorpora ilustraciones SVG decorativas a gran escala, fijadas al fondo de la ventana; no bloquean controles.
- En **Distribución de escaños**, los botones **Barras** y **Circular** alternan entre dos gráficos accesibles, generados con JavaScript y SVG, sin dependencias externas.
- Los gráficos se recalculan automáticamente al cambiar los votos, nombres, colores, partidos, escaños o votos en blanco.
- El gráfico representa **escaños asignados**, no porcentaje de votos. El gráfico circular usa el total de escaños efectivamente adjudicados.
- El proyecto funciona directamente en GitHub Pages. Sube también la carpeta `assets/`.


## Beta 6: fondo ligero por secciones

Las ilustraciones SVG (hemiciclo, Ciudad de las Artes y las Ciencias, silueta decorativa de la Comunitat Valenciana, naranjas y Torres de Serranos) aparecen a distintas alturas mientras se desplaza la página. Son dibujos estilizados, no fotografías ni cartografía exacta. Se ha eliminado el fondo fijo y los filtros de desenfoque para reducir el coste de renderizado. Los gráficos, la clasificación y los cálculos se conservan.


## Beta 7

- Fondo gris con cinco ilustraciones SVG distribuidas por la página (la silueta es decorativa, no cartográfica). Asegúrate de subir la carpeta `assets/` completa.
- Selector de gráficos centrado y transición de deslizamiento al cambiar entre barras y circular.
- Aparición progresiva de secciones al desplazarse mediante `IntersectionObserver`.
- Compatibilidad con la preferencia de accesibilidad de movimiento reducido.
- Los gráficos y la tabla se recalculan al editar votos, nombres y colores.


## Beta 8 — Correcciones y fondo ampliado

- Corregida la desaparición de gráficos al alternar Barras/Circular: se cancela la animación de salida antes de mostrar el nuevo contenido y se evita `fill: forwards`.
- Fondos SVG grandes y detallados repartidos verticalmente; sin filtros pesados ni fondo fijo.
- Se conserva la actualización automática, el selector centrado y las animaciones de entrada.
- Publicar **también la carpeta `assets/`** y todos sus SVG en la raíz del repositorio.
- En GitHub Pages, esperar el despliegue y refrescar con Ctrl+F5.


## Beta 9: Costa mediterránea
Fondo costero en CSS, con arena y agua en los bordes y contenido central legible. Ilustraciones SVG en `assets/`, incluida una silueta **artística y no cartográfica** de la Comunitat Valenciana. Subir la carpeta `assets` junto al resto de archivos.


## Beta 10
- Fondos sin rótulos ni texto incrustado en las ilustraciones.
- Animación reversible de aparición/desaparición de secciones al desplazarse en ambas direcciones (IntersectionObserver).
- Desplegable D’Hondt con transición de altura al abrir y cerrar.
- Respeta la preferencia de accesibilidad de movimiento reducido.

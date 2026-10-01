# 🦌 El Refugio de los Pudús

> Un juego incremental (*idle/clicker*) cálido y acogedor ambientado en el bosque templado lluvioso valdiviano del sur de Chile, centrado en pudús y cosechas de maquis.

Diseñado con un ritmo de juego calibrado para completarse en **~75 a 90 minutos**, pensado especialmente como un regalo interactivo con dedicatoria personalizable.

---

## 🍃 Características

* **Estética Cozy del Sur de Chile:** Lluvia suave procedural, bosque valdiviano con musgo, helechos y arbustos de maqui.
* **Progresión en Capas (Unfolding Game):**
  1. *Fase 1: El Encuentro* — Cosecha manual y ganarse la confianza del primer pudú tímido (*Pichi*).
  2. *Fase 2: La Manada* — Construcción de camitas de musgo, llegada de más pudús con nombres chilenos, brotes de maqui y eventos activos del *Chucao*.
  3. *Fase 3: El Taller del Bosque* — Elaboración de mermelada de maqui en olla de greda, infusiones de canelo y bufanditas chilotas.
  4. *Fase 4: El Gran Picnic* — Preparativos para el banquete final y desbloqueo de la carta de regalo.
* **Audio Web Nativo:** Sintetizador con Web Audio API de lluvia sureña, pops de recolección y trino melódico de Chucao (cero dependencias de archivos de audio pesados).
* **Persistencia Automática:** Guarda el progreso en `localStorage` cada 5 segundos y calcula ganancias offline si la pestaña se cierra o queda en segundo plano.
* **Fácil de Personalizar:** Configuración centralizada en `src/giftConfig.js` para adaptar el nombre del destinatario, apodos, recuerdos y la carta final.

---

## 🚀 Cómo ejecutar localmente

1. Clona o abre la carpeta del proyecto:
   ```bash
   cd scratch/el-refugio-del-pudu
   ```

2. Instala dependencias (solo Vite):
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abre la URL local indicada (ej. `http://localhost:5173`) en tu navegador.

---

## 🎁 Cómo personalizar el Regalo

Edita el archivo [`src/giftConfig.js`](src/giftConfig.js):
* `destinatario`: Nombre de la persona.
* `apodoPudu`: Apodo cariñoso.
* `recuerdos`: Lista de recuerdos o anécdotas que se revelan en la Bitácora.
* `cartaFinal`: El saludo, párrafos de la carta y tu firma de despedida.

---

## 📦 Despliegue para regalar

Para compartirlo como un link web accesible desde cualquier celular o computador:

* **Netlify / Vercel:** Puedes conectar el repositorio o arrastrar la carpeta resultante de `npm run build` (`dist/`).
* **GitHub Pages:** Sube los archivos a una rama `gh-pages` o configura GitHub Actions con Vite.

/**
 * Sistema de Árbol de Habilidades en Grafo / Constelación 2D Interactivo
 * Estilo idéntico a la referencia: red de nodos en rombos y cuadrados con circuitos luminosos dorados.
 */

export const SKILL_GRAPH_NODES = {
  // Centro
  semillaCanelo: { x: 0, y: 0, shape: 'diamond', branch: 'centro', color: '#f59e0b' },

  // === RAMA RECOLECTOR (Izquierda / Noroeste) ===
  cucharaAlerce: { x: -140, y: -40, shape: 'square', branch: 'recolector', color: '#10b981' },
  brotesRapidos: { x: -220, y: -130, shape: 'square', branch: 'recolector', color: '#10b981' },
  cosechaCertera: { x: -280, y: -40, shape: 'diamond', branch: 'recolector', color: '#10b981' },
  punteriaAustral: { x: -370, y: -120, shape: 'square', branch: 'recolector', color: '#10b981' },
  oidoChucao: { x: -220, y: 60, shape: 'diamond', branch: 'recolector', color: '#10b981' },
  suerteProlongada: { x: -330, y: 100, shape: 'square', branch: 'recolector', color: '#10b981' },
  teCanelo: { x: -410, y: -10, shape: 'diamond', branch: 'recolector', color: '#10b981' },
  lluviaPrimavera: { x: -520, y: -10, shape: 'master_diamond', branch: 'recolector', color: '#34d399' },

  // === RAMA MANADA (Derecha / Noreste) ===
  nidoHojarasca: { x: 140, y: -40, shape: 'square', branch: 'manada', color: '#f59e0b' },
  camitasAcolchadas: { x: 220, y: -130, shape: 'square', branch: 'manada', color: '#f59e0b' },
  zapatosMusgo: { x: 280, y: -40, shape: 'diamond', branch: 'manada', color: '#f59e0b' },
  pasosSilenciosos: { x: 370, y: -120, shape: 'square', branch: 'manada', color: '#f59e0b' },
  bufandasChilotas: { x: 220, y: 60, shape: 'diamond', branch: 'manada', color: '#f59e0b' },
  ternuraCervatillos: { x: 330, y: 100, shape: 'square', branch: 'manada', color: '#f59e0b' },
  armoniaVocal: { x: 410, y: -10, shape: 'diamond', branch: 'manada', color: '#f59e0b' },
  llamadoAncestral: { x: 520, y: -10, shape: 'master_diamond', branch: 'manada', color: '#fbbf24' },

  // === RAMA TALLER (Abajo / Sur) ===
  lenaLuma: { x: 0, y: 130, shape: 'square', branch: 'taller', color: '#ea580c' },
  brasasEternas: { x: -100, y: 200, shape: 'square', branch: 'taller', color: '#ea580c' },
  fuegosVivos: { x: 100, y: 200, shape: 'square', branch: 'taller', color: '#ea580c' },
  recetaMermelada: { x: -150, y: 290, shape: 'diamond', branch: 'taller', color: '#ea580c' },
  dulzorAustral: { x: -230, y: 370, shape: 'square', branch: 'taller', color: '#ea580c' },
  amuletoArcoiris: { x: 150, y: 290, shape: 'diamond', branch: 'taller', color: '#ea580c' },
  brilloSolar: { x: 230, y: 370, shape: 'square', branch: 'taller', color: '#ea580c' },
  coronaCopihues: { x: 0, y: 350, shape: 'diamond', branch: 'taller', color: '#ea580c' },
  fuegoSagrado: { x: 0, y: 470, shape: 'master_diamond', branch: 'taller', color: '#f97316' }
};

// Conexiones de circuitos (aristas del grafo)
export const SKILL_GRAPH_EDGES = [
  // Conexiones desde la raíz central
  ['semillaCanelo', 'cucharaAlerce'],
  ['semillaCanelo', 'nidoHojarasca'],
  ['semillaCanelo', 'lenaLuma'],

  // Rama Recolectora
  ['cucharaAlerce', 'brotesRapidos'],
  ['cucharaAlerce', 'cosechaCertera'],
  ['cucharaAlerce', 'oidoChucao'],
  ['brotesRapidos', 'cosechaCertera'],
  ['cosechaCertera', 'punteriaAustral'],
  ['oidoChucao', 'suerteProlongada'],
  ['cosechaCertera', 'teCanelo'],
  ['oidoChucao', 'teCanelo'],
  ['punteriaAustral', 'teCanelo'],
  ['suerteProlongada', 'teCanelo'],
  ['teCanelo', 'lluviaPrimavera'],

  // Rama Manada
  ['nidoHojarasca', 'camitasAcolchadas'],
  ['nidoHojarasca', 'zapatosMusgo'],
  ['nidoHojarasca', 'bufandasChilotas'],
  ['camitasAcolchadas', 'zapatosMusgo'],
  ['zapatosMusgo', 'pasosSilenciosos'],
  ['bufandasChilotas', 'ternuraCervatillos'],
  ['zapatosMusgo', 'armoniaVocal'],
  ['bufandasChilotas', 'armoniaVocal'],
  ['pasosSilenciosos', 'armoniaVocal'],
  ['ternuraCervatillos', 'armoniaVocal'],
  ['armoniaVocal', 'llamadoAncestral'],

  // Rama Taller
  ['lenaLuma', 'brasasEternas'],
  ['lenaLuma', 'fuegosVivos'],
  ['brasasEternas', 'recetaMermelada'],
  ['fuegosVivos', 'amuletoArcoiris'],
  ['lenaLuma', 'recetaMermelada'],
  ['lenaLuma', 'amuletoArcoiris'],
  ['recetaMermelada', 'dulzorAustral'],
  ['amuletoArcoiris', 'brilloSolar'],
  ['recetaMermelada', 'coronaCopihues'],
  ['amuletoArcoiris', 'coronaCopihues'],
  ['coronaCopihues', 'fuegoSagrado'],

  // Enlaces transversales de armonía entre ramas (como en la referencia)
  ['cucharaAlerce', 'lenaLuma'],
  ['nidoHojarasca', 'lenaLuma']
];

export class SkillWebUI {
  constructor(state, sound, ui) {
    this.state = state;
    this.sound = sound;
    this.ui = ui;

    this.isOpen = false;
    this.selectedId = 'cucharaAlerce';

    // Estado del Pan & Zoom
    this.panX = 0;
    this.panY = 0;
    this.zoom = 1.0;
    this.minZoom = 0.55;
    this.maxZoom = 1.8;

    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.initialPanX = 0;
    this.initialPanY = 0;

    this.initDOM();
    this.setupListeners();
  }

  initDOM() {
    this.screen = document.getElementById('skill-web-screen');
    this.viewport = document.getElementById('skill-web-viewport');
    this.canvas = document.getElementById('skill-web-canvas');
    this.svg = document.getElementById('skill-web-svg');
    this.nodesContainer = document.getElementById('skill-web-nodes');
    this.inspector = document.getElementById('skill-web-inspector');

    this.resMaquis = document.getElementById('web-res-maquis');
    this.resCrit = document.getElementById('web-res-crit');
    this.resProgress = document.getElementById('web-res-progress');
  }

  setupListeners() {
    if (!this.viewport) return;

    // 1. Arrastre libre con el ratón (Pan)
    this.viewport.addEventListener('mousedown', (e) => {
      // Ignorar si hace clic en el inspector o en los controles
      if (e.target.closest('#skill-web-inspector') || e.target.closest('.skill-web-controls')) return;
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.initialPanX = this.panX;
      this.initialPanY = this.panY;
      this.viewport.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStartX;
      const dy = e.clientY - this.dragStartY;
      this.panX = this.initialPanX + dx;
      this.panY = this.initialPanY + dy;
      this.applyTransform();
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        if (this.viewport) this.viewport.style.cursor = 'grab';
      }
    });

    // 2. Soporte táctil en móviles
    this.viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.dragStartX = e.touches[0].clientX;
        this.dragStartY = e.touches[0].clientY;
        this.initialPanX = this.panX;
        this.initialPanY = this.panY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - this.dragStartX;
      const dy = e.touches[0].clientY - this.dragStartY;
      this.panX = this.initialPanX + dx;
      this.panY = this.initialPanY + dy;
      this.applyTransform();
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // 3. Zoom con rueda del ratón centrado
    this.viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      this.setZoom(this.zoom * zoomFactor);
    }, { passive: false });

    // 4. Botones flotantes de Zoom
    const zoomInBtn = document.getElementById('web-zoom-in');
    const zoomOutBtn = document.getElementById('web-zoom-out');
    const zoomResetBtn = document.getElementById('web-zoom-reset');

    if (zoomInBtn) zoomInBtn.onclick = () => this.setZoom(this.zoom * 1.25);
    if (zoomOutBtn) zoomOutBtn.onclick = () => this.setZoom(this.zoom / 1.25);
    if (zoomResetBtn) zoomResetBtn.onclick = () => this.centerView();

    // 5. Botón cerrar pantalla completa
    const closeBtn = document.getElementById('btn-close-skill-web');
    if (closeBtn) closeBtn.onclick = () => this.close();

    // 6. Navegación en la barra superior (Cosecha, Refugio, Habilidades, etc.)
    document.querySelectorAll('.skill-web-nav .web-nav-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.dataset.targetTab;
        if (target === 'arbol') {
          // Ya estamos en habilidades
          return;
        }
        this.close();
        if (this.ui) this.ui.switchTab(target);
      };
    });

    // 7. Cerrar inspector flotante
    const closeInspBtn = document.getElementById('btn-close-inspector');
    if (closeInspBtn) {
      closeInspBtn.onclick = () => {
        if (this.inspector) this.inspector.classList.add('hidden');
      };
    }
  }

  setZoom(newZoom) {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));
    this.applyTransform();
  }

  centerView() {
    if (!this.viewport) return;
    const rect = this.viewport.getBoundingClientRect();
    this.panX = rect.width / 2;
    this.panY = rect.height / 2;
    this.zoom = 1.0;
    this.applyTransform();
  }

  applyTransform() {
    if (this.canvas) {
      this.canvas.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
    }
  }

  open() {
    this.isOpen = true;
    if (this.screen) this.screen.classList.remove('hidden');
    this.centerView();
    this.render();
    if (this.sound) this.sound.playChime();
  }

  close() {
    this.isOpen = false;
    if (this.screen) this.screen.classList.add('hidden');
  }

  render() {
    if (!this.isOpen) return;

    this.renderHUD();
    this.renderLines();
    this.renderNodes();
    this.renderInspector();
  }

  renderHUD() {
    const s = this.state.data;
    const arbol = s.arbolHabilidades;
    if (!arbol) return;

    const total = Object.keys(arbol).length;
    const aprendidas = Object.values(arbol).filter(n => n.comprada).length;
    const pct = Math.round((aprendidas / total) * 100);

    if (this.resMaquis) this.resMaquis.innerText = Math.floor(s.maquis).toLocaleString();
    if (this.resCrit) this.resCrit.innerText = `${Math.round((s.probabilidadCritico || 0) * 100)}% (x${s.multiplicadorCritico || 5})`;
    if (this.resProgress) this.resProgress.innerText = `${aprendidas} / ${total} (${pct}%)`;
  }

  renderLines() {
    if (!this.svg) return;
    const arbol = this.state.data.arbolHabilidades;
    if (!arbol) return;

    // Calcular límites para el SVG
    let svgHtml = `
      <defs>
        <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    `;

    SKILL_GRAPH_EDGES.forEach(([fromId, toId]) => {
      const fromPos = SKILL_GRAPH_NODES[fromId];
      const toPos = SKILL_GRAPH_NODES[toId];
      if (!fromPos || !toPos) return;

      const fromData = arbol[fromId];
      const toData = arbol[toId];

      const fromComprada = fromData?.comprada;
      const toComprada = toData?.comprada;

      let lineClass = 'web-edge-locked';
      if (fromComprada && toComprada) {
        lineClass = 'web-edge-learned';
      } else if (fromComprada && toData?.desbloqueada) {
        lineClass = 'web-edge-available';
      }

      svgHtml += `
        <line x1="${fromPos.x}" y1="${fromPos.y}" x2="${toPos.x}" y2="${toPos.y}" 
              class="web-edge ${lineClass}" />
      `;
    });

    this.svg.innerHTML = svgHtml;
  }

  renderNodes() {
    if (!this.nodesContainer) return;
    const arbol = this.state.data.arbolHabilidades;
    if (!arbol) return;

    this.nodesContainer.innerHTML = '';

    for (const id in SKILL_GRAPH_NODES) {
      const graphNode = SKILL_GRAPH_NODES[id];
      const nodo = arbol[id];
      if (!nodo) continue;

      const cumplidos = this.state.cumplePrerrequisitos(id);
      const puedeComprar = this.state.puedeAprenderHabilidad(id);
      const esSeleccionado = this.selectedId === id;

      let statusClass = 'node-locked';
      if (nodo.comprada) {
        statusClass = 'node-learned';
      } else if (puedeComprar) {
        statusClass = 'node-available';
      } else if (cumplidos) {
        statusClass = 'node-affordable-wait';
      }

      const nodeEl = document.createElement('div');
      nodeEl.className = `web-node-wrapper node-${graphNode.shape} ${statusClass} ${esSeleccionado ? 'node-selected' : ''}`;
      nodeEl.style.left = `${graphNode.x}px`;
      nodeEl.style.top = `${graphNode.y}px`;
      nodeEl.dataset.nodeId = id;

      nodeEl.innerHTML = `
        <div class="web-node-inner" style="border-color: ${nodo.comprada ? '#fbbf24' : (puedeComprar ? '#f59e0b' : 'rgba(255,255,255,0.12)')}">
          <span class="web-node-icon">${nodo.icono}</span>
        </div>
      `;

      nodeEl.onclick = (e) => {
        e.stopPropagation();
        this.selectedId = id;
        this.renderInspector();
        this.renderNodes();
        if (this.sound) this.sound.playChirp(580, 0.03);
      };

      this.nodesContainer.appendChild(nodeEl);
    }
  }

  renderInspector() {
    if (!this.inspector) return;
    const arbol = this.state.data.arbolHabilidades;
    if (!arbol || !this.selectedId || !arbol[this.selectedId]) {
      this.inspector.classList.add('hidden');
      return;
    }

    const nodo = arbol[this.selectedId];
    const graphNode = SKILL_GRAPH_NODES[this.selectedId] || { branch: 'recolector', color: '#10b981' };
    const cumplidos = this.state.cumplePrerrequisitos(this.selectedId);
    const puedeComprar = this.state.puedeAprenderHabilidad(this.selectedId);

    this.inspector.classList.remove('hidden');

    const iconEl = document.getElementById('inspector-icon');
    const branchEl = document.getElementById('inspector-branch');
    const nameEl = document.getElementById('inspector-name');
    const descEl = document.getElementById('inspector-desc');
    const prereqsEl = document.getElementById('inspector-prereqs');
    const buyBtn = document.getElementById('inspector-buy-btn');

    if (iconEl) iconEl.innerText = nodo.icono;
    if (nameEl) nameEl.innerText = nodo.nombre;

    const branchNames = {
      centro: "🌰 Raíz Central",
      recolector: "🍃 Senda Recolectora",
      manada: "🐾 Senda de la Manada",
      taller: "🍯 Senda del Taller"
    };

    if (branchEl) {
      branchEl.innerText = `${branchNames[nodo.rama] || "Bosque"} • Tier ${nodo.tier || 0}${nodo.tier === 4 ? ' ⭐' : ''}`;
      branchEl.style.color = graphNode.color;
    }

    if (descEl) descEl.innerText = nodo.desc;

    // Prerrequisitos
    if (prereqsEl) {
      if (nodo.prerrequisitos && nodo.prerrequisitos.length > 0) {
        const items = nodo.prerrequisitos.map(pid => {
          const pNodo = arbol[pid];
          const ok = pNodo?.comprada;
          return `<span class="prereq-pill ${ok ? 'ok' : 'pending'}">${ok ? '✓' : '🔒'} ${pNodo?.nombre || pid}</span>`;
        }).join('');
        prereqsEl.innerHTML = `<div class="prereqs-title">Requisitos previos:</div><div class="prereqs-list">${items}</div>`;
      } else {
        prereqsEl.innerHTML = `<div class="prereqs-title">✨ Raíz inicial disponible sin requisitos</div>`;
      }
    }

    this.updateInspectorButton();
  }

  updateInspectorButton() {
    const buyBtn = document.getElementById('inspector-buy-btn');
    if (!buyBtn || !this.selectedId) return;

    const arbol = this.state.data.arbolHabilidades;
    if (!arbol) return;
    const nodo = arbol[this.selectedId];
    if (!nodo) return;

    const cumplidos = this.state.cumplePrerrequisitos(this.selectedId);

    if (nodo.comprada) {
      buyBtn.innerHTML = `✓ Habilidad Aprendida y Activa`;
      buyBtn.className = 'cta-btn secondary web-btn-disabled';
      buyBtn.disabled = true;
      buyBtn.onclick = null;
    } else if (!cumplidos) {
      buyBtn.innerHTML = `🔒 Requiere desbloquear anteriores`;
      buyBtn.className = 'cta-btn disabled web-btn-disabled';
      buyBtn.disabled = true;
      buyBtn.onclick = null;
    } else if (this.state.data.maquis < nodo.costo) {
      const faltan = Math.ceil(nodo.costo - this.state.data.maquis);
      buyBtn.innerHTML = `🌰 Faltan ${faltan.toLocaleString()} Maquis (${nodo.costo.toLocaleString()} 🌰)`;
      buyBtn.className = 'cta-btn disabled web-btn-disabled';
      buyBtn.disabled = true;
      buyBtn.onclick = null;
    } else {
      buyBtn.innerHTML = `✨ Aprender Habilidad (🌰 ${nodo.costo.toLocaleString()})`;
      buyBtn.className = 'cta-btn web-btn-buy';
      buyBtn.disabled = false;
      buyBtn.onclick = () => {
        const ok = this.state.aprenderHabilidad(this.selectedId);
        if (ok) {
          if (this.sound) this.sound.playChime();
          if (this.ui) {
            this.ui.notify(`¡Aprendiste: ${nodo.nombre}! ${nodo.icono}`, 'success');
            this.ui.render();
          }
          this.render();
        }
      };
    }
  }
}


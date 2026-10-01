/**
 * Interfaz de Usuario, Pestañas, Modales, Menú Desplegable Izquierdo y Enciclopedia
 */
import { giftConfig } from './giftConfig.js';
import { SaveManager } from './save.js';
import { FAUNA_FLORA_DATA } from './faunaData.js';

export const RAMAS_ARBOL = [
  {
    id: "recolector",
    nombre: "Senda Recolectora",
    icono: "🍃",
    color: "#10b981",
    tagline: "Clicks, Golpes Críticos y Microeventos",
    t1: "cucharaAlerce",
    t2a: "cosechaCertera",
    t2b: "oidoChucao",
    t3: "teCanelo",
    t4: "lluviaPrimavera",
    nodos: ["cucharaAlerce", "cosechaCertera", "oidoChucao", "teCanelo", "lluviaPrimavera"]
  },
  {
    id: "manada",
    nombre: "Senda de la Manada",
    icono: "🐾",
    color: "#f59e0b",
    tagline: "Pudús, Crías y Automatización Pasiva",
    t1: "nidoHojarasca",
    t2a: "zapatosMusgo",
    t2b: "bufandasChilotas",
    t3: "armoniaVocal",
    t4: "llamadoAncestral",
    nodos: ["nidoHojarasca", "zapatosMusgo", "bufandasChilotas", "armoniaVocal", "llamadoAncestral"]
  },
  {
    id: "taller",
    nombre: "Senda del Taller",
    icono: "🍯",
    color: "#ea580c",
    tagline: "Olla de Greda, Clima y Multiplicadores",
    t1: "lenaLuma",
    t2a: "recetaMermelada",
    t2b: "amuletoArcoiris",
    t3: "coronaCopihues",
    t4: "fuegoSagrado",
    nodos: ["lenaLuma", "recetaMermelada", "amuletoArcoiris", "coronaCopihues", "fuegoSagrado"]
  }
];

export class GameUI {
  constructor(state, sound, diorama) {
    this.state = state;
    this.sound = sound;
    this.diorama = diorama;
    this.engine = null;

    this.activeTab = 'cosecha'; // 'cosecha' | 'refugio' | 'arbol' | 'taller' | 'bitacora'
    this.sidebarCollapsed = false;
    this.selectedSkillId = 'cucharaAlerce';
    this.treeBranchFilter = 'todas';
    this.isTreeModalOpen = false;

    this.setupListeners();
  }

  setEngine(engine) {
    this.engine = engine;
  }

  setupListeners() {
    // 1. Control del Menú Lateral Plegable / Desplegable
    const sidebar = document.getElementById('sidebar-menu');
    const toggleBtn = document.getElementById('btn-toggle-sidebar');
    const openBtn = document.getElementById('btn-open-sidebar');

    const toggleSidebar = (collapse) => {
      this.sidebarCollapsed = collapse;
      if (sidebar) sidebar.classList.toggle('collapsed', collapse);
      if (openBtn) openBtn.classList.toggle('hidden', !collapse);

      // Reajustar resolución del diorama de forma inmediata
      setTimeout(() => {
        if (this.diorama) this.diorama.handleResize();
      }, 250);
    };

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => toggleSidebar(true));
    }
    if (openBtn) {
      openBtn.addEventListener('click', () => toggleSidebar(false));
    }

    // 2. Navegación por Pestañas del Menú
    document.querySelectorAll('.sidebar-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    // 3. Toggle de Sonido Ambiental
    const soundBtn = document.getElementById('btn-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const active = this.sound.toggleSound();
        soundBtn.innerHTML = active ? '🌧️ Lluvia: ON' : '🌧️ Lluvia: OFF';
        soundBtn.classList.toggle('active', active);
      });
    }

    // 4. Toggle de Ritmo de Juego (Normal vs Veloz)
    const speedBtn = document.getElementById('btn-speed');
    if (speedBtn) {
      speedBtn.addEventListener('click', () => {
        const s = this.state.data;
        s.ritmo = s.ritmo === 'calido' ? 'veloz' : 'calido';
        speedBtn.innerHTML = s.ritmo === 'veloz' ? '⚡ Ritmo: Express' : '⏳ Ritmo: Cálido';
        this.notify(`Ritmo cambiado a: ${s.ritmo === 'veloz' ? 'Express (~45-60 min)' : 'Cálido (~75-90 min)'}`, 'info');
      });
    }

    // 5. Clics en el Canvas (Mundo Visual Pixel Art)
    const canvas = document.getElementById('diorama-canvas');
    if (canvas) {
      canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        // Convertir a coordenadas virtuales del diorama
        const vCoords = this.diorama.screenToVirtual(screenX, screenY);

        // A. Verificar click sobre el Chucao en vuelo
        const ch = this.state.data.chucao;
        if (ch.activo) {
          const distChucao = Math.hypot(vCoords.x - ch.x, vCoords.y - ch.y);
          if (distChucao < 20) {
            this.engine.clickChucao();
            return;
          }
        }

        // B. Verificar click sobre la Baya Dorada flotante
        const bd = this.state.data.bayaDorada;
        if (bd && bd.activa) {
          const distBD = Math.hypot(vCoords.x - (bd.x + 4), vCoords.y - (bd.y + 4));
          if (distBD < 18) {
            this.diorama.clickBayaDorada();
            return;
          }
        }

        // C. Verificar click sobre la Ranita de Darwin en el arroyo
        const frog = this.state.data.ranitaDarwin;
        if (frog && frog.activa) {
          const distFrog = Math.hypot(vCoords.x - (frog.x + 4), vCoords.y - (frog.y + 4));
          if (distFrog < 16) {
            this.diorama.clickRanita();
            return;
          }
        }

        // D. Verificar click sobre algún Pudú o Cervatillo para acariciarlo
        for (const pudu of this.diorama.pudusVisuales) {
          const distPudu = Math.hypot(vCoords.x - (pudu.x + 8), vCoords.y - (pudu.y + 6));
          if (distPudu < 15) {
            this.diorama.petPudu(pudu);
            return;
          }
        }

        // E. Clic en la Olla de Greda (si está en fase >= 3)
        const potX = this.diorama.virtualWidth - 45;
        const potY = this.diorama.virtualHeight - 38;
        const distPot = Math.hypot(vCoords.x - potX, vCoords.y - potY);
        if (distPot < 20 && this.state.data.fase >= 3) {
          this.switchTab('taller');
          this.sound.playChirp(520, 0.06);
          return;
        }

        // F. Clic en el arbusto central o bayas
        const critMult = this.state.evaluarCritico();
        const ganancia = this.state.getMaquisPorClick() * critMult;
        this.state.data.maquis += ganancia;
        this.state.data.totalMaquis += ganancia;
        this.state.data.clicksCount++;
        this.diorama.triggerBushClick(e, ganancia, critMult > 1);
      });
    }

    // 6. Apertura del Sobre Interactivo
    const envelopeCover = document.getElementById('envelope-cover');
    const letterContentArea = document.getElementById('letter-content-area');
    if (envelopeCover && letterContentArea) {
      envelopeCover.addEventListener('click', () => {
        this.sound.playChime();
        envelopeCover.classList.add('hidden');
        letterContentArea.classList.remove('hidden');
      });
    }

    // 7. Cerrar Modal de Regalo
    const closeLetterBtn = document.getElementById('btn-cerrar-carta');
    if (closeLetterBtn) {
      closeLetterBtn.addEventListener('click', () => {
        document.getElementById('modal-regalo').classList.add('hidden');
      });
    }

    // 7.1 Cerrar Modal de Árbol de Habilidades
    const closeTreeBtn = document.getElementById('btn-cerrar-arbol');
    if (closeTreeBtn) {
      closeTreeBtn.addEventListener('click', () => {
        this.cerrarModalArbol();
      });
    }
    const modalArbol = document.getElementById('modal-arbol');
    if (modalArbol) {
      modalArbol.addEventListener('click', (e) => {
        if (e.target === modalArbol) this.cerrarModalArbol();
      });
    }

    // 8. Reiniciar partida
    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("¿Deseas reiniciar el refugio desde el inicio? Tu progreso volverá al claro silvestre.")) {
          SaveManager.reset();
        }
      });
    }
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.sidebar-tabs .tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabName);
    });
    document.querySelectorAll('.sidebar-content .tab-content').forEach(c => {
      c.classList.toggle('hidden', c.id !== `tab-${tabName}`);
    });
    this.sound.playChirp(600, 0.04);
  }

  notify(mensaje, tipo = "info") {
    const container = document.getElementById('notifications-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.innerText = mensaje;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  abrirModalRegalo() {
    const modal = document.getElementById('modal-regalo');
    if (!modal) return;

    const envelopeCover = document.getElementById('envelope-cover');
    const letterContentArea = document.getElementById('letter-content-area');
    if (envelopeCover) envelopeCover.classList.remove('hidden');
    if (letterContentArea) letterContentArea.classList.add('hidden');

    const destEl = document.getElementById('letter-destinatario');
    if (destEl) destEl.innerText = giftConfig.destinatario || "Mi Pudú Favorito";

    const carta = giftConfig.cartaFinal;
    document.getElementById('carta-saludo').innerText = carta.saludo;
    
    const parrafosContainer = document.getElementById('carta-parrafos');
    parrafosContainer.innerHTML = '';
    carta.parrafos.forEach(p => {
      const el = document.createElement('p');
      el.innerText = p;
      parrafosContainer.appendChild(el);
    });

    document.getElementById('carta-despedida').innerText = carta.despedida;
    document.getElementById('carta-firma').innerText = carta.firma;

    modal.classList.remove('hidden');
  }

  render() {
    const s = this.state.data;

    // 1. Actualizar marcadores principales
    const maquisCount = document.getElementById('maquis-count');
    const maquisRate = document.getElementById('maquis-rate');
    if (maquisCount) maquisCount.innerText = Math.floor(s.maquis).toLocaleString();
    if (maquisRate) {
      const mps = this.state.getMaquisPorSegundo();
      maquisRate.innerText = `+${mps >= 10 ? Math.round(mps).toLocaleString() : mps.toFixed(1)}/s`;
    }

    // 2. Clima actual
    const weatherIcon = document.getElementById('weather-icon');
    const weatherName = document.getElementById('weather-name');
    if (weatherIcon) weatherIcon.innerText = s.clima.icono;
    if (weatherName) weatherName.innerText = s.clima.nombre;

    // 3. Indicador de suerte de Chucao en HUD
    const luckIndicator = document.getElementById('luck-indicator');
    if (luckIndicator) {
      if (s.chucao.segundosRestantesSuerte > 0) {
        luckIndicator.classList.remove('hidden');
        luckIndicator.innerText = `✨ Suerte del Chucao: x3 (${Math.ceil(s.chucao.segundosRestantesSuerte)}s)`;
      } else {
        luckIndicator.classList.add('hidden');
      }
    }

    // 4. Indicador de Caricia / Pudús felices en HUD
    const petIndicator = document.getElementById('pet-indicator');
    if (petIndicator) {
      if (s.caricias.segundosBonoCaricia > 0) {
        petIndicator.classList.remove('hidden');
        petIndicator.innerText = `💖 ¡Manada Feliz! +25% (${Math.ceil(s.caricias.segundosBonoCaricia)}s)`;
      } else {
        petIndicator.classList.add('hidden');
      }
    }

    // 4.1 Indicador de Buff de Cocina en HUD
    const cookIndicator = document.getElementById('cook-indicator');
    if (cookIndicator) {
      if (s.buffCocina.segundosRestantes > 0) {
        cookIndicator.classList.remove('hidden');
        cookIndicator.innerText = `🥧 Kuchen Austral: x${s.buffCocina.multiplicador} (${Math.ceil(s.buffCocina.segundosRestantes)}s)`;
      } else {
        cookIndicator.classList.add('hidden');
      }
    }

    // 4.2 Indicador de Rocío de la Ranita de Darwin en HUD
    const waterIndicator = document.getElementById('water-indicator');
    if (waterIndicator) {
      if (s.ranitaDarwin && s.ranitaDarwin.segundosBuffAgua > 0) {
        waterIndicator.classList.remove('hidden');
        waterIndicator.innerText = `💧 Rocío del Arroyo: +30% (${Math.ceil(s.ranitaDarwin.segundosBuffAgua)}s)`;
      } else {
        waterIndicator.classList.add('hidden');
      }
    }

    // 5. Panel Fase 1: Domesticar a Pichi
    const phase1Box = document.getElementById('box-fase-1');
    if (phase1Box) {
      if (s.fase === 1) {
        phase1Box.classList.remove('hidden');
        const progressBar = document.getElementById('pudu-confianza-bar');
        const progressTxt = document.getElementById('pudu-confianza-txt');
        if (progressBar) progressBar.style.width = `${s.confianzaPudu}%`;
        if (progressTxt) progressTxt.innerText = `Confianza: ${s.confianzaPudu}%`;

        const feedBtn = document.getElementById('btn-feed-pudu');
        if (feedBtn) {
          feedBtn.onclick = () => this.engine.alimentarPrimerPudu();
          feedBtn.disabled = s.maquis < 10;
        }
      } else {
        phase1Box.classList.add('hidden');
      }
    }

    // 6. Renderizar Pestaña Activa
    if (this.activeTab === 'cosecha') this.renderCosecha();
    if (this.activeTab === 'refugio') this.renderRefugio();
    if (this.activeTab === 'arbol') this.renderArbolHabilidades();
    if (this.activeTab === 'taller') this.renderTaller();
    if (this.activeTab === 'bitacora') this.renderBitacora();

    if (this.isTreeModalOpen) {
      this.actualizarModalDetalle();
    }
  }

  renderCosecha() {
    const container = document.getElementById('tab-cosecha-list');
    if (!container) return;

    const s = this.state.data;
    container.innerHTML = '';

    for (const key in s.productores) {
      const prod = s.productores[key];
      const costo = this.state.getCostoProductor(key);
      const puedeComprar = s.maquis >= costo;

      const item = document.createElement('div');
      item.className = `upgrade-card ${puedeComprar ? 'affordable' : 'locked'}`;
      item.innerHTML = `
        <div class="card-icon">${prod.icono}</div>
        <div class="card-info">
          <div class="card-title">${prod.nombre} <span class="card-qty">x${prod.cantidad}</span></div>
          <div class="card-desc">${prod.desc}</div>
          <div class="card-rate">+${(prod.produccionBase * s.armonia).toFixed(1)}/s c/u</div>
        </div>
        <button class="buy-btn" ${!puedeComprar ? 'disabled' : ''}>
          🌰 ${costo.toLocaleString()}
        </button>
      `;

      item.querySelector('.buy-btn').onclick = () => {
        if (s.maquis >= costo) {
          s.maquis -= costo;
          prod.cantidad++;
          this.sound.playBerryPop();

          // Si es camita de musgo, llega un nuevo habitante
          if (prod.id === 'camitaMusgo' && s.nombresDisponibles.length > 0) {
            const nuevoPuduData = s.nombresDisponibles.shift();
            s.pudus.push({
              id: `pudu_${s.pudus.length + 1}`,
              nombre: nuevoPuduData.nombre,
              rol: nuevoPuduData.rol,
              sombrero: nuevoPuduData.sombrero
            });
            this.notify(`¡${nuevoPuduData.nombre} se unió al refugio! 🐾`, 'hito');
            this.sound.playPuduHappy();
          }
        }
      };

      container.appendChild(item);
    }
  }

  renderRefugio() {
    const container = document.getElementById('tab-refugio-list');
    if (!container) return;

    const s = this.state.data;
    container.innerHTML = '';

    // Lista de pudús habitantes
    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `<h4>Manada del Refugio (${s.pudus.length} pudús)</h4>`;
    container.appendChild(header);

    const pudusGrid = document.createElement('div');
    pudusGrid.className = 'pudus-grid';
    s.pudus.forEach(p => {
      let icon = '🍂';
      let badgeExtra = '';
      if (p.tipo === 'miku' || p.sombrero === 'miku') {
        icon = '🎤';
        badgeExtra = 'pudu-badge-miku';
      } else if (p.tipo === 'teto' || p.sombrero === 'teto') {
        icon = '🥖';
        badgeExtra = 'pudu-badge-teto';
      } else if (p.tipo === 'mizuki' || p.sombrero === 'mizuki') {
        icon = '🎀';
        badgeExtra = 'pudu-badge-mizuki';
      } else if (p.tipo === 'neru' || p.sombrero === 'neru') {
        icon = '📱';
        badgeExtra = 'pudu-badge-neru';
      } else if (p.tipo === 'esme' || p.sombrero === 'esme') {
        icon = '⭐';
        badgeExtra = 'pudu-badge-esme';
      } else if (p.sombrero === 'crown') icon = '👑';
      else if (p.sombrero === 'dewdrop') icon = '💧';
      else if (p.sombrero === 'copihue') icon = '🌸';
      else if (p.sombrero === 'chupalla') icon = '🌾';
      else if (p.sombrero === 'scarf') icon = '🧣';
      else if (p.sombrero === 'leaf') icon = '🍃';
      else if (p.tipo === 'fawn') icon = '🦌';

      const card = document.createElement('div');
      card.className = `pudu-badge ${badgeExtra}`;
      card.innerHTML = `
        <span class="pudu-hat">${icon}</span>
        <strong>${p.nombre}</strong>
        <small>${p.rol}</small>
      `;
      pudusGrid.appendChild(card);
    });
    container.appendChild(pudusGrid);

    // Acceso al Árbol de Habilidades
    const totalAprendidas = Object.values(s.arbolHabilidades || {}).filter(n => n.comprada).length;
    const subheader = document.createElement('div');
    subheader.className = 'section-header';
    subheader.innerHTML = `<h4>Comodidades y Armonía del Refugio</h4>`;
    container.appendChild(subheader);

    const promoCard = document.createElement('div');
    promoCard.className = 'tree-promo-card';
    promoCard.innerHTML = `
      <div class="tree-promo-icon">🌳</div>
      <div class="tree-promo-info">
        <strong>Árbol de Habilidades: Raíces de la Armonía</strong>
        <p>Las comodidades y maestrías del bosque ahora florecen en el Árbol de Habilidades.</p>
        <div class="tree-promo-stats">✨ ${totalAprendidas} / 15 Habilidades Aprendidas</div>
      </div>
      <button class="cta-btn secondary btn-tree-goto">Ver Árbol 🌿</button>
    `;
    promoCard.querySelector('.btn-tree-goto').onclick = () => {
      this.switchTab('arbol');
    };
    container.appendChild(promoCard);
  }

  // =========================================================================
  // SISTEMA DEL ÁRBOL DE HABILIDADES ("RAÍCES DE LA ARMONÍA")
  // =========================================================================

  renderArbolHabilidades(force = false) {
    const container = document.getElementById('tab-arbol-content');
    if (!container) return;

    const s = this.state.data;
    const arbol = s.arbolHabilidades;
    if (!arbol) return;

    // Throttle de refresco visual para evitar reconstruir el DOM en cada frame
    const now = performance.now();
    if (!force && this._lastArbolRenderTime && (now - this._lastArbolRenderTime < 300)) {
      this.actualizarBotonesSidebarArbol();
      return;
    }
    this._lastArbolRenderTime = now;

    const totalHabilidades = Object.keys(arbol).length;
    const aprendidas = Object.values(arbol).filter(n => n.comprada).length;
    const pctProgreso = Math.round((aprendidas / totalHabilidades) * 100);

    container.innerHTML = '';

    // 1. Encabezado del Árbol con Progreso y Botón de Expandir
    const header = document.createElement('div');
    header.className = 'tree-sidebar-header';
    header.innerHTML = `
      <div class="tree-header-top">
        <div>
          <h3>🌳 Raíces de la Armonía</h3>
          <p class="tree-subtitle">Árbol de Habilidades y Maestrías</p>
        </div>
        <button id="btn-open-tree-modal" class="tree-expand-btn" title="Ver en pantalla completa">
          🔍 Panorámico
        </button>
      </div>

      <div class="tree-progress-box">
        <div class="tree-progress-info">
          <span>✨ Progreso del Claro:</span>
          <strong>${aprendidas} / ${totalHabilidades} (${pctProgreso}%)</strong>
        </div>
        <div class="tree-progress-bar">
          <div class="tree-progress-fill" style="width: ${pctProgreso}%;"></div>
        </div>
      </div>

      <div class="tree-branch-filters">
        <button class="branch-filter-btn ${this.treeBranchFilter === 'todas' ? 'active' : ''}" data-branch="todas">
          🌐 Todas
        </button>
        <button class="branch-filter-btn filter-recolector ${this.treeBranchFilter === 'recolector' ? 'active' : ''}" data-branch="recolector">
          🍃 Recolectora
        </button>
        <button class="branch-filter-btn filter-manada ${this.treeBranchFilter === 'manada' ? 'active' : ''}" data-branch="manada">
          🐾 Manada
        </button>
        <button class="branch-filter-btn filter-taller ${this.treeBranchFilter === 'taller' ? 'active' : ''}" data-branch="taller">
          🍯 Taller
        </button>
      </div>
    `;

    const expandBtn = header.querySelector('#btn-open-tree-modal');
    if (expandBtn) {
      expandBtn.onclick = () => this.abrirModalArbol();
    }

    header.querySelectorAll('.branch-filter-btn').forEach(btn => {
      btn.onclick = () => {
        this.treeBranchFilter = btn.dataset.branch;
        this.renderArbolHabilidades(true);
        this.sound.playChirp(650, 0.03);
      };
    });

    container.appendChild(header);

    // 2. Secciones de Ramas
    const ramasVisibles = this.treeBranchFilter === 'todas'
      ? RAMAS_ARBOL
      : RAMAS_ARBOL.filter(r => r.id === this.treeBranchFilter);

    ramasVisibles.forEach(rama => {
      const ramaCard = document.createElement('div');
      ramaCard.className = `branch-section branch-${rama.id}`;

      ramaCard.innerHTML = `
        <div class="branch-header" style="border-left-color: ${rama.color};">
          <span class="branch-icon">${rama.icono}</span>
          <div class="branch-meta">
            <h4>${rama.nombre}</h4>
            <small>${rama.tagline}</small>
          </div>
        </div>
        <div class="branch-nodes-list"></div>
      `;

      const nodesList = ramaCard.querySelector('.branch-nodes-list');

      rama.nodos.forEach(nodeId => {
        const nodo = arbol[nodeId];
        if (!nodo) return;

        const cumplidos = this.state.cumplePrerrequisitos(nodeId);
        const puedeComprar = this.state.puedeAprenderHabilidad(nodeId);
        const esSeleccionado = this.selectedSkillId === nodeId;

        let estadoClase = 'locked-prereqs';
        let estadoBadge = '🔒 Bloqueada';

        if (nodo.comprada) {
          estadoClase = 'learned';
          estadoBadge = '✓ Aprendida';
        } else if (puedeComprar) {
          estadoClase = 'available';
          estadoBadge = `✨ Desbloquear (🌰 ${nodo.costo.toLocaleString()})`;
        } else if (cumplidos) {
          estadoClase = 'affordable-wait';
          estadoBadge = `🌰 ${nodo.costo.toLocaleString()}`;
        }

        // Pill de prerrequisitos
        let prereqHtml = '';
        if (nodo.prerrequisitos && nodo.prerrequisitos.length > 0) {
          const preItems = nodo.prerrequisitos.map(pid => {
            const pNodo = arbol[pid];
            const pOk = pNodo?.comprada;
            return `<span class="prereq-tag ${pOk ? 'done' : 'missing'}">${pOk ? '✓' : '🔒'} ${pNodo?.nombre || pid}</span>`;
          }).join(' ');
          prereqHtml = `<div class="node-prereqs">${preItems}</div>`;
        }

        const nodeEl = document.createElement('div');
        nodeEl.className = `skill-node-card ${estadoClase} ${esSeleccionado ? 'selected' : ''}`;
        nodeEl.dataset.nodeId = nodeId;
        nodeEl.innerHTML = `
          <div class="node-icon-wrapper" style="border-color: ${nodo.comprada ? rama.color : 'rgba(255,255,255,0.15)'}">
            <span class="node-icon">${nodo.icono}</span>
          </div>
          <div class="node-info">
            <div class="node-title-row">
              <span class="node-name">${nodo.nombre}</span>
              <span class="node-tier">T${nodo.tier}${nodo.tier === 4 ? ' ⭐' : ''}</span>
            </div>
            <div class="node-desc">${nodo.desc}</div>
            ${prereqHtml}
          </div>
          <div class="node-action">
            <button class="skill-buy-btn ${nodo.comprada ? 'btn-learned' : (puedeComprar ? 'btn-can-buy' : 'btn-disabled')}"
                    ${!puedeComprar || nodo.comprada ? 'disabled' : ''}>
              ${estadoBadge}
            </button>
          </div>
        `;

        nodeEl.onclick = (e) => {
          this.selectedSkillId = nodeId;
          if (e.target.closest('.skill-buy-btn') && puedeComprar) {
            const ok = this.state.aprenderHabilidad(nodeId);
            if (ok) {
              this.sound.playChime();
              this.notify(`¡Aprendiste: ${nodo.nombre}! ${nodo.icono}`, 'success');
              this.renderArbolHabilidades(true);
              if (this.isTreeModalOpen) this.renderArbolModal();
            }
          } else {
            this.renderArbolHabilidades(true);
          }
        };

        nodesList.appendChild(nodeEl);
      });

      container.appendChild(ramaCard);
    });
  }

  actualizarBotonesSidebarArbol() {
    const s = this.state.data;
    const arbol = s.arbolHabilidades;
    if (!arbol) return;

    document.querySelectorAll('.skill-node-card').forEach(card => {
      const buyBtn = card.querySelector('.skill-buy-btn');
      if (!buyBtn || !card.dataset.nodeId) return;
      const nodeId = card.dataset.nodeId;
      const nodo = arbol[nodeId];
      if (!nodo || nodo.comprada) return;

      const puedeComprar = this.state.puedeAprenderHabilidad(nodeId);
      const cumplidos = this.state.cumplePrerrequisitos(nodeId);

      card.classList.toggle('available', puedeComprar);
      card.classList.toggle('affordable-wait', !puedeComprar && cumplidos);
      buyBtn.disabled = !puedeComprar;
      buyBtn.classList.toggle('btn-can-buy', puedeComprar);
      buyBtn.classList.toggle('btn-disabled', !puedeComprar);
      if (puedeComprar) {
        buyBtn.innerText = `✨ Desbloquear (🌰 ${nodo.costo.toLocaleString()})`;
      } else if (cumplidos) {
        buyBtn.innerText = `🌰 ${nodo.costo.toLocaleString()}`;
      }
    });
  }

  abrirModalArbol() {
    this.isTreeModalOpen = true;
    const modal = document.getElementById('modal-arbol');
    if (modal) modal.classList.remove('hidden');
    this.renderArbolModal();
    this.sound.playChime();
  }

  cerrarModalArbol() {
    this.isTreeModalOpen = false;
    const modal = document.getElementById('modal-arbol');
    if (modal) modal.classList.add('hidden');
  }

  renderArbolModal() {
    const container = document.getElementById('modal-arbol-content');
    if (!container) return;

    const s = this.state.data;
    const arbol = s.arbolHabilidades;
    if (!arbol) return;

    if (!this.selectedSkillId || !arbol[this.selectedSkillId]) {
      this.selectedSkillId = 'cucharaAlerce';
    }

    const totalHabilidades = Object.keys(arbol).length;
    const aprendidas = Object.values(arbol).filter(n => n.comprada).length;
    const critPct = Math.round((s.probabilidadCritico || 0) * 100);

    container.innerHTML = '';

    // 1. HUD Superior del Modal
    const hud = document.createElement('div');
    hud.className = 'tree-modal-hud';
    hud.innerHTML = `
      <div class="tree-hud-pill">
        <span>✨ Habilidades:</span>
        <strong>${aprendidas} / ${totalHabilidades}</strong>
      </div>
      <div class="tree-hud-pill">
        <span>🌰 Maquis:</span>
        <strong id="modal-maquis-val">${Math.floor(s.maquis).toLocaleString()}</strong>
      </div>
      <div class="tree-hud-pill">
        <span>🎯 Golpe Crítico:</span>
        <strong>${critPct}% (x${s.multiplicadorCritico || 5})</strong>
      </div>
      <div class="tree-hud-pill">
        <span>🌿 Armonía del Bosque:</span>
        <strong>x${s.armonia.toFixed(2)}</strong>
      </div>
    `;
    container.appendChild(hud);

    // 2. Grid de las 3 Ramas (Constelación Visual)
    const branchesGrid = document.createElement('div');
    branchesGrid.className = 'tree-modal-branches-grid';

    RAMAS_ARBOL.forEach(rama => {
      const col = document.createElement('div');
      col.className = `modal-branch-col branch-col-${rama.id}`;

      // Cabecera de la columna
      const bHeader = document.createElement('div');
      bHeader.className = 'modal-branch-header';
      bHeader.style.borderBottomColor = rama.color;
      bHeader.innerHTML = `
        <div class="branch-badge-icon">${rama.icono}</div>
        <h4>${rama.nombre}</h4>
        <small>${rama.tagline}</small>
      `;
      col.appendChild(bHeader);

      // Contenedor vertical de Tiers
      const tierContainer = document.createElement('div');
      tierContainer.className = 'tree-tier-container';

      // Helper para renderizar un nodo en el modal
      const createModalNode = (nodeId, isUltimate = false) => {
        const nodo = arbol[nodeId];
        if (!nodo) return document.createElement('div');

        const cumplidos = this.state.cumplePrerrequisitos(nodeId);
        const puedeComprar = this.state.puedeAprenderHabilidad(nodeId);
        const esSeleccionado = this.selectedSkillId === nodeId;

        let stClass = 'locked-prereqs';
        let stBadge = '🔒 Bloqueada';
        let stBadgeClass = 'locked';

        if (nodo.comprada) {
          stClass = 'learned';
          stBadge = '✓ Activa';
          stBadgeClass = 'learned';
        } else if (puedeComprar) {
          stClass = 'available';
          stBadge = `🌰 ${nodo.costo.toLocaleString()}`;
          stBadgeClass = 'can-buy';
        } else if (cumplidos) {
          stClass = 'affordable-wait';
          stBadge = `🌰 ${nodo.costo.toLocaleString()}`;
          stBadgeClass = 'locked';
        }

        const card = document.createElement('div');
        card.className = `modal-node-card ${stClass} ${esSeleccionado ? 'selected' : ''} ${isUltimate ? 'tier-4-ultimate' : ''}`;
        card.dataset.nodeId = nodeId;
        card.innerHTML = `
          <div class="modal-node-icon">${nodo.icono}</div>
          <div class="modal-node-name">${nodo.nombre}</div>
          <div class="modal-node-badge ${stBadgeClass}">${stBadge}</div>
        `;

        card.onclick = () => {
          this.selectedSkillId = nodeId;
          this.renderArbolModal();
          this.sound.playChirp(580, 0.03);
        };

        return card;
      };

      // TIER 1
      const rowT1 = document.createElement('div');
      rowT1.className = 'tier-row';
      rowT1.appendChild(createModalNode(rama.t1));
      tierContainer.appendChild(rowT1);

      // Conector T1 -> T2
      const t1Comprada = arbol[rama.t1]?.comprada;
      const conn1 = document.createElement('div');
      conn1.className = `tier-connector ${t1Comprada ? 'active' : ''}`;
      tierContainer.appendChild(conn1);

      // TIER 2 (Dual: T2-A y T2-B)
      const rowT2 = document.createElement('div');
      rowT2.className = 'tier-row-dual';
      rowT2.appendChild(createModalNode(rama.t2a));
      rowT2.appendChild(createModalNode(rama.t2b));
      tierContainer.appendChild(rowT2);

      // Conector T2 -> T3
      const t2Comprada = arbol[rama.t2a]?.comprada && arbol[rama.t2b]?.comprada;
      const conn2 = document.createElement('div');
      conn2.className = `tier-connector ${t2Comprada ? 'active' : ''}`;
      tierContainer.appendChild(conn2);

      // TIER 3
      const rowT3 = document.createElement('div');
      rowT3.className = 'tier-row';
      rowT3.appendChild(createModalNode(rama.t3));
      tierContainer.appendChild(rowT3);

      // Conector T3 -> T4
      const t3Comprada = arbol[rama.t3]?.comprada;
      const conn3 = document.createElement('div');
      conn3.className = `tier-connector ${t3Comprada ? 'active' : ''}`;
      tierContainer.appendChild(conn3);

      // TIER 4 (Ultimate)
      const rowT4 = document.createElement('div');
      rowT4.className = 'tier-row';
      rowT4.appendChild(createModalNode(rama.t4, true));
      tierContainer.appendChild(rowT4);

      col.appendChild(tierContainer);
      branchesGrid.appendChild(col);
    });

    container.appendChild(branchesGrid);

    // 3. Panel Inferior de Inspección y Aprendizaje
    const detailPanel = document.createElement('div');
    detailPanel.id = 'modal-skill-detail-panel';
    detailPanel.className = 'tree-modal-detail-panel';
    container.appendChild(detailPanel);

    this.actualizarModalDetalle();
  }

  actualizarModalDetalle() {
    const s = this.state.data;
    const arbol = s.arbolHabilidades;
    if (!arbol) return;

    const maquisHud = document.getElementById('modal-maquis-val');
    if (maquisHud) maquisHud.innerText = Math.floor(s.maquis).toLocaleString();

    const panel = document.getElementById('modal-skill-detail-panel');
    if (!panel) return;

    const nodo = arbol[this.selectedSkillId];
    if (!nodo) return;

    const cumplidos = this.state.cumplePrerrequisitos(this.selectedSkillId);
    const puedeComprar = this.state.puedeAprenderHabilidad(this.selectedSkillId);
    const rama = RAMAS_ARBOL.find(r => r.id === nodo.rama) || { nombre: "Bosque", color: "#34d399", icono: "🌲" };

    let prereqText = 'Inicio de la senda (sin requisitos previos)';
    if (nodo.prerrequisitos && nodo.prerrequisitos.length > 0) {
      const items = nodo.prerrequisitos.map(pid => {
        const pNodo = arbol[pid];
        const ok = pNodo?.comprada;
        return `<span class="prereq-tag ${ok ? 'done' : 'missing'}">${ok ? '✓' : '🔒'} ${pNodo?.nombre || pid}</span>`;
      }).join(' ');
      prereqText = `Requiere: ${items}`;
    }

    let btnText = `✨ Aprender Habilidad (🌰 ${nodo.costo.toLocaleString()})`;
    let btnClass = 'cta-btn';
    let btnDisabled = false;

    if (nodo.comprada) {
      btnText = '✓ Habilidad Aprendida y Activa';
      btnClass = 'cta-btn secondary';
      btnDisabled = true;
    } else if (!cumplidos) {
      btnText = '🔒 Prerrequisitos pendientes';
      btnClass = 'cta-btn disabled';
      btnDisabled = true;
    } else if (s.maquis < nodo.costo) {
      const faltan = Math.ceil(nodo.costo - s.maquis);
      btnText = `🌰 Faltan ${faltan.toLocaleString()} Maquis`;
      btnClass = 'cta-btn disabled';
      btnDisabled = true;
    }

    panel.innerHTML = `
      <div class="detail-panel-inner">
        <div class="detail-icon-wrap" style="border-color: ${nodo.comprada ? rama.color : 'rgba(255,255,255,0.2)'};">
          <span>${nodo.icono}</span>
        </div>
        <div class="detail-info-block">
          <div class="detail-header-row">
            <span class="detail-title">${nodo.nombre}</span>
            <span class="detail-branch-tag" style="background: ${rama.color}22; color: ${rama.color}; border: 1px solid ${rama.color}55;">
              ${rama.icono} ${rama.nombre} • Tier ${nodo.tier}${nodo.tier === 4 ? ' ⭐' : ''}
            </span>
          </div>
          <div class="detail-desc">${nodo.desc}</div>
          <div class="detail-prereqs-row">${prereqText}</div>
        </div>
        <div class="detail-action-block">
          <button id="btn-learn-modal-skill" class="${btnClass} detail-buy-btn" ${btnDisabled ? 'disabled' : ''}>
            ${btnText}
          </button>
        </div>
      </div>
    `;

    const buyBtn = panel.querySelector('#btn-learn-modal-skill');
    if (buyBtn && puedeComprar) {
      buyBtn.onclick = () => {
        const ok = this.state.aprenderHabilidad(this.selectedSkillId);
        if (ok) {
          this.sound.playChime();
          this.notify(`¡Aprendiste: ${nodo.nombre}! ${nodo.icono}`, 'success');
          this.renderArbolModal();
          this.renderArbolHabilidades(true);
        }
      };
    }
  }

  renderTaller() {
    const container = document.getElementById('tab-taller-content');
    if (!container) return;

    const s = this.state.data;
    if (s.fase < 3) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🏺</span>
          <h4>El Taller Austral aún no ha sido descubierto</h4>
          <p>Sigue cuidando a la manada y cosechando maquis para descubrir la vieja olla de greda junto al arroyo.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    const panel = document.createElement('div');
    panel.className = 'workshop-panel';

    // 1. Cabecera de la Olla de Greda
    const header = document.createElement('div');
    header.className = 'claypot-header';
    header.innerHTML = `
      <span class="claypot-icon">🏺</span>
      <div class="claypot-title-group">
        <h3>La Olla de Greda Austral</h3>
        <p>Cocción lenta y tradicional a la leña</p>
        <span class="claypot-stats">🍯 Frascos elaborados: <strong>${s.mermeladas}</strong> (+${(s.mermeladas * 4)}% Armonía permanente)</span>
      </div>
    `;
    panel.appendChild(header);

    // 2. Estado de cocción activo si está cocinando
    const c = s.cocina;
    if (c.enCoccion) {
      const rec = c.recetas[c.recetaActual] || { nombre: 'Receta Austral' };
      const pct = Math.max(0, Math.min(100, ((c.tiempoTotal - c.tiempoRestante) / c.tiempoTotal) * 100));
      const activeCard = document.createElement('div');
      activeCard.className = 'cooking-active-card';
      activeCard.innerHTML = `
        <div class="cooking-header">
          <span class="cooking-title">🔥 Cocinando: ${rec.nombre}</span>
          <span class="cooking-time">⏱️ ${Math.ceil(c.tiempoRestante)}s</span>
        </div>
        <div class="cooking-progress-bar">
          <div class="cooking-progress-fill" style="width: ${pct}%;"></div>
        </div>
      `;
      panel.appendChild(activeCard);
    }

    // 3. Banner de Buff activo de cocina si está activo
    if (s.buffCocina.segundosRestantes > 0) {
      const buffBanner = document.createElement('div');
      buffBanner.className = 'active-buff-banner';
      buffBanner.innerHTML = `
        <span>🥧</span>
        <div>
          <strong>¡Festín de Kuchen Activo!</strong>
          <p>x${s.buffCocina.multiplicador} a toda la producción del bosque (${Math.ceil(s.buffCocina.segundosRestantes)}s restantes)</p>
        </div>
      `;
      panel.appendChild(buffBanner);
    }

    // 4. Lista de Recetas Disponibles
    const recipesList = document.createElement('div');
    recipesList.className = 'recipes-list';

    for (const key in c.recetas) {
      const rec = c.recetas[key];
      const puedeCocinar = rec.desbloqueada && !c.enCoccion && s.maquis >= rec.costoMaquis;

      const card = document.createElement('div');
      card.className = `recipe-card ${puedeCocinar ? 'affordable' : ''} ${!rec.desbloqueada ? 'locked' : ''}`;

      if (rec.desbloqueada) {
        card.innerHTML = `
          <div class="recipe-icon">${rec.icono}</div>
          <div class="recipe-info">
            <div class="recipe-title-row">
              <span class="recipe-name">${rec.nombre}</span>
              <span class="recipe-duration">⏱️ ${rec.tiempoSegundos}s</span>
            </div>
            <p class="recipe-desc">${rec.desc}</p>
          </div>
          <div class="recipe-actions">
            <button class="recipe-btn" ${!puedeCocinar ? 'disabled' : ''}>
              ${c.enCoccion ? 'Olla Ocupada' : `Cocinar (${rec.costoMaquis.toLocaleString()} 🌰)`}
            </button>
          </div>
        `;

        const cookBtn = card.querySelector('.recipe-btn');
        if (cookBtn && puedeCocinar) {
          cookBtn.onclick = () => {
            const ok = this.state.iniciarCoccion(rec.id);
            if (ok) {
              this.sound.playChime();
              this.notify(`¡Iniciando cocción de ${rec.nombre}!`, 'info');
            }
          };
        }
      } else {
        const requisito = key === 'kuchen_maqui' ? 'Elabora 2 frascos de mermelada' : 'Elabora 4 frascos de mermelada';
        card.innerHTML = `
          <div class="recipe-icon">🔒</div>
          <div class="recipe-info">
            <span class="recipe-name">${rec.nombre}</span>
            <p class="recipe-desc recipe-locked-text">🔒 Requiere: ${requisito}</p>
          </div>
          <div class="recipe-actions">
            <button class="recipe-btn" disabled>Bloqueado</button>
          </div>
        `;
      }

      recipesList.appendChild(card);
    }

    panel.appendChild(recipesList);
    container.appendChild(panel);
  }

  renderBitacora() {
    const container = document.getElementById('tab-bitacora-content');
    if (!container) return;

    const s = this.state.data;
    container.innerHTML = '';

    // 1. El Gran Picnic
    const picnicBox = document.createElement('div');
    picnicBox.className = 'picnic-box';
    const metaMaquis = 55000;
    const metaMermeladas = 10;
    const listo = s.maquis >= metaMaquis && s.mermeladas >= metaMermeladas;

    picnicBox.innerHTML = `
      <h3>🧺 El Gran Picnic de Primavera</h3>
      <p>El hito culminante del refugio: un banquete especial para celebrar el cariño y todo lo florecido.</p>
      <div class="picnic-requirements">
        <div class="req-item ${s.maquis >= metaMaquis ? 'done' : ''}">
          🌰 Maquis: ${Math.floor(s.maquis).toLocaleString()} / ${metaMaquis.toLocaleString()}
        </div>
        <div class="req-item ${s.mermeladas >= metaMermeladas ? 'done' : ''}">
          🍯 Mermeladas: ${s.mermeladas} / ${metaMermeladas}
        </div>
      </div>
      <button id="btn-celebrate-picnic" class="cta-btn ${listo || s.picnicCelebrado ? 'ready' : 'disabled'}">
        ${s.picnicCelebrado ? 'Abrir Sobre de Regalo ✨' : '¡Celebrar el Gran Picnic! 🎉'}
      </button>
    `;

    picnicBox.querySelector('#btn-celebrate-picnic').onclick = () => {
      if (s.picnicCelebrado) {
        this.abrirModalRegalo();
      } else {
        this.engine.celebrarGranPicnic();
      }
    };
    container.appendChild(picnicBox);

    // 2. Enciclopedia Didáctica
    const faunaHeader = document.createElement('div');
    faunaHeader.className = 'section-header';
    faunaHeader.innerHTML = `<h4>🌿 Enciclopedia de Flora y Fauna (${s.fichasDesbloqueadas.length} / ${FAUNA_FLORA_DATA.length} descubiertas)</h4>`;
    container.appendChild(faunaHeader);

    const faunaGrid = document.createElement('div');
    faunaGrid.className = 'fauna-grid';

    FAUNA_FLORA_DATA.forEach(item => {
      const descubierta = s.fichasDesbloqueadas.includes(item.id);
      const card = document.createElement('div');
      card.className = `fauna-card ${descubierta ? 'unlocked' : 'locked'}`;

      if (descubierta) {
        card.innerHTML = `
          <div class="fauna-top">
            <span class="fauna-icon">${item.icono}</span>
            <div>
              <strong>${item.nombre}</strong>
              <em>${item.nombreCientifico}</em>
            </div>
            <span class="fauna-cat">${item.categoria}</span>
          </div>
          <p class="fauna-desc">${item.curiosidad}</p>
          <div class="fauna-reward">🌟 ${item.recompensa}</div>
        `;
      } else {
        card.innerHTML = `
          <div class="fauna-top">
            <span class="fauna-icon">🔒</span>
            <div>
              <strong>Especie por descubrir</strong>
              <em>En los senderos del bosque...</em>
            </div>
          </div>
          <p class="fauna-desc">Sigue cuidando el refugio y cosechando para encontrar este habitante nativo.</p>
        `;
      }

      faunaGrid.appendChild(card);
    });
    container.appendChild(faunaGrid);

    // 3. Recuerdos
    const recuerdosHeader = document.createElement('div');
    recuerdosHeader.className = 'section-header';
    recuerdosHeader.innerHTML = `<h4>📜 Recuerdos Desbloqueados</h4>`;
    container.appendChild(recuerdosHeader);

    const recuerdosList = document.createElement('div');
    recuerdosList.className = 'recuerdos-list';

    giftConfig.recuerdos.forEach(r => {
      const desbloqueado = s.recuerdosDesbloqueados.includes(r.id);
      const card = document.createElement('div');
      card.className = `recuerdo-card ${desbloqueado ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <span class="recuerdo-icon">${desbloqueado ? r.icono : '🔒'}</span>
        <div class="recuerdo-text">
          <strong>${r.hito}</strong>
          <p>${desbloqueado ? r.texto : 'Se revelará al alcanzar nuevos momentos del refugio...'}</p>
        </div>
      `;
      recuerdosList.appendChild(card);
    });
    container.appendChild(recuerdosList);
  }
}

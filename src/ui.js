/**
 * Interfaz de Usuario, Pestañas, Modales, Menú Desplegable Izquierdo y Enciclopedia
 */
import { giftConfig } from './giftConfig.js';
import { SaveManager } from './save.js';
import { FAUNA_FLORA_DATA } from './faunaData.js';

export class GameUI {
  constructor(state, sound, diorama) {
    this.state = state;
    this.sound = sound;
    this.diorama = diorama;
    this.engine = null;

    this.activeTab = 'cosecha'; // 'cosecha' | 'refugio' | 'taller' | 'bitacora'
    this.sidebarCollapsed = false;
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

        // A. Verificar click sobre el Chucao
        const ch = this.state.data.chucao;
        if (ch.activo) {
          const distChucao = Math.hypot(vCoords.x - ch.x, vCoords.y - ch.y);
          if (distChucao < 18) {
            this.engine.clickChucao();
            return;
          }
        }

        // B. Verificar click sobre algún Pudú en el suelo para acariciarlo
        for (const pudu of this.diorama.pudusVisuales) {
          const distPudu = Math.hypot(vCoords.x - (pudu.x + 8), vCoords.y - (pudu.y + 6));
          if (distPudu < 14) {
            this.diorama.petPudu(pudu);
            return;
          }
        }

        // C. Clic en el arbusto central o bayas
        const ganancia = this.state.getMaquisPorClick();
        this.state.data.maquis += ganancia;
        this.state.data.totalMaquis += ganancia;
        this.state.data.clicksCount++;
        this.diorama.triggerBushClick(e);
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
    if (this.activeTab === 'taller') this.renderTaller();
    if (this.activeTab === 'bitacora') this.renderBitacora();
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
      const card = document.createElement('div');
      card.className = 'pudu-badge';
      card.innerHTML = `
        <span class="pudu-hat">${p.sombrero || '🍂'}</span>
        <strong>${p.nombre}</strong>
        <small>${p.rol}</small>
      `;
      pudusGrid.appendChild(card);
    });
    container.appendChild(pudusGrid);

    // Mejoras de Comunidad
    const subheader = document.createElement('div');
    subheader.className = 'section-header';
    subheader.innerHTML = `<h4>Comodidades del Bosque</h4>`;
    container.appendChild(subheader);

    const upgradesContainer = document.createElement('div');
    upgradesContainer.className = 'upgrades-grid';

    for (const key in s.mejoras) {
      const mejora = s.mejoras[key];
      if (!mejora.desbloqueada || mejora.comprada) continue;

      const puedeComprar = s.maquis >= mejora.costo;
      const card = document.createElement('div');
      card.className = `upgrade-card ${puedeComprar ? 'affordable' : 'locked'}`;
      card.innerHTML = `
        <div class="card-icon">${mejora.icono}</div>
        <div class="card-info">
          <div class="card-title">${mejora.nombre}</div>
          <div class="card-desc">${mejora.desc}</div>
        </div>
        <button class="buy-btn" ${!puedeComprar ? 'disabled' : ''}>
          🌰 ${mejora.costo.toLocaleString()}
        </button>
      `;

      card.querySelector('.buy-btn').onclick = () => {
        if (s.maquis >= mejora.costo) {
          s.maquis -= mejora.costo;
          mejora.comprada = true;
          mejora.efecto(s);
          this.sound.playChime();
          this.notify(`¡Mejora desbloqueada: ${mejora.nombre}!`, 'success');
        }
      };

      upgradesContainer.appendChild(card);
    }
    container.appendChild(upgradesContainer);
  }

  renderTaller() {
    const container = document.getElementById('tab-taller-content');
    if (!container) return;

    const s = this.state.data;
    if (s.fase < 4) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🏺</span>
          <h4>El Taller Austral aún no ha sido descubierto</h4>
          <p>Sigue cuidando a la manada y cosechando maquis para desbloquear la cocinilla comunitaria.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="workshop-panel">
        <div class="jam-crafting">
          <div class="jam-display">
            <span class="jam-icon">🍯</span>
            <div class="jam-info">
              <h3>Mermelada de Maqui en Olla de Greda</h3>
              <p>Frascos elaborados: <strong>${s.mermeladas}</strong></p>
              <small>Efecto: +${(s.mermeladas * 3)}% permanente a toda la producción del bosque.</small>
            </div>
          </div>
          <button id="btn-cook-jam" class="cta-btn ${s.maquis >= 1200 ? '' : 'disabled'}">
            Cocinar Frasco (1,200 🌰)
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-cook-jam').onclick = () => {
      this.engine.cocinarMermelada();
    };
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

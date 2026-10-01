/**
 * Interfaz de Usuario, Pestañas, Modales y Notificaciones
 */
import { giftConfig } from './giftConfig.js';
import { SaveManager } from './save.js';

export class GameUI {
  constructor(state, sound, diorama) {
    this.state = state;
    this.sound = sound;
    this.diorama = diorama;
    this.engine = null; // Asignado luego

    this.activeTab = 'cosecha'; // 'cosecha' | 'refugio' | 'taller' | 'bitacora'
    this.setupListeners();
  }

  setEngine(engine) {
    this.engine = engine;
  }

  setupListeners() {
    // Pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Toggle de sonido
    const soundBtn = document.getElementById('btn-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const active = this.sound.toggleSound();
        soundBtn.innerHTML = active ? '🌧️ Lluvia: ON' : '🌧️ Lluvia: OFF';
        soundBtn.classList.toggle('active', active);
      });
    }

    // Click en el arbusto central de Canvas
    const canvas = document.getElementById('diorama-canvas');
    if (canvas) {
      canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Comprobar si hizo click sobre el Chucao
        const ch = this.state.data.chucao;
        if (ch.activo) {
          const distChucao = Math.hypot(clickX - ch.x, clickY - ch.y);
          if (distChucao < 30) {
            this.engine.clickChucao();
            return;
          }
        }

        // Click regular en el arbusto
        const ganancia = this.state.getMaquisPorClick();
        this.state.data.maquis += ganancia;
        this.state.data.totalMaquis += ganancia;
        this.state.data.clicksCount++;
        this.diorama.triggerBushClick(e);
      });
    }

    // Modal de Regalo - Cerrar
    const closeLetterBtn = document.getElementById('btn-cerrar-carta');
    if (closeLetterBtn) {
      closeLetterBtn.addEventListener('click', () => {
        document.getElementById('modal-regalo').classList.add('hidden');
      });
    }

    // Botón reiniciar partida (con confirmación)
    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("¿Seguro que deseas reiniciar el refugio desde el inicio?")) {
          SaveManager.reset();
        }
      });
    }
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(c => {
      c.classList.toggle('hidden', c.id !== `tab-${tabName}`);
    });
    this.sound.playChirp(600, 0.05);
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
    }, 3500);
  }

  abrirModalRegalo() {
    const modal = document.getElementById('modal-regalo');
    if (!modal) return;

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

  mostrarModalOffline(segundos, ganancia) {
    if (ganancia <= 0) return;
    const minutos = Math.round(segundos / 60);
    this.notify(`¡Tus pudús te extrañaron! Mientras descansabas (${minutos} min) recolectaron ${Math.floor(ganancia).toLocaleString()} maquis.`, 'hito');
  }

  render() {
    const s = this.state.data;

    // Actualizar marcadores principales
    const maquisCount = document.getElementById('maquis-count');
    const maquisRate = document.getElementById('maquis-rate');
    if (maquisCount) maquisCount.innerText = Math.floor(s.maquis).toLocaleString();
    if (maquisRate) {
      const mps = this.state.getMaquisPorSegundo();
      maquisRate.innerText = `${mps >= 10 ? Math.round(mps).toLocaleString() : mps.toFixed(1)}/seg`;
    }

    // Indicador de suerte de Chucao
    const luckIndicator = document.getElementById('luck-indicator');
    if (luckIndicator) {
      if (s.chucao.segundosRestantesSuerte > 0) {
        luckIndicator.classList.remove('hidden');
        luckIndicator.innerText = `✨ Suerte del Chucao: x3 (${Math.ceil(s.chucao.segundosRestantesSuerte)}s)`;
      } else {
        luckIndicator.classList.add('hidden');
      }
    }

    // Fase 1: Panel de domesticar a Pichi
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

    // Renderizar Pestaña Actual
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

    // Renderizar Productores
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
          <div class="card-rate">+${(prod.produccionBase * s.armonia).toFixed(1)}/s cada uno</div>
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

          // Si es camita de musgo, llega un nuevo pudú
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
    header.innerHTML = `<h4>Manada de Pudús (${s.pudus.length} habitantes)</h4>`;
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
    if (s.fase < 3) {
      container.innerHTML = `
        <div class="empty-state">
          <span>🏺</span>
          <p>El Taller del Bosque aún no ha sido descubierto.</p>
          <small>Sigue cuidando el refugio y cosechando maquis para desbloquearlo.</small>
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
              <h3>Mermelada de Maqui en Greda</h3>
              <p>Frascos elaborados: <strong>${s.mermeladas}</strong></p>
              <small>Efecto: +${(s.mermeladas * 2)}% permanente a toda la producción del bosque.</small>
            </div>
          </div>
          <button id="btn-cook-jam" class="cta-btn ${s.maquis >= 1500 ? '' : 'disabled'}">
            Cocinar Frasco (1,500 Maquis)
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

    // Sección El Gran Picnic (Objetivo Final)
    const picnicBox = document.createElement('div');
    picnicBox.className = 'picnic-box';
    const metaMaquis = 80000;
    const metaMermeladas = 15;
    const listo = s.maquis >= metaMaquis && s.mermeladas >= metaMermeladas;

    picnicBox.innerHTML = `
      <h3>🧺 El Gran Picnic de Primavera</h3>
      <p>La meta suprema del refugio: un banquete especial para celebrar la amistad y el amor.</p>
      <div class="picnic-requirements">
        <div class="req-item ${s.maquis >= metaMaquis ? 'done' : ''}">
          🌰 Maquis: ${Math.floor(s.maquis).toLocaleString()} / ${metaMaquis.toLocaleString()}
        </div>
        <div class="req-item ${s.mermeladas >= metaMermeladas ? 'done' : ''}">
          🍯 Mermeladas: ${s.mermeladas} / ${metaMermeladas}
        </div>
      </div>
      <button id="btn-celebrate-picnic" class="cta-btn ${listo ? 'ready' : 'disabled'}">
        ${s.picnicCelebrado ? 'Ver Carta del Regalo ✨' : '¡Celebrar el Gran Picnic! 🎉'}
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

    // Lista de Recuerdos desbloqueables
    const recuerdosHeader = document.createElement('h4');
    recuerdosHeader.className = 'section-header';
    recuerdosHeader.innerText = 'Recuerdos del Bosque';
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
          <p>${desbloqueado ? r.texto : 'Se revelará a medida que prospere el refugio...'}</p>
        </div>
      `;
      recuerdosList.appendChild(card);
    });
    container.appendChild(recuerdosList);
  }
}

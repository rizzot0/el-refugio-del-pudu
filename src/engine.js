/**
 * Motor Central de Lógica y Loop Temporal
 */
import { SaveManager } from './save.js';
import { giftConfig } from './giftConfig.js';

export class GameEngine {
  constructor(state, sound, diorama, ui) {
    this.state = state;
    this.sound = sound;
    this.diorama = diorama;
    this.ui = ui;

    this.lastTime = performance.now();
    this.saveTimer = 0;
    this.chucaoSpawnTimer = 45; // Primer Chucao a los 45s aprox
  }

  start() {
    requestAnimationFrame((t) => this.loop(t));
  }

  loop(currentTime) {
    const dt = Math.min(1, Math.max(0, (currentTime - this.lastTime) / 1000));
    this.lastTime = currentTime;

    this.update(dt);
    this.diorama.update(dt);
    this.diorama.draw();
    this.ui.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    const s = this.state.data;
    s.tiempoJugadoSegundos += dt;

    // 1. Producción pasiva de Maquis
    const mps = this.state.getMaquisPorSegundo();
    if (mps > 0) {
      const ganancia = mps * dt;
      s.maquis += ganancia;
      s.totalMaquis += ganancia;
    }

    // 2. Temporizador de Suerte del Chucao
    if (s.chucao.segundosRestantesSuerte > 0) {
      s.chucao.segundosRestantesSuerte -= dt;
      if (s.chucao.segundosRestantesSuerte <= 0) {
        s.chucao.multiplicadorSuerte = 1;
        this.ui.notify("La bendición del Chucao ha terminado.", "info");
      }
    }

    // 3. Manejo de vuelo del Chucao
    if (s.chucao.activo) {
      s.chucao.x += (s.chucao.direccion * 75) * dt;
      // Si sale de la pantalla
      if ((s.chucao.direccion > 0 && s.chucao.x > this.diorama.width + 40) ||
          (s.chucao.direccion < 0 && s.chucao.x < -40)) {
        s.chucao.activo = false;
      }
    } else {
      this.chucaoSpawnTimer -= dt;
      if (this.chucaoSpawnTimer <= 0) {
        this.spawnChucao();
        this.chucaoSpawnTimer = 70 + Math.random() * 60; // Cada 70-130 segundos
      }
    }

    // 4. Verificación de Fases y Desbloqueos Narrativos
    this.checkPhaseProgression();

    // 5. Guardado automático periódico (cada 5 segundos)
    this.saveTimer += dt;
    if (this.saveTimer >= 5) {
      this.saveTimer = 0;
      SaveManager.save(this.state);
    }
  }

  spawnChucao() {
    const s = this.state.data;
    s.chucao.activo = true;
    s.chucao.direccion = Math.random() > 0.5 ? 1 : -1;
    s.chucao.x = s.chucao.direccion > 0 ? -20 : this.diorama.width + 20;
    s.chucao.y = 50 + Math.random() * (this.diorama.height * 0.4);
    this.sound.playChucao();
    this.ui.notify("¡Un Chucao curioso vuela por el bosque!", "chucao");
  }

  clickChucao() {
    const s = this.state.data;
    if (!s.chucao.activo) return;

    s.chucao.activo = false;
    s.chucao.multiplicadorSuerte = 3;
    s.chucao.segundosRestantesSuerte = 30;

    // Bono inmediato de bayas
    const mps = this.state.getMaquisPorSegundo();
    const bono = Math.max(50, Math.floor(mps * 20));
    s.maquis += bono;
    s.totalMaquis += bono;

    this.sound.playChucao();
    this.ui.notify(`¡Buena suerte del Chucao! +${bono} maquis y x3 producción por 30s.`, "success");
  }

  checkPhaseProgression() {
    const s = this.state.data;

    // Fase 1 a Fase 2: Ganarse la confianza del primer pudú
    if (s.fase === 1 && s.puduAmigado) {
      s.fase = 2;
      this.sound.playChime();
      this.ui.notify("¡Pichi ahora vive en el refugio! Puedes construir camitas y plantar brotes.", "hito");
      this.desbloquearRecuerdo("recuerdo_1");
    }

    // Desbloqueo de Fase 3: El Taller
    if (s.fase === 2 && s.totalMaquis >= 8000) {
      s.fase = 3;
      s.mejoras.recetaMermelada.desbloqueada = true;
      this.sound.playChime();
      this.ui.notify("¡Se desbloqueó El Taller del Bosque! Ahora puedes cocinar mermeladas.", "hito");
      this.desbloquearRecuerdo("recuerdo_4");
    }

    // Desbloqueo de Fase 4: Preparación del Gran Picnic
    if (s.fase === 3 && s.totalMaquis >= 45000) {
      s.fase = 4;
      this.sound.playChime();
      this.ui.notify("¡La manada está lista para organizar El Gran Picnic!", "hito");
    }

    // Desbloqueo dinámico de mejoras según progreso
    if (s.totalMaquis >= 150) s.mejoras.zapatosMusgo.desbloqueada = true;
    if (s.totalMaquis >= 800) s.mejoras.bufandasChilotas.desbloqueada = true;
    if (s.totalMaquis >= 3000) s.mejoras.teCanelo.desbloqueada = true;
    if (s.totalMaquis >= 25000) s.mejoras.coronaCopihues.desbloqueada = true;
  }

  desbloquearRecuerdo(id) {
    const s = this.state.data;
    if (!s.recuerdosDesbloqueados.includes(id)) {
      s.recuerdosDesbloqueados.push(id);
      const recuerdo = giftConfig.recuerdos.find(r => r.id === id);
      if (recuerdo) {
        this.ui.notify(`Nuevo recuerdo desbloqueado: ${recuerdo.hito}`, "recuerdo");
      }
    }
  }

  // Acción manual al alimentar al pudú en Fase 1
  alimentarPrimerPudu() {
    const s = this.state.data;
    if (s.puduAmigado) return;

    const costoComida = 10;
    if (s.maquis >= costoComida) {
      s.maquis -= costoComida;
      s.confianzaPudu = Math.min(100, s.confianzaPudu + 25);
      this.sound.playPuduHappy();

      if (s.confianzaPudu >= 100) {
        s.puduAmigado = true;
      }
    } else {
      this.ui.notify("Necesitas al menos 10 maquis para convidar a Pichi.", "warn");
    }
  }

  // Crafteo de Mermelada en Fase 3
  cocinarMermelada() {
    const s = this.state.data;
    const costoMaquis = 1500;
    if (s.maquis >= costoMaquis) {
      s.maquis -= costoMaquis;
      s.mermeladas += 1;
      s.totalMermeladas += 1;
      this.sound.playChime();
      this.ui.notify("¡Has cocinado un frasco de mermelada de maqui pura! (+2% permanente)", "success");
    } else {
      this.ui.notify(`Necesitas ${costoMaquis} maquis para preparar una mermelada en greda.`, "warn");
    }
  }

  // Gran Picnic (Objetivo final)
  celebrarGranPicnic() {
    const s = this.state.data;
    const metaMaquis = 80000;
    const metaMermeladas = 15;

    if (s.maquis >= metaMaquis && s.mermeladas >= metaMermeladas) {
      s.maquis -= metaMaquis;
      s.picnicCelebrado = true;
      s.fase = 5;
      this.desbloquearRecuerdo("recuerdo_5");
      this.sound.playChime();
      this.ui.abrirModalRegalo();
    } else {
      this.ui.notify(`Faltan preparativos: necesitas ${metaMaquis.toLocaleString()} maquis y ${metaMermeladas} mermeladas.`, "warn");
    }
  }
}

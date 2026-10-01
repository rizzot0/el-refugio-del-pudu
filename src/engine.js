/**
 * Motor Central de Lógica, Fases y Ciclos Ambientales
 */
import { SaveManager } from './save.js';
import { giftConfig } from './giftConfig.js';
import { FAUNA_FLORA_DATA } from './faunaData.js';

export class GameEngine {
  constructor(state, sound, diorama, ui) {
    this.state = state;
    this.sound = sound;
    this.diorama = diorama;
    this.ui = ui;

    this.lastTime = performance.now();
    this.saveTimer = 0;
    this.chucaoSpawnTimer = 35; // Primer Chucao a los 35s
    this.bayaDoradaTimer = 50; // Primera Baya Dorada a los 50s
    this.climaTimer = 75; // Cambio de clima cada 75s
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

    // 1. Producción pasiva de Maquis (MPS)
    const mps = this.state.getMaquisPorSegundo();
    if (mps > 0) {
      const ganancia = mps * dt;
      s.maquis += ganancia;
      s.totalMaquis += ganancia;
    }

    // 2. Temporizador de caricias a los pudús
    if (s.caricias.segundosBonoCaricia > 0) {
      s.caricias.segundosBonoCaricia -= dt;
      if (s.caricias.segundosBonoCaricia <= 0) {
        s.caricias.multiplicadorCaricia = 1;
        this.ui.notify("Los pudús descansan de las caricias.", "info");
      }
    }

    // 3. Temporizador de Suerte del Chucao
    if (s.chucao.segundosRestantesSuerte > 0) {
      s.chucao.segundosRestantesSuerte -= dt;
      if (s.chucao.segundosRestantesSuerte <= 0) {
        s.chucao.multiplicadorSuerte = 1;
        this.ui.notify("La bendición del Chucao ha terminado.", "info");
      }
    }

    // 4. Temporizador de Buff de Cocina (Kuchen y recetas)
    if (s.buffCocina.segundosRestantes > 0) {
      s.buffCocina.segundosRestantes -= dt;
      if (s.buffCocina.segundosRestantes <= 0) {
        s.buffCocina.multiplicador = 1;
        this.ui.notify("El aroma del festín de cocina ha concluido.", "info");
      }
    }

    // 5. Temporizador de Buff de Agua de la Ranita de Darwin
    if (s.ranitaDarwin && s.ranitaDarwin.segundosBuffAgua > 0) {
      s.ranitaDarwin.segundosBuffAgua -= dt;
      if (s.ranitaDarwin.segundosBuffAgua <= 0) {
        this.ui.notify("El rocío revitalizante del arroyo vuelve a la calma.", "info");
      }
    }

    // 6. Proceso de Cocción en la Olla de Greda
    const platoListo = this.state.tickCoccion(dt);
    if (platoListo) {
      this.sound.playChime();
      this.ui.notify(`¡Listo en la Olla de Greda! ${platoListo.nombre}: ${platoListo.bono}`, "success");
    }

    // 7. Manejo del vuelo del Chucao
    if (s.chucao.activo) {
      s.chucao.x += (s.chucao.direccion * 75) * dt;
      if ((s.chucao.direccion > 0 && s.chucao.x > this.diorama.virtualWidth + 40) ||
          (s.chucao.direccion < 0 && s.chucao.x < -40)) {
        s.chucao.activo = false;
      }
    } else {
      this.chucaoSpawnTimer -= dt;
      if (this.chucaoSpawnTimer <= 0) {
        this.spawnChucao();
        const baseCooldown = s.mejoras.cantoChucaoArmonico?.comprada ? 50 : 75;
        this.chucaoSpawnTimer = baseCooldown + Math.random() * 40;
      }
    }

    // 8. Evento periódico de Baya Dorada flotante
    if (!s.bayaDorada?.activa) {
      this.bayaDoradaTimer -= dt;
      if (this.bayaDoradaTimer <= 0) {
        this.spawnBayaDorada();
        this.bayaDoradaTimer = 65 + Math.random() * 45;
      }
    }

    // 9. Ciclo Dinámico del Clima
    this.climaTimer -= dt;
    if (this.climaTimer <= 0) {
      this.cambiarClima();
    }

    // 10. Verificación de Fases, Desbloqueos Didácticos y Recuerdos
    this.checkPhaseProgression();

    // 11. Guardado automático periódico (cada 5s)
    this.saveTimer += dt;
    if (this.saveTimer >= 5) {
      this.saveTimer = 0;
      SaveManager.save(this.state);
    }
  }

  cambiarClima() {
    const s = this.state.data;
    const climas = [
      { tipo: 'lluvia_suave', nombre: 'Lluvia Sureña Suave', icono: '🌧️', mult: 1, duracion: 80 },
      { tipo: 'viento_hojarasca', nombre: 'Viento con Hojarasca', icono: '🍂', mult: 1.25, duracion: 50 },
      { tipo: 'arcoiris_sol', nombre: 'Llovizna con Sol y Arcoíris', icono: '🌈', mult: 2.0, duracion: 40 }
    ];

    // Escoger un clima diferente al actual
    const disponibles = climas.filter(c => c.tipo !== s.clima.tipo);
    const nuevoClima = disponibles[Math.floor(Math.random() * disponibles.length)];

    s.clima.tipo = nuevoClima.tipo;
    s.clima.nombre = nuevoClima.nombre;
    s.clima.icono = nuevoClima.icono;
    s.clima.multiplicador = nuevoClima.mult;
    this.climaTimer = nuevoClima.duracion;

    this.sound.playWindBreeze();
    this.ui.notify(`El clima ha cambiado: ¡${nuevoClima.nombre}! (${nuevoClima.mult > 1 ? `x${nuevoClima.mult} producción` : 'Paz y lluvia'})`, "clima");
  }

  spawnChucao() {
    const s = this.state.data;
    s.chucao.activo = true;
    s.chucao.direccion = Math.random() > 0.5 ? 1 : -1;
    s.chucao.x = s.chucao.direccion > 0 ? -20 : this.diorama.virtualWidth + 20;
    s.chucao.y = 35 + Math.random() * (this.diorama.virtualHeight * 0.35);
    this.sound.playChucao();
    this.ui.notify("¡Un Chucao curioso vuela por el bosque!", "chucao");
  }

  spawnBayaDorada() {
    const s = this.state.data;
    s.bayaDorada.activa = true;
    s.bayaDorada.x = 45 + Math.random() * (this.diorama.virtualWidth - 90);
    s.bayaDorada.y = 15;
    s.bayaDorada.vy = 0.45 + Math.random() * 0.20;
    this.sound.playChirp(780, 0.08);
    this.ui.notify("¡Una Baya Dorada flota suavemente entre las copas de los árboles!", "baya");
  }

  clickChucao() {
    const s = this.state.data;
    if (!s.chucao.activo) return;

    s.chucao.activo = false;
    s.chucao.multiplicadorSuerte = 3;
    const duracion = s.mejoras.cantoChucaoArmonico?.comprada ? 45 : 30;
    s.chucao.segundosRestantesSuerte = duracion;

    // Bono inmediato de bayas
    const mps = this.state.getMaquisPorSegundo();
    const bono = Math.max(35, Math.floor(mps * 18));
    s.maquis += bono;
    s.totalMaquis += bono;

    this.sound.playChucao();
    this.ui.notify(`¡Buena suerte del Chucao! +${bono.toLocaleString()} maquis y x3 producción por ${duracion}s.`, "success");
    this.desbloquearFichaDidactica("chucao");
  }

  checkPhaseProgression() {
    const s = this.state.data;

    // Fase 1 a Fase 2: Ganarse la confianza del primer pudú
    if (s.fase === 1 && s.puduAmigado) {
      s.fase = 2;
      this.sound.playChime();
      this.ui.notify("¡Pichi ahora vive en el refugio! Puedes construir camitas y plantar brotes.", "hito");
      this.desbloquearRecuerdo("recuerdo_1");
      this.desbloquearFichaDidactica("canelo");
    }

    // Fase 2 a Fase 3: Amigos del Bosque
    if (s.fase === 2 && s.totalMaquis >= 3500) {
      s.fase = 3;
      this.sound.playChime();
      this.ui.notify("¡Llegan nuevos amigos del bosque! El Monito del Monte y la Ranita de Darwin se acercan.", "hito");
      this.desbloquearRecuerdo("recuerdo_2");
      this.desbloquearFichaDidactica("monito_monte");
      this.desbloquearFichaDidactica("ranita_darwin");
    }

    // Fase 3 a Fase 4: El Taller Austral
    if (s.fase === 3 && s.totalMaquis >= 18000) {
      s.fase = 4;
      s.mejoras.recetaMermelada.desbloqueada = true;
      this.sound.playChime();
      this.ui.notify("¡Se desbloqueó El Taller del Bosque! Ahora puedes cocinar mermeladas en greda.", "hito");
      this.desbloquearRecuerdo("recuerdo_4");
      this.desbloquearFichaDidactica("copihue");
      this.desbloquearFichaDidactica("carpintero_negro");
    }

    // Fase 4 a Fase 5: Preparación del Gran Picnic
    if (s.fase === 4 && s.totalMaquis >= 45000) {
      s.fase = 5;
      this.sound.playChime();
      this.ui.notify("¡La manada está lista para organizar El Gran Picnic!", "hito");
      this.desbloquearRecuerdo("recuerdo_3");
    }

    // Desbloqueo gradual de mejoras según maquis acumulados
    if (s.totalMaquis >= 120) s.mejoras.zapatosMusgo.desbloqueada = true;
    if (s.totalMaquis >= 650) s.mejoras.bufandasChilotas.desbloqueada = true;
    if (s.totalMaquis >= 2400) s.mejoras.teCanelo.desbloqueada = true;
    if (s.totalMaquis >= 10000) s.mejoras.cantoChucaoArmonico.desbloqueada = true;
    if (s.totalMaquis >= 24000) s.mejoras.coronaCopihues.desbloqueada = true;
  }

  desbloquearFichaDidactica(id) {
    const s = this.state.data;
    if (!s.fichasDesbloqueadas.includes(id)) {
      s.fichasDesbloqueadas.push(id);
      const ficha = FAUNA_FLORA_DATA.find(f => f.id === id);
      if (ficha) {
        this.ui.notify(`¡Nueva ficha en la Bitácora: ${ficha.nombre}!`, "didactica");
      }
    }
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

  // Acción manual para alimentar al pudú en Fase 1
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

  // Crafteo de Mermelada en Olla de Greda
  cocinarMermelada() {
    const s = this.state.data;
    if (s.cocina.enCoccion) {
      this.ui.notify("La olla de greda ya está al fuego cocinando otra receta.", "warn");
      return;
    }
    const ok = this.state.iniciarCoccion('mermelada_clasica');
    if (ok) {
      this.sound.playChime();
      this.ui.notify("¡Iniciando cocción de Mermelada de Maqui en la olla de greda! (15 segundos)", "info");
    } else {
      const costo = s.cocina.recetas.mermelada_clasica.costoMaquis;
      this.ui.notify(`Necesitas ${costo.toLocaleString()} maquis para preparar una mermelada en olla de greda.`, "warn");
    }
  }

  // Gran Picnic (Objetivo final)
  celebrarGranPicnic() {
    const s = this.state.data;
    const metaMaquis = 55000;
    const metaMermeladas = 10;

    if (s.maquis >= metaMaquis && s.mermeladas >= metaMermeladas) {
      s.maquis -= metaMaquis;
      s.picnicCelebrado = true;
      this.desbloquearRecuerdo("recuerdo_5");
      this.sound.playChime();
      this.ui.abrirModalRegalo();
    } else {
      this.ui.notify(`Faltan preparativos: necesitas ${metaMaquis.toLocaleString()} maquis y ${metaMermeladas} mermeladas.`, "warn");
    }
  }
}

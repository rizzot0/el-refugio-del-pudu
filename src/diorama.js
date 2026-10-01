/**
 * Motor del Mundo y Diorama en Pixel Art para "El Refugio de los Pudús"
 * Renderiza el claro del bosque en resolución pixel-perfect con sprites procedurales,
 * animaciones de trote, sueño, recolección, arroyo animado, olla de greda y clima.
 */

import {
  PALETTE,
  drawPixelMatrix,
  PUDU_FRAMES,
  PUDU_COLOR_MAP,
  CHUCAO_SPRITES,
  CHUCAO_COLOR_MAP,
  MONITO_SPRITE,
  MONITO_COLOR_MAP,
  MOSS_BED_SPRITE,
  MOSS_BED_COLOR_MAP,
  CLAY_POT_SPRITE,
  CLAY_POT_COLOR_MAP,
  SPROUT_SPRITE,
  SPROUT_COLOR_MAP,
  ACCESSORY_SPRITES
} from './pixelRenderer.js';

export class ForestDiorama {
  constructor(canvasElement, state, sound) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.state = state;
    this.sound = sound;

    // Buffer interno de baja resolución para estética Pixel Art retro nítida
    this.virtualWidth = 380;
    this.virtualHeight = 220;
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = this.virtualWidth;
    this.offscreenCanvas.height = this.virtualHeight;
    this.vCtx = this.offscreenCanvas.getContext('2d');
    this.vCtx.imageSmoothingEnabled = false;

    // Configurar canvas principal
    this.handleResize();

    // Entidades del mundo
    this.pudusVisuales = [];
    this.initPudus();

    // Bayas caídas con física en el suelo
    this.groundBerries = [];

    // Partículas pixel (humo, lluvia, hojas, corazones, textos flotantes)
    this.pixelParticles = [];
    this.floatingTexts = [];
    this.raindrops = [];
    this.leaves = [];
    this.initWeather();

    // Rebote elástico del arbusto
    this.bushScale = 1;
    this.bushVelocity = 0;

    // Temporizador de animación de agua y fuego
    this.waterAnimTimer = 0;
    this.fireAnimFrame = 0;

    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.ctx.imageSmoothingEnabled = false;
  }

  initWeather() {
    this.raindrops = [];
    for (let i = 0; i < 40; i++) {
      this.raindrops.push({
        x: Math.random() * this.virtualWidth,
        y: Math.random() * this.virtualHeight,
        speed: 3 + Math.random() * 3,
        length: 4 + Math.random() * 4
      });
    }

    this.leaves = [];
    for (let i = 0; i < 14; i++) {
      this.leaves.push({
        x: Math.random() * this.virtualWidth,
        y: Math.random() * this.virtualHeight,
        vx: 1 + Math.random() * 1.5,
        vy: 0.6 + Math.random() * 1,
        color: ['#c25927', '#d97d29', '#e0a93b'][Math.floor(Math.random() * 3)]
      });
    }
  }

  initPudus() {
    this.pudusVisuales = [];
    const count = Math.min(8, Math.max(1, this.state.data.pudus.length));
    for (let i = 0; i < count; i++) {
      const pData = this.state.data.pudus[i];
      this.pudusVisuales.push({
        id: pData ? pData.id : `p_${i}`,
        nombre: pData ? pData.nombre : `Pudú ${i + 1}`,
        x: 35 + (i * 42) % (this.virtualWidth - 80),
        y: this.virtualHeight - 64 - (i % 2) * 8,
        baseY: this.virtualHeight - 64 - (i % 2) * 8,
        vx: (Math.random() - 0.5) * 0.45,
        direction: Math.random() > 0.5 ? 1 : -1,
        state: 'idle', // 'idle' | 'walk' | 'eat' | 'sleep' | 'pet'
        frameTimer: Math.random() * 10,
        petTimer: 0,
        sleepTimer: 0,
        eatTimer: 0,
        targetBerry: null,
        hat: this.getHatKey(pData?.sombrero)
      });
    }
  }

  getHatKey(sombrero) {
    if (sombrero === "🌸" || sombrero === "🎀") return "copihue";
    if (sombrero === "☀️" || sombrero === "🌾") return "chupalla";
    if (sombrero === "🧣" || sombrero === "🔥") return "scarf";
    return "leaf"; // por defecto hoja verde
  }

  // Conversión de coordenadas de pantalla a espacio virtual del juego
  screenToVirtual(screenX, screenY) {
    const scaleX = this.virtualWidth / this.canvas.width;
    const scaleY = this.virtualHeight / this.canvas.height;
    return {
      x: screenX * scaleX,
      y: screenY * scaleY
    };
  }

  // Clic en el arbusto central
  triggerBushClick(screenEvent) {
    this.bushScale = 0.85;
    this.sound.playBerryPop();

    let vx = this.virtualWidth / 2;
    let vy = this.virtualHeight * 0.42;

    if (screenEvent) {
      const rect = this.canvas.getBoundingClientRect();
      const coords = this.screenToVirtual(screenEvent.clientX - rect.left, screenEvent.clientY - rect.top);
      vx = coords.x;
      vy = coords.y;
    }

    // Soltar bayas físicas al suelo
    if (this.groundBerries.length < 18) {
      this.groundBerries.push({
        x: this.virtualWidth / 2 + (Math.random() - 0.5) * 70,
        y: this.virtualHeight * 0.45,
        vy: 1.5 + Math.random() * 2,
        targetY: this.virtualHeight - 32 - Math.random() * 20,
        collected: false
      });
    }

    // Partículas de jugo de maqui
    for (let i = 0; i < 4; i++) {
      this.pixelParticles.push({
        x: vx + (Math.random() - 0.5) * 16,
        y: vy + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 2,
        vy: -1.5 - Math.random() * 2,
        color: PALETTE.berryLight,
        life: 0.8
      });
    }

    const ganancia = this.state.getMaquisPorClick();
    this.addFloatingText(`+${ganancia}`, vx, vy - 10, '#fef08a');
  }

  // Acariciar pudú
  petPudu(pudu) {
    pudu.state = 'pet';
    pudu.petTimer = 1.4;
    this.sound.playPetHeart();
    this.sound.playPuduHappy();

    const s = this.state.data;
    s.caricias.contadorTotal++;
    s.caricias.segundosBonoCaricia = 20;
    s.caricias.multiplicadorCaricia = 1.25;

    // Corazones pixel flotantes
    for (let i = 0; i < 3; i++) {
      this.pixelParticles.push({
        x: pudu.x + (Math.random() - 0.5) * 12,
        y: pudu.y - 8,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -1 - Math.random() * 0.6,
        color: '#f43f5e',
        isHeart: true,
        life: 1.2
      });
    }

    this.addFloatingText("¡Pudú feliz! 💕", pudu.x + 8, pudu.y - 12, '#f472b6', 10);
  }

  addFloatingText(text, x, y, color = '#ffffff', size = 9) {
    this.floatingTexts.push({
      text,
      x: Math.floor(x),
      y: Math.floor(y),
      vy: -0.6,
      alpha: 1,
      size,
      color
    });
  }

  update(dt) {
    const s = this.state.data;

    // Sincronizar pudús si se agregaron
    if (this.pudusVisuales.length !== Math.min(8, s.pudus.length)) {
      this.initPudus();
    }

    // Física de rebote del arbusto
    const k = 0.24;
    const damping = 0.78;
    const displacement = 1 - this.bushScale;
    this.bushVelocity += displacement * k;
    this.bushVelocity *= damping;
    this.bushScale += this.bushVelocity;

    // Temporizadores de agua y fuego
    this.waterAnimTimer += dt * 3;
    this.fireAnimFrame = (this.fireAnimFrame + dt * 6) % 2;

    // 1. Clima pixel
    if (s.clima.tipo === 'lluvia_suave') {
      for (const drop of this.raindrops) {
        drop.y += drop.speed;
        if (drop.y > this.virtualHeight) {
          drop.y = -6;
          drop.x = Math.random() * this.virtualWidth;
        }
      }
    } else if (s.clima.tipo === 'viento_hojarasca') {
      for (const leaf of this.leaves) {
        leaf.x += leaf.vx;
        leaf.y += leaf.vy;
        if (leaf.x > this.virtualWidth + 10) leaf.x = -10;
        if (leaf.y > this.virtualHeight) leaf.y = -6;
      }
    }

    // 2. Caída de bayas físicas
    for (const b of this.groundBerries) {
      if (b.y < b.targetY) {
        b.y += b.vy;
        if (b.y >= b.targetY) b.y = b.targetY;
      }
    }

    // 3. IA de comportamiento de Pudús
    for (const pudu of this.pudusVisuales) {
      pudu.frameTimer += dt * 3.5;

      // Estado Petting
      if (pudu.state === 'pet') {
        pudu.petTimer -= dt;
        if (pudu.petTimer <= 0) pudu.state = 'idle';
        continue;
      }

      // Estado Comiendo
      if (pudu.state === 'eat') {
        pudu.eatTimer -= dt;
        if (pudu.eatTimer <= 0) pudu.state = 'idle';
        continue;
      }

      // Estado Durmiendo
      if (pudu.state === 'sleep') {
        pudu.sleepTimer -= dt;
        if (pudu.sleepTimer <= 0) pudu.state = 'idle';
        continue;
      }

      // Buscar bayas en el suelo si hay alguna libre
      if (this.groundBerries.length > 0 && !pudu.targetBerry) {
        const available = this.groundBerries.filter(b => !b.claimed);
        if (available.length > 0) {
          const target = available[0];
          target.claimed = true;
          pudu.targetBerry = target;
        }
      }

      if (pudu.targetBerry) {
        pudu.state = 'walk';
        const dx = pudu.targetBerry.x - pudu.x;
        pudu.direction = dx >= 0 ? 1 : -1;
        pudu.x += Math.sign(dx) * 0.75;

        if (Math.abs(dx) < 6) {
          // Llegó a la baya
          const idx = this.groundBerries.indexOf(pudu.targetBerry);
          if (idx !== -1) this.groundBerries.splice(idx, 1);
          pudu.targetBerry = null;
          pudu.state = 'eat';
          pudu.eatTimer = 1.0;

          const bonoBaya = Math.max(1, Math.round(this.state.getMaquisPorClick() * 0.5));
          s.maquis += bonoBaya;
          s.totalMaquis += bonoBaya;
          this.addFloatingText(`+${bonoBaya} 🫐`, pudu.x + 8, pudu.y - 8, '#c084fc', 8);
          this.sound.playPuduHappy();
        }
      } else {
        // Paseo / Idle / Dormir ocasional en camita
        if (Math.random() < 0.003 && s.productores.camitaMusgo.cantidad > 0) {
          pudu.state = 'sleep';
          pudu.sleepTimer = 6.0;
        } else if (Math.random() < 0.008) {
          pudu.vx = (Math.random() - 0.5) * 0.5;
          pudu.direction = pudu.vx >= 0 ? 1 : -1;
          pudu.state = Math.abs(pudu.vx) > 0.05 ? 'walk' : 'idle';
        }

        if (pudu.state === 'walk') {
          pudu.x += pudu.vx;
          if (pudu.x < 16) {
            pudu.x = 16;
            pudu.vx = Math.abs(pudu.vx);
            pudu.direction = 1;
          } else if (pudu.x > this.virtualWidth - 42) {
            pudu.x = this.virtualWidth - 42;
            pudu.vx = -Math.abs(pudu.vx);
            pudu.direction = -1;
          }
        }
      }
    }

    // 4. Partículas
    for (let i = this.pixelParticles.length - 1; i >= 0; i--) {
      const p = this.pixelParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dt;
      if (p.life <= 0) this.pixelParticles.splice(i, 1);
    }

    // 5. Textos flotantes
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= dt * 0.9;
      if (ft.alpha <= 0) this.floatingTexts.splice(i, 1);
    }
  }

  draw() {
    const vCtx = this.vCtx;
    const s = this.state.data;

    // Limpiar canvas virtual
    vCtx.clearRect(0, 0, this.virtualWidth, this.virtualHeight);

    // 1. Cielo degradado pixel
    this.drawPixelSky(vCtx);

    // 2. Siluetas de árboles y montañas lejanas
    this.drawPixelMountainsAndTrees(vCtx);

    // 3. Suelo boscoso (Tierra y alfombra de musgo)
    this.drawPixelGround(vCtx);

    // 4. Acequia de Deshielo si está comprada
    if (s.productores.canaletaDeshielo.cantidad > 0) {
      this.drawPixelStream(vCtx);
    }

    // 5. Camitas de musgo construidas
    const camas = Math.min(4, s.productores.camitaMusgo.cantidad);
    for (let i = 0; i < camas; i++) {
      const cx = 30 + i * 36;
      const cy = this.virtualHeight - 48;
      drawPixelMatrix(vCtx, MOSS_BED_SPRITE, MOSS_BED_COLOR_MAP, cx, cy, 1);
    }

    // 6. Brotes de Maqui plantados
    const brotes = Math.min(8, s.productores.broteMaqui.cantidad);
    for (let i = 0; i < brotes; i++) {
      const bx = 18 + (i * 44) % (this.virtualWidth - 50);
      const by = this.virtualHeight - 52 - (i % 2) * 8;
      drawPixelMatrix(vCtx, SPROUT_SPRITE, SPROUT_COLOR_MAP, bx, by, 1);
    }

    // 7. Olla de Greda con fuego animado
    if (s.productores.ollaGreda.cantidad > 0) {
      const ox = this.virtualWidth - 44;
      const oy = this.virtualHeight - 54;
      drawPixelMatrix(vCtx, CLAY_POT_SPRITE, CLAY_POT_COLOR_MAP, ox, oy, 1);
    }

    // 8. Bayas en el suelo
    for (const b of this.groundBerries) {
      vCtx.fillStyle = PALETTE.berryMid;
      vCtx.fillRect(Math.floor(b.x), Math.floor(b.y), 3, 3);
      vCtx.fillStyle = PALETTE.berryGlint;
      vCtx.fillRect(Math.floor(b.x), Math.floor(b.y), 1, 1);
    }

    // 9. Arbusto Central de Maqui (Pixel Art con rebote)
    this.drawPixelCentralBush(vCtx);

    // 10. Pudús en Pixel Art
    this.drawPixelPudus(vCtx);

    // 11. Monito del Monte en la rama
    if (s.productores.monitoMonte.cantidad > 0) {
      this.drawPixelMonito(vCtx);
    }

    // 12. Chucao volando
    if (s.chucao.activo) {
      this.drawPixelChucao(vCtx);
    }

    // 13. Clima y partículas
    this.drawPixelWeather(vCtx);

    // 14. Textos flotantes
    this.drawPixelTexts(vCtx);

    // Renderizar buffer virtual escalado en el canvas visible
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.offscreenCanvas,
      0, 0, this.virtualWidth, this.virtualHeight,
      0, 0, this.canvas.width, this.canvas.height
    );
  }

  drawPixelSky(ctx) {
    const s = this.state.data;
    const skyColors = s.clima.tipo === 'arcoiris_sol'
      ? ['#2f5e43', '#3d7756', '#52966e', '#72b68e']
      : (s.clima.tipo === 'viento_hojarasca'
        ? ['#223a2d', '#2d4b3b', '#3b5f4c', '#4b755e']
        : ['#172e21', '#1f3d2c', '#294d38', '#345e46']);

    const bandH = Math.floor(this.virtualHeight * 0.6 / skyColors.length);
    skyColors.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect(0, i * bandH, this.virtualWidth, bandH + 2);
    });

    // Arcoíris pixel si hay llovizna con sol
    if (s.clima.tipo === 'arcoiris_sol') {
      const arcCols = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#c084fc'];
      arcCols.forEach((col, idx) => {
        ctx.fillStyle = col;
        ctx.globalAlpha = 0.25;
        ctx.fillRect(this.virtualWidth * 0.4 + idx * 4, 18 + idx * 3, this.virtualWidth * 0.5, 3);
        ctx.globalAlpha = 1.0;
      });
    }
  }

  drawPixelMountainsAndTrees(ctx) {
    // Silueta de Araucarias y Coihues de fondo
    ctx.fillStyle = 'rgba(16, 38, 24, 0.65)';
    for (let x = 10; x < this.virtualWidth; x += 32) {
      // Tronco
      ctx.fillRect(x + 6, 30, 3, this.virtualHeight * 0.5);
      // Follaje piramidal
      ctx.fillRect(x + 2, 45, 11, 8);
      ctx.fillRect(x + 4, 38, 7, 7);
      ctx.fillRect(x + 5, 32, 5, 6);
    }
  }

  drawPixelGround(ctx) {
    const groundY = this.virtualHeight - 58;

    // Capa de tierra
    ctx.fillStyle = PALETTE.groundDark;
    ctx.fillRect(0, groundY + 12, this.virtualWidth, this.virtualHeight - groundY);

    // Manto de hierba y musgo
    ctx.fillStyle = PALETTE.groundMid;
    ctx.fillRect(0, groundY, this.virtualWidth, 14);

    ctx.fillStyle = PALETTE.groundMoss;
    for (let x = 0; x < this.virtualWidth; x += 4) {
      const h = ((x * 7) % 5);
      ctx.fillRect(x, groundY - h, 3, h + 3);
    }

    // Pequeñas flores silvestres del bosque
    for (let x = 15; x < this.virtualWidth; x += 55) {
      ctx.fillStyle = (x % 2 === 0) ? PALETTE.flowerYellow : PALETTE.flowerRed;
      ctx.fillRect(x, groundY - 2, 2, 2);
    }
  }

  drawPixelStream(ctx) {
    const streamY = this.virtualHeight - 16;
    ctx.fillStyle = PALETTE.waterDark;
    ctx.fillRect(0, streamY, this.virtualWidth, 16);

    ctx.fillStyle = PALETTE.waterMid;
    ctx.fillRect(0, streamY + 2, this.virtualWidth, 10);

    // Destellos animados de agua
    const offset = Math.floor(this.waterAnimTimer % 8);
    ctx.fillStyle = PALETTE.waterLight;
    for (let x = offset; x < this.virtualWidth; x += 16) {
      ctx.fillRect(x, streamY + 4, 5, 2);
    }
  }

  drawPixelCentralBush(ctx) {
    const cx = Math.floor(this.virtualWidth / 2);
    const cy = Math.floor(this.virtualHeight * 0.44);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(this.bushScale, this.bushScale);

    // Sombra pixel en el suelo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.fillRect(-32, 42, 64, 8);

    // Tronco leñoso
    ctx.fillStyle = PALETTE.trunkDark;
    ctx.fillRect(-4, 20, 8, 24);
    ctx.fillStyle = PALETTE.trunkMid;
    ctx.fillRect(-2, 20, 4, 24);

    // Copa de follaje de maqui en capas pixel
    const layers = [
      { y: -30, r: 24, col: PALETTE.leafShadow },
      { y: -16, r: 32, col: PALETTE.leafMid },
      { y: 0,   r: 36, col: PALETTE.leafLight },
      { y: 12,  r: 28, col: PALETTE.leafHighlight }
    ];

    layers.forEach(l => {
      ctx.fillStyle = l.col;
      ctx.fillRect(-l.r, l.y - 12, l.r * 2, l.r * 1.1);
      // Redondear esquinas estilo pixel
      ctx.clearRect(-l.r, l.y - 12, 3, 3);
      ctx.clearRect(l.r - 3, l.y - 12, 3, 3);
    });

    // Racimos de bayas de maqui moradas
    const berryPositions = [
      { x: -18, y: -20 }, { x: 14, y: -22 }, { x: -8, y: -4 },
      { x: 18, y: 4 }, { x: -22, y: 12 }, { x: 6, y: 16 }
    ];

    berryPositions.forEach(bp => {
      ctx.fillStyle = PALETTE.berryMid;
      ctx.fillRect(bp.x, bp.y, 6, 6);
      ctx.fillStyle = PALETTE.berryGlint;
      ctx.fillRect(bp.x, bp.y, 2, 2);
    });

    ctx.restore();
  }

  drawPixelPudus(ctx) {
    for (const p of this.pudusVisuales) {
      let matrix = PUDU_FRAMES.idle;

      if (p.state === 'walk') {
        const frameIndex = Math.floor(p.frameTimer) % 2;
        matrix = frameIndex === 0 ? PUDU_FRAMES.walk1 : PUDU_FRAMES.walk2;
      } else if (p.state === 'eat') {
        matrix = PUDU_FRAMES.eat;
      } else if (p.state === 'sleep') {
        matrix = PUDU_FRAMES.sleep;
      }

      // Sombra pixel en el suelo estilo referencia
      ctx.fillStyle = PALETTE.puduShadow;
      ctx.fillRect(Math.floor(p.x + 3), Math.floor(p.y + 18), 18, 3);

      // Dibujar sprite de pudú: original mira hacia la izquierda.
      // Si direction > 0 (mira a la derecha), se invierte horizontalmente.
      const isFacingRight = p.direction > 0;
      drawPixelMatrix(ctx, matrix, PUDU_COLOR_MAP, p.x, p.y, 1, isFacingRight);

      // Accesorio en la cabeza si no está durmiendo (ajustado anatómicamente a la cabeza erguida o gacha)
      if (p.state !== 'sleep' && p.hat && ACCESSORY_SPRITES[p.hat]) {
        const hatColorMap = {
          'G': PALETTE.leafHighlight,
          'R': PALETTE.flowerRed,
          'Y': '#facc15'
        };
        const isEat = p.state === 'eat';
        const hx = isFacingRight ? (isEat ? p.x + 14 : p.x + 17) : (isEat ? p.x + 4 : p.x + 3);
        const hy = isEat ? p.y + 8 : p.y - 3;
        drawPixelMatrix(ctx, ACCESSORY_SPRITES[p.hat], hatColorMap, hx, hy, 1, isFacingRight);
      }

      // Si duerme, mostrar 'Zzz' pixel
      if (p.state === 'sleep') {
        ctx.fillStyle = '#bae6fd';
        ctx.font = '7px sans-serif';
        ctx.fillText("Zzz", Math.floor(p.x + 10), Math.floor(p.y - 4));
      }
    }
  }

  drawPixelMonito(ctx) {
    const mx = 24;
    const my = 34;

    // Rama
    ctx.fillStyle = PALETTE.trunkDark;
    ctx.fillRect(0, my + 6, 44, 4);

    drawPixelMatrix(ctx, MONITO_SPRITE, MONITO_COLOR_MAP, mx, my, 1);
  }

  drawPixelChucao(ctx) {
    const ch = this.state.data.chucao;
    const frame = Math.floor(Date.now() / 150) % 2 === 0 ? CHUCAO_SPRITES.fly1 : CHUCAO_SPRITES.fly2;
    drawPixelMatrix(ctx, frame, CHUCAO_COLOR_MAP, ch.x, ch.y, 1, ch.direccion < 0);

    // Halo dorado pixel
    ctx.fillStyle = '#fde047';
    ctx.fillRect(Math.floor(ch.x - 2), Math.floor(ch.y + 4), 2, 2);
  }

  drawPixelWeather(ctx) {
    const s = this.state.data;

    if (s.clima.tipo === 'lluvia_suave') {
      ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
      for (const d of this.raindrops) {
        ctx.fillRect(Math.floor(d.x), Math.floor(d.y), 1, Math.floor(d.length));
      }
    } else if (s.clima.tipo === 'viento_hojarasca') {
      for (const l of this.leaves) {
        ctx.fillStyle = l.color;
        ctx.fillRect(Math.floor(l.x), Math.floor(l.y), 3, 2);
      }
    }

    // Partículas de corazón y humo
    for (const p of this.pixelParticles) {
      ctx.fillStyle = p.color;
      if (p.isHeart) {
        // Corazón pixel de 4x3
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 4, 3);
      } else {
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, 2);
      }
    }
  }

  drawPixelTexts(ctx) {
    for (const ft of this.floatingTexts) {
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = ft.alpha;
      ctx.font = `bold ${ft.size}px 'Nunito', sans-serif`;
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1.0;
  }
}

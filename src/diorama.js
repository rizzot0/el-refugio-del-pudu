/**
 * Diorama Visual Interactivo en HTML5 Canvas con Física Táctil y Ambiente Vivo
 * Renderiza el claro del bosque, el arbusto de maqui elástico, bayas físicas en el suelo,
 * pudús con IA de recolección y sistema de caricias, amigos del bosque y clima cambiante.
 */

export class ForestDiorama {
  constructor(canvasElement, state, sound) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.state = state;
    this.sound = sound;

    this.width = canvasElement.width = canvasElement.offsetWidth || 600;
    this.height = canvasElement.height = canvasElement.offsetHeight || 380;

    // Partículas climáticas (lluvia, hojas de viento, brillos de sol)
    this.raindrops = [];
    this.leaves = [];
    this.sunbeams = [];
    this.initWeatherParticles();

    // Partículas de click y textos flotantes
    this.floatingTexts = [];
    this.clickParticles = [];

    // Bayas físicas caídas en el suelo que los pudús pueden recoger
    this.groundBerries = [];

    // Pudús animados en el refugio
    this.pudusVisuales = [];
    this.initPudus();

    // Rebote elástico del arbusto central
    this.bushScale = 1;
    this.bushVelocity = 0;

    // Humo procedural de la olla de greda
    this.smokeParticles = [];

    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = this.canvas.offsetWidth;
    this.height = this.canvas.height = this.canvas.offsetHeight;
    this.initWeatherParticles();
  }

  initWeatherParticles() {
    // 1. Lluvia
    this.raindrops = [];
    const dropCount = Math.floor(this.width / 14);
    for (let i = 0; i < dropCount; i++) {
      this.raindrops.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        speed: 5 + Math.random() * 5,
        length: 10 + Math.random() * 12,
        alpha: 0.15 + Math.random() * 0.25
      });
    }

    // 2. Hojas otoñales arrastradas por el viento
    this.leaves = [];
    for (let i = 0; i < 18; i++) {
      this.leaves.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: 1.5 + Math.random() * 2.5,
        vy: 0.8 + Math.random() * 1.5,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.05,
        color: ['#c25927', '#d97d29', '#e0a93b', '#8f3e23'][Math.floor(Math.random() * 4)],
        size: 5 + Math.random() * 4
      });
    }
  }

  initPudus() {
    this.pudusVisuales = [];
    const count = Math.min(7, Math.max(1, this.state.data.pudus.length));
    for (let i = 0; i < count; i++) {
      const pData = this.state.data.pudus[i];
      this.pudusVisuales.push({
        id: pData ? pData.id : `p_${i}`,
        nombre: pData ? pData.nombre : `Pudú ${i + 1}`,
        x: 40 + Math.random() * (this.width - 80),
        y: this.height - 48 - (i % 3) * 12,
        baseY: this.height - 48 - (i % 3) * 12,
        vx: (Math.random() - 0.5) * 0.7,
        direction: Math.random() > 0.5 ? 1 : -1,
        bounceTimer: Math.random() * 10,
        hat: pData ? (pData.sombrero || "🍂") : "🍂",
        isPetting: false,
        pettingTimer: 0,
        targetBerry: null,
        gatherCooldown: 0
      });
    }
  }

  // Click manual en el arbusto central
  triggerBushClick(e) {
    this.bushScale = 0.86;
    this.sound.playBerryPop();

    const rect = this.canvas.getBoundingClientRect();
    const clickX = e ? e.clientX - rect.left : this.width / 2;
    const clickY = e ? e.clientY - rect.top : this.height * 0.44;

    // 1. Partículas visuales inmediatas
    for (let i = 0; i < 5; i++) {
      this.clickParticles.push({
        x: clickX + (Math.random() - 0.5) * 35,
        y: clickY + (Math.random() - 0.5) * 35,
        vx: (Math.random() - 0.5) * 4,
        vy: -3 - Math.random() * 3.5,
        size: 5 + Math.random() * 3,
        alpha: 1,
        color: Math.random() > 0.3 ? '#421448' : '#692073'
      });
    }

    // 2. Generar bayas físicas que caen al suelo para que los pudús las recojan
    if (this.groundBerries.length < 15) {
      this.groundBerries.push({
        x: this.width / 2 + (Math.random() - 0.5) * 100,
        y: this.height * 0.46,
        vy: 2 + Math.random() * 3,
        targetY: this.height - 35 - Math.random() * 25,
        rot: Math.random() * Math.PI,
        size: 6,
        collected: false
      });
    }

    // 3. Texto flotante con ganancia
    const ganancia = this.state.getMaquisPorClick();
    this.addFloatingText(`+${ganancia}`, clickX, clickY - 15, '#fef08a');
  }

  // Acariciar a un pudú
  petPudu(pudu) {
    pudu.isPetting = true;
    pudu.pettingTimer = 1.2;
    this.sound.playPetHeart();
    this.sound.playPuduHappy();

    // Activar bono de caricia en el estado (+25% por 20 segundos)
    const s = this.state.data;
    s.caricias.contadorTotal++;
    s.caricias.segundosBonoCaricia = 20;
    s.caricias.multiplicadorCaricia = 1.25;

    // Partículas de corazones flotantes
    for (let i = 0; i < 4; i++) {
      this.floatingTexts.push({
        text: '❤️',
        x: pudu.x + (Math.random() - 0.5) * 20,
        y: pudu.y - 15,
        vy: -1.4 - Math.random() * 1.2,
        alpha: 1,
        size: 15,
        color: '#f43f5e'
      });
    }

    this.addFloatingText("¡Pudú regalón! +25% velocidad", pudu.x, pudu.y - 30, '#f472b6', 13);
  }

  addFloatingText(text, x, y, color = '#ffffff', size = 14) {
    this.floatingTexts.push({
      text,
      x,
      y,
      vy: -1.2,
      alpha: 1,
      size,
      color
    });
  }

  update(dt) {
    const s = this.state.data;

    // Sincronizar pudús si se unieron nuevos habitantes
    if (this.pudusVisuales.length !== Math.min(7, s.pudus.length)) {
      this.initPudus();
    }

    // 1. Física de resorte del arbusto
    const k = 0.22;
    const damping = 0.8;
    const displacement = 1 - this.bushScale;
    this.bushVelocity += displacement * k;
    this.bushVelocity *= damping;
    this.bushScale += this.bushVelocity;

    // 2. Clima: actualizar partículas
    if (s.clima.tipo === 'lluvia_suave') {
      for (const drop of this.raindrops) {
        drop.y += drop.speed;
        if (drop.y > this.height) {
          drop.y = -10;
          drop.x = Math.random() * this.width;
        }
      }
    } else if (s.clima.tipo === 'viento_hojarasca') {
      for (const leaf of this.leaves) {
        leaf.x += leaf.vx;
        leaf.y += leaf.vy;
        leaf.rot += leaf.vrot;
        if (leaf.x > this.width + 20) leaf.x = -20;
        if (leaf.y > this.height) leaf.y = -10;
      }
    }

    // 3. Bayas en el suelo (caída con gravedad)
    for (const b of this.groundBerries) {
      if (b.y < b.targetY) {
        b.y += b.vy;
        if (b.y >= b.targetY) b.y = b.targetY;
      }
    }

    // 4. Actualizar Pudús e IA de recolección de bayas
    for (const pudu of this.pudusVisuales) {
      pudu.bounceTimer += dt * 4;

      // Temporizador de caricia
      if (pudu.isPetting) {
        pudu.pettingTimer -= dt;
        if (pudu.pettingTimer <= 0) pudu.isPetting = false;
      }

      // Si hay bayas en el suelo, buscar la más cercana
      if (this.groundBerries.length > 0 && !pudu.targetBerry) {
        const available = this.groundBerries.filter(b => !b.claimed);
        if (available.length > 0) {
          const closest = available[0];
          closest.claimed = true;
          pudu.targetBerry = closest;
        }
      }

      // Caminar hacia la baya o patrullar
      if (pudu.targetBerry) {
        const dx = pudu.targetBerry.x - pudu.x;
        pudu.direction = dx >= 0 ? 1 : -1;
        pudu.x += Math.sign(dx) * 1.1;

        if (Math.abs(dx) < 8) {
          // Baya recogida por el pudú
          const bIdx = this.groundBerries.indexOf(pudu.targetBerry);
          if (bIdx !== -1) {
            this.groundBerries.splice(bIdx, 1);
          }
          pudu.targetBerry = null;

          const bonoBaya = Math.max(1, Math.round(this.state.getMaquisPorClick() * 0.6));
          s.maquis += bonoBaya;
          s.totalMaquis += bonoBaya;
          this.addFloatingText(`+${bonoBaya} 🫐`, pudu.x, pudu.y - 14, '#c084fc', 12);
          this.sound.playPuduHappy();
        }
      } else {
        // Movimiento normal
        pudu.x += pudu.vx;
        if (pudu.x < 30) {
          pudu.x = 30;
          pudu.vx = Math.abs(pudu.vx);
          pudu.direction = 1;
        } else if (pudu.x > this.width - 50) {
          pudu.x = this.width - 50;
          pudu.vx = -Math.abs(pudu.vx);
          pudu.direction = -1;
        }

        if (Math.random() < 0.006) {
          pudu.vx = (Math.random() - 0.5) * 0.8;
          pudu.direction = pudu.vx >= 0 ? 1 : -1;
        }
      }
    }

    // 5. Partículas de click
    for (let i = this.clickParticles.length - 1; i >= 0; i--) {
      const p = this.clickParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.16; // Gravedad
      p.alpha -= 0.025;
      if (p.alpha <= 0) this.clickParticles.splice(i, 1);
    }

    // 6. Textos flotantes
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.02;
      if (ft.alpha <= 0) this.floatingTexts.splice(i, 1);
    }

    // 7. Humo de la olla de greda si ya está construida
    if (s.productores.ollaGreda.cantidad > 0) {
      if (Math.random() < 0.2) {
        this.smokeParticles.push({
          x: this.width - 65,
          y: this.height - 65,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.8 - Math.random() * 0.6,
          size: 4 + Math.random() * 3,
          alpha: 0.6
        });
      }
      for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
        const sm = this.smokeParticles[i];
        sm.x += sm.vx;
        sm.y += sm.vy;
        sm.size += 0.08;
        sm.alpha -= 0.012;
        if (sm.alpha <= 0) this.smokeParticles.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const s = this.state.data;

    // 1. Cielo atmosférico según el clima
    this.drawSkyAtmosphere();

    // 2. Bosque y follaje de fondo
    this.drawForestBackground();

    // 3. Elementos construidos del refugio (Arroyo de acequia, camitas, olla de greda)
    this.drawCampElements();

    // 4. Suelo de tierra húmeda y musgo
    this.drawGround();

    // 5. Clima: lluvia / hojas / sol
    this.drawWeatherEffects();

    // 6. Bayas en el suelo
    this.drawGroundBerries();

    // 7. El Arbusto Central de Maqui
    this.drawCentralBush();

    // 8. Pudús caminando y recogiendo
    this.drawPudus();

    // 9. Fauna especial: Monito del Monte en las ramas
    if (s.productores.monitoMonte.cantidad > 0) {
      this.drawMonitoDelMonte();
    }

    // 10. Chucao volando si está activo
    this.drawChucao();

    // 11. Partículas y textos flotantes
    this.drawParticlesAndTexts();
  }

  drawSkyAtmosphere() {
    const s = this.state.data;
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);

    if (s.clima.tipo === 'arcoiris_sol') {
      skyGrad.addColorStop(0, '#2e5b42');
      skyGrad.addColorStop(0.5, '#4a7c59');
      skyGrad.addColorStop(1, '#689d71');
    } else if (s.clima.tipo === 'viento_hojarasca') {
      skyGrad.addColorStop(0, '#2d4233');
      skyGrad.addColorStop(0.6, '#3e5443');
      skyGrad.addColorStop(1, '#4f6853');
    } else {
      // Lluvia suave por defecto
      skyGrad.addColorStop(0, '#1a3324');
      skyGrad.addColorStop(0.6, '#264431');
      skyGrad.addColorStop(1, '#325239');
    }

    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Si hay arcoíris con sol
    if (s.clima.tipo === 'arcoiris_sol') {
      this.ctx.save();
      this.ctx.lineWidth = 12;
      this.ctx.globalAlpha = 0.22;
      const arcColors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'];
      arcColors.forEach((color, idx) => {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(this.width * 0.8, this.height + 60, this.height * 0.85 + (idx * 6), Math.PI, Math.PI * 1.6);
        this.ctx.stroke();
      });
      this.ctx.restore();
    }
  }

  drawForestBackground() {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(14, 32, 19, 0.42)';
    // Troncos y siluetas lejanas
    for (let x = 25; x < this.width; x += 95) {
      this.ctx.fillRect(x, 0, 22, this.height * 0.76);
    }
    // Niebla tenue
    const mistGrad = this.ctx.createLinearGradient(0, this.height * 0.35, 0, this.height * 0.75);
    mistGrad.addColorStop(0, 'rgba(215, 235, 225, 0.08)');
    mistGrad.addColorStop(1, 'rgba(215, 235, 225, 0.01)');
    this.ctx.fillStyle = mistGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  }

  drawCampElements() {
    const s = this.state.data;

    // 1. Arroyo cristalino de la acequia de deshielo
    if (s.productores.canaletaDeshielo.cantidad > 0) {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(125, 211, 252, 0.45)';
      this.ctx.lineWidth = 14;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.height - 22);
      this.ctx.bezierCurveTo(this.width * 0.3, this.height - 18, this.width * 0.7, this.height - 28, this.width, this.height - 24);
      this.ctx.stroke();

      // Reflejos del agua
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(this.width * 0.2, this.height - 20);
      this.ctx.lineTo(this.width * 0.4, this.height - 22);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // 2. Camitas de musgo construidas
    const camas = Math.min(4, s.productores.camitaMusgo.cantidad);
    for (let i = 0; i < camas; i++) {
      const cx = 35 + i * 38;
      const cy = this.height - 40;
      this.ctx.save();
      this.ctx.fillStyle = '#2f5a34';
      this.ctx.beginPath();
      this.ctx.ellipse(cx, cy, 14, 6, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#e2b347'; // Hoja seca como cojín
      this.ctx.beginPath();
      this.ctx.arc(cx - 2, cy - 2, 4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 3. Cocinilla y Olla de Greda
    if (s.productores.ollaGreda.cantidad > 0) {
      const ox = this.width - 65;
      const oy = this.height - 50;

      this.ctx.save();
      // Olla de greda rústica
      this.ctx.fillStyle = '#a0522d';
      this.ctx.beginPath();
      this.ctx.arc(ox, oy, 11, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#78350f';
      this.ctx.fillRect(ox - 9, oy - 14, 18, 5);

      // Partículas de humo
      for (const sm of this.smokeParticles) {
        this.ctx.fillStyle = `rgba(240, 240, 240, ${sm.alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(sm.x, sm.y, sm.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }
  }

  drawGround() {
    this.ctx.save();
    this.ctx.fillStyle = '#1e3522';
    this.ctx.beginPath();
    this.ctx.ellipse(this.width / 2, this.height + 15, this.width * 0.65, 75, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.strokeStyle = '#3e6b3f';
    this.ctx.lineWidth = 3.5;
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawWeatherEffects() {
    const s = this.state.data;
    this.ctx.save();

    if (s.clima.tipo === 'lluvia_suave') {
      this.ctx.strokeStyle = 'rgba(210, 235, 245, 0.38)';
      this.ctx.lineWidth = 1.1;
      for (const drop of this.raindrops) {
        this.ctx.beginPath();
        this.ctx.moveTo(drop.x, drop.y);
        this.ctx.lineTo(drop.x - 1, drop.y + drop.length);
        this.ctx.stroke();
      }
    } else if (s.clima.tipo === 'viento_hojarasca') {
      for (const leaf of this.leaves) {
        this.ctx.save();
        this.ctx.translate(leaf.x, leaf.y);
        this.ctx.rotate(leaf.rot);
        this.ctx.fillStyle = leaf.color;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, leaf.size, leaf.size * 0.55, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    this.ctx.restore();
  }

  drawGroundBerries() {
    this.ctx.save();
    for (const b of this.groundBerries) {
      this.ctx.fillStyle = '#39123D';
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Brillo
      this.ctx.fillStyle = '#c084fc';
      this.ctx.beginPath();
      this.ctx.arc(b.x - 1.5, b.y - 1.5, 1.6, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  drawCentralBush() {
    this.ctx.save();
    const cx = this.width / 2;
    const cy = this.height * 0.44;

    this.ctx.translate(cx, cy);
    this.ctx.scale(this.bushScale, this.bushScale);

    // Sombra del arbusto
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 75, 75, 22, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Hojas del arbusto de maqui
    const leafColors = ['#1a4329', '#275836', '#3d784a'];
    const clusterPositions = [
      { x: -35, y: -20, r: 44, color: leafColors[0] },
      { x: 35, y: -15, r: 46, color: leafColors[0] },
      { x: 0, y: -45, r: 50, color: leafColors[1] },
      { x: -22, y: 15, r: 47, color: leafColors[1] },
      { x: 25, y: 18, r: 48, color: leafColors[2] },
      { x: 0, y: 0, r: 54, color: leafColors[2] }
    ];

    for (const c of clusterPositions) {
      this.ctx.fillStyle = c.color;
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Racimos de Maquis maduros
    const berryClusters = [
      { x: -25, y: -15 }, { x: 22, y: -25 }, { x: -10, y: 15 },
      { x: 30, y: 10 }, { x: -40, y: 5 }, { x: 5, y: -35 }, { x: 0, y: 35 }
    ];

    for (const b of berryClusters) {
      this.ctx.fillStyle = '#39123D';
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, 6.5, 0, Math.PI * 2);
      this.ctx.arc(b.x + 5, b.y + 4, 6, 0, Math.PI * 2);
      this.ctx.arc(b.x - 4, b.y + 5, 5.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Brillo
      this.ctx.fillStyle = '#d8b4fe';
      this.ctx.beginPath();
      this.ctx.arc(b.x - 1.5, b.y - 1.5, 2, 0, Math.PI * 2);
      this.ctx.arc(b.x + 3.5, b.y + 2.5, 1.6, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  drawPudus() {
    for (const p of this.pudusVisuales) {
      this.ctx.save();
      const bounce = Math.sin(p.bounceTimer) * 2;
      this.ctx.translate(p.x, p.y + bounce);
      this.ctx.scale(p.direction, 1);

      // Sombra
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      this.ctx.beginPath();
      this.ctx.ellipse(0, 16, 15, 5, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Si está siendo acariciado, salto de alegría
      if (p.isPetting) {
        this.ctx.translate(0, -4);
      }

      // Cuerpo rechoncho del pudú
      this.ctx.fillStyle = '#7a3e26';
      this.ctx.beginPath();
      this.ctx.ellipse(0, 4, 15, 10, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Patitas
      this.ctx.fillStyle = '#542817';
      this.ctx.fillRect(-8, 10, 3.5, 7);
      this.ctx.fillRect(5, 10, 3.5, 7);

      // Cabeza
      this.ctx.fillStyle = '#8a472c';
      this.ctx.beginPath();
      this.ctx.arc(10, -3, 8.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Orejita
      this.ctx.fillStyle = '#612d19';
      this.ctx.beginPath();
      this.ctx.ellipse(7, -11, 4, 2.5, -0.4, 0, Math.PI * 2);
      this.ctx.fill();

      // Mejilla sonrojada si es regalón
      if (p.isPetting) {
        this.ctx.fillStyle = 'rgba(244, 63, 94, 0.55)';
        this.ctx.beginPath();
        this.ctx.arc(9, 0, 2.8, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Ojito tierno
      this.ctx.fillStyle = '#1c0f0a';
      this.ctx.beginPath();
      this.ctx.arc(12, -4, 2, 0, Math.PI * 2);
      this.ctx.fill();

      // Brillo en el ojo
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(12.6, -4.6, 0.8, 0, Math.PI * 2);
      this.ctx.fill();

      // Hocico
      this.ctx.fillStyle = '#22110c';
      this.ctx.beginPath();
      this.ctx.arc(17.5, -2, 2.2, 0, Math.PI * 2);
      this.ctx.fill();

      // Sombrerito / Accesorio
      if (p.hat) {
        this.ctx.font = '11px sans-serif';
        this.ctx.fillText(p.hat, 6, -12);
      }

      this.ctx.restore();
    }
  }

  drawMonitoDelMonte() {
    this.ctx.save();
    const mx = 50;
    const my = 45;

    // Ramita
    this.ctx.strokeStyle = '#5c4033';
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 50);
    this.ctx.lineTo(85, 42);
    this.ctx.stroke();

    // Monito del monte
    this.ctx.fillStyle = '#8d6e63';
    this.ctx.beginPath();
    this.ctx.arc(mx, my, 8, 0, Math.PI * 2);
    this.ctx.fill();

    // Ojos negros grandes
    this.ctx.fillStyle = '#212121';
    this.ctx.beginPath();
    this.ctx.arc(mx + 4, my - 2, 2.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Colita prensil
    this.ctx.strokeStyle = '#8d6e63';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(mx - 8, my + 4, 6, 0, Math.PI);
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawChucao() {
    const ch = this.state.data.chucao;
    if (!ch.activo) return;

    this.ctx.save();
    this.ctx.translate(ch.x, ch.y);
    this.ctx.scale(ch.direccion, 1);

    // Cuerpo
    this.ctx.fillStyle = '#3a3430';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Pecho rufo
    this.ctx.fillStyle = '#cf5723';
    this.ctx.beginPath();
    this.ctx.arc(4, 2, 7, 0, Math.PI * 2);
    this.ctx.fill();

    // Colita levantada hacia arriba
    this.ctx.fillStyle = '#2c2522';
    this.ctx.beginPath();
    this.ctx.moveTo(-7, -2);
    this.ctx.lineTo(-15, -12);
    this.ctx.lineTo(-9, -4);
    this.ctx.fill();

    // Ojo y pico
    this.ctx.fillStyle = '#111';
    this.ctx.beginPath();
    this.ctx.arc(6, -2, 1.6, 0, Math.PI * 2);
    this.ctx.fill();

    // Halo dorado
    this.ctx.strokeStyle = '#fcd34d';
    this.ctx.lineWidth = 2.2;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 15, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawParticlesAndTexts() {
    this.ctx.save();

    // Partículas de bayas
    for (const p of this.clickParticles) {
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Textos flotantes
    for (const ft of this.floatingTexts) {
      this.ctx.globalAlpha = ft.alpha;
      this.ctx.fillStyle = ft.color;
      this.ctx.font = `bold ${ft.size}px 'Nunito', sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
    }

    this.ctx.restore();
  }
}

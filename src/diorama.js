/**
 * Diorama Visual Interactivo en HTML5 Canvas
 * Renderiza el claro del bosque, el arbusto de maqui, los pudús trotando y los efectos de clima.
 */

export class ForestDiorama {
  constructor(canvasElement, state, sound) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.state = state;
    this.sound = sound;

    this.width = canvasElement.width = canvasElement.offsetWidth;
    this.height = canvasElement.height = canvasElement.offsetHeight;

    // Partículas de lluvia
    this.raindrops = [];
    this.initRain();

    // Partículas de bayas y efectos flotantes
    this.particles = [];

    // Pudús animados en el suelo del bosque
    this.pudusVisuales = [];
    this.initPudus();

    // Animación de rebote del arbusto central
    this.bushScale = 1;
    this.bushVelocity = 0;

    // Redimensionado responsivo
    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    this.width = this.canvas.width = this.canvas.offsetWidth;
    this.height = this.canvas.height = this.canvas.offsetHeight;
    this.initRain();
  }

  initRain() {
    this.raindrops = [];
    const count = Math.floor(this.width / 16);
    for (let i = 0; i < count; i++) {
      this.raindrops.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        speed: 4 + Math.random() * 4,
        length: 8 + Math.random() * 10,
        alpha: 0.15 + Math.random() * 0.25
      });
    }
  }

  initPudus() {
    this.pudusVisuales = [];
    const count = Math.min(6, Math.max(1, this.state.data.pudus.length));
    for (let i = 0; i < count; i++) {
      this.pudusVisuales.push({
        x: 40 + Math.random() * (this.width - 80),
        y: this.height - 45 - Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.6,
        bounceTimer: Math.random() * 10,
        direction: Math.random() > 0.5 ? 1 : -1,
        hat: this.state.data.pudus[i]?.sombrero || "🍂"
      });
    }
  }

  // Trigger de click en el arbusto
  triggerBushClick(e) {
    this.bushScale = 0.88; // Rebote elástico
    this.sound.playBerryPop();

    // Crear partículas de bayas que brotan
    const rect = this.canvas.getBoundingClientRect();
    const clickX = e ? e.clientX - rect.left : this.width / 2;
    const clickY = e ? e.clientY - rect.top : this.height * 0.45;

    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: clickX + (Math.random() - 0.5) * 40,
        y: clickY + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 3,
        vy: -2.5 - Math.random() * 3,
        size: 5 + Math.random() * 3,
        alpha: 1,
        color: '#4B134F' // Color intenso maqui
      });
    }
  }

  update(dt) {
    // Sincronizar pudús si se unieron nuevos
    if (this.pudusVisuales.length !== Math.min(6, this.state.data.pudus.length)) {
      this.initPudus();
    }

    // Física de rebote del arbusto
    const k = 0.2; // Rigidez del resorte
    const damping = 0.82;
    const displacement = 1 - this.bushScale;
    this.bushVelocity += displacement * k;
    this.bushVelocity *= damping;
    this.bushScale += this.bushVelocity;

    // Actualizar lluvia
    for (const drop of this.raindrops) {
      drop.y += drop.speed;
      if (drop.y > this.height) {
        drop.y = -10;
        drop.x = Math.random() * this.width;
      }
    }

    // Actualizar partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // Gravedad
      p.alpha -= 0.025;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Actualizar pudús
    for (const pudu of this.pudusVisuales) {
      pudu.x += pudu.vx;
      pudu.bounceTimer += dt * 4;

      // Límites de pantalla
      if (pudu.x < 30) {
        pudu.x = 30;
        pudu.vx = Math.abs(pudu.vx);
        pudu.direction = 1;
      } else if (pudu.x > this.width - 50) {
        pudu.x = this.width - 50;
        pudu.vx = -Math.abs(pudu.vx);
        pudu.direction = -1;
      }

      // Cambiar de rumbo ocasionalmente
      if (Math.random() < 0.005) {
        pudu.vx = (Math.random() - 0.5) * 0.7;
        pudu.direction = pudu.vx >= 0 ? 1 : -1;
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Cielo y atmósfera boscosa (degradado suave)
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    skyGrad.addColorStop(0, '#1b3323'); // Verde profundo húmedo
    skyGrad.addColorStop(0.6, '#284633');
    skyGrad.addColorStop(1, '#34523a');
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 2. Siluetas de árboles y helechos de fondo
    this.drawFoliageBackground();

    // 3. Suelo del bosque (tierra con musgo y hojas caídas)
    this.drawGround();

    // 4. Lluvia suave
    this.drawRain();

    // 5. El Arbusto Central de Maqui
    this.drawCentralBush();

    // 6. Pudús caminando en el refugio
    this.drawPudus();

    // 7. Chucao volando si está activo
    this.drawChucao();

    // 8. Partículas de bayas
    this.drawParticles();
  }

  drawFoliageBackground() {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(15, 35, 20, 0.45)';
    // Troncos y ramas distantes
    for (let x = 30; x < this.width; x += 110) {
      this.ctx.fillRect(x, 0, 24, this.height * 0.75);
    }
    // Niebla / humedad suave
    const mistGrad = this.ctx.createLinearGradient(0, this.height * 0.3, 0, this.height * 0.7);
    mistGrad.addColorStop(0, 'rgba(210, 230, 220, 0.08)');
    mistGrad.addColorStop(1, 'rgba(210, 230, 220, 0.02)');
    this.ctx.fillStyle = mistGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  }

  drawGround() {
    this.ctx.save();
    // Capa de tierra con musgo
    this.ctx.fillStyle = '#213a24';
    this.ctx.beginPath();
    this.ctx.ellipse(this.width / 2, this.height + 20, this.width * 0.65, 80, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Borde de musgo luminoso
    this.ctx.strokeStyle = '#437042';
    this.ctx.lineWidth = 4;
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawRain() {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(200, 230, 240, 0.4)';
    this.ctx.lineWidth = 1.2;
    for (const drop of this.raindrops) {
      this.ctx.beginPath();
      this.ctx.moveTo(drop.x, drop.y);
      this.ctx.lineTo(drop.x - 1, drop.y + drop.length);
      this.ctx.stroke();
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
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 75, 70, 20, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Follaje del arbusto de maqui (3 capas de hojas redondeadas)
    const leafColors = ['#1a4329', '#275836', '#3d784a'];
    const clusterPositions = [
      { x: -35, y: -20, r: 42, color: leafColors[0] },
      { x: 35, y: -15, r: 44, color: leafColors[0] },
      { x: 0, y: -45, r: 48, color: leafColors[1] },
      { x: -20, y: 15, r: 45, color: leafColors[1] },
      { x: 25, y: 18, r: 46, color: leafColors[2] },
      { x: 0, y: 0, r: 52, color: leafColors[2] }
    ];

    for (const c of clusterPositions) {
      this.ctx.fillStyle = c.color;
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Racimos de Maqui maduros (morado oscuro brillante)
    const berryClusters = [
      { x: -25, y: -15 }, { x: 20, y: -25 }, { x: -10, y: 15 },
      { x: 30, y: 10 }, { x: -40, y: 5 }, { x: 5, y: -35 }, { x: 0, y: 35 }
    ];

    for (const b of berryClusters) {
      // Dibuja un pequeño racimo de 3-4 bayas
      this.ctx.fillStyle = '#39123D'; // Púrpura profundo maqui
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
      this.ctx.arc(b.x + 5, b.y + 4, 5.5, 0, Math.PI * 2);
      this.ctx.arc(b.x - 4, b.y + 5, 5, 0, Math.PI * 2);
      this.ctx.fill();

      // Brillo en las bayas
      this.ctx.fillStyle = '#B45BB8';
      this.ctx.beginPath();
      this.ctx.arc(b.x - 1.5, b.y - 1.5, 1.8, 0, Math.PI * 2);
      this.ctx.arc(b.x + 3.5, b.y + 2.5, 1.5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  // Dibuja a los pequeños pudús trotando
  drawPudus() {
    for (const p of this.pudusVisuales) {
      this.ctx.save();
      const bounce = Math.sin(p.bounceTimer) * 2;
      this.ctx.translate(p.x, p.y + bounce);
      this.ctx.scale(p.direction, 1);

      // Sombra pequeña
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      this.ctx.beginPath();
      this.ctx.ellipse(0, 16, 14, 5, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Cuerpo rechoncho del pudú (marrón rojizo sureño)
      this.ctx.fillStyle = '#7a3e26';
      this.ctx.beginPath();
      this.ctx.ellipse(0, 4, 15, 10, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Patitas cortas
      this.ctx.fillStyle = '#542817';
      this.ctx.fillRect(-8, 10, 3.5, 7);
      this.ctx.fillRect(5, 10, 3.5, 7);

      // Cabeza pequeña y tierna
      this.ctx.fillStyle = '#8a472c';
      this.ctx.beginPath();
      this.ctx.arc(10, -3, 8.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Orejas redondeadas
      this.ctx.fillStyle = '#612d19';
      this.ctx.beginPath();
      this.ctx.ellipse(7, -11, 4, 2.5, -0.4, 0, Math.PI * 2);
      this.ctx.fill();

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

      // Hocico negro
      this.ctx.fillStyle = '#22110c';
      this.ctx.beginPath();
      this.ctx.arc(17.5, -2, 2.2, 0, Math.PI * 2);
      this.ctx.fill();

      // Detalle: Sombrerito u hoja sobre la cabeza
      if (p.hat) {
        this.ctx.font = '11px sans-serif';
        this.ctx.fillText(p.hat, 6, -12);
      }

      this.ctx.restore();
    }
  }

  // Dibuja el Chucao curioso volando
  drawChucao() {
    const ch = this.state.data.chucao;
    if (!ch.activo) return;

    this.ctx.save();
    this.ctx.translate(ch.x, ch.y);
    this.ctx.scale(ch.direccion, 1);

    // Cuerpo del Chucao (pecho rufo/anaranjado característico)
    this.ctx.fillStyle = '#3a3430'; // Espalda parda
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 9, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#cf5723'; // Pecho anaranjado rufo
    this.ctx.beginPath();
    this.ctx.arc(4, 2, 6.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Colita levantada hacia arriba típica del chucao
    this.ctx.fillStyle = '#2c2522';
    this.ctx.beginPath();
    this.ctx.moveTo(-7, -2);
    this.ctx.lineTo(-15, -12);
    this.ctx.lineTo(-9, -4);
    this.ctx.fill();

    // Ojo y pico
    this.ctx.fillStyle = '#111';
    this.ctx.beginPath();
    this.ctx.arc(6, -2, 1.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Brillo dorado que indica bono
    this.ctx.strokeStyle = '#fcd34d';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 14, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawParticles() {
    this.ctx.save();
    for (const p of this.particles) {
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }
}

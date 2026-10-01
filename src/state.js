/**
 * Estado global del juego "El Refugio de los Pudús"
 * Maneja los recursos, fases, lista de mejoras, pudús, clima y progreso hacia el Gran Picnic.
 */

export const INITIAL_STATE = {
  // Recursos Principales
  maquis: 0,
  totalMaquis: 0,
  clicksCount: 0,
  maquisPerClick: 1,
  mermeladas: 0,
  totalMermeladas: 0,
  armonia: 1, // Multiplicador general de paz del bosque

  // Ritmo de juego ('calido' = ~75-90 min | 'veloz' = ~45-60 min)
  ritmo: 'calido',

  // Fases narrativas (1: El Encuentro, 2: La Manada, 3: Amigos del Bosque, 4: El Taller, 5: El Gran Picnic)
  fase: 1,
  confianzaPudu: 0, // 0 a 100 para amigar al primer pudú
  puduAmigado: false,

  // Sistema de Clima Dinámico del Sur
  clima: {
    tipo: 'lluvia_suave', // 'lluvia_suave' | 'viento_hojarasca' | 'arcoiris_sol'
    nombre: 'Lluvia Sureña Suave',
    icono: '🌧️',
    segundosRestantes: 60,
    multiplicador: 1
  },

  // Evento activo de Chucao (Golden Bird)
  chucao: {
    activo: false,
    x: 0,
    y: 0,
    direccion: 1,
    multiplicadorSuerte: 1,
    segundosRestantesSuerte: 0
  },

  // Sistema de Caricias a Pudús (Petting)
  caricias: {
    contadorTotal: 0,
    segundosBonoCaricia: 0,
    multiplicadorCaricia: 1
  },

  // Temporizadores y estadísticas
  tiempoJugadoSegundos: 0,
  ultimoGuardado: Date.now(),
  picnicCelebrado: false,

  // Edificios / Productores pasivos del refugio
  productores: {
    broteMaqui: {
      id: "broteMaqui",
      nombre: "Brote de Maqui",
      desc: "Un pequeño arbusto plantado con cariño que florece y da bayas solas.",
      costoBase: 12,
      factorCosto: 1.14,
      produccionBase: 0.8,
      cantidad: 0,
      icono: "🌱"
    },
    camitaMusgo: {
      id: "camitaMusgo",
      nombre: "Camita de Musgo",
      desc: "Un nido tibio bajo un helecho. Atrae a un nuevo pudú habitante al refugio.",
      costoBase: 80,
      factorCosto: 1.14,
      produccionBase: 3.5,
      cantidad: 0,
      icono: "🛏️"
    },
    canastoMimbre: {
      id: "canastoMimbre",
      nombre: "Canasto de Mimbre",
      desc: "Tejido artesanal tradicional para acopiar cosechas sin aplastar las bayas.",
      costoBase: 420,
      factorCosto: 1.14,
      produccionBase: 15,
      cantidad: 0,
      icono: "🧺"
    },
    monitoMonte: {
      id: "monitoMonte",
      nombre: "Monito del Monte",
      desc: "Un simpático marsupial que trepa a las copas y sacude bayas maduras.",
      costoBase: 1800,
      factorCosto: 1.15,
      produccionBase: 50,
      cantidad: 0,
      icono: "🐾"
    },
    canaletaDeshielo: {
      id: "canaletaDeshielo",
      nombre: "Acequia de Deshielo",
      desc: "Agua pura y cristalina de la cordillera que riega y nutre el bosque.",
      costoBase: 7200,
      factorCosto: 1.15,
      produccionBase: 180,
      cantidad: 0,
      icono: "💧"
    },
    ollaGreda: {
      id: "ollaGreda",
      nombre: "Olla de Greda",
      desc: "Cocinilla rústica a leña donde los pudús preparan ricas mermeladas.",
      costoBase: 26000,
      factorCosto: 1.15,
      produccionBase: 620,
      cantidad: 0,
      icono: "🏺"
    },
    maquiAncestral: {
      id: "maquiAncestral",
      nombre: "Maqui Centenario",
      desc: "Un árbol colosal y místico cuya copa siempre rebosa de racimos morados.",
      costoBase: 95000,
      factorCosto: 1.16,
      produccionBase: 2100,
      cantidad: 0,
      icono: "🌳"
    }
  },

  // Mejoras tecnológicas únicas
  mejoras: {
    cucharaAlerce: {
      id: "cucharaAlerce",
      nombre: "Cuchara de Alerce",
      desc: "Tallada a mano. +2 maquis por cada click manual.",
      costo: 35,
      comprada: false,
      efecto: (s) => { s.maquisPerClick += 2; },
      desbloqueada: true,
      icono: "🥄"
    },
    zapatosMusgo: {
      id: "zapatosMusgo",
      nombre: "Zapatitos de Musgo",
      desc: "Los pudús caminan silenciosos y cosechan un 30% más rápido.",
      costo: 180,
      comprada: false,
      efecto: (s) => { s.armonia *= 1.3; },
      desbloqueada: false,
      icono: "🌿"
    },
    bufandasChilotas: {
      id: "bufandasChilotas",
      nombre: "Bufandas de Lana Chilota",
      desc: "Abrigan a la manada contra la lluvia austral. +40% de producción total.",
      costo: 950,
      comprada: false,
      efecto: (s) => { s.armonia *= 1.4; },
      desbloqueada: false,
      icono: "🧣"
    },
    teCanelo: {
      id: "teCanelo",
      nombre: "Infusión de Canelo Sagrado",
      desc: "Té revitalizante. Los clicks obtienen un 4% de la producción pasiva por segundo.",
      costo: 3600,
      comprada: false,
      efecto: () => {},
      desbloqueada: false,
      icono: "🍵"
    },
    recetaMermelada: {
      id: "recetaMermelada",
      nombre: "Receta Tradicional de Mermelada",
      desc: "Permite elaborar frascos de mermelada en el taller con multiplicador permanente.",
      costo: 8500,
      comprada: false,
      efecto: () => {},
      desbloqueada: false,
      icono: "🍯"
    },
    coronaCopihues: {
      id: "coronaCopihues",
      nombre: "Corona de Copihues Rojos",
      desc: "La flor nacional bendice el claro. Duplica toda la cosecha del bosque.",
      costo: 32000,
      comprada: false,
      efecto: (s) => { s.armonia *= 2.0; },
      desbloqueada: false,
      icono: "🌺"
    },
    cantoChucaoArmonico: {
      id: "cantoChucaoArmonico",
      nombre: "Trino de Buena Ventura",
      desc: "El Chucao visita el refugio más seguido y su bono de suerte dura 45 segundos.",
      costo: 16000,
      comprada: false,
      efecto: () => {},
      desbloqueada: false,
      icono: "🎶"
    }
  },

  // Pudús residentes en el refugio
  pudus: [
    { id: "pudu_1", nombre: "Pichi", rol: "El primer explorador", humor: "Feliz y curioso", sombrero: "🍂" }
  ],

  // Lista de nombres disponibles para los pudús que se van uniendo
  nombresDisponibles: [
    { nombre: "Pewén", rol: "Recolector de hojas tiernas", sombrero: "🍁" },
    { nombre: "Rayén", rol: "Cuidaperlas del bosque", sombrero: "🌸" },
    { nombre: "Antu", rol: "Vigía de los rayos de sol", sombrero: "☀️" },
    { nombre: "Millaray", rol: "Degustadora de mermeladas", sombrero: "🎀" },
    { nombre: "Kutral", rol: "Guardián de la leña seca", sombrero: "🔥" },
    { nombre: "Lafkén", rol: "Explorador de orillas de arroyo", sombrero: "🌊" },
    { nombre: "Nahuel", rol: "Dormilón bajo los helechos", sombrero: "💤" },
    { nombre: "Ailín", rol: "Recolectora de rocío de la mañana", sombrero: "💧" }
  ],

  // Fichas didácticas descubiertas en la Bitácora
  fichasDesbloqueadas: ["pudu", "maqui"],

  // Recuerdos narrativos desbloqueados
  recuerdosDesbloqueados: []
};

export class GameState {
  constructor() {
    this.data = JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  // Costo escalado según fórmula clásica suave
  getCostoProductor(id) {
    const prod = this.data.productores[id];
    if (!prod) return Infinity;
    return Math.floor(prod.costoBase * Math.pow(prod.factorCosto, prod.cantidad));
  }

  // Producción total pasiva por segundo (MPS)
  getMaquisPorSegundo() {
    let totalBase = 0;
    for (const key in this.data.productores) {
      const prod = this.data.productores[key];
      totalBase += prod.cantidad * prod.produccionBase;
    }

    // Sinergia: Camitas de musgo potencian a la manada (+2% por camita)
    const bonoCamitas = 1 + (this.data.productores.camitaMusgo.cantidad * 0.02);

    // Efecto de mermeladas elaboradas (+3% permanente por cada frasco)
    const bonoMermelada = 1 + (this.data.mermeladas * 0.03);

    // Multiplicador del clima actual
    const bonoClima = this.data.clima.multiplicador;

    // Multiplicador de suerte temporal del Chucao
    const bonoChucao = this.data.chucao.multiplicadorSuerte;

    // Multiplicador por caricia a los pudús (+25% temporal)
    const bonoCaricia = this.data.caricias.multiplicadorCaricia;

    // Multiplicador de ritmo
    const bonoRitmo = this.data.ritmo === 'veloz' ? 1.5 : 1.0;

    return totalBase * this.data.armonia * bonoCamitas * bonoMermelada * bonoClima * bonoChucao * bonoCaricia * bonoRitmo;
  }

  // Producción manual por click
  getMaquisPorClick() {
    let porClick = this.data.maquisPerClick;
    
    // Si tiene la infusión de canelo sagrado, los clicks escalan con una fracción del MPS
    if (this.data.mejoras.teCanelo?.comprada) {
      porClick += this.getMaquisPorSegundo() * 0.04;
    }

    const bonoChucao = this.data.chucao.multiplicadorSuerte;
    const bonoClima = this.data.clima.tipo === 'arcoiris_sol' ? 2 : 1;
    const bonoRitmo = this.data.ritmo === 'veloz' ? 1.5 : 1.0;

    return Math.max(1, Math.round(porClick * bonoChucao * bonoClima * bonoRitmo));
  }
}

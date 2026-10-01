/**
 * Estado global del juego "El Refugio de los Pudús"
 * Maneja los recursos, fases, lista de mejoras, pudús y progreso hacia el Gran Picnic.
 */

export const INITIAL_STATE = {
  // Recursos
  maquis: 0,
  totalMaquis: 0,
  clicksCount: 0,
  maquisPerClick: 1,
  mermeladas: 0,
  totalMermeladas: 0,
  armonia: 1, // Multiplicador general

  // Fases narrativas (1: El Encuentro, 2: La Manada, 3: El Taller, 4: El Gran Picnic, 5: Completado)
  fase: 1,
  confianzaPudu: 0, // 0 a 100 para domesticar/amigar al primer pudú
  puduAmigado: false,

  // Evento activo de Chucao (Golden Cookie)
  chucao: {
    activo: false,
    x: 0,
    y: 0,
    direccion: 1,
    multiplicadorSuerte: 1,
    segundosRestantesSuerte: 0
  },

  // Temporizadores y estadísticas
  tiempoJugadoSegundos: 0,
  ultimoGuardado: Date.now(),
  picnicCelebrado: false,

  // Edificios / Productores pasivos
  productores: {
    broteMaqui: {
      id: "broteMaqui",
      nombre: "Brote de Maqui",
      desc: "Un pequeño arbusto plantado con cariño que da bayas solas.",
      costoBase: 15,
      factorCosto: 1.15,
      produccionBase: 0.8,
      cantidad: 0,
      icono: "🌱"
    },
    camitaMusgo: {
      id: "camitaMusgo",
      nombre: "Camita de Musgo",
      desc: "Un nido tibio bajo un helecho. Atrae a un pudú al refugio.",
      costoBase: 100,
      factorCosto: 1.15,
      produccionBase: 4,
      cantidad: 0,
      icono: "🛏️"
    },
    canastoMimbre: {
      id: "canastoMimbre",
      nombre: "Canasto de Mimbre",
      desc: "Tejido artesanal para acopiar más bayas sin que se aplasten.",
      costoBase: 500,
      factorCosto: 1.16,
      produccionBase: 18,
      cantidad: 0,
      icono: "🧺"
    },
    monitoMonte: {
      id: "monitoMonte",
      nombre: "Monito del Monte",
      desc: "Un marsupial dormilón que trepa alto y sacude las ramas de maqui.",
      costoBase: 2400,
      factorCosto: 1.16,
      produccionBase: 65,
      cantidad: 0,
      icono: "🐾"
    },
    canaletaDeshielo: {
      id: "canaletaDeshielo",
      nombre: "Acequia de Deshielo",
      desc: "Agua fresca de la cordillera que mantiene húmedo y fértil el bosque.",
      costoBase: 9500,
      factorCosto: 1.16,
      produccionBase: 240,
      cantidad: 0,
      icono: "💧"
    },
    ollaGreda: {
      id: "ollaGreda",
      nombre: "Olla de Greda",
      desc: "Cocina comunitaria para hervir maquis y destilar su rica esencia.",
      costoBase: 35000,
      factorCosto: 1.17,
      produccionBase: 850,
      cantidad: 0,
      icono: "🏺"
    },
    maquiAncestral: {
      id: "maquiAncestral",
      nombre: "Maqui Centenario",
      desc: "Un árbol místico cuya copa siempre rebosa de racimos morados gigantes.",
      costoBase: 140000,
      factorCosto: 1.17,
      produccionBase: 2600,
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
      costo: 50,
      comprada: false,
      efecto: (s) => { s.maquisPerClick += 2; },
      desbloqueada: true,
      icono: "🥄"
    },
    zapatosMusgo: {
      id: "zapatosMusgo",
      nombre: "Zapatitos de Musgo",
      desc: "Los pudús caminan en silencio y cosechan un 30% más rápido.",
      costo: 250,
      comprada: false,
      efecto: (s) => { s.armonia *= 1.3; },
      desbloqueada: false,
      icono: "🌿"
    },
    bufandasChilotas: {
      id: "bufandasChilotas",
      nombre: "Bufandas de Lana Chilota",
      desc: "Abrigan a la manada contra el frío austral. +40% a toda la producción.",
      costo: 1200,
      comprada: false,
      efecto: (s) => { s.armonia *= 1.4; },
      desbloqueada: false,
      icono: "🧣"
    },
    teCanelo: {
      id: "teCanelo",
      nombre: "Infusión de Hojas Sagradas",
      desc: "Té medicinal de canelo. Los clicks generan 3% de los maquis por segundo.",
      costo: 4500,
      comprada: false,
      efecto: (s) => { /* Calculado dinámicamente en el engine */ },
      desbloqueada: false,
      icono: "🍵"
    },
    recetaMermelada: {
      id: "recetaMermelada",
      nombre: "Receta Secreta de Mermelada",
      desc: "Permite elaborar mermeladas en el taller, multiplicando la armonía.",
      costo: 12000,
      comprada: false,
      efecto: (s) => { /* Habilita crafteo */ },
      desbloqueada: false,
      icono: "🍯"
    },
    coronaCopihues: {
      id: "coronaCopihues",
      nombre: "Corona de Copihues Rojos",
      desc: "La flor nacional bendice el claro. Duplica todo el poder de recolección.",
      costo: 45000,
      comprada: false,
      efecto: (s) => { s.armonia *= 2.0; },
      desbloqueada: false,
      icono: "🌺"
    }
  },

  // Pudús residentes en el refugio
  pudus: [
    { id: "pudu_1", nombre: "Pichi", rol: "El primer explorador", humor: "Feliz y curioso", sombrero: "🍂" }
  ],

  // Lista de nombres para nuevos pudús que se unan
  nombresDisponibles: [
    { nombre: "Pewén", rol: "Recolector de hojas tiernas", sombrero: "🍁" },
    { nombre: "Rayén", rol: "Cuidaperlas del bosque", sombrero: "🌸" },
    { nombre: "Antu", rol: "Vigía de los rayos de sol", sombrero: "☀️" },
    { nombre: "Millaray", rol: "Degustadora de mermeladas", sombrero: "🎀" },
    { nombre: "Kutral", rol: "Guardián del fuego tibio", sombrero: "🔥" },
    { nombre: "Lafkén", rol: "Paseador de orillas de arroyo", sombrero: "🌊" },
    { nombre: "Nahuel", rol: "Dormilón bajo los arrayanes", sombrero: "💤" }
  ],

  // Recuerdos desbloqueados
  recuerdosDesbloqueados: []
};

export class GameState {
  constructor() {
    this.data = JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  // Costo escalado según fórmula clásica de incrementales
  getCostoProductor(id) {
    const prod = this.data.productores[id];
    if (!prod) return Infinity;
    return Math.floor(prod.costoBase * Math.pow(prod.factorCosto, prod.cantidad));
  }

  // Producción total pasiva por segundo
  getMaquisPorSegundo() {
    let totalBase = 0;
    for (const key in this.data.productores) {
      const prod = this.data.productores[key];
      totalBase += prod.cantidad * prod.produccionBase;
    }

    // Efecto de mermeladas (cada frasco da un +2% permanente)
    const bonoMermelada = 1 + (this.data.mermeladas * 0.02);

    // Multiplicador de suerte temporal del Chucao
    const bonoChucao = this.data.chucao.multiplicadorSuerte;

    return totalBase * this.data.armonia * bonoMermelada * bonoChucao;
  }

  // Producción por click
  getMaquisPorClick() {
    let porClick = this.data.maquisPerClick;
    // Si tiene la infusión de canelo, los clicks escalan con una fracción del ingreso pasivo
    if (this.data.mejoras.teCanelo?.comprada) {
      porClick += this.getMaquisPorSegundo() * 0.04;
    }
    const bonoChucao = this.data.chucao.multiplicadorSuerte;
    return Math.max(1, Math.round(porClick * bonoChucao));
  }
}

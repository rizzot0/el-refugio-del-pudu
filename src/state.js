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

  // Evento activo de Baya Dorada Flotante (Golden Berry Event)
  bayaDorada: {
    activa: false,
    x: 0,
    y: 0,
    vy: 0.55,
    recolectada: false
  },

  // Ranita de Darwin en el Arroyo
  ranitaDarwin: {
    activa: true,
    x: 36,
    y: 196,
    saltos: 0,
    croakTimer: 0,
    segundosBuffAgua: 0
  },

  // Sistema de Cocina Tradicional en la Olla de Greda
  cocina: {
    enCoccion: false,
    tiempoRestante: 0,
    tiempoTotal: 20,
    recetaActual: null,
    recetas: {
      mermelada_clasica: {
        id: "mermelada_clasica",
        nombre: "Mermelada de Maqui Austral",
        costoMaquis: 500,
        tiempoSegundos: 15,
        icono: "🍯",
        desc: "Cocción lenta con leña seca en olla de greda. Otorga +1 frasco y +4% permanente a la Armonía.",
        desbloqueada: true
      },
      kuchen_maqui: {
        id: "kuchen_maqui",
        nombre: "Kuchen Sureño de Maqui",
        costoMaquis: 2200,
        tiempoSegundos: 25,
        icono: "🥧",
        desc: "Masa crujiente y bayas seleccionadas. Otorga x2 producción general por 90 segundos.",
        desbloqueada: false
      },
      infusion_canelo: {
        id: "infusion_canelo",
        nombre: "Infusión de Canelo y Miel",
        costoMaquis: 1200,
        tiempoSegundos: 20,
        icono: "🍵",
        desc: "Té revitalizante. Triplica el poder de las caricias y hace saltar de alegría a los pudús.",
        desbloqueada: false
      }
    }
  },

  // Buffs temporales de cocina
  buffCocina: {
    multiplicador: 1,
    segundosRestantes: 0
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
    { id: "pudu_1", nombre: "Pichi", tipo: "adult", rol: "El primer explorador", humor: "Curioso y regalón", sombrero: "leaf" },
    { id: "pudu_miku", nombre: "Miku-Pudú", tipo: "miku", rol: "Diva vocalista del bosque", humor: "Alegre y cantarina", sombrero: "miku" },
    { id: "pudu_teto", nombre: "Teto-Pudú", tipo: "teto", rol: "Quimera de los taladros rojos", humor: "Entusiasta y fan del pan", sombrero: "teto" },
    { id: "pudu_mizuki", nombre: "Mizuki-Pudú", tipo: "mizuki", rol: "Creadora de videos de 25-ji", humor: "Libre, estilosa y tierna", sombrero: "mizuki" }
  ],

  // Lista de nombres disponibles para los pudús y cervatillos que se van uniendo
  nombresDisponibles: [
    { nombre: "Colo-Colo", tipo: "adult", rol: "Explorador de colinas altas", sombrero: "leaf" },
    { nombre: "Pewencito", tipo: "fawn", rol: "Cervatillo juguetón", sombrero: "dewdrop" },
    { nombre: "Rayén", tipo: "adult", rol: "Cuidaperlas del bosque", sombrero: "copihue" },
    { nombre: "Antu", tipo: "adult", rol: "Vigía de los rayos de sol", sombrero: "chupalla" },
    { nombre: "Millaray", tipo: "adult", rol: "Cocinera de mermeladas", sombrero: "crown" },
    { nombre: "Kutral", tipo: "adult", rol: "Guardián de la leña seca", sombrero: "scarf" },
    { nombre: "Lafkén", tipo: "adult", rol: "Bebedor de arroyo cristalino", sombrero: "leaf" },
    { nombre: "Nahuel", tipo: "adult", rol: "Dormilón bajo los helechos", sombrero: "dewdrop" },
    { nombre: "Ailín", tipo: "fawn", rol: "Cervatillo cazamariposas", sombrero: "copihue" }
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

    // Sinergia: Camitas de musgo potencian a la manada (+2.5% por camita)
    const bonoCamitas = 1 + (this.data.productores.camitaMusgo.cantidad * 0.025);

    // Efecto de mermeladas elaboradas (+4% permanente por cada frasco)
    const bonoMermelada = 1 + (this.data.mermeladas * 0.04);

    // Multiplicador del clima actual
    const bonoClima = this.data.clima.multiplicador;

    // Multiplicador de suerte temporal del Chucao
    const bonoChucao = this.data.chucao.multiplicadorSuerte;

    // Multiplicador por caricia a los pudús (+35% temporal)
    const bonoCaricia = this.data.caricias.multiplicadorCaricia;

    // Buff temporal de cocina (Kuchen u otros)
    const bonoBuffCocina = this.data.buffCocina.multiplicador;

    // Buff de agua de la Ranita de Darwin (+30% a acequias y producción)
    const bonoRanita = this.data.ranitaDarwin.segundosBuffAgua > 0 ? 1.3 : 1.0;

    // Multiplicador de ritmo
    const bonoRitmo = this.data.ritmo === 'veloz' ? 1.5 : 1.0;

    return totalBase * this.data.armonia * bonoCamitas * bonoMermelada * bonoClima * bonoChucao * bonoCaricia * bonoBuffCocina * bonoRanita * bonoRitmo;
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
    const bonoCaricia = this.data.caricias.multiplicadorCaricia > 1 ? 1.25 : 1.0;
    const bonoRitmo = this.data.ritmo === 'veloz' ? 1.5 : 1.0;

    return Math.max(1, Math.round(porClick * bonoChucao * bonoClima * bonoCaricia * bonoRitmo));
  }

  // Iniciar cocción de receta en la olla de greda
  iniciarCoccion(recetaId) {
    const c = this.data.cocina;
    const rec = c.recetas[recetaId];
    if (!rec || c.enCoccion) return false;

    if (this.data.maquis >= rec.costoMaquis) {
      this.data.maquis -= rec.costoMaquis;
      c.enCoccion = true;
      c.recetaActual = recetaId;
      c.tiempoTotal = rec.tiempoSegundos;
      c.tiempoRestante = rec.tiempoSegundos;
      return true;
    }
    return false;
  }

  // Actualizar cocción con delta time
  tickCoccion(dt) {
    const c = this.data.cocina;
    if (!c.enCoccion) return null;

    c.tiempoRestante -= dt;
    if (c.tiempoRestante <= 0) {
      c.enCoccion = false;
      const recId = c.recetaActual;
      c.recetaActual = null;
      c.tiempoRestante = 0;

      // Aplicar recompensas de la receta
      if (recId === 'mermelada_clasica') {
        this.data.mermeladas += 1;
        this.data.totalMermeladas += 1;
        this.data.armonia += 0.04; // +4% permanente
        // Desbloquear nuevas recetas al acumular mermeladas
        if (this.data.mermeladas >= 2) c.recetas.kuchen_maqui.desbloqueada = true;
        if (this.data.mermeladas >= 4) c.recetas.infusion_canelo.desbloqueada = true;
        return { tipo: 'mermelada', nombre: 'Mermelada de Maqui', bono: '+1 Frasco (+4% Armonía permanente)' };
      } else if (recId === 'kuchen_maqui') {
        this.data.buffCocina.multiplicador = 2.0;
        this.data.buffCocina.segundosRestantes = 90;
        return { tipo: 'buff', nombre: 'Kuchen de Maqui', bono: 'x2 Producción total por 90s' };
      } else if (recId === 'infusion_canelo') {
        this.data.caricias.segundosBonoCaricia = 45;
        this.data.caricias.multiplicadorCaricia = 2.0;
        return { tipo: 'canelo', nombre: 'Infusión de Canelo', bono: 'x2 Buff de Caricias y alegría pura por 45s' };
      }
    }
    return null;
  }
}

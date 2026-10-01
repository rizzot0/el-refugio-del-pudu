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

  // Sistema de Golpes Críticos de Cosecha
  probabilidadCritico: 0,
  multiplicadorCritico: 5,

  // Árbol de Habilidades: "Raíces de la Armonía" (3 Ramas Estratégicas)
  arbolHabilidades: {
    // === RAMA 1: SENDA DEL RECOLECTOR (Clicks & Microeventos Activos) ===
    // === NODO RAÍZ CENTRAL (Semilla del Canelo) ===
    semillaCanelo: {
      id: "semillaCanelo",
      nombre: "Semilla del Canelo",
      rama: "centro",
      tier: 0,
      costo: 0,
      icono: "🌰",
      desc: "El árbol sagrado del pueblo mapuche y corazón espiritual del claro.",
      prerrequisitos: [],
      desbloqueada: true,
      comprada: true,
      efecto: () => {}
    },

    // === RAMA 1: SENDA DEL RECOLECTOR (Clicks & Microeventos Activos) ===
    cucharaAlerce: {
      id: "cucharaAlerce",
      nombre: "Cuchara de Alerce",
      rama: "recolector",
      tier: 1,
      costo: 35,
      icono: "🥄",
      desc: "Tallada a mano. +2 maquis directos por cada click manual en el arbusto.",
      prerrequisitos: ["semillaCanelo"],
      desbloqueada: true,
      comprada: false,
      efecto: (s) => { s.maquisPerClick += 2; }
    },
    brotesRapidos: {
      id: "brotesRapidos",
      nombre: "Brotes Rápidos",
      rama: "recolector",
      tier: 2,
      costo: 90,
      icono: "🌱",
      desc: "Cosecha ágil: +1 maqui base adicional en cada clic manual.",
      prerrequisitos: ["cucharaAlerce"],
      desbloqueada: false,
      comprada: false,
      efecto: (s) => { s.maquisPerClick += 1; }
    },
    cosechaCertera: {
      id: "cosechaCertera",
      nombre: "Cosecha Certera",
      rama: "recolector",
      tier: 2,
      costo: 180,
      icono: "🎯",
      desc: "Ojo experto para bayas maduras. 18% de probabilidad de Golpe Crítico (x5 maquis) al hacer click.",
      prerrequisitos: ["cucharaAlerce"],
      desbloqueada: false,
      comprada: false,
      efecto: (s) => { s.probabilidadCritico = 0.18; s.multiplicadorCritico = 5; }
    },
    punteriaAustral: {
      id: "punteriaAustral",
      nombre: "Puntería Austral",
      rama: "recolector",
      tier: 3,
      costo: 420,
      icono: "✨",
      desc: "Precisión en los arbustos: +3% de probabilidad adicional de Golpe Crítico.",
      prerrequisitos: ["cosechaCertera"],
      desbloqueada: false,
      comprada: false,
      efecto: (s) => { s.probabilidadCritico += 0.03; }
    },
    oidoChucao: {
      id: "oidoChucao",
      nombre: "Trino del Chucao",
      rama: "recolector",
      tier: 2,
      costo: 320,
      icono: "🎶",
      desc: "Atento al monte. El Chucao y la Baya Dorada aparecen un 30% más seguido y la suerte dura 45s.",
      prerrequisitos: ["cucharaAlerce"],
      desbloqueada: false,
      comprada: false,
      efecto: (s) => { s.armonia *= 1.15; }
    },
    suerteProlongada: {
      id: "suerteProlongada",
      nombre: "Suerte Prolongada",
      rama: "recolector",
      tier: 3,
      costo: 600,
      icono: "⏳",
      desc: "El canto de buena fortuna del Chucao dura 15 segundos adicionales.",
      prerrequisitos: ["oidoChucao"],
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    teCanelo: {
      id: "teCanelo",
      nombre: "Infusión de Canelo",
      rama: "recolector",
      tier: 3,
      costo: 1800,
      icono: "🍵",
      desc: "Té místico. Los clicks absorben un 4% de la producción pasiva por segundo, y acariciar otorga 25 maquis directos.",
      prerrequisitos: ["cosechaCertera", "oidoChucao"],
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    lluviaPrimavera: {
      id: "lluviaPrimavera",
      nombre: "Lluvia de Primavera",
      rama: "recolector",
      tier: 4,
      costo: 6500,
      icono: "⭐",
      desc: "Maestría recolectora. Eleva la probabilidad de crítico a 30% y otorga +35% de producción global.",
      prerrequisitos: ["teCanelo"],
      desbloqueada: false,
      comprada: false,
      efecto: (s) => { s.probabilidadCritico = 0.30; s.armonia *= 1.35; }
    },

    // === RAMA 2: SENDA DE LA MANADA (Pudús & Automatización Pasiva) ===
    nidoHojarasca: {
      id: "nidoHojarasca",
      nombre: "Nido de Hojarasca",
      rama: "manada",
      tier: 1,
      costo: 60,
      icono: "🌿",
      desc: "Camas mullidas. +20% a la producción base de brotes de maqui y camitas de musgo.",
      prerrequisitos: ["semillaCanelo"],
      desbloqueada: true,
      comprada: false,
      efecto: (s) => {
        s.productores.broteMaqui.produccionBase *= 1.2;
        s.productores.camitaMusgo.produccionBase *= 1.2;
      }
    },
    camitasAcolchadas: {
      id: "camitasAcolchadas",
      nombre: "Camitas Acolchadas",
      rama: "manada",
      tier: 2,
      costo: 110,
      icono: "🛏️",
      desc: "+15% de producción base a todas las Camitas de Musgo del refugio.",
      prerrequisitos: ["nidoHojarasca"],
      desbloqueada: false,
      comprada: false,
      efecto: (s) => { s.productores.camitaMusgo.produccionBase *= 1.15; }
    },
    zapatosMusgo: {
      id: "zapatosMusgo",
      nombre: "Zapatitos de Musgo",
      rama: "manada",
      tier: 2,
      costo: 240,
      icono: "🍃",
      desc: "Los pudús caminan silenciosos sin asustar a la fauna: +35% de producción pasiva global.",
      prerrequisitos: ["nidoHojarasca"],
      desbloqueada: false,
      comprada: false,
      efecto: (s) => { s.armonia *= 1.35; }
    },
    pasosSilenciosos: {
      id: "pasosSilenciosos",
      nombre: "Pasos Silenciosos",
      rama: "manada",
      tier: 3,
      costo: 380,
      icono: "🐾",
      desc: "+15% de velocidad a los pudús al trotar por el claro, generando maquis con más alegría.",
      prerrequisitos: ["zapatosMusgo"],
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    bufandasChilotas: {
      id: "bufandasChilotas",
      nombre: "Bufandas Chilotas",
      rama: "manada",
      tier: 2,
      costo: 480,
      icono: "🧣",
      desc: "Lana tejida que abriga del frío: +40% de producción pasiva y +8% adicional por cada cría.",
      prerrequisitos: ["nidoHojarasca"],
      desbloqueada: false,
      comprada: false,
      efecto: (s) => { s.armonia *= 1.4; }
    },
    ternuraCervatillos: {
      id: "ternuraCervatillos",
      nombre: "Ternura de Cervatillos",
      rama: "manada",
      tier: 3,
      costo: 720,
      icono: "🦌",
      desc: "+5% adicional de producción pasiva por cada cría residente en el claro.",
      prerrequisitos: ["bufandasChilotas"],
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    armoniaVocal: {
      id: "armoniaVocal",
      nombre: "Coro del Bosque",
      rama: "manada",
      tier: 3,
      costo: 2200,
      icono: "🎤",
      desc: "Sinergia especial: cada pudú residente único (Miku, Teto, Mizuki, Neru y Esme) aporta +12% a la producción total.",
      prerrequisitos: ["zapatosMusgo", "bufandasChilotas"],
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    llamadoAncestral: {
      id: "llamadoAncestral",
      nombre: "Danza Ancestral",
      rama: "manada",
      tier: 4,
      costo: 9000,
      icono: "👑",
      desc: "Lazo eterno con los espíritus. +50% permanente a toda la manada y corazones al trotar.",
      prerrequisitos: ["armoniaVocal"],
      desbloqueada: false,
      comprada: false,
      efecto: (s) => { s.armonia *= 1.5; }
    },

    // === RAMA 3: SENDA DEL TALLER AUSTRAL (Olla de Greda & Clima) ===
    lenaLuma: {
      id: "lenaLuma",
      nombre: "Leña Seca de Luma",
      rama: "taller",
      tier: 1,
      costo: 90,
      icono: "🪵",
      desc: "Brasas duraderas. Reduce el tiempo de cocción en la olla de greda un 25%.",
      prerrequisitos: ["semillaCanelo"],
      desbloqueada: true,
      comprada: false,
      efecto: () => {}
    },
    brasasEternas: {
      id: "brasasEternas",
      nombre: "Brasas Eternas",
      rama: "taller",
      tier: 2,
      costo: 150,
      icono: "🪵",
      desc: "Reduce un 10% adicional el tiempo de cocción de todas las recetas en la olla.",
      prerrequisitos: ["lenaLuma"],
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    fuegosVivos: {
      id: "fuegosVivos",
      nombre: "Fuegos Vivos",
      rama: "taller",
      tier: 2,
      costo: 280,
      icono: "🔥",
      desc: "Los buffs de kuchen y cocina duran 15% más de tiempo en el claro.",
      prerrequisitos: ["lenaLuma"],
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    recetaMermelada: {
      id: "recetaMermelada",
      nombre: "Mermelada Secreta",
      rama: "taller",
      tier: 2,
      costo: 380,
      icono: "🍯",
      desc: "Cada frasco de mermelada elaborado otorga +6% permanente a la Armonía (en vez de +4%).",
      prerrequisitos: ["lenaLuma"],
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    dulzorAustral: {
      id: "dulzorAustral",
      nombre: "Dulzor Austral",
      rama: "taller",
      tier: 3,
      costo: 640,
      icono: "🍯",
      desc: "+2% adicional de Armonía permanente por cada frasco de mermelada elaborado.",
      prerrequisitos: ["recetaMermelada"],
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    amuletoArcoiris: {
      id: "amuletoArcoiris",
      nombre: "Amuleto de Arcoíris",
      rama: "taller",
      tier: 2,
      costo: 750,
      icono: "🌈",
      desc: "El clima de Arcoíris y Sol es más frecuente y multiplica la producción x2.5.",
      prerrequisitos: ["lenaLuma"],
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    brilloSolar: {
      id: "brilloSolar",
      nombre: "Brillo Solar",
      rama: "taller",
      tier: 3,
      costo: 1100,
      icono: "☀️",
      desc: "El clima de Arcoíris y Sol dura 30 segundos adicionales al despejarse.",
      prerrequisitos: ["amuletoArcoiris"],
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    coronaCopihues: {
      id: "coronaCopihues",
      nombre: "Corona de Copihues",
      rama: "taller",
      tier: 3,
      costo: 3600,
      icono: "🌺",
      desc: "La flor sagrada bendice el claro: duplica (x2) toda la producción y los kuchenes duran 180s.",
      prerrequisitos: ["recetaMermelada", "amuletoArcoiris"],
      desbloqueada: false,
      comprada: false,
      efecto: (s) => { s.armonia *= 2.0; }
    },
    fuegoSagrado: {
      id: "fuegoSagrado",
      nombre: "Fuego del Canelo",
      rama: "taller",
      tier: 4,
      costo: 12000,
      icono: "🔥",
      desc: "Llama ancestral permanente. +50% permanente de producción general a todo el claro.",
      prerrequisitos: ["coronaCopihues"],
      desbloqueada: false,
      comprada: false,
      efecto: (s) => { s.armonia *= 1.5; }
    }
  },

  // Alias para mantener compatibilidad con código existente
  mejoras: {},

  // Pudús residentes en el refugio
  pudus: [
    { id: "pudu_1", nombre: "Pichi", tipo: "adult", rol: "El primer explorador", humor: "Curioso y regalón", sombrero: "leaf" },
    { id: "pudu_miku", nombre: "Miku-Pudú", tipo: "miku", rol: "Diva vocalista del bosque", humor: "Alegre y cantarina", sombrero: "miku" },
    { id: "pudu_teto", nombre: "Teto-Pudú", tipo: "teto", rol: "Quimera de los taladros rojos", humor: "Entusiasta y fan del pan", sombrero: "teto" },
    { id: "pudu_mizuki", nombre: "Mizuki-Pudú", tipo: "mizuki", rol: "Creadora de videos de 25-ji", humor: "Libre, estilosa y tierna", sombrero: "mizuki" },
    { id: "pudu_neru", nombre: "Neru-Pudú", tipo: "neru", rol: "Tsundere fan del celular", humor: "Revisando sus mensajes", sombrero: "neru" },
    { id: "pudu_esme", nombre: "Esme-Pudú", tipo: "esme", rol: "Espíritu de los rulos esmeralda y estrellas", humor: "Creativa, risueña y con estilo", sombrero: "esme" }
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

function clonarConFunciones(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (typeof obj === 'function') return obj;
  if (Array.isArray(obj)) return obj.map(clonarConFunciones);
  const copia = {};
  for (const key in obj) {
    copia[key] = clonarConFunciones(obj[key]);
  }
  return copia;
}

export class GameState {
  constructor() {
    this.data = clonarConFunciones(INITIAL_STATE);
    this.sincronizarMejorasLegacy();
  }

  sincronizarMejorasLegacy() {
    // Sincronizar mejoras legacy para que código existente apunte a los nodos del árbol
    if (!this.data.arbolHabilidades) return;
    this.data.mejoras = { ...this.data.arbolHabilidades };
    // Alias para nodos con nombres legacy
    if (this.data.arbolHabilidades.oidoChucao) {
      this.data.mejoras.cantoChucaoArmonico = this.data.arbolHabilidades.oidoChucao;
    }
  }

  // Comprobar si cumple prerrequisitos de una habilidad
  cumplePrerrequisitos(id) {
    const nodo = this.data.arbolHabilidades[id];
    if (!nodo) return false;
    if (!nodo.prerrequisitos || nodo.prerrequisitos.length === 0) return true;
    return nodo.prerrequisitos.every(preId => this.data.arbolHabilidades[preId]?.comprada);
  }

  // Comprobar si una habilidad del árbol puede ser aprendida
  puedeAprenderHabilidad(id) {
    const nodo = this.data.arbolHabilidades[id];
    if (!nodo || nodo.comprada) return false;
    if (!this.cumplePrerrequisitos(id)) return false;
    return this.data.maquis >= nodo.costo;
  }

  // Aprender habilidad del árbol de habilidades
  aprenderHabilidad(id) {
    if (!this.puedeAprenderHabilidad(id)) return false;
    const nodo = this.data.arbolHabilidades[id];
    this.data.maquis -= nodo.costo;
    nodo.comprada = true;
    nodo.desbloqueada = true;

    // Ejecutar efecto mecánico en el estado
    if (typeof nodo.efecto === 'function') {
      nodo.efecto(this.data);
    }

    // Desbloquear nodos hijos para que se vean disponibles en el árbol
    for (const key in this.data.arbolHabilidades) {
      const hijo = this.data.arbolHabilidades[key];
      if (!hijo.comprada && hijo.prerrequisitos && hijo.prerrequisitos.includes(id)) {
        hijo.desbloqueada = true;
      }
    }

    this.sincronizarMejorasLegacy();
    return true;
  }

  // Evalúa si un clic en el arbusto resulta en golpe crítico
  evaluarCritico() {
    if (this.data.probabilidadCritico > 0 && Math.random() < this.data.probabilidadCritico) {
      return this.data.multiplicadorCritico || 5;
    }
    return 1;
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

    // Efecto de mermeladas elaboradas (+6% permanente por frasco si tiene Mermelada Secreta, sino +4%)
    const factorMermelada = this.data.arbolHabilidades.recetaMermelada?.comprada ? 0.06 : 0.04;
    const bonoMermelada = 1 + (this.data.mermeladas * factorMermelada);

    // Multiplicador del clima actual (Amuleto de arcoíris potencia a x2.5 en arcoíris)
    let bonoClima = this.data.clima.multiplicador;
    if (this.data.clima.tipo === 'arcoiris_sol' && this.data.arbolHabilidades.amuletoArcoiris?.comprada) {
      bonoClima = 2.5;
    }

    // Multiplicador de suerte temporal del Chucao
    const bonoChucao = this.data.chucao.multiplicadorSuerte;

    // Multiplicador por caricia a los pudús (+35% temporal)
    const bonoCaricia = this.data.caricias.multiplicadorCaricia;

    // Buff temporal de cocina (Kuchen u otros)
    const bonoBuffCocina = this.data.buffCocina.multiplicador;

    // Buff de agua de la Ranita de Darwin (+30% a acequias y producción)
    const bonoRanita = this.data.ranitaDarwin.segundosBuffAgua > 0 ? 1.3 : 1.0;

    // Sinergia Árbol: Coro del Bosque (+12% por cada pudú especial residente)
    let bonoPudusEspeciales = 1.0;
    if (this.data.arbolHabilidades.armoniaVocal?.comprada) {
      const countEspeciales = this.data.pudus.filter(p => ['miku', 'teto', 'mizuki', 'neru', 'esme'].includes(p.tipo)).length;
      bonoPudusEspeciales += countEspeciales * 0.12;
    }

    // Sinergia Árbol: Bufandas chilotas (+8% por cada cervatillo)
    let bonoCervatillos = 1.0;
    if (this.data.arbolHabilidades.bufandasChilotas?.comprada) {
      const countFawns = this.data.pudus.filter(p => p.tipo === 'fawn').length;
      bonoCervatillos += countFawns * 0.08;
    }

    // Multiplicador de ritmo
    const bonoRitmo = this.data.ritmo === 'veloz' ? 1.5 : 1.0;

    return totalBase * this.data.armonia * bonoCamitas * bonoMermelada * bonoClima * bonoChucao * bonoCaricia * bonoBuffCocina * bonoRanita * bonoPudusEspeciales * bonoCervatillos * bonoRitmo;
  }

  // Producción manual por click base
  getMaquisPorClick() {
    let porClick = this.data.maquisPerClick;
    
    // Si tiene la infusión de canelo sagrado, los clicks escalan con una fracción del MPS
    if (this.data.arbolHabilidades.teCanelo?.comprada || this.data.mejoras.teCanelo?.comprada) {
      porClick += this.getMaquisPorSegundo() * 0.04;
    }

    const bonoChucao = this.data.chucao.multiplicadorSuerte;
    let bonoClima = 1;
    if (this.data.clima.tipo === 'arcoiris_sol') {
      bonoClima = this.data.arbolHabilidades.amuletoArcoiris?.comprada ? 2.5 : 2.0;
    }
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

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

  // Árbol de Habilidades: "Raíces de la Armonía" (3 Ramas Estratégicas + Conexiones)
  arbolHabilidades: {
    // === NODO RAÍZ CENTRAL (Semilla del Canelo) ===
    semillaCanelo: {
      id: "semillaCanelo",
      nombre: "Semilla del Canelo",
      rama: "centro",
      tier: 0,
      nivel: 1,
      maxNivel: 20,
      costoBase: 45,
      costo: 45,
      icono: "🌰",
      desc: "Corazón espiritual del bosque. +3% de producción por segundo por cada nivel.",
      prerrequisitos: [],
      modoPrerrequisito: "all",
      desbloqueada: true,
      comprada: true,
      efecto: () => {}
    },

    // === RAMA 1: SENDA DEL RECOLECTOR (Clicks, Críticos & Microeventos) ===
    cucharaAlerce: {
      id: "cucharaAlerce",
      nombre: "Cuchara de Alerce",
      rama: "recolector",
      tier: 1,
      nivel: 0,
      maxNivel: 20,
      costoBase: 35,
      costo: 35,
      icono: "🥄",
      desc: "Tallada a mano. +2 maquis directos al clic manual y +1.5 maquis/clic por cada nivel (+3% MPS/nivel).",
      prerrequisitos: ["semillaCanelo"],
      modoPrerrequisito: "all",
      desbloqueada: true,
      comprada: false,
      efecto: (s) => {}
    },
    brotesRapidos: {
      id: "brotesRapidos",
      nombre: "Brotes Rápidos",
      rama: "recolector",
      tier: 2,
      nivel: 0,
      maxNivel: 20,
      costoBase: 90,
      costo: 90,
      icono: "🌱",
      desc: "Cosecha ágil: +1 maqui base por clic y +3% de producción pasiva por nivel.",
      prerrequisitos: ["cucharaAlerce"],
      modoPrerrequisito: "all",
      desbloqueada: false,
      comprada: false,
      efecto: (s) => {}
    },
    cosechaCertera: {
      id: "cosechaCertera",
      nombre: "Cosecha Certera",
      rama: "recolector",
      tier: 2,
      nivel: 0,
      maxNivel: 20,
      costoBase: 180,
      costo: 180,
      icono: "🎯",
      desc: "Ojo experto para bayas maduras: +12% prob. de Crítico base (+1.2%/nvl) y +0.2x al multiplicador por nivel.",
      prerrequisitos: ["cucharaAlerce", "brotesRapidos"],
      modoPrerrequisito: "any",
      desbloqueada: false,
      comprada: false,
      efecto: (s) => {}
    },
    punteriaAustral: {
      id: "punteriaAustral",
      nombre: "Puntería Austral",
      rama: "recolector",
      tier: 3,
      nivel: 0,
      maxNivel: 20,
      costoBase: 420,
      costo: 420,
      icono: "✨",
      desc: "Precisión en los arbustos: +0.8% de probabilidad de crítico y +0.15x multiplicador por nivel.",
      prerrequisitos: ["cosechaCertera"],
      modoPrerrequisito: "all",
      desbloqueada: false,
      comprada: false,
      efecto: (s) => {}
    },
    oidoChucao: {
      id: "oidoChucao",
      nombre: "Trino del Chucao",
      rama: "recolector",
      tier: 2,
      nivel: 0,
      maxNivel: 20,
      costoBase: 320,
      costo: 320,
      icono: "🎶",
      desc: "Atento al monte. El Chucao y la Baya Dorada aparecen un 2.5% más seguido y la suerte dura +1.5s por nivel.",
      prerrequisitos: ["cucharaAlerce"],
      modoPrerrequisito: "all",
      desbloqueada: false,
      comprada: false,
      efecto: (s) => {}
    },
    suerteProlongada: {
      id: "suerteProlongada",
      nombre: "Suerte Prolongada",
      rama: "recolector",
      tier: 3,
      nivel: 0,
      maxNivel: 20,
      costoBase: 600,
      costo: 600,
      icono: "⏳",
      desc: "El canto de buena fortuna del Chucao dura +2s adicionales y otorga +0.1x al multiplicador por nivel.",
      prerrequisitos: ["oidoChucao"],
      modoPrerrequisito: "all",
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    teCanelo: {
      id: "teCanelo",
      nombre: "Infusión de Canelo",
      rama: "recolector",
      tier: 3,
      nivel: 0,
      maxNivel: 20,
      costoBase: 1800,
      costo: 1800,
      icono: "🍵",
      desc: "Té místico. Los clics absorben 3.5% (+0.5%/nvl) del MPS y acariciar pudús otorga +15 maquis por nivel.",
      prerrequisitos: ["cosechaCertera", "oidoChucao", "armoniaVocal"],
      modoPrerrequisito: "any",
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    lluviaPrimavera: {
      id: "lluviaPrimavera",
      nombre: "Lluvia de Primavera",
      rama: "recolector",
      tier: 4,
      nivel: 0,
      maxNivel: 20,
      costoBase: 6500,
      costo: 6500,
      icono: "⭐",
      desc: "Maestría recolectora: +6% a la producción pasiva global y +0.6% de probabilidad de crítico por nivel.",
      prerrequisitos: ["teCanelo"],
      modoPrerrequisito: "all",
      desbloqueada: false,
      comprada: false,
      efecto: (s) => {}
    },

    // === RAMA 2: SENDA DE LA MANADA (Pudús & Automatización Pasiva) ===
    nidoHojarasca: {
      id: "nidoHojarasca",
      nombre: "Nido de Hojarasca",
      rama: "manada",
      tier: 1,
      nivel: 0,
      maxNivel: 20,
      costoBase: 60,
      costo: 60,
      icono: "🌿",
      desc: "Camas mullidas. +15% de producción base a brotes de maqui y camitas de musgo por cada nivel.",
      prerrequisitos: ["semillaCanelo"],
      modoPrerrequisito: "all",
      desbloqueada: true,
      comprada: false,
      efecto: (s) => {}
    },
    camitasAcolchadas: {
      id: "camitasAcolchadas",
      nombre: "Camitas Acolchadas",
      rama: "manada",
      tier: 2,
      nivel: 0,
      maxNivel: 20,
      costoBase: 110,
      costo: 110,
      icono: "🛏️",
      desc: "+12% a la producción base de todas las Camitas de Musgo y +3% general por nivel.",
      prerrequisitos: ["nidoHojarasca"],
      modoPrerrequisito: "all",
      desbloqueada: false,
      comprada: false,
      efecto: (s) => {}
    },
    zapatosMusgo: {
      id: "zapatosMusgo",
      nombre: "Zapatitos de Musgo",
      rama: "manada",
      tier: 2,
      nivel: 0,
      maxNivel: 20,
      costoBase: 240,
      costo: 240,
      icono: "🍃",
      desc: "Los pudús caminan silenciosos sin asustar a la fauna: +4% de producción pasiva global por nivel.",
      prerrequisitos: ["nidoHojarasca", "camitasAcolchadas"],
      modoPrerrequisito: "any",
      desbloqueada: false,
      comprada: false,
      efecto: (s) => {}
    },
    pasosSilenciosos: {
      id: "pasosSilenciosos",
      nombre: "Pasos Silenciosos",
      rama: "manada",
      tier: 3,
      nivel: 0,
      maxNivel: 20,
      costoBase: 380,
      costo: 380,
      icono: "🐾",
      desc: "+5% de velocidad a los pudús al trotar por el claro y +3% de producción global por nivel.",
      prerrequisitos: ["zapatosMusgo"],
      modoPrerrequisito: "all",
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    bufandasChilotas: {
      id: "bufandasChilotas",
      nombre: "Bufandas Chilotas",
      rama: "manada",
      tier: 2,
      nivel: 0,
      maxNivel: 20,
      costoBase: 480,
      costo: 480,
      icono: "🧣",
      desc: "Lana tejida que abriga del frío: +4% de producción pasiva y +2% adicional por cada cría por nivel.",
      prerrequisitos: ["nidoHojarasca", "oidoChucao"],
      modoPrerrequisito: "any",
      desbloqueada: false,
      comprada: false,
      efecto: (s) => {}
    },
    ternuraCervatillos: {
      id: "ternuraCervatillos",
      nombre: "Ternura de Cervatillos",
      rama: "manada",
      tier: 3,
      nivel: 0,
      maxNivel: 20,
      costoBase: 720,
      costo: 720,
      icono: "🦌",
      desc: "+2.5% adicional de producción pasiva por cada cría residente en el claro por nivel (+3% MPS/nivel).",
      prerrequisitos: ["bufandasChilotas"],
      modoPrerrequisito: "all",
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    armoniaVocal: {
      id: "armoniaVocal",
      nombre: "Coro del Bosque",
      rama: "manada",
      tier: 3,
      nivel: 0,
      maxNivel: 20,
      costoBase: 2200,
      costo: 2200,
      icono: "🎤",
      desc: "Sinergia especial: cada pudú residente único (Miku, Teto, Mizuki, Neru y Esme) aporta +3% a la producción total por nivel.",
      prerrequisitos: ["zapatosMusgo", "bufandasChilotas", "pasosSilenciosos", "teCanelo"],
      modoPrerrequisito: "any",
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    llamadoAncestral: {
      id: "llamadoAncestral",
      nombre: "Danza Ancestral",
      rama: "manada",
      tier: 4,
      nivel: 0,
      maxNivel: 20,
      costoBase: 9000,
      costo: 9000,
      icono: "👑",
      desc: "Lazo eterno con los espíritus. +8% permanente a toda la manada por nivel y corazones brillantes al trotar.",
      prerrequisitos: ["armoniaVocal"],
      modoPrerrequisito: "all",
      desbloqueada: false,
      comprada: false,
      efecto: (s) => {}
    },

    // === RAMA 3: SENDA DEL TALLER AUSTRAL (Olla de Greda, Mermeladas & Clima) ===
    lenaLuma: {
      id: "lenaLuma",
      nombre: "Leña Seca de Luma",
      rama: "taller",
      tier: 1,
      nivel: 0,
      maxNivel: 20,
      costoBase: 90,
      costo: 90,
      icono: "🪵",
      desc: "Brasas duraderas. Reduce el tiempo de cocción en la olla un 2% por nivel (hasta -40%) y da +3% MPS/nivel.",
      prerrequisitos: ["semillaCanelo", "cucharaAlerce", "nidoHojarasca"],
      modoPrerrequisito: "any",
      desbloqueada: true,
      comprada: false,
      efecto: () => {}
    },
    brasasEternas: {
      id: "brasasEternas",
      nombre: "Brasas Eternas",
      rama: "taller",
      tier: 2,
      nivel: 0,
      maxNivel: 20,
      costoBase: 150,
      costo: 150,
      icono: "🪵",
      desc: "Reduce un 1.5% adicional el tiempo de cocción y +8% de producción a las ollas de greda por nivel.",
      prerrequisitos: ["lenaLuma"],
      modoPrerrequisito: "all",
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    fuegosVivos: {
      id: "fuegosVivos",
      nombre: "Fuegos Vivos",
      rama: "taller",
      tier: 2,
      nivel: 0,
      maxNivel: 20,
      costoBase: 280,
      costo: 280,
      icono: "🔥",
      desc: "Los buffs de kuchen y cocina duran +4s y aportan +0.15x de multiplicador por nivel.",
      prerrequisitos: ["lenaLuma"],
      modoPrerrequisito: "all",
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    recetaMermelada: {
      id: "recetaMermelada",
      nombre: "Mermelada Secreta",
      rama: "taller",
      tier: 2,
      nivel: 0,
      maxNivel: 20,
      costoBase: 380,
      costo: 380,
      icono: "🍯",
      desc: "Cada frasco de mermelada elaborado otorga +0.3% permanente de producción adicional por nivel.",
      prerrequisitos: ["lenaLuma", "brasasEternas"],
      modoPrerrequisito: "any",
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    dulzorAustral: {
      id: "dulzorAustral",
      nombre: "Dulzor Austral",
      rama: "taller",
      tier: 3,
      nivel: 0,
      maxNivel: 20,
      costoBase: 640,
      costo: 640,
      icono: "🍯",
      desc: "+0.2% adicional de Armonía por frasco de mermelada y +3% MPS por nivel.",
      prerrequisitos: ["recetaMermelada", "ternuraCervatillos"],
      modoPrerrequisito: "any",
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    amuletoArcoiris: {
      id: "amuletoArcoiris",
      nombre: "Amuleto de Arcoíris",
      rama: "taller",
      tier: 2,
      nivel: 0,
      maxNivel: 20,
      costoBase: 750,
      costo: 750,
      icono: "🌈",
      desc: "El clima de Arcoíris es 3% más frecuente y su multiplicador sube +0.2x por nivel.",
      prerrequisitos: ["lenaLuma", "fuegosVivos", "suerteProlongada"],
      modoPrerrequisito: "any",
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    brilloSolar: {
      id: "brilloSolar",
      nombre: "Brillo Solar",
      rama: "taller",
      tier: 3,
      nivel: 0,
      maxNivel: 20,
      costoBase: 1100,
      costo: 1100,
      icono: "☀️",
      desc: "El clima despejado y de arcoíris dura +4s adicionales y da +3% MPS por nivel.",
      prerrequisitos: ["amuletoArcoiris"],
      modoPrerrequisito: "all",
      desbloqueada: false,
      comprada: false,
      efecto: () => {}
    },
    coronaCopihues: {
      id: "coronaCopihues",
      nombre: "Corona de Copihues",
      rama: "taller",
      tier: 3,
      nivel: 0,
      maxNivel: 20,
      costoBase: 3600,
      costo: 3600,
      icono: "🌺",
      desc: "Bendición del Copihue: +7% a la producción global y +6s de duración a los kuchenes por nivel.",
      prerrequisitos: ["recetaMermelada", "amuletoArcoiris", "armoniaVocal"],
      modoPrerrequisito: "any",
      desbloqueada: false,
      comprada: false,
      efecto: (s) => {}
    },
    fuegoSagrado: {
      id: "fuegoSagrado",
      nombre: "Fuego del Canelo",
      rama: "taller",
      tier: 4,
      nivel: 0,
      maxNivel: 20,
      costoBase: 12000,
      costo: 12000,
      icono: "🔥",
      desc: "Fuego ancestral del Canelo: +10% de producción pasiva general a todo el claro por nivel.",
      prerrequisitos: ["coronaCopihues"],
      modoPrerrequisito: "all",
      desbloqueada: false,
      comprada: false,
      efecto: (s) => {}
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
    // Asegurar propiedades de nivel y costo para todos los nodos
    for (const key in this.data.arbolHabilidades) {
      const n = this.data.arbolHabilidades[key];
      if (typeof n.nivel !== 'number') {
        n.nivel = n.comprada ? 1 : 0;
      }
      if (!n.maxNivel) n.maxNivel = 20;
      if (!n.costoBase) n.costoBase = n.costo || 50;
      if (!n.costo) n.costo = this.getCostoHabilidad(key, n.nivel);
    }
  }

  // Costo para subir al siguiente nivel de una habilidad
  getCostoHabilidad(id, nivelActual) {
    const nodo = this.data.arbolHabilidades[id];
    if (!nodo) return Infinity;
    const factor = nodo.tier === 4 ? 1.25 : (nodo.tier === 3 ? 1.23 : 1.21);
    return Math.round(nodo.costoBase * Math.pow(factor, nivelActual));
  }

  // Comprobar si cumple prerrequisitos de una habilidad
  cumplePrerrequisitos(id) {
    const nodo = this.data.arbolHabilidades[id];
    if (!nodo) return false;
    if (!nodo.prerrequisitos || nodo.prerrequisitos.length === 0) return true;

    // Si modoPrerrequisito es 'any', basta que al menos uno tenga nivel >= 1
    if (nodo.modoPrerrequisito === 'any') {
      return nodo.prerrequisitos.some(preId => {
        const p = this.data.arbolHabilidades[preId];
        return p && (p.nivel > 0 || p.comprada);
      });
    }

    // Por defecto 'all': todos deben tener nivel >= 1
    return nodo.prerrequisitos.every(preId => {
      const p = this.data.arbolHabilidades[preId];
      return p && (p.nivel > 0 || p.comprada);
    });
  }

  // Comprobar si una habilidad del árbol puede ser aprendida o mejorada de nivel (hasta nivel 20)
  puedeAprenderHabilidad(id) {
    const nodo = this.data.arbolHabilidades[id];
    if (!nodo) return false;
    if (nodo.nivel >= (nodo.maxNivel || 20)) return false;
    if (!this.cumplePrerrequisitos(id)) return false;
    return this.data.maquis >= nodo.costo;
  }

  // Aprender o subir de nivel una habilidad del árbol
  aprenderHabilidad(id) {
    if (!this.puedeAprenderHabilidad(id)) return false;
    const nodo = this.data.arbolHabilidades[id];
    this.data.maquis -= nodo.costo;
    nodo.nivel = (nodo.nivel || 0) + 1;
    nodo.comprada = true;
    nodo.desbloqueada = true;

    // Calcular costo para el próximo nivel si no llegó al máximo
    if (nodo.nivel < (nodo.maxNivel || 20)) {
      nodo.costo = this.getCostoHabilidad(id, nodo.nivel);
    }

    // Ejecutar efecto mecánico en el estado si aplica
    if (typeof nodo.efecto === 'function') {
      nodo.efecto(this.data, nodo.nivel);
    }

    // Desbloquear nodos hijos para que se vean disponibles en el árbol
    for (const key in this.data.arbolHabilidades) {
      const hijo = this.data.arbolHabilidades[key];
      if (hijo.nivel === 0 && this.cumplePrerrequisitos(key)) {
        hijo.desbloqueada = true;
      }
    }

    this.sincronizarMejorasLegacy();
    return true;
  }

  // Evalúa si un clic en el arbusto resulta en golpe crítico
  evaluarCritico() {
    let prob = this.data.probabilidadCritico;
    let mult = this.data.multiplicadorCritico || 5;

    // Cosecha Certera (Crítico activo)
    const nvCosecha = this.data.arbolHabilidades.cosechaCertera?.nivel || 0;
    if (nvCosecha > 0) {
      prob += 0.12 + (nvCosecha * 0.012); // hasta +36%
      mult += nvCosecha * 0.2;
    }

    // Puntería Austral
    const nvPunteria = this.data.arbolHabilidades.punteriaAustral?.nivel || 0;
    if (nvPunteria > 0) {
      prob += nvPunteria * 0.008;
      mult += nvPunteria * 0.15;
    }

    // Lluvia de Primavera
    const nvLluvia = this.data.arbolHabilidades.lluviaPrimavera?.nivel || 0;
    if (nvLluvia > 0) {
      prob += nvLluvia * 0.006;
      mult += nvLluvia * 0.25;
    }

    if (prob > 0 && Math.random() < Math.min(0.85, prob)) {
      return mult;
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
      let factorProd = 1.0;
      // Nido de Hojarasca potencia brotes y camitas
      const nvNido = this.data.arbolHabilidades.nidoHojarasca?.nivel || 0;
      if (nvNido > 0 && (prod.id === 'broteMaqui' || prod.id === 'camitaMusgo')) {
        factorProd += nvNido * 0.15;
      }
      // Camitas Acolchadas potencia camitas de musgo
      const nvCam = this.data.arbolHabilidades.camitasAcolchadas?.nivel || 0;
      if (nvCam > 0 && prod.id === 'camitaMusgo') {
        factorProd += nvCam * 0.12;
      }
      // Brasas Eternas potencia olla de greda
      const nvBrasas = this.data.arbolHabilidades.brasasEternas?.nivel || 0;
      if (nvBrasas > 0 && prod.id === 'ollaGreda') {
        factorProd += nvBrasas * 0.08;
      }

      totalBase += prod.cantidad * (prod.produccionBase * factorProd);
    }

    // Sinergia: Camitas de musgo potencian a la manada (+2.5% por camita)
    const bonoCamitas = 1 + (this.data.productores.camitaMusgo.cantidad * 0.025);

    // Multiplicador general por todos los niveles del árbol de habilidades (+3% por cada nivel aprendido)
    let bonoNivelesArbol = 1.0;
    for (const key in this.data.arbolHabilidades) {
      const n = this.data.arbolHabilidades[key];
      if (n.nivel > 0) {
        bonoNivelesArbol += n.nivel * 0.03;
      }
    }

    // Efecto de mermeladas elaboradas (+4% base + 0.3% por nivel de recetaMermelada + 0.2% por nivel de dulzorAustral)
    const nvRecetaMerm = this.data.arbolHabilidades.recetaMermelada?.nivel || 0;
    const nvDulzor = this.data.arbolHabilidades.dulzorAustral?.nivel || 0;
    const factorMermelada = 0.04 + (nvRecetaMerm * 0.003) + (nvDulzor * 0.002);
    const bonoMermelada = 1 + (this.data.mermeladas * factorMermelada);

    // Multiplicador del clima actual (Amuleto de arcoíris potencia según nivel)
    let bonoClima = this.data.clima.multiplicador;
    if (this.data.clima.tipo === 'arcoiris_sol') {
      const nvAmuleto = this.data.arbolHabilidades.amuletoArcoiris?.nivel || 0;
      bonoClima = 2.0 + (nvAmuleto * 0.2);
    }

    // Multiplicador de suerte temporal del Chucao (+ bono por suerteProlongada)
    const nvSuerte = this.data.arbolHabilidades.suerteProlongada?.nivel || 0;
    const bonoChucao = this.data.chucao.multiplicadorSuerte > 1
      ? this.data.chucao.multiplicadorSuerte + (nvSuerte * 0.1)
      : 1.0;

    // Multiplicador por caricia a los pudús (+35% temporal)
    const bonoCaricia = this.data.caricias.multiplicadorCaricia;

    // Buff temporal de cocina (Kuchen u otros + fuegosVivos)
    const nvFuegos = this.data.arbolHabilidades.fuegosVivos?.nivel || 0;
    const bonoBuffCocina = this.data.buffCocina.segundosRestantes > 0
      ? this.data.buffCocina.multiplicador + (nvFuegos * 0.15)
      : 1.0;

    // Buff de agua de la Ranita de Darwin (+30% a acequias y producción)
    const bonoRanita = this.data.ranitaDarwin.segundosBuffAgua > 0 ? 1.3 : 1.0;

    // Sinergia Árbol: Coro del Bosque (+3% por nivel por cada pudú especial residente)
    let bonoPudusEspeciales = 1.0;
    const nvCoro = this.data.arbolHabilidades.armoniaVocal?.nivel || 0;
    if (nvCoro > 0) {
      const countEspeciales = this.data.pudus.filter(p => ['miku', 'teto', 'mizuki', 'neru', 'esme'].includes(p.tipo)).length;
      bonoPudusEspeciales += countEspeciales * (nvCoro * 0.03);
    }

    // Sinergia Árbol: Bufandas chilotas (+4% por nivel + 2% adicional por cada cervatillo por nivel)
    let bonoBufandas = 1.0;
    const nvBufandas = this.data.arbolHabilidades.bufandasChilotas?.nivel || 0;
    if (nvBufandas > 0) {
      const countFawns = this.data.pudus.filter(p => p.tipo === 'fawn').length;
      bonoBufandas += (nvBufandas * 0.04) + (countFawns * nvBufandas * 0.02);
    }

    // Sinergia Árbol: Ternura de cervatillos (+2.5% adicional por cría por nivel)
    let bonoTernura = 1.0;
    const nvTernura = this.data.arbolHabilidades.ternuraCervatillos?.nivel || 0;
    if (nvTernura > 0) {
      const countFawns = this.data.pudus.filter(p => p.tipo === 'fawn').length;
      bonoTernura += countFawns * nvTernura * 0.025;
    }

    // Sinergia Árbol: Zapatitos de Musgo (+4% global por nivel)
    const nvZapatos = this.data.arbolHabilidades.zapatosMusgo?.nivel || 0;
    const bonoZapatos = 1 + (nvZapatos * 0.04);

    // Sinergia Árbol: Pasos silenciosos (+3% global por nivel)
    const nvPasos = this.data.arbolHabilidades.pasosSilenciosos?.nivel || 0;
    const bonoPasos = 1 + (nvPasos * 0.03);

    // Sinergias Tier 4 Ultimates:
    // Lluvia de Primavera (+6% global por nivel)
    const nvLluvia = this.data.arbolHabilidades.lluviaPrimavera?.nivel || 0;
    const bonoLluvia = 1 + (nvLluvia * 0.06);

    // Danza Ancestral (+8% global por nivel)
    const nvDanza = this.data.arbolHabilidades.llamadoAncestral?.nivel || 0;
    const bonoDanza = 1 + (nvDanza * 0.08);

    // Corona de Copihues (+7% global por nivel)
    const nvCorona = this.data.arbolHabilidades.coronaCopihues?.nivel || 0;
    const bonoCorona = 1 + (nvCorona * 0.07);

    // Fuego Sagrado (+10% global por nivel)
    const nvFuego = this.data.arbolHabilidades.fuegoSagrado?.nivel || 0;
    const bonoFuego = 1 + (nvFuego * 0.10);

    // Multiplicador de ritmo
    const bonoRitmo = this.data.ritmo === 'veloz' ? 1.5 : 1.0;

    return totalBase * this.data.armonia * bonoNivelesArbol * bonoCamitas * bonoMermelada * bonoClima * bonoChucao * bonoCaricia * bonoBuffCocina * bonoRanita * bonoPudusEspeciales * bonoBufandas * bonoTernura * bonoZapatos * bonoPasos * bonoLluvia * bonoDanza * bonoCorona * bonoFuego * bonoRitmo;
  }

  // Producción manual por click base
  getMaquisPorClick() {
    let porClick = this.data.maquisPerClick;
    
    // Cuchara de Alerce (+1.5 por nivel)
    const nvCuchara = this.data.arbolHabilidades.cucharaAlerce?.nivel || 0;
    porClick += nvCuchara * 1.5;

    // Brotes Rápidos (+1 por nivel)
    const nvBrotes = this.data.arbolHabilidades.brotesRapidos?.nivel || 0;
    porClick += nvBrotes * 1.0;

    // Si tiene la infusión de canelo sagrado, los clicks escalan con una fracción creciente del MPS
    const nvTe = this.data.arbolHabilidades.teCanelo?.nivel || 0;
    if (nvTe > 0) {
      const pctMPS = 0.035 + (nvTe * 0.005); // 3.5% up to 13.5% del MPS en cada clic manual
      porClick += this.getMaquisPorSegundo() * pctMPS;
    }

    const bonoChucao = this.data.chucao.multiplicadorSuerte;
    let bonoClima = 1;
    if (this.data.clima.tipo === 'arcoiris_sol') {
      const nvAmuleto = this.data.arbolHabilidades.amuletoArcoiris?.nivel || 0;
      bonoClima = 2.0 + (nvAmuleto * 0.2);
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

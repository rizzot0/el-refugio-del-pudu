/**
 * Motor de Renderizado Pixel Art Procedural para "El Refugio de los Pudús"
 * Proporciona matrices de píxeles, paletas auténticas del bosque valdiviano
 * basadas en el sprite de referencia de ciervo/pudú con pintas doradas y patas esbeltas.
 */

// Paleta Maestra Pixel Art
export const PALETTE = {
  // Pudú (Extraído directamente de la referencia de arte)
  puduSnout: "#211c2e",   // 'E': Hocico y ojo carbón
  puduOchre: "#c27a23",   // 'O': Contorno dorado/ocre del cuello, orejas y pintas de cervatillo
  puduBody: "#734c3e",    // 'B': Pelaje castaño rojizo principal
  puduDark: "#4b2e25",    // 'D': Lomo oscuro y patas traseras sombreadas
  puduLight: "#9c7467",   // 'L': Vientre pálido
  puduShadow: "#33453e",  // 'S': Sombra proyectada

  // Flora y Árboles
  trunkDark: "#301d13",
  trunkMid: "#4d301f",
  trunkLight: "#6e4730",
  leafShadow: "#14361e",
  leafMid: "#235431",
  leafLight: "#387a48",
  leafHighlight: "#5bb070",
  flowerRed: "#e11d48",
  flowerYellow: "#facc15",

  // Maquis
  berryDark: "#270a2d",
  berryMid: "#4d1458",
  berryLight: "#842696",
  berryGlint: "#d8b4fe",

  // Suelo, Musgo y Agua
  groundDark: "#182b1c",
  groundMid: "#25422b",
  groundLight: "#375f3e",
  groundMoss: "#4e8255",
  waterDark: "#0284c7",
  waterMid: "#38bdf8",
  waterLight: "#bae6fd",

  // Chucao
  chucaoBack: "#362e29",
  chucaoChest: "#d9531e",
  chucaoBelly: "#f59e0b",

  // Monito del Monte
  monitoFur: "#85583b",
  monitoLight: "#b58763",
  monitoEye: "#141414",

  // Olla de Greda
  clayDark: "#78350f",
  clayMid: "#b45309",
  clayLight: "#d97706",
  fireOrange: "#f97316",
  fireYellow: "#fde047"
};

/**
 * Dibuja un sprite definido en matriz de píxeles con escalado nítido
 */
export function drawPixelMatrix(ctx, matrix, colorMap, x, y, scale = 1, flipX = false) {
  const h = matrix.length;
  const w = matrix[0].length;

  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  if (flipX) {
    ctx.scale(-1, 1);
    ctx.translate(-Math.floor(w * scale), 0);
  }

  for (let r = 0; r < h; r++) {
    const row = matrix[r];
    for (let c = 0; c < w; c++) {
      const char = row[c];
      if (char === '.' || char === ' ') continue;
      const color = colorMap[char];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(c * scale, r * scale, scale, scale);
      }
    }
  }
  ctx.restore();
}

/* ==========================================================================
   MATRICES DE SPRITES DEL PUDÚ (25x21) - IDÉNTICAS AL ESTILO DE REFERENCIA
   ========================================================================== */

// '.' = transparente
// 'O' = puduOchre (contorno dorado/ocre, orejas y manchas)
// 'B' = puduBody (castaño rojizo del pudú)
// 'D' = puduDark (lomo y patas secundarias oscuras)
// 'L' = puduLight (vientre claro)
// 'E' = puduSnout (hocico y ojo)
// 'S' = puduShadow (sombra)

export const PUDU_FRAMES = {
  // Idle (Reposo fiel al arte de referencia)
  idle: [
    "...O.O...................",
    "..BBBB...................",
    ".BBBBB...................",
    "EBEBBB...................",
    "BBBBBBB..................",
    ".OOOOBBB.................",
    "...OOOBBD................",
    "....OOBBBDDDDBOBOBO......",
    "....OOBBBBOBOBBBBDBBBB...",
    ".....OBBBBBBBBBBBBBBBBBB.",
    ".....OBBBDBBBDBBBBBBBBBBB",
    "......OBBBBBBBBBBBBBBBBBB",
    "......OBBBBBBDBBBBBBBBBOB",
    ".......OBBBOBBBBBBBBBBBBO",
    ".......OBBOD....LBBBBBBO.",
    ".......OBBOD.......DBBB..",
    "........BODD.......DOBB..",
    "........BODD.......DDOBB.",
    "........BOD........DD.OB.",
    "........ODB........D..OO.",
    "........SO.........D...O."
  ],

  // Trote Cuadro 1 (Pata delantera extendida, trasera impulsando)
  walk1: [
    "...O.O...................",
    "..BBBB...................",
    ".BBBBB...................",
    "EBEBBB...................",
    "BBBBBBB..................",
    ".OOOOBBB.................",
    "...OOOBBD................",
    "....OOBBBDDDDBOBOBO......",
    "....OOBBBBOBOBBBBDBBBB...",
    ".....OBBBBBBBBBBBBBBBBBB.",
    ".....OBBBDBBBDBBBBBBBBBBB",
    "......OBBBBBBBBBBBBBBBBBB",
    "......OBBBBBBDBBBBBBBBBOB",
    ".......OBBBOBBBBBBBBBBBBO",
    ".......OBBOD....LBBBBBBO.",
    "......OBB.OD.......DBBB..",
    ".....OB...DD........DOBB.",
    "....OB....DD........DDOBB",
    "....O......D........DD.OB",
    "...O.......D.........D.OO",
    "...........D...........O."
  ],

  // Trote Cuadro 2 (Patas recogidas en el paso)
  walk2: [
    "...O.O...................",
    "..BBBB...................",
    ".BBBBB...................",
    "EBEBBB...................",
    "BBBBBBB..................",
    ".OOOOBBB.................",
    "...OOOBBD................",
    "....OOBBBDDDDBOBOBO......",
    "....OOBBBBOBOBBBBDBBBB...",
    ".....OBBBBBBBBBBBBBBBBBB.",
    ".....OBBBDBBBDBBBBBBBBBBB",
    "......OBBBBBBBBBBBBBBBBBB",
    "......OBBBBBBDBBBBBBBBBOB",
    ".......OBBBOBBBBBBBBBBBBO",
    ".......OBBOD....LBBBBBBO.",
    "........OBBOD......DBBB..",
    ".........BODD......DOBB..",
    ".........BODD......DDOBB.",
    ".........B.OD.......DD.OB",
    ".........O.DD........D.OO",
    ".........O..D..........O."
  ],

  // Cosechando / Comiendo bayas del suelo (Cabeza gacha anatómica hacia el suelo y bayas)
  eat: [
    ".........................",
    ".........................",
    ".........................",
    ".........................",
    ".........................",
    ".........................",
    ".........................",
    ".........DDDDDBOBOBO.....",
    ".......DDBBBOBOBBBBDBBBB.",
    "......DDBBBBBBBBBBBBBBBB.",
    ".....ODBBDBBBDBBBBBBBBBBB",
    "....OBOBBBBBBBBBBBBBBBBBB",
    "...OOBBBBBBBBDBBBBBBBBBOB",
    "..EBBBBBOBBBOBBBBBBBBBBBO",
    ".EBEBBOOBBOD....LBBBBBBO.",
    "EBEBB..OBBOD.......DBBB..",
    ".EEB....BODD.......DOBB..",
    "........BODD.......DDOBB.",
    "........BOD........DD.OB.",
    "........ODB........D..OO.",
    "........SO.........D...O."
  ],

  // Durmiendo acurrucado en camita de musgo (apoyado fielmente en el suelo)
  sleep: [
    ".........................",
    ".........................",
    ".........................",
    ".........................",
    ".........................",
    ".........................",
    ".........................",
    ".........................",
    ".........................",
    ".........................",
    ".........................",
    ".........................",
    ".......DDDDDDDD..........",
    "....DDDBBBOBOBBDDDD......",
    "...DBBBBBBOBOBBBBBDD.....",
    "..DBBOBBBBBBBBBBBBBBD....",
    "..DBOEBEBBBBBBDBBBBBBD...",
    "..DBBBBBBBOBBBBBBBBBBD...",
    "...DOOOBBBOBDDBBBBBBBD...",
    "....OOOOODDDDDLBBBBBBD...",
    ".....OOOO......DDDDD....."
  ]
};

export const PUDU_COLOR_MAP = {
  'O': PALETTE.puduOchre,
  'B': PALETTE.puduBody,
  'D': PALETTE.puduDark,
  'L': PALETTE.puduLight,
  'E': PALETTE.puduSnout,
  'S': PALETTE.puduShadow
};

// Accesorios en la cabeza ajustados al nuevo tamaño de 25x21
export const ACCESSORY_SPRITES = {
  leaf: [
    "....G...",
    "...GGG..",
    "..GGGG..",
    "...GG..."
  ],
  copihue: [
    "..RR..",
    ".RRRR.",
    ".RRRR.",
    "..YY.."
  ],
  chupalla: [
    "..YYYYYY..",
    ".YYYYYYYY.",
    "YYYYYYYYYY"
  ],
  scarf: [
    "RRRRRRRR",
    "RRR..RRR"
  ]
};

// Chucao
export const CHUCAO_SPRITES = {
  fly1: [
    "..BB........",
    ".BBBB...B...",
    ".BBEB..BBB..",
    "BCCOOBBBBB..",
    ".COOOBBB....",
    "..OOOBB.....",
    "...OOB......",
    "....YY......"
  ],
  fly2: [
    "............",
    "..BB...BBB..",
    ".BBEB.BBBBB.",
    "BCCOOBBBBB..",
    ".COOOBBB....",
    "..OOOB......",
    "...OOB......",
    "....YY......"
  ]
};

export const CHUCAO_COLOR_MAP = {
  'B': PALETTE.chucaoBack,
  'E': '#111111',
  'C': PALETTE.chucaoChest,
  'O': PALETTE.chucaoBelly,
  'Y': '#facc15'
};

// Monito del Monte
export const MONITO_SPRITE = [
  "...FFFF.....",
  "..FFFFFF....",
  ".FFEFFEFF...",
  ".FFFFFFLL...",
  "..LLLLLL....",
  "...LLLL.....",
  "...T.T......",
  "..TT.TT.....",
  ".TT...TT...."
];

export const MONITO_COLOR_MAP = {
  'F': PALETTE.monitoFur,
  'L': PALETTE.monitoLight,
  'E': PALETTE.monitoEye,
  'T': PALETTE.trunkDark
};

// Camita de Musgo
export const MOSS_BED_SPRITE = [
  ".....GGGGGGGGGG.....",
  "...GGGGMMMMMMGGGG...",
  "..GGMMMMMMMMMMMMGG..",
  ".GGMMMMYYYYYYMMMMGG.",
  ".GGMMYYYYYYYYYYMMGG.",
  "..GGMMMMYYYYMMMMGG..",
  "...GGGGMMMMMMGGGG...",
  ".....GGGGGGGGGG....."
];

export const MOSS_BED_COLOR_MAP = {
  'G': PALETTE.groundDark,
  'M': PALETTE.groundMoss,
  'Y': '#ca8a04'
};

// Olla de Greda
export const CLAY_POT_SPRITE = [
  "......CCCC......",
  "....CCCCCCCC....",
  "...CCCCCCCCCC...",
  "..CCCCCCCCCCCC..",
  "..CCCDDDDDDCCC..",
  "..CCCCCCCCCCCC..",
  "...CCCCCCCCCC...",
  "....CCCCCCCC....",
  ".....SSSSSS.....",
  "...SSFFFFFFSS...",
  "..SSFFYYYYFFSS..",
  ".SSFFYYYYYYFFSS.",
  ".SSFFFFFFFFFFSS.",
  "..SSSSSSSSSSSS.."
];

export const CLAY_POT_COLOR_MAP = {
  'C': PALETTE.clayMid,
  'D': PALETTE.clayDark,
  'S': '#4b5563',
  'F': PALETTE.fireOrange,
  'Y': PALETTE.fireYellow
};

// Brote de Maqui
export const SPROUT_SPRITE = [
  "....GG....",
  "...GGGG...",
  "..GGGGGG..",
  "..GGMMGG..",
  "...TTTT...",
  "....TT....",
  "....TT....",
  "...GTTG...",
  "..GGTTGG..",
  "...DDDD..."
];

export const SPROUT_COLOR_MAP = {
  'G': PALETTE.leafMid,
  'M': PALETTE.berryLight,
  'T': PALETTE.trunkMid,
  'D': PALETTE.groundDark
};

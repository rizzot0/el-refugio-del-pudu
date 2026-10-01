/**
 * Motor de Renderizado Pixel Art Procedural para "El Refugio de los Pudús"
 * Proporciona matrices de píxeles, paletas auténticas del bosque valdiviano
 * y dibujado nítido con escalado entero (pixel-perfect).
 */

// Paleta Maestra Pixel Art (Inspirada en la naturaleza del sur de Chile)
export const PALETTE = {
  // Pudú
  puduDark: "#3a1a0e",
  puduBody: "#753920",
  puduLight: "#964c2d",
  puduBelly: "#c4734d",
  puduSnout: "#1b0a05",
  puduEye: "#120502",
  puduCheek: "#f43f5e",
  puduHoof: "#241008",
  puduWhite: "#ffffff",

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
  waterFoam: "#ffffff",

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
 * Dibuja un sprite definido en matriz de píxeles (array de strings o índices).
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
   MATRICES DE SPRITES PIXEL ART (16x16 / 20x16 / 24x20)
   ========================================================================== */

// 1. SPRITES DEL PUDÚ (18 de ancho x 14 de alto)
// '.' = transparente
// 'D' = puduDark, 'B' = puduBody, 'L' = puduLight, 'M' = puduBelly
// 'S' = snout, 'E' = eye, 'W' = white, 'H' = hoof, 'C' = cheek
export const PUDU_FRAMES = {
  // Idle (Reposo respirando)
  idle: [
    "....DD............",
    "...DLDD...........",
    "..DLLEEE..DDDD....",
    "..DLLLEW.DBBBBD...",
    "...DSSS.DBBBBBBD..",
    ".......DBBBBBBBBD.",
    "......DBBLMMMBBBD.",
    ".....DBBLLMMMBBBD.",
    ".....DBBBLLMMBBDD.",
    "......DBBBBBBBBD..",
    ".......DBBBDBBD...",
    ".......HDDH.HDDH..",
    ".......HHH..HHH..."
  ],

  // Trote Cuadro 1 (Patas estiradas)
  walk1: [
    "....DD............",
    "...DLDD...........",
    "..DLLEEE..DDDD....",
    "..DLLLEW.DBBBBD...",
    "...DSSS.DBBBBBBD..",
    ".......DBBBBBBBBD.",
    "......DBBLMMMBBBD.",
    ".....DBBLLMMMBBBD.",
    "....HDBBLLMMBBD...",
    "...HH.DBBBBBBBD.H.",
    ".......DD..DDB.HH.",
    "............DD....",
    ".................."
  ],

  // Trote Cuadro 2 (Patas recogidas)
  walk2: [
    "....DD............",
    "...DLDD...........",
    "..DLLEEE..DDDD....",
    "..DLLLEW.DBBBBD...",
    "...DSSS.DBBBBBBD..",
    ".......DBBBBBBBBD.",
    "......DBBLMMMBBBD.",
    ".....DBBLLMMMBBBD.",
    ".....DBBBLLMMBBDD.",
    "......DBB..DBBD...",
    "......HDH..HDDH...",
    "......HH....HH....",
    ".................."
  ],

  // Durmiendo acurrucado (En camita de musgo)
  sleep: [
    "..................",
    "..................",
    "..................",
    "..................",
    ".......DDDD.......",
    ".....DDLLLLDD.....",
    "...DDLLBBBBLLDD...",
    "..DLLEEEBBBBBBLD..",
    "..DSSSSEBBBBBBBBD.",
    "..DDSSBBBBBBBBBBD.",
    "...DDBBBBBBBBBBD..",
    "....DDDDBBDDDD....",
    ".......HHHH......."
  ],

  // Comiendo / Cosechando (Cabeza hacia abajo)
  eat: [
    "..................",
    "..........DDDD....",
    ".........DBBBBD...",
    "....DD..DBBBBBBD..",
    "...DLDDDBBBBBBBBD.",
    "..DLLEEDBBLMMMBBBD",
    "..DLLLEWBBLLMMMBBD",
    "...DSSSDBBBLLMMBD.",
    "....SSS.DBBBBBBD..",
    ".........DBBBDBD..",
    ".........HDDHHDDH.",
    ".........HHH..HHH.",
    ".................."
  ]
};

// Mapa de colores para Pudú
export const PUDU_COLOR_MAP = {
  'D': PALETTE.puduDark,
  'B': PALETTE.puduBody,
  'L': PALETTE.puduLight,
  'M': PALETTE.puduBelly,
  'S': PALETTE.puduSnout,
  'E': PALETTE.puduEye,
  'W': PALETTE.puduWhite,
  'H': PALETTE.puduHoof,
  'C': PALETTE.puduCheek
};

// 2. ACCESORIOS PIXEL ART PARA PUDÚS
export const ACCESSORY_SPRITES = {
  // Hoja verde en la cabeza
  leaf: [
    "....G...",
    "...GGG..",
    "..GGGG..",
    "...GG...",
    "....G..."
  ],
  // Flor de Copihue
  copihue: [
    "...RR...",
    "..RRRR..",
    ".RRRRRR.",
    "..RRRR..",
    "...YY..."
  ],
  // Chupalla de paja
  chupalla: [
    "....YY....",
    "..YYYYYY..",
    ".YYYYYYYY.",
    "YYYYYYYYYY"
  ],
  // Bufandita de lana
  scarf: [
    "RRRRRRRR",
    "RRR..RRR",
    "RR....RR"
  ]
};

// 3. SPRITE DEL CHUCAO PIXEL ART (12x10)
export const CHUCAO_SPRITES = {
  fly1: [
    "..BB........",
    ".BBBB...B...",
    ".BBEB..BBB..",
    "BCCOOBBBBB..",
    ".COOOBBB....",
    "..OOOBB.....",
    "...OOB......",
    "....YY......",
    "............"
  ],
  fly2: [
    "............",
    "..BB...BBB..",
    ".BBEB.BBBBB.",
    "BCCOOBBBBB..",
    ".COOOBBB....",
    "..OOOB......",
    "...OOB......",
    "....YY......",
    "............"
  ]
};

export const CHUCAO_COLOR_MAP = {
  'B': PALETTE.chucaoBack,
  'E': '#111111',
  'C': PALETTE.chucaoChest,
  'O': PALETTE.chucaoBelly,
  'Y': '#facc15'
};

// 4. SPRITE DEL MONITO DEL MONTE (12x10)
export const MONITO_SPRITE = [
  "...FFFF.....",
  "..FFFFFF....",
  ".FFEFFEFF...",
  ".FFFFFFLL...",
  "..LLLLLL....",
  "...LLLL.....",
  "...T.T......",
  "..TT.TT.....",
  ".TT...TT....",
  "TT.....TT..."
];

export const MONITO_COLOR_MAP = {
  'F': PALETTE.monitoFur,
  'L': PALETTE.monitoLight,
  'E': PALETTE.monitoEye,
  'T': PALETTE.trunkDark
};

// 5. CAMITA DE MUSGO PIXEL ART (20x8)
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
  'Y': '#ca8a04' // Hoja suave de relleno
};

// 6. OLLA DE GREDA Y FUEGO (16x14)
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
  'S': '#4b5563', // Piedras
  'F': PALETTE.fireOrange,
  'Y': PALETTE.fireYellow
};

// 7. BROTE DE MAQUI JOVEN (10x12)
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
  "..GGTTGG..",
  "...DDDD...",
  ".........."
];

export const SPROUT_COLOR_MAP = {
  'G': PALETTE.leafMid,
  'M': PALETTE.berryLight,
  'T': PALETTE.trunkMid,
  'D': PALETTE.groundDark
};

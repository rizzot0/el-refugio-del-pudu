/**
 * Configuración del Regalo y Personalización
 * 
 * Puedes editar libremente este archivo para personalizar los nombres,
 * los textos de recuerdos y la carta final del regalo.
 */
export const giftConfig = {
  // Datos del destinatario
  destinatario: "Para alguien muy especial",
  apodoPudu: "Pudú Regalón",
  
  // Título y dedicatoria inicial
  tituloJuego: "El Refugio de los Pudús",
  subtitulo: "Un rincón de bosque, lluvia y maquis para ti",

  // Recuerdos que se desbloquean en la Bitácora del Bosque a medida que avanza el juego
  recuerdos: [
    {
      id: "recuerdo_1",
      hito: "El primer maqui compartido",
      texto: "Dicen que los pudús son tímidos, pero con paciencia y cariño, el bosque siempre abre sus puertas.",
      icono: "🌱"
    },
    {
      id: "recuerdo_2",
      hito: "El calor del refugio",
      texto: "Bajo la lluvia del sur, no hay nada más lindo que encontrar un lugar seguro donde sentirse en casa.",
      icono: "🌧️"
    },
    {
      id: "recuerdo_3",
      hito: "El canto del Chucao",
      texto: "Un encuentro fugaz que llena el día de buena suerte y sonrisas inesperadas.",
      icono: "🐦"
    },
    {
      id: "recuerdo_4",
      hito: "Aroma a mermelada y canelo",
      texto: "Las mejores cosas de la vida se cocinan a fuego lento, con dulzura y dedicación.",
      icono: "🍯"
    },
    {
      id: "recuerdo_5",
      hito: "El Gran Picnic bajo los arrayanes",
      texto: "Todo este refugio floreció gracias a tu compañía y cuidado.",
      icono: "✨"
    }
  ],

  // Mensaje final desplegado al completar el Gran Picnic
  cartaFinal: {
    saludo: "¡Feliz día, mi pudú favorito!",
    parrafos: [
      "Si estás leyendo esto, es porque cuidaste con paciencia cada brote, alimentaste a la manada y llenaste de vida este rincón del bosque.",
      "Así como este pequeño refugio se volvió un lugar cálido entre la lluvia, quería regalarte un momento tranquilo para recordarte lo mucho que te quiero y lo especial que eres para mí.",
      "Gracias por estar siempre ahí, por cada sonrisa y por hacer que todo sea más bonito."
    ],
    despedida: "Con todo mi amor,",
    firma: "Tu persona favorita ❤️"
  }
};

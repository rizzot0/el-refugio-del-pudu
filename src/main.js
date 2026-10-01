/**
 * Punto de entrada principal de "El Refugio de los Pudús"
 */
import { GameState } from './state.js';
import { sound } from './audio.js';
import { ForestDiorama } from './diorama.js';
import { GameUI } from './ui.js';
import { GameEngine } from './engine.js';
import { SaveManager } from './save.js';

window.addEventListener('DOMContentLoaded', () => {
  const state = new GameState();

  // Cargar partida previa si existe
  const offlineData = SaveManager.load(state);

  const canvas = document.getElementById('diorama-canvas');
  const diorama = new ForestDiorama(canvas, state, sound);
  const ui = new GameUI(state, sound, diorama);
  const engine = new GameEngine(state, sound, diorama, ui);

  ui.setEngine(engine);

  // Iniciar loop de juego
  engine.start();

  // Notificar progreso offline si hubo ganancias
  if (offlineData && offlineData.gananciaOffline > 0) {
    ui.mostrarModalOffline(offlineData.segundosOffline, offlineData.gananciaOffline);
  }
});

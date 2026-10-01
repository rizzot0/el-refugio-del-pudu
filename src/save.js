/**
 * Sistema de Persistencia con localStorage y Progreso Offline
 */
import { INITIAL_STATE } from './state.js';

const SAVE_KEY = 'pudu_refugio_save_v1';

export class SaveManager {
  static save(state) {
    try {
      state.data.ultimoGuardado = Date.now();
      localStorage.setItem(SAVE_KEY, JSON.stringify(state.data));
    } catch (e) {
      console.warn("No se pudo guardar en localStorage", e);
    }
  }

  static load(state) {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const loaded = JSON.parse(raw);

      // Reconciliar con estructura actual para evitar campos undefined
      state.data = {
        ...JSON.parse(JSON.stringify(INITIAL_STATE)),
        ...loaded,
        productores: {
          ...INITIAL_STATE.productores,
          ...(loaded.productores || {})
        },
        mejoras: {
          ...INITIAL_STATE.mejoras,
          ...(loaded.mejoras || {})
        }
      };

      // Calcular progreso offline (hasta un máximo de 6 horas)
      const ahora = Date.now();
      const deltaOfflineSegundos = Math.min(6 * 3600, Math.max(0, (ahora - (loaded.ultimoGuardado || ahora)) / 1000));
      
      let gananciaOffline = 0;
      if (deltaOfflineSegundos > 10) {
        const mps = state.getMaquisPorSegundo();
        gananciaOffline = Math.floor(mps * deltaOfflineSegundos * 0.85); // 85% de eficiencia al descansar
        if (gananciaOffline > 0) {
          state.data.maquis += gananciaOffline;
          state.data.totalMaquis += gananciaOffline;
        }
      }

      return {
        segundosOffline: deltaOfflineSegundos,
        gananciaOffline
      };
    } catch (e) {
      console.error("Error al cargar partida guardada", e);
      return null;
    }
  }

  static reset() {
    localStorage.removeItem(SAVE_KEY);
    window.location.reload();
  }
}

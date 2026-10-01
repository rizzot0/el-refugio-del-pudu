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
        arbolHabilidades: {
          ...INITIAL_STATE.arbolHabilidades,
          ...(loaded.arbolHabilidades || {})
        }
      };

      // Restaurar callbacks de efecto y propiedades de nivel en cada nodo del árbol
      for (const k in INITIAL_STATE.arbolHabilidades) {
        const nodo = state.data.arbolHabilidades[k];
        if (nodo) {
          nodo.efecto = INITIAL_STATE.arbolHabilidades[k].efecto;
          nodo.maxNivel = 20;
          if (typeof nodo.nivel !== 'number') {
            nodo.nivel = nodo.comprada ? 1 : 0;
          }
          if (!nodo.costoBase) nodo.costoBase = INITIAL_STATE.arbolHabilidades[k].costoBase;
          nodo.costo = state.getCostoHabilidad(k, nodo.nivel);
        }
      }

      // Migrar mejoras compradas de partidas guardadas previas hacia el árbol
      if (loaded.mejoras && typeof loaded.mejoras === 'object') {
        for (const k in loaded.mejoras) {
          if (loaded.mejoras[k]?.comprada) {
            const targetId = k === 'cantoChucaoArmonico' ? 'oidoChucao' : k;
            if (state.data.arbolHabilidades[targetId]) {
              const tn = state.data.arbolHabilidades[targetId];
              tn.comprada = true;
              tn.desbloqueada = true;
              if (tn.nivel < 1) tn.nivel = 1;
              tn.costo = state.getCostoHabilidad(targetId, tn.nivel);
            }
          }
        }
      }

      // Sincronizar hijos desbloqueados en el árbol
      for (const key in state.data.arbolHabilidades) {
        const nodo = state.data.arbolHabilidades[key];
        if (nodo.prerrequisitos && nodo.prerrequisitos.length > 0) {
          if (nodo.prerrequisitos.some(preId => {
            const p = state.data.arbolHabilidades[preId];
            return p && (p.nivel > 0 || p.comprada);
          })) {
            nodo.desbloqueada = true;
          }
        }
      }

      state.sincronizarMejorasLegacy();

      // Asegurar que si hay pudús nuevos en INITIAL_STATE (como Miku-Pudú), se sincronicen
      if (Array.isArray(state.data.pudus)) {
        INITIAL_STATE.pudus.forEach(initP => {
          if (!state.data.pudus.some(p => p.id === initP.id || p.tipo === initP.tipo)) {
            state.data.pudus.push(initP);
          }
        });
      }

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

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCanvasStore = create(
  persist(
    (set, get) => ({
      tool: "selection",
      color: "#000000",

      elements: [],
      selectedId: null,

      zoom: 1,
      pan: { x: 0, y: 0 },

  
      past: [],
      future: [],

      setTool: (tool) => set({ tool }),
      setColor: (color) => set({ color }),


      pushToHistory: () => {
        const { elements, past } = get();
        set({
          past: [...past, elements],
          future: [] // clear redo on new action
        });
      },

      addElement: (el) => {
        get().pushToHistory();

        set((s) => ({
          elements: [...s.elements, el]
        }));
      },


      updateElement: (id, updates) => {
        set((s) => ({
          elements: s.elements.map((el) =>
            el.id === id ? { ...el, ...updates } : el
          )
        }));
      },


      undo: () => {
        const { past, elements, future } = get();

        if (past.length === 0) return;

        const previous = past[past.length - 1];

        set({
          elements: previous,
          past: past.slice(0, -1),
          future: [elements, ...future]
        });
      },


      redo: () => {
        const { future, elements, past } = get();

        if (future.length === 0) return;

        const next = future[0];

        set({
          elements: next,
          future: future.slice(1),
          past: [...past, elements]
        });
      },

      setSelected: (id) => set({ selectedId: id }),

      setPan: (pan) => set({ pan }),
      setZoom: (zoom) => set({ zoom })
    }),
    {
      name: "canvas-storage",

  
      partialize: (state) => ({
        tool: state.tool,
        color: state.color,
        elements: state.elements,
        selectedId: state.selectedId,
        zoom: state.zoom,
        pan: state.pan
      })
    }
  )
);
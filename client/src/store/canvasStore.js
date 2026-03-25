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

      setTool: (tool) => set({ tool }),
      setColor: (color) => set({ color }),

      addElement: (el) =>
        set((s) => ({
          elements: [...s.elements, el]
        })),

      updateElement: (id, updates) =>
        set((s) => ({
          elements: s.elements.map((el) =>
            el.id === id ? { ...el, ...updates } : el
          )
        })),

      setSelected: (id) => set({ selectedId: id }),

      setPan: (pan) => set({ pan }),
      setZoom: (zoom) => set({ zoom })
    }),
    {
      name: "canvas-storage"
    }
  )
);
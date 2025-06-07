import { create } from "zustand";

interface MultiSelectState {
  options: { label: string; value: string }[];
  selected: string[];
  setOptions: (options: { label: string; value: string }[]) => void;
  setSelected: (selected: string[]) => void;
  addSelected: (value: string) => void;
  removeSelected: (value: string) => void;
  reset: () => void;
  onChangeCallback?: (selected: string[]) => void;
  setOnChangeCallback: (cb: (selected: string[]) => void) => void;
}

export const useMultiSelectStore = (id: string) =>
  create<MultiSelectState>((set, get) => ({
    options: [],
    selected: [],
    setOptions: (options) => set({ options }),
    setSelected: (selected) => {
      set({ selected });
      get().onChangeCallback?.(selected);
    },
    addSelected: (value) => {
      const selected = [...get().selected, value];
      set({ selected });
      get().onChangeCallback?.(selected);
    },
    removeSelected: (value) => {
      const selected = get().selected.filter((v) => v !== value);
      set({ selected });
      get().onChangeCallback?.(selected);
    },
    reset: () => set({ selected: [] }),
    onChangeCallback: undefined,
    setOnChangeCallback: (cb) => set({ onChangeCallback: cb }),
  }));

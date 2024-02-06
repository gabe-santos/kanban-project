import { create } from "zustand";
import { ColumnState, ColumnActions, ColumnType } from "../utils/types";

// export const useBoardStore = create<BoardState & BoardActions>()((set) => ({
//   boards: [],
// }));

export const useColumnStore = create<ColumnState & ColumnActions>()((set) => ({
  columns: [],
  addColumn: (column: ColumnType) => {
    console.log("adding column: ", column);
    set((state) => ({ columns: [...state.columns, column] }));
  },
  deleteColumn: (id: string) =>
    set((state) => ({ columns: state.columns.filter((col) => col.id !== id) })),
  updateColumn: (column: ColumnType) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === column.id ? column : col,
      ),
    })),
  setColumns: (columns: ColumnType[]) => set({ columns }),
}));

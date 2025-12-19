import { create } from 'zustand';
import { Event, Todo } from '../types';

interface AppState {
  events: Event[];
  todos: Todo[];
  hoveredBlip: string | null;
  selectedBlip: string | null;
  sidePanelOpen: boolean;
  
  setEvents: (events: Event[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  setHoveredBlip: (id: string | null) => void;
  setSelectedBlip: (id: string | null) => void;
  setSidePanelOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  events: [],
  todos: [],
  hoveredBlip: null,
  selectedBlip: null,
  sidePanelOpen: false,
  
  setEvents: (events) => set({ events }),
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
  updateTodo: (id, updates) => set((state) => ({
    todos: state.todos.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter(t => t.id !== id)
  })),
  setHoveredBlip: (id) => set({ hoveredBlip: id }),
  setSelectedBlip: (id) => set({ selectedBlip: id, sidePanelOpen: id !== null }),
  setSidePanelOpen: (open) => set({ sidePanelOpen: open }),
}));


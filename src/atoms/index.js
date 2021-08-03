import { atom } from "../lib/state-manager";

export const TODOS = atom({
  name: "todos",
  default: [],
  localStoragePersistence: true,
  actions: {
    create({ args, state, dispatch }) {
      const { title = "" } = args;
      dispatch((todos) => [
        ...todos,
        {
          title,
          id: Math.random(),
          completed: false,
          edited: new Date(),
        },
      ]);
    },
    edit({ args, dispatch }) {
      const { todo } = args;
      dispatch((todos) =>
        todos.map((_todo) => (_todo.id === todo.id ? { ...todo } : _todo))
      );
    },
    delete({ args, dispatch }) {
      const { id } = args;
      dispatch((todos) => todos.filter((todo) => todo.id !== id));
    },
  },
});

export const TODO_NAME = atom({
  name: "todo-name",
  default: "",
  localStoragePersistence: true,
});

export const SHOW_COMPLETED = atom({
  name: "show-completed",
  default: false,
  localStoragePersistence: true,
});

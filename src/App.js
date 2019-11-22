import React from 'react';
import { autorun, decorate, observable, computed, reaction, action } from 'mobx';

class ObservableTodoStore {
  // @observable
  todos = [];

  // @observable
  pendingRequests = 0;

  constructor() {
    autorun( () => console.log(this.report) );
  }

  // @computed
  get completedTodosCount() {
    return this.todos.filter(
      todo => todo.completed === true
    ).length;
  }

  // @computed
  get report() {
    if (this.todos.length === 0)
      return "<none>";
    return `Next todo: "${this.todos[0].task}". ` +
      `Progress: ${this.completedTodosCount}/${this.todos.length}`;
  }

  addTodo(task) {
    this.todos.push({
      task: task,
      completed: false,
      assignee: null
    });
  }
}
decorate(ObservableTodoStore, {
  todos: observable,
  pendingRequests: observable,
  completedTodosCount: computed,
  report: computed
})

const todoStore = new ObservableTodoStore();

todoStore.addTodo("read MobX tutorial");

todoStore.addTodo("try MobX");

todoStore.todos[0].completed = true;

todoStore.todos[1].task = "try MobX in own project";

todoStore.todos[0].task = "grok MobX tutorial";

function App() {
  return (
    <div>
      <h1>Hello, MobX</h1>
    </div>
  );
}

export default App;

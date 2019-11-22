import React from 'react';
import { autorun, decorate, observable, computed, reaction, action } from 'mobx';
import { observer } from 'mobx-react';

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

const observableTodoStore = new ObservableTodoStore();

const TodoList = observer(class TodoList extends React.Component {
  render() {
    const store = this.props.store;
    return (
      <div>
        { store.report }
        <ul>
        { store.todos.map(
          (todo, idx) => <TodoView todo={ todo } key={ idx } />
        ) }
        </ul>
        { store.pendingRequests > 0 ? <marquee>Loading    </marquee> : null }
        <button onClick={ this.onNewTodo }>New Todo</button>
        <small>(double-click a todo to edit)</small>
        {/* <RenderCounter /> */}
      </div>
    );
  }

  onNewTodo = () => {
    this.props.store.addTodo(prompt('Enter a new todo:','coffee plz'));
  }
});

const TodoView = observer(class TodoView extends React.Component{
  render() {
    const todo = this.props.todo;
    return(
      <li onDoubleClick={ this.onRename }>
        <input 
          type='checkbox'
          checked={ todo.completed }
          onChange={ this.onToggleCompleted }
        />
        { todo.task }
        { todo.assignee 
          ? <small>{ todo.assignee.name }</small>
          : null
        }
        {/* <RenderCounter /> */}
      </li>
    );
  }

  onToggleCompleted = () => {
    const todo = this.props.todo;
    todo.completed = !todo.completed;
  };

  onRename= () => {
    const todo = this.props.todo;
    todo.task = prompt('Task name', todo.task) || todo.task;
  };

});

/*
todoStore.addTodo("read MobX tutorial");
todoStore.addTodo("try MobX");
todoStore.todos[0].completed = true;
todoStore.todos[1].task = "try MobX in own project";
todoStore.todos[0].task = "grok MobX tutorial";
*/

function App() {
  return (
    <div>
      <TodoList store={ observableTodoStore } />
    </div>
  );
}

export default App;

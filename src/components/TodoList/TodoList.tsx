import { useEffect, useState } from 'react';
import TaskInput from '../TaskInput';
import TaskList from '../TaskList';
import { Todo } from '../../@types/todo.type';
import styles from './todoList.module.scss';
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

const syncReactToLocal = (handleNewTodos: (todos: Todo[]) => Todo[]) => {
  const todosString = localStorage.getItem('todos');
  const todosObj: Todo[] = JSON.parse(todosString || '[]');
  const newTodosObj = handleNewTodos(todosObj);
  localStorage.setItem('todos', JSON.stringify(newTodosObj));
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [duplicateTask, setDuplicateTask] = useState<string | null>(null);

  useEffect(() => {
    const todosString = localStorage.getItem('todos');
    const todosObj: Todo[] = JSON.parse(todosString || '[]');
    setTodos(todosObj);
  }, []);

  const resetDuplicateTask = () => setDuplicateTask(null);

  const checkDuplicate = (name: string) => {
    const trimmedName = name.trim();
    if (todos.some((todo) => todo.name === trimmedName)) {
      setDuplicateTask(trimmedName);
    } else {
      setDuplicateTask(null);
    }
  };

  const addTodo = (name: string) => {
    const trimmedName = name.trim();
    if (todos.some((todo) => todo.name === trimmedName)) {
      setDuplicateTask(trimmedName);
      return;
    }

    resetDuplicateTask();
    const newTodo: Todo = { name: trimmedName, done: false, id: new Date().toISOString() };
    setTodos((prev) => [...prev, newTodo]);
    syncReactToLocal((todosObj) => [...todosObj, newTodo]);
  };

  const handleDoneTodo = (id: string, done: boolean) => {
    const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, done } : todo));
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const startEditTodo = (id: string) => {
    const foundTodo = todos.find((todo) => todo.id === id);
    if (foundTodo) {
      setCurrentTodo(foundTodo);
      checkDuplicate(foundTodo.name);
    }
  };

  const editTodo = (name: string) => {
    setCurrentTodo((prev) => (prev ? { ...prev, name } : null));
    checkDuplicate(name);
  };

  const finishEditTodo = () => {
    if (!currentTodo) return;
    if (todos.some((todo) => todo.id !== currentTodo.id && todo.name.trim() === currentTodo.name.trim())) {
      setDuplicateTask(currentTodo.name.trim());
      return;
    }

    resetDuplicateTask();
    const updatedTodos = todos.map((todo) => (todo.id === currentTodo.id ? currentTodo : todo));
    setTodos(updatedTodos);
    setCurrentTodo(null);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    localStorage.setItem('todos', JSON.stringify(todos.filter((todo) => todo.id !== id)));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const updatedTodos = [...todos];
    const [reorderedTodo] = updatedTodos.splice(result.source.index, 1);
    updatedTodos.splice(result.destination.index, 0, reorderedTodo);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const doneTodos = todos.filter((todo) => todo.done);
  const notDoneTodos = todos.filter((todo) => !todo.done);

  return (
    <div className={styles.todoList}>
      <div className={styles.todoListContainer}>
        <TaskInput
          addTodo={addTodo}
          currentTodo={currentTodo}
          editTodo={editTodo}
          finishEditTodo={finishEditTodo}
          duplicateTask={duplicateTask}
          resetDuplicateTask={resetDuplicateTask}
          checkDuplicate={checkDuplicate}
        />

        <DragDropContext onDragEnd={onDragEnd}>
          <TaskList
            todos={notDoneTodos}
            handleDoneTodo={handleDoneTodo}
            startEditTodo={startEditTodo}
            deleteTodo={deleteTodo}
            duplicateTask={duplicateTask}
            onDragEnd={onDragEnd}
          />
          <TaskList
            doneTaskList
            todos={doneTodos}
            handleDoneTodo={handleDoneTodo}
            startEditTodo={startEditTodo}
            deleteTodo={deleteTodo}
            duplicateTask={duplicateTask}
            onDragEnd={onDragEnd}
          />
        </DragDropContext>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import TaskInput from '../TaskInput';
import TaskList from '../TaskList';
import { Todo } from '../../@types/todo.type';
import styles from './todoList.module.scss';

type HandleNewTodos = (todos: Todo[]) => Todo[];

const syncReactToLocal = (handleNewTodos: HandleNewTodos) => {
  const todosString = localStorage.getItem('todos');
  const todosObj: Todo[] = JSON.parse(todosString || '[]');
  const newTodosObj = handleNewTodos(todosObj);
  localStorage.setItem('todos', JSON.stringify(newTodosObj));
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [duplicateTask, setDuplicateTask] = useState<string | null>(null);

  const resetDuplicateTask = () => {
    setDuplicateTask(null); // ✅ Reset duplicateTask về null
  };

  // 🚀 Kiểm tra task trùng ngay khi nhập hoặc sửa
  const checkDuplicate = (name: string) => {
    const trimmedName = name.trim();
    if (todos.some((todo) => todo.name === trimmedName)) {
      setDuplicateTask(trimmedName); // ✅ Đánh dấu task trùng
    } else {
      setDuplicateTask(null); // ✅ Không trùng thì reset
    }
  };

  const doneTodos = todos.filter((todo) => todo.done);
  const notdoneTodos = todos.filter((todo) => !todo.done);

  useEffect(() => {
    const todosString = localStorage.getItem('todos');
    const todosObj: Todo[] = JSON.parse(todosString || '[]');
    setTodos(todosObj);
  }, []);

  const addTodo = (name: string) => {
    const trimmedName = name.trim();
    checkDuplicate(trimmedName); // ✅ Kiểm tra trùng trước khi thêm

    if (duplicateTask) {
      return; // ✅ Nếu đã có trùng, không cho thêm
    }

    const todo: Todo = {
      name: trimmedName,
      done: false,
      id: new Date().toISOString()
    };
    setTodos((prev) => [...prev, todo]);
    syncReactToLocal((todosObj: Todo[]) => [...todosObj, todo]);
  };

  const handleDoneTodo = (id: string, done: boolean) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, done };
      }
      return todo;
    });
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const startEditTodo = (id: string) => {
    const findedTodo = todos.find((todo) => todo.id === id);
    if (findedTodo) {
      setCurrentTodo(findedTodo);
      checkDuplicate(findedTodo.name); // ✅ Kiểm tra trùng ngay khi bắt đầu sửa
    }
  };

  const editTodo = (name: string) => {
    setCurrentTodo((prev) => {
      if (prev) return { ...prev, name };
      return null;
    });
    checkDuplicate(name); // ✅ Kiểm tra trùng ngay khi sửa
  };

  const finishEditTodo = () => {
    if (!currentTodo) return;

    if (todos.some((todo) => todo.id !== currentTodo.id && todo.name.trim() === currentTodo.name.trim())) {
      setDuplicateTask(currentTodo.name.trim()); // ✅ Nếu trùng, hiển thị lỗi
      return;
    }

    resetDuplicateTask(); // ✅ Nếu không trùng, reset lỗi

    const handler = (todoObj: Todo[]) => {
      return todoObj.map((todo) => (todo.id === currentTodo.id ? currentTodo : todo));
    };
    setTodos(handler);
    setCurrentTodo(null);
    syncReactToLocal(handler);
  };

  const deleteTodo = (id: string) => {
    if (currentTodo) {
      setCurrentTodo(null);
    }
    const handler = (todoObj: Todo[]) => {
      const findedIndexTodo = todoObj.findIndex((todo) => todo.id === id);
      if (findedIndexTodo > -1) {
        const result = [...todoObj];
        result.splice(findedIndexTodo, 1);
        return result;
      }
      return todoObj;
    };
    setTodos(handler);
    syncReactToLocal(handler);
  };

  return (
    <div className={styles.todoList}>
      <div className={styles.todoListContainer}>
        <TaskInput
          addTodo={addTodo}
          currentTodo={currentTodo}
          editTodo={editTodo}
          finishEditTodo={finishEditTodo}
          duplicateTask={duplicateTask}
          resetDuplicateTask={resetDuplicateTask} // ✅ Thêm dòng này để truyền hàm vào
          checkDuplicate={checkDuplicate} // ✅ Truyền checkDuplicate để kiểm tra trùng
        />

        <TaskList
          todos={notdoneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
          duplicateTask={duplicateTask} // ✅ Thêm dòng này
        />
        <TaskList
          doneTaskList
          todos={doneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
          duplicateTask={duplicateTask} // ✅ Thêm dòng này
        />
      </div>
    </div>
  );
}

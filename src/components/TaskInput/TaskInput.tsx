import { useState, useEffect, useRef } from 'react';
import { Todo } from '../../@types/todo.type';
import styles from './taskInput.module.scss';

interface TaskInputProps {
  addTodo: (name: string) => void;
  editTodo: (name: string) => void;
  finishEditTodo: () => void;
  currentTodo: Todo | null;
  duplicateTask: string | null;
  resetDuplicateTask: () => void;
  checkDuplicate: (name: string) => boolean;
}

export default function TaskInput(props: TaskInputProps) {
  const { addTodo, currentTodo, editTodo, finishEditTodo, duplicateTask, resetDuplicateTask, checkDuplicate } = props;
  const [name, setName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentTodo) {
      setName(currentTodo.name);
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(currentTodo.name.length, currentTodo.name.length);
      }
      resetDuplicateTask();
      setShowError(false);
    } else {
      setName('');
      resetDuplicateTask();
      setShowError(false);
      setErrorMessage('');
    }
  }, [currentTodo]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
  
    // 🚀 Kiểm tra nếu task trống
    if (!trimmedName) {  // 🔥 Dùng !trimmedName thay vì trimmedName === ''
      setErrorMessage('⚠️ Please enter the task content!');
      setShowError(true);
      return;  // 🔥 Dừng lại nếu task trống 
    }
  
    // 🚀 Kiểm tra trùng chỉ khi submit (KHÔNG kiểm tra liên tục khi nhập)
    if (checkDuplicate(trimmedName)) {

      setErrorMessage(`⚠️ Task "${trimmedName}" already exists!`);
      addTodo(trimmedName);
      finishEditTodo();

      setShowError(true);

      return;

    }
  
    // ✅ Nếu hợp lệ, tiếp tục xử lý
    setErrorMessage('');
    if (currentTodo) {
      finishEditTodo(); // ✅ Kiểm tra trùng khi nhấn "Hoàn tất"
    } else {
      addTodo(trimmedName); // ✅ Kiểm tra trùng khi nhấn "Thêm task"
    }
    setName('');
  };
  

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setName(newValue);

    if (showError) {
      setShowError(false);
      setErrorMessage('');
    }

    if (currentTodo) {
      editTodo(newValue);
    }

    if (duplicateTask && newValue.trim() !== duplicateTask.trim()) {
      resetDuplicateTask();
    }
  };

  return (
    <div className='mb-2'>
      <h1 className={styles.title}>Create your Todo-List
      </h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type='text'
          placeholder='What are your tasks for today？'
          value={name}
          onChange={onChangeInput}
          className={showError ? styles.duplicateTask : ''}
        />
        <button type='submit'>{currentTodo ? '✔️' : '➕'}</button>
      </form>
      {showError && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
}

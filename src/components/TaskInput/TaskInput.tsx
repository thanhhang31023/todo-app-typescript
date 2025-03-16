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
  checkDuplicate: (name: string) => void; // ✅ Thêm hàm kiểm tra trùng từ TodoList.tsx
}

export default function TaskInput(props: TaskInputProps) {
  const { addTodo, currentTodo, editTodo, finishEditTodo, duplicateTask, resetDuplicateTask, checkDuplicate } = props;
  const [name, setName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>(''); 
  const inputRef = useRef<HTMLInputElement>(null);

  // 🚀 Khi chọn sửa task, tự động điền nội dung task vào input
  useEffect(() => {
    if (currentTodo) {
      setName(currentTodo.name);
      checkDuplicate(currentTodo.name); // ✅ Kiểm tra trùng ngay khi sửa
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(currentTodo.name.length, currentTodo.name.length);
      }
    } else {
      setName('');
      resetDuplicateTask(); // ✅ Reset duplicateTask khi thêm mới
    }
  }, [currentTodo]);

  // 🚀 Hiển thị lỗi ngay khi duplicateTask thay đổi hoặc khi nhập trùng
  useEffect(() => {
    if (duplicateTask && name.trim() === duplicateTask.trim()) {
      setErrorMessage(`⚠️ Task "${duplicateTask}" đã tồn tại!`);
    } else {
      setErrorMessage('');
    }
  }, [duplicateTask, name]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    // 🚀 Kiểm tra nếu task trống
    if (trimmedName === '') {
      setErrorMessage('⚠️ Vui lòng nhập nội dung task!');
      return;
    }

    // 🚀 Kiểm tra nếu task trùng tên
    checkDuplicate(trimmedName); // ✅ Kiểm tra trùng trước khi submit
    if (duplicateTask && trimmedName === duplicateTask.trim()) {
      setErrorMessage(`⚠️ Task "${duplicateTask}" đã tồn tại!`);
      return;
    }

    // ✅ Nếu hợp lệ, tiếp tục xử lý
    setErrorMessage('');
    if (currentTodo) {
      finishEditTodo(); // ✅ Hoàn tất chỉnh sửa
    } else {
      addTodo(trimmedName);
    }
    setName('');
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setName(newValue);

    checkDuplicate(newValue); // ✅ Kiểm tra trùng ngay khi nhập

    if (currentTodo) {
      editTodo(newValue); // ✅ Gọi editTodo để cập nhật khi sửa
    }

    // 🚀 Khi người dùng nhập một giá trị mới, reset duplicateTask nếu khác
    if (duplicateTask && newValue.trim() !== duplicateTask.trim()) {
      resetDuplicateTask();
    }
  };

  return (
    <div className='mb-2'>
      <h1 className={styles.title}>To do list typescript</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type='text'
          placeholder='caption goes here'
          value={name}
          onChange={onChangeInput}
          className={duplicateTask && name.trim() === duplicateTask.trim() ? styles.duplicateTask : ''}
        />
        <button type='submit'>{currentTodo ? '✔️' : '➕'}</button>
      </form>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
}

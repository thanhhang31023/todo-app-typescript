import { useState, useEffect, useRef } from 'react'
import { Todo } from '../../@types/todo.type'
import styles from './taskInput.module.scss'

interface TaskInputProps {
  addTodo: (name: string) => void
  editTodo: (name: string) => void
  finishEditTodo: () => void
  currentTodo: Todo | null
}

export default function TaskInput(props: TaskInputProps) {
  const { addTodo, currentTodo, editTodo, finishEditTodo } = props
  const [name, setName] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('') // Thêm state lưu lỗi
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (currentTodo && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(currentTodo.name.length, currentTodo.name.length)
    }
  }, [currentTodo])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (name.trim() === '') {
      setErrorMessage('⚠️ Please enter the task content!') // Hiển thị thông báo lỗi
      return
    }
    setErrorMessage('') // Xóa thông báo lỗi nếu nhập hợp lệ
    if (currentTodo) {
      finishEditTodo()
    } else {
      addTodo(name.trim())
    }
    setName('')
  }

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('') // Xóa lỗi khi người dùng nhập lại
    const { value } = event.target
    if (currentTodo) {
      editTodo(value)
    } else {
      setName(value)
    }
  }

  return (
    <div className='mb-2'>
      <h1 className={styles.title}>To do list typescript</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type='text'
          placeholder='caption goes here'
          value={currentTodo ? currentTodo.name : name}
          onChange={onChangeInput}
        />
        <button type='submit'>{currentTodo ? '✔️' : '➕'}</button>
      </form>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>} {/* Hiển thị lỗi */}
    </div>
  )
}

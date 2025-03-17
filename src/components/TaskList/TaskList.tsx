import { Todo } from '../../@types/todo.type'
import styles from './taskList.module.scss'
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult, 
  DroppableProvided, 
  DraggableProvided, 
  DraggableStateSnapshot 
} from "@hello-pangea/dnd";



interface TaskListProps {
  doneTaskList?: boolean
  todos: Todo[]
  handleDoneTodo: (id: string, done: boolean) => void
  startEditTodo: (id: string) => void
  deleteTodo: (id: string) => void
  duplicateTask?: string | null
  onDragEnd: (result: DropResult) => void
}

export default function TaskList(props: TaskListProps) {
  const { doneTaskList, todos, handleDoneTodo, startEditTodo, deleteTodo, duplicateTask, onDragEnd } = props

  const onChangeCheckbox = (idTodo: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    handleDoneTodo(idTodo, event.target.checked)
  }

  return (
    <div className='mb-2'>
      <h2 className={styles.title}>{doneTaskList ? '🎉Completed Tasks' : '📌To do Tasks'}</h2>

      <Droppable droppableId={doneTaskList ? 'completedTasks' : 'pendingTasks'}>
        {(provided: DroppableProvided) => (
        <div
        className={`${styles.tasks} ${doneTaskList ? styles.completedTaskList : ''}`}
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
      
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                  <div
                    className={`${styles.task} ${snapshot.isDragging ? styles.dragging : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <input
                      type='checkbox'
                      className={styles.taskCheckbox}
                      checked={todo.done}
                      onChange={onChangeCheckbox(todo.id)}
                    />
                    <span
                      className={`${styles.taskName} ${todo.done ? styles.taskNameDone : ''} ${
                        duplicateTask === todo.name ? styles.duplicateTask : ''
                      }`}
                    >
                      {todo.name}
                    </span>
                    <div className={styles.taskActions}>
                      <button className={styles.taskBtn} onClick={() => startEditTodo(todo.id)}>
                        🖊️
                      </button>
                      <button className={styles.taskBtn} onClick={() => deleteTodo(todo.id)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

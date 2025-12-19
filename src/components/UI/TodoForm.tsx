import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { Todo, Category, Priority } from '../../types'
import './TodoForm.css'

const TodoForm: React.FC = () => {
  const { addTodo } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('work')
  const [priority, setPriority] = useState<Priority>('medium')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newTodo: Todo = {
      id: `todo-${Date.now()}`,
      title: title.trim(),
      startTime: new Date(),
      endTime: new Date(),
      category,
      priority,
      description: description.trim() || undefined,
      isFixed: false,
      isComplete: false,
    }

    addTodo(newTodo)
    setTitle('')
    setDescription('')
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button className="todo-form-toggle" onClick={() => setIsOpen(true)}>
        + Add Todo
      </button>
    )
  }

  return (
    <div className="todo-form-container">
      <form className="todo-form" onSubmit={handleSubmit}>
        <div className="todo-form-header">
          <h3>New Todo</h3>
          <button
            type="button"
            className="todo-form-close"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="todo-form-field">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            autoFocus
            required
          />
        </div>

        <div className="todo-form-field">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">· Low</option>
            <option value="medium">○ Medium</option>
            <option value="high">◉ High</option>
            <option value="critical">● Critical</option>
          </select>
        </div>

        <div className="todo-form-field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            <option value="work">◉ Work</option>
            <option value="personal">○ Personal</option>
            <option value="health">◐ Health</option>
          </select>
        </div>

        <div className="todo-form-field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={3}
          />
        </div>

        <div className="todo-form-actions">
          <button type="button" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}

export default TodoForm

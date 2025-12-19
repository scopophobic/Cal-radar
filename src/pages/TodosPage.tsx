import { useState } from 'react'
import { format } from 'date-fns'
import LeftSidebar from '../components/UI/LeftSidebar'
import Navbar from '../components/UI/Navbar'
import { useAppStore } from '../store/useAppStore'
import { useThemeStore } from '../store/useThemeStore'
import { Todo, Category, Priority } from '../types'
import './TodosPage.css'

function TodosPage() {
  const { theme } = useThemeStore()
  const { todos, addTodo, updateTodo, deleteTodo } = useAppStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    category: 'work' as Category,
    priority: 'medium' as Priority,
    description: '',
  })

  const activeTodos = todos.filter((todo) => !todo.isComplete)
  const completedTodos = todos.filter((todo) => todo.isComplete)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    if (editingTodo) {
      updateTodo(editingTodo.id, {
        title: formData.title.trim(),
        category: formData.category,
        priority: formData.priority,
        description: formData.description.trim() || undefined,
      })
    } else {
      const newTodo: Todo = {
        id: `todo-${Date.now()}`,
        title: formData.title.trim(),
        startTime: new Date(),
        endTime: new Date(),
        category: formData.category,
        priority: formData.priority,
        description: formData.description.trim() || undefined,
        isFixed: false,
        isComplete: false,
      }
      addTodo(newTodo)
    }

    setFormData({
      title: '',
      category: 'work',
      priority: 'medium',
      description: '',
    })
    setIsFormOpen(false)
    setEditingTodo(null)
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setFormData({
      title: todo.title,
      category: todo.category,
      priority: todo.priority || 'medium',
      description: todo.description || '',
    })
    setIsFormOpen(true)
  }

  const handleComplete = (id: string) => {
    updateTodo(id, { isComplete: true })
  }

  const handleDelete = (id: string) => {
    deleteTodo(id)
  }

  const priorityDoodles: Record<Priority, string> = {
    low: '·',
    medium: '○',
    high: '◉',
    critical: '●',
  }

  const categoryDoodles: Record<Category, string> = {
    work: '◉',
    personal: '○',
    health: '◐',
  }

  return (
    <div className="todos-page" data-theme={theme}>
      <LeftSidebar />
      <Navbar />
      <div className="todos-content">
        <div className="todos-main">
          <div className="todos-header">
            <h2>Tasks</h2>
            <button className="add-todo-btn" onClick={() => setIsFormOpen(true)}>
              + Add Todo
            </button>
          </div>

          {isFormOpen && (
            <div className="todo-form-modal">
              <form className="todo-form-content" onSubmit={handleSubmit}>
                <div className="form-header">
                  <h3>{editingTodo ? 'Edit Todo' : 'New Todo'}</h3>
                  <button
                    type="button"
                    className="form-close"
                    onClick={() => {
                      setIsFormOpen(false)
                      setEditingTodo(null)
                      setFormData({
                        title: '',
                        category: 'work',
                        priority: 'medium',
                        description: '',
                      })
                    }}
                  >
                    ×
                  </button>
                </div>

                <div className="form-field">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter task title"
                    required
                    autoFocus
                  />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priority: e.target.value as Priority,
                        })
                      }
                    >
                      <option value="low">· Low</option>
                      <option value="medium">○ Medium</option>
                      <option value="high">◉ High</option>
                      <option value="critical">● Critical</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as Category,
                        })
                      }
                    >
                      <option value="work">◉ Work</option>
                      <option value="personal">○ Personal</option>
                      <option value="health">◐ Health</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit">
                    {editingTodo ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="todos-list">
            {activeTodos.length === 0 && completedTodos.length === 0 ? (
              <div className="empty-state">
                <p>No todos yet. Create your first task!</p>
              </div>
            ) : (
              <>
                {activeTodos.length > 0 && (
                  <div className="todos-section">
                    <h3>Active ({activeTodos.length})</h3>
                    {activeTodos.map((todo) => (
                      <div key={todo.id} className="todo-item">
                        <div className="todo-main">
                          <span className="todo-priority">
                            {priorityDoodles[todo.priority]}
                          </span>
                          <span className="todo-category">
                            {categoryDoodles[todo.category]}
                          </span>
                          <span className="todo-title">{todo.title}</span>
                          {todo.description && (
                            <span className="todo-description">
                              {todo.description}
                            </span>
                          )}
                        </div>
                        <div className="todo-actions">
                          <button
                            className="todo-btn"
                            onClick={() => handleEdit(todo)}
                          >
                            Edit
                          </button>
                          <button
                            className="todo-btn"
                            onClick={() => handleComplete(todo.id)}
                          >
                            ✓
                          </button>
                          <button
                            className="todo-btn delete"
                            onClick={() => handleDelete(todo.id)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {completedTodos.length > 0 && (
                  <div className="todos-section">
                    <h3>Completed ({completedTodos.length})</h3>
                    {completedTodos.map((todo) => (
                      <div key={todo.id} className="todo-item completed">
                        <div className="todo-main">
                          <span className="todo-title">{todo.title}</span>
                        </div>
                        <div className="todo-actions">
                          <button
                            className="todo-btn delete"
                            onClick={() => handleDelete(todo.id)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodosPage


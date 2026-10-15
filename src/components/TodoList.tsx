import React, { useEffect, useState } from 'react';
import { useTodosStore } from '../stores/todosStore';
import { TodoItemSkeleton } from './SkeletonLoader';
import { EmptyState } from './EmptyState';
import '../styles/todos.css';

export const TodoList: React.FC = () => {
  // Using global state - no prop drilling!
  const { 
    todos, 
    loadingState, 
    error, 
    fetchTodos, 
    addTodo, 
    toggleTodo, 
    deleteTodo 
  } = useTodosStore();

  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      addTodo(newTodoTitle);
      setNewTodoTitle('');
    }
  };

  // Loading state with skeleton
  if (loadingState === 'loading') {
    return (
      <div className="todos-container">
        <h2>My Tasks</h2>
        <div className="todos-list">
          {Array.from({ length: 5 }).map((_, i) => (
            <TodoItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (loadingState === 'error') {
    return (
      <div className="todos-container">
        <EmptyState
          icon="⚠️"
          title="Failed to load tasks"
          description={error || 'Something went wrong while fetching your tasks'}
          action={{
            label: 'Retry',
            onClick: fetchTodos
          }}
        />
      </div>
    );
  }

  return (
    <div className="todos-container">
      <h2>My Tasks</h2>

      {/* Add todo form */}
      <form className="add-todo-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="todo-input"
        />
        <button type="submit" className="add-todo-btn">
          Add Task
        </button>
      </form>

      {/* Empty state when no todos */}
      {todos.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No tasks yet"
          description="Create your first task to get started with your todo list!"
        />
      ) : (
        <div className="todos-list">
          {todos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <span className="todo-title">{todo.title}</span>
              <button
                className="delete-todo-btn"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {todos.length > 0 && (
        <div className="todos-summary">
          <span>{todos.filter(t => !t.completed).length} active</span>
          <span>{todos.filter(t => t.completed).length} completed</span>
        </div>
      )}
    </div>
  );
};

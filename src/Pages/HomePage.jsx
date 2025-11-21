import React, { useState, useMemo } from 'react';
// import { createRoot } from 'react-dom/client';
import { 
  Plus, 
  Trash2, 
  Check, 
  Calendar, 
  CheckCircle2,
} from 'lucide-react';


const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="group flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mb-3 animate-in fade-in slide-in-from-bottom-2">
      <button
        onClick={() => onToggle(todo.id)}
        className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
          todo.completed
            ? 'bg-indigo-500 border-indigo-500 text-white'
            : 'border-slate-300 text-transparent hover:border-indigo-400'
        }`}
      >
        <Check size={14} strokeWidth={3} />
      </button>
      
      <span 
        className={`grow text-slate-700 font-medium transition-all duration-200 ${
          todo.completed ? 'text-slate-400 line-through' : ''
        }`}
      >
        {todo.text}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
        aria-label="Delete task"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

const FilterTab = ({ label, active, count, onClick }) => (
  <button
    onClick={onClick}
    className={`pb-2 px-1 text-sm font-semibold transition-colors relative ${
      active 
        ? 'text-indigo-600' 
        : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {label}
    <span className={`ml-1.5 text-xs py-0.5 px-1.5 rounded-full ${
      active ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
    }`}>
      {count}
    </span>
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
    )}
  </button>
);

const EmptyState = ({ filter }) => {
  const messages = {
    all: "You're all caught up! Time to relax.",
    active: "No active tasks. Add one to get started!",
    completed: "No completed tasks yet. Let's get to work!"
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
      <div className="bg-slate-50 p-4 rounded-full mb-4">
        <CheckCircle2 className="text-slate-300" size={48} />
      </div>
      <h3 className="text-slate-600 font-semibold text-lg mb-1">No tasks found</h3>
      <p className="text-slate-400 text-sm max-w-[200px]">
        {messages[filter] || messages.all}
      </p>
    </div>
  );
};

// --- Main Application ---

export default function HomePage() {
  // Initial Mock Data
  const [todos, setTodos] = useState([
    { id: 1, text: 'Design new dashboard', completed: true },
    { id: 2, text: 'Meeting with team', completed: false },
    { id: 3, text: 'Buy groceries', completed: false },
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Actions
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
  };

  // Derived State
  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    return todos;
  }, [todos, filter]);

  const counts = {
    all: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-white relative overflow-hidden shrink-0">
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-indigo-400 opacity-20 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
                      <p className="text-indigo-100 text-sm font-medium flex items-center mt-1 opacity-90">
                          <Calendar size={14} className="mr-1.5" />
                          {today}
                      </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <div className="text-center leading-none">
                      <span className="block text-lg font-bold">{counts.active}</span>
                      <span className="text-[10px] uppercase tracking-wider opacity-80">Left</span>
                    </div>
                  </div>
              </div>
            </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-6 px-6 pt-4 border-b border-slate-100 shrink-0">
          <FilterTab 
            label="All" 
            active={filter === 'all'} 
            count={counts.all}
            onClick={() => setFilter('all')} 
          />
          <FilterTab 
            label="Active" 
            active={filter === 'active'} 
            count={counts.active}
            onClick={() => setFilter('active')} 
          />
          <FilterTab 
            label="Completed" 
            active={filter === 'completed'} 
            count={counts.completed}
            onClick={() => setFilter('completed')} 
          />
        </div>

        {/* Scrollable List Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-1 custom-scrollbar">
          {filteredTodos.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            filteredTodos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onToggle={handleToggleTodo} 
                onDelete={handleDeleteTodo} 
              />
            ))
          )}
          
          {/* Clear Completed Button */}
          {counts.completed > 0 && filter !== 'active' && (
             <div className="pt-4 flex justify-center">
                <button 
                    onClick={handleClearCompleted}
                    className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                    <Trash2 size={12} />
                    Clear completed tasks
                </button>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-100 shrink-0 z-10">
          <form onSubmit={handleAddTodo} className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a new task..."
              className="w-full pl-4 pr-14 py-4 bg-slate-50 border-2 border-slate-100 text-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <Plus size={24} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

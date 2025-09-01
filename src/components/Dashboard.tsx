import React, { useState } from 'react'
import { Plane, Plus, LogOut, CheckCircle, Clock, Filter, Folder, FolderPlus, Settings, Navigation } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import { useCategories } from '../hooks/useCategories'
import { useFAACategories } from '../hooks/useFAACategories'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'
import { CategoryForm } from './CategoryForm'
import { CategorySection } from './CategorySection'
import { ConfirmationDialog } from './ConfirmationDialog'
import { Database } from '../lib/supabase'

type Task = Database['public']['Tables']['tasks']['Row']
type Category = Database['public']['Tables']['categories']['Row']

interface DashboardProps {
  onNavigate: (page: 'dashboard' | 'work' | 'admin') => void
  userRole: string
}

export function Dashboard({ onNavigate, userRole }: DashboardProps) {
  const { user, signOut } = useAuth()
  const { tasks, loading, createTask, updateTask, deleteTask, toggleComplete } = useTasks()
  const { categories, loading: categoriesLoading, createCategory, updateCategory, deleteCategory } = useCategories()
  const { getFlightStatus } = useFAACategories()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [activeTab, setActiveTab] = useState<'todo' | 'completed'>('todo')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all')
  const [showDeleteCategoryConfirmation, setShowDeleteCategoryConfirmation] = useState(false)
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const filterTasksByCategory = (taskList: Task[]) => {
    if (selectedCategoryFilter === 'all') return taskList
    if (selectedCategoryFilter === 'uncategorized') return taskList.filter(task => !task.category_id)
    return taskList.filter(task => task.category_id === selectedCategoryFilter)
  }

  const todoTasks = filterTasksByCategory(tasks.filter(task => !task.completed))
  const completedTasks = filterTasksByCategory(tasks.filter(task => task.completed))
  const uncategorizedTasks = tasks.filter(task => !task.category_id)

  const handleTaskSubmit = async (taskData: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData)
      setEditingTask(null)
    } else {
      await createTask(taskData)
    }
    setShowTaskForm(false)
  }

  const handleCategorySubmit = async (categoryData: any) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, categoryData)
      setEditingCategory(null)
    } else {
      await createCategory(categoryData)
    }
    setShowCategoryForm(false)
  }
  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setShowCategoryForm(true)
  }
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    setCategoryToDeleteId(id)
    setShowDeleteCategoryConfirmation(true)
  }

  const handleConfirmDeleteCategory = async () => {
    if (categoryToDeleteId) {
      await deleteCategory(categoryToDeleteId)
      setCategoryToDeleteId(null)
    }
    setShowDeleteCategoryConfirmation(false)
  }

  const handleCancelDeleteCategory = () => {
    setCategoryToDeleteId(null)
    setShowDeleteCategoryConfirmation(false)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const flightStatus = getFlightStatus()
  
  const getStatusIcon = () => {
    switch (flightStatus) {
      case 'Landed':
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case 'Airborne':
        return <Plane className="w-6 h-6 text-blue-400" />
      case 'Taxiing':
        return <Navigation className="w-6 h-6 text-yellow-400" />
      default:
        return <Clock className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (flightStatus) {
      case 'Landed':
        return 'from-green-600 to-green-700'
      case 'Airborne':
        return 'from-blue-600 to-blue-700'
      case 'Taxiing':
        return 'from-yellow-600 to-yellow-700'
      default:
        return 'from-gray-600 to-gray-700'
    }
  }

  if (loading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your tasks...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Plane className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">PilotPad</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
              <button
                onClick={() => onNavigate('work')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 min-h-[44px]"
              >
                <Navigation className="w-4 h-4" />
                <span>Flight Ops</span>
              </button>
              
              {userRole === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 min-h-[44px]"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              )}
              
              {/* Flight Status Indicator */}
              <div className={`px-3 xl:px-4 py-2 rounded-full border border-white/30 bg-gradient-to-r ${getStatusColor()}`}>
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <div className="text-white">
                    <div className="text-xs font-medium opacity-80 hidden xl:block">Status</div>
                    <div className="text-xs xl:text-sm font-bold">{flightStatus}</div>
                  </div>
                </div>
              </div>
              
              <span className="text-gray-600 text-sm hidden xl:block">Welcome, {user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xl:block">Sign Out</span>
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                  <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                </div>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-3 sm:mt-4 pb-3 sm:pb-4 border-t border-gray-200">
              <div className="space-y-4 pt-4">
                {/* Flight Status */}
                <div className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-white/30 bg-gradient-to-r ${getStatusColor()}`}>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon()}
                    <div className="text-white">
                      <div className="text-xs font-medium opacity-80">Status</div>
                      <div className="text-sm font-bold">{flightStatus}</div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    onNavigate('work')
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors p-3 rounded-lg hover:bg-gray-100 min-h-[44px] text-base"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Flight Ops</span>
                </button>
                
                {userRole === 'admin' && (
                  <button
                    onClick={() => {
                      onNavigate('admin')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors p-3 rounded-lg hover:bg-gray-100 min-h-[44px] text-base"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Admin</span>
                  </button>
                )}
                
                <div className="text-gray-600 text-sm px-3 py-2 border-t border-gray-200">
                  Welcome, {user?.email}
                </div>
                
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors p-3 rounded-lg hover:bg-gray-100 min-h-[44px] text-base"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 p-4 sm:p-6 lg:p-8 rounded-2xl bg-white/30 backdrop-blur-md max-w-7xl mx-auto mb-4 lg:mb-8 mt-3 lg:mt-5" style={{ width: 'calc(100% - 16px)', maxWidth: 'calc(1280px + 32px)' }}>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Categories</p>
                <p className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <Folder className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Total Tasks</p>
                <p className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">To Do</p>
                <p className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{todoTasks.length}</p>
              </div>
              <Filter className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Completed</p>
                <p className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{completedTasks.length}</p>
              </div>
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex space-x-1 bg-gray-100 rounded-lg sm:rounded-xl p-1 border border-gray-200 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('todo')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 lg:px-6 py-2 rounded-md sm:rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm lg:text-base min-h-[44px] ${
                activeTab === 'todo'
                  ? 'bg-white text-blue-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              To Do ({todoTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 lg:px-6 py-2 rounded-md sm:rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm lg:text-base min-h-[44px] ${
                activeTab === 'completed'
                  ? 'bg-white text-blue-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed ({completedTasks.length})
            </button>
          </div>

          <div className="flex flex-col xs:flex-row items-stretch xs:items-center space-y-3 xs:space-y-0 xs:space-x-3 sm:space-x-4">
            <div>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm lg:text-base min-h-[44px] truncate"
              >
                <option value="all">All Categories</option>
                <option value="uncategorized">Uncategorized</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => setShowCategoryForm(true)}
              className="flex items-center justify-center space-x-1 xs:space-x-2 bg-gray-100 text-gray-800 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 border border-gray-300 text-xs sm:text-sm lg:text-base min-h-[44px] flex-shrink-0"
            >
              <FolderPlus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">New Category</span>
              <span className="sm:hidden whitespace-nowrap">Category</span>
            </button>
            
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center justify-center space-x-1 xs:space-x-2 bg-white text-blue-900 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm lg:text-base min-h-[44px] flex-shrink-0"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">New Task</span>
              <span className="sm:hidden whitespace-nowrap">Task</span>
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4 sm:space-y-6">
          {activeTab === 'todo' ? (
            <>
              {/* Categories with tasks */}
              {categories.map(category => {
                const categoryTasks = tasks.filter(task => task.category_id === category.id)
                if (categoryTasks.length === 0 && selectedCategoryFilter !== 'all' && selectedCategoryFilter !== category.id) return null
                
                return (
                  <CategorySection
                    key={category.id}
                    category={category}
                    tasks={categoryTasks}
                    activeTab={activeTab}
                    onToggleComplete={toggleComplete}
                    onEditTask={handleEdit}
                    onDeleteTask={handleDelete}
                    onEditCategory={handleEditCategory}
                    onDeleteCategory={handleDeleteCategory}
                  />
                )
              })}
              
              {/* Uncategorized tasks */}
              {todoTasks.filter(task => !task.category_id).length > 0 && (selectedCategoryFilter === 'all' || selectedCategoryFilter === 'uncategorized') && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                      <Clock className="w-6 h-6 text-blue-400" />
                      <span>Uncategorized Tasks</span>
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {todoTasks
                      .filter(task => !task.category_id)
                      .map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggleComplete={toggleComplete}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                  </div>
                </div>
              )}
              
              {todoTasks.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-4">Create your first task to get organized!</p>
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="bg-white text-blue-900 px-4 sm:px-6 py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 min-h-[44px] min-w-[44px]"
                  >
                    Create Task
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Completed Categories with tasks */}
              {categories.map(category => {
                const categoryTasks = tasks.filter(task => task.category_id === category.id)
                if (categoryTasks.length === 0 && selectedCategoryFilter !== 'all' && selectedCategoryFilter !== category.id) return null
                
                return (
                  <CategorySection
                    key={category.id}
                    category={category}
                    tasks={categoryTasks}
                    activeTab={activeTab}
                    onToggleComplete={toggleComplete}
                    onEditTask={handleEdit}
                    onDeleteTask={handleDelete}
                    onEditCategory={handleEditCategory}
                    onDeleteCategory={handleDeleteCategory}
                  />
                )
              })}
              
              {/* Completed Uncategorized tasks */}
              {completedTasks.filter(task => !task.category_id).length > 0 && (selectedCategoryFilter === 'all' || selectedCategoryFilter === 'uncategorized') && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <span>Completed Uncategorized Tasks</span>
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {completedTasks
                      .filter(task => !task.category_id)
                      .map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggleComplete={toggleComplete}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                  </div>
                </div>
              )}
              
              {completedTasks.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2">No completed tasks</h3>
                  <p className="text-gray-600 text-sm sm:text-base px-4">Complete some tasks to see them here!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Category Confirmation Dialog */}
      {showDeleteCategoryConfirmation && (
        <ConfirmationDialog
          isOpen={showDeleteCategoryConfirmation}
          title="Delete Category"
          message="Are you sure you want to delete this category? Tasks in this category will become uncategorized."
          onConfirm={handleConfirmDeleteCategory}
          onCancel={handleCancelDeleteCategory}
          confirmText="Yes, Delete"
          cancelText="Cancel"
        />
      )}

      {/* Delete Category Confirmation Dialog */}
      {showDeleteCategoryConfirmation && (
        <ConfirmationDialog
          isOpen={showDeleteCategoryConfirmation}
          title="Delete Category"
          message="Are you sure you want to delete this category? Tasks in this category will become uncategorized."
          onConfirm={handleConfirmDeleteCategory}
          onCancel={handleCancelDeleteCategory}
          confirmText="Yes, Delete"
          cancelText="Cancel"
        />
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleTaskSubmit}
          onClose={() => {
            setShowTaskForm(false)
            setEditingTask(null)
          }}
        />
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onSubmit={handleCategorySubmit}
          onClose={() => {
            setShowCategoryForm(false)
            setEditingCategory(null)
          }}
        />
      )}
    </div>
  )
}
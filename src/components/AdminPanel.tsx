import React, { useState } from 'react'
import { Shield, Plus, Users, Settings, BarChart3, ArrowLeft, Edit3, Trash2 } from 'lucide-react'
import { useFAACategories } from '../hooks/useFAACategories'
import { FAATaskForm } from './FAATaskForm'
import { Database } from '../lib/supabase'

type FAATask = Database['public']['Tables']['faa_tasks']['Row']

interface AdminPanelProps {
  onNavigateBack: () => void
}

export function AdminPanel({ onNavigateBack }: AdminPanelProps) {
  const { faaCategories, loading, createFAATask, updateFAATask, deleteFAATask } = useFAACategories()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<FAATask | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')

  const getPriorityBackgroundColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/10 border-red-500/20'
      case 'Medium':
        return 'bg-yellow-500/10 border-yellow-500/20'
      case 'Low':
        return 'bg-green-500/10 border-green-500/20'
      default:
        return 'bg-gray-500/10 border-gray-500/20'
    }
  }

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600'
      case 'Medium':
        return 'text-yellow-600'
      case 'Low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const handleTaskSubmit = async (taskData: any) => {
    if (editingTask) {
      await updateFAATask(editingTask.id, taskData)
      setEditingTask(null)
    } else {
      await createFAATask(taskData)
    }
    setShowTaskForm(false)
  }

  const handleEditTask = (task: FAATask) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleDeleteTask = async (id: string) => {
    if (confirm('Are you sure you want to delete this FAA task? This will affect all pilots.')) {
      await deleteFAATask(id)
    }
  }

  const handleNewTask = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setEditingTask(null)
    setShowTaskForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin panel...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Admin Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={onNavigateBack}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] text-sm sm:text-base"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden xs:inline">Back to Dashboard</span>
                <span className="xs:hidden">Back</span>
              </button>
              
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base hidden sm:block">Manage FAA categories and tasks</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-white/30 backdrop-blur-md mx-4 sm:mx-6 mb-4 sm:mb-8">
        {/* Admin Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">FAA Categories</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{faaCategories.length}</p>
              </div>
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Total FAA Tasks</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {faaCategories.reduce((sum, cat) => sum + cat.faa_tasks.length, 0)}
                </p>
              </div>
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Active Pilots</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">-</p>
              </div>
              <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200 col-span-2 sm:col-span-4 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">System Status</p>
                <p className="text-base sm:text-lg font-bold text-green-400">Operational</p>
              </div>
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* FAA Categories Management */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">FAA Categories & Tasks</h2>
          </div>

          {faaCategories.map(category => (
            <div key={category.id} className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    <div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 leading-tight">{category.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {category.faa_tasks.length} tasks • Order: {category.order}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleNewTask(category.id)}
                    className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 text-gray-800 px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 border border-gray-300 min-h-[44px] min-w-[44px] text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Add Task</span>
                    <span className="xs:hidden">Add Task</span>
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {category.faa_tasks.length > 0 ? (
                  <div className="space-y-4">
                    {category.faa_tasks.map((task, index) => (
                      <div key={task.id} className={`rounded-lg sm:rounded-xl p-3 sm:p-4 border transition-all duration-300 ${getPriorityBackgroundColor(task.priority)} hover:shadow-md`}>
                        {/* Row 1: Status bar - Priority, Step Number, FAA Badge */}
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          {/* Left Group: Priority & Step Number */}
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <span className={`text-xs sm:text-sm font-bold uppercase tracking-wide ${getPriorityTextColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            
                            <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-medium text-blue-300">
                              {task.order_in_category}
                            </div>
                          </div>
                          
                          {/* Right Group: FAA Badge */}
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 flex-shrink-0" />
                              <span className="hidden xs:inline">FAA Required</span>
                              <span className="xs:hidden">FAA</span>
                            </span>
                          </div>
                        </div>

                        {/* Row 2: Task title and action buttons */}
                        <div className="flex items-center justify-between mt-2 mb-2 sm:mb-3">
                          <div className="flex-1 pr-2 sm:pr-4">
                            <h4 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight break-words">
                              {task.title}
                            </h4>
                          </div>
                          
                          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            >
                              <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Row 3: Details/Description */}
                        {task.description && (
                          <div className="mt-2">
                            <p className="text-xs sm:text-sm leading-relaxed whitespace-normal break-words text-gray-600">
                              {task.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-2 sm:mb-3" />
                    <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">No tasks in this category yet</p>
                    <button
                      onClick={() => handleNewTask(category.id)}
                      className="bg-white text-blue-900 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 min-h-[44px] min-w-[44px] text-sm sm:text-base"
                    >
                      Add First Task
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAA Task Form Modal */}
      {showTaskForm && (
        <FAATaskForm
          task={editingTask}
          categories={faaCategories}
          selectedCategoryId={selectedCategoryId}
          onSubmit={handleTaskSubmit}
          onClose={() => {
            setShowTaskForm(false)
            setEditingTask(null)
            setSelectedCategoryId('')
          }}
        />
      )}
    </div>
  )
}
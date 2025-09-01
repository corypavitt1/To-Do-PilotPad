import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Folder, Edit3, Trash2, Lock } from 'lucide-react'
import { Database } from '../lib/supabase'
import { TaskCard } from './TaskCard'

type Category = Database['public']['Tables']['categories']['Row']
type Task = Database['public']['Tables']['tasks']['Row']

interface CategorySectionProps {
  category: Category
  tasks: Task[]
  activeTab: 'todo' | 'completed'
  onToggleComplete: (id: string, completed: boolean) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onEditCategory: (category: Category) => void
  onDeleteCategory: (id: string) => void
}

export function CategorySection({
  category,
  tasks,
  activeTab,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onEditCategory,
  onDeleteCategory
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [sortOrder, setSortOrder] = useState<'priority_desc' | 'priority_asc'>('priority_desc')

  // Filter tasks based on active tab, then sort
  const filteredTasks = tasks.filter(task => 
    activeTab === 'todo' ? !task.completed : task.completed
  )

  const filteredAndSortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
    
    if (sortOrder === 'priority_desc') {
      // High to Low priority
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
    } else {
      // Low to High priority
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
    }

    // Then by order in category
    const aOrder = a.order_in_category || 999
    const bOrder = b.order_in_category || 999
    return aOrder - bOrder
  })

  // For sequential categories, determine which tasks should be locked
  const getTaskLockStatus = (taskIndex: number) => {
    if (!category.sequential) return false
    
    // Get all tasks in original order for sequential checking
    const allTasksInOrder = [...tasks].sort((a, b) => {
      const aOrder = a.order_in_category || 999
      const bOrder = b.order_in_category || 999
      return aOrder - bOrder
    })
    
    // Find the current task in the original ordered list
    const currentTask = filteredAndSortedTasks[taskIndex]
    const currentTaskOrderIndex = allTasksInOrder.findIndex(t => t.id === currentTask.id)
    
    // Check if any previous task in the original order is incomplete
    for (let i = 0; i < currentTaskOrderIndex; i++) {
      if (!allTasksInOrder[i].completed) {
        return true // This task should be locked
      }
    }
    return false
  }

  // Calculate progress based on ALL tasks in category, not just filtered ones
  const completedCount = tasks.filter(task => task.completed).length
  const totalCount = tasks.length

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden">
      {/* Category Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            
            <Folder className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            
            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 flex flex-col xs:flex-row xs:items-center xs:space-x-2">
                <span>{category.name}</span>
                {category.sequential && (
                  <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 mt-1 xs:mt-0">
                    <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                    <span className="hidden xs:inline">Sequential</span>
                    <span className="xs:hidden">Seq</span>
                  </span>
                )}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {completedCount} of {totalCount} completed
              </p>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row items-end xs:items-center space-y-2 xs:space-y-0 xs:space-x-2 sm:space-x-3">
            <div>
              <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">Sort by</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'priority_desc' | 'priority_asc')}
                className="w-full xs:w-auto px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-gray-100 border border-gray-300 text-gray-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] truncate"
              >
                <option value="priority_desc">High to Low</option>
                <option value="priority_asc">Low to High</option>
              </select>
            </div>
            
            <button
              onClick={() => onEditCategory(category)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onDeleteCategory(category.id)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 sm:mt-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-green-400 h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1 gap-2">
            <span className="truncate">{Math.round(totalCount > 0 ? (completedCount / totalCount) * 100 : 0)}% complete</span>
            <span className="flex-shrink-0">{completedCount}/{totalCount} tasks</span>
          </div>
        </div>
      </div>

      {/* Tasks */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {filteredAndSortedTasks.length > 0 ? (
            filteredAndSortedTasks.map((task, index) => {
              const isLocked = getTaskLockStatus(index)
              return (
                <div key={task.id}>
                  <TaskCard
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    isLocked={isLocked}
                    showSequentialOrder={category.sequential}
                    sequentialOrder={task.order_in_category || index + 1}
                  />
                </div>
              )
            })
          ) : (
            <div className="text-center py-8">
              <Folder className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-2 sm:mb-3" />
              <p className="text-gray-600 text-sm sm:text-base px-4">
                {activeTab === 'todo' ? 'No pending tasks in this category' : 'No completed tasks in this category'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Shield, Lock } from 'lucide-react'
import { FAACategoryWithTasks } from '../hooks/useFAACategories'
import { FAATaskCard } from './FAATaskCard'

interface FAACategorySectionProps {
  category: FAACategoryWithTasks
  onToggleComplete: (id: string, completed: boolean) => void
  isLocked?: boolean
  initialExpanded?: boolean
}

export function FAACategorySection({
  category,
  onToggleComplete,
  isLocked = false,
  initialExpanded = true
}: FAACategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded)

  const completedCount = category.faa_tasks.filter(task => task.user_progress?.completed).length
  const totalCount = category.faa_tasks.length
  const isComplete = completedCount === totalCount

  // For sequential FAA categories, determine which tasks should be locked
  const getTaskLockStatus = (taskIndex: number) => {
    if (isLocked) return true // Entire category is locked
    
    // Check if any previous task is incomplete
    for (let i = 0; i < taskIndex; i++) {
      if (!category.faa_tasks[i].user_progress?.completed) {
        return true // This task should be locked
      }
    }
    return false
  }

  // Get category-specific background color
  const getCategoryBackgroundColor = () => {
    const categoryName = category.name.toLowerCase()
    if (categoryName.includes('taxi')) {
      return 'bg-[#FDF2E9]' // Light orange
    } else if (categoryName.includes('takeoff') || categoryName.includes('take-off')) {
      return 'bg-[#FBE9E9]' // Light red
    } else if (categoryName.includes('landing')) {
      return 'bg-[#F2F9E9]' // Light green
    }
    return 'bg-[#E9F2FD]' // Light blue
  }

  return (
    <div className={`bg-white rounded-xl sm:rounded-2xl border overflow-hidden ${
      isLocked 
        ? 'border-yellow-500/30 opacity-60' 
        : isComplete 
          ? 'border-green-500/30' 
          : 'border-blue-500/30'
    }`}>
      {/* FAA Category Header */}
      <div className={`p-4 sm:p-6 border-b border-gray-200 ${getCategoryBackgroundColor()}`}>
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
            
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            
            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 flex flex-col xs:flex-row xs:items-center xs:space-x-2">
                <span>{category.name}</span>
                <div className="flex items-center space-x-1 xs:space-x-2 mt-1 xs:mt-0">
                  <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                    <span className="hidden xs:inline">FAA Required</span>
                    <span className="xs:hidden">FAA</span>
                  </span>
                  {isLocked && (
                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                      <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                      <span className="hidden xs:inline">Locked</span>
                      <span className="xs:hidden">🔒</span>
                    </span>
                  )}
                </div>
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {completedCount} of {totalCount} completed
                {isLocked && (
                  <span className="block xs:inline">
                    <span className="hidden xs:inline"> • </span>
                    Complete previous categories first
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
            <div
              className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                isComplete 
                  ? 'bg-gradient-to-r from-green-400 to-green-500' 
                  : 'bg-gradient-to-r from-blue-400 to-indigo-400'
              }`}
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* FAA Tasks */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {category.faa_tasks.map((task, index) => {
            const isTaskLocked = getTaskLockStatus(index)
            return (
              <FAATaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                isLocked={isTaskLocked}
                sequentialOrder={task.order_in_category}
                canComplete={!isLocked}
                showSequentialOrder={true}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
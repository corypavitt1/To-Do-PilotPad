import React, { useState } from 'react'
import { CheckCircle, Circle, Lock, Shield } from 'lucide-react'
import { FAATaskWithProgress } from '../hooks/useFAACategories'
import { ConfirmationDialog } from './ConfirmationDialog'

interface FAATaskCardProps {
  task: FAATaskWithProgress
  onToggleComplete: (id: string, completed: boolean) => void
  isLocked?: boolean
  sequentialOrder: number
  canComplete: boolean
  showSequentialOrder?: boolean
}

export function FAATaskCard({ 
  task, 
  onToggleComplete, 
  isLocked = false,
  sequentialOrder,
  canComplete,
  showSequentialOrder = true
}: FAATaskCardProps) {
  const isCompleted = task.user_progress?.completed || false
  const [showConfirmation, setShowConfirmation] = useState(false)

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

  const handleToggleClick = () => {
    if (canComplete && !isLocked && !isCompleted) {
      setShowConfirmation(true)
    } else if (canComplete && !isLocked && isCompleted) {
      // Allow unchecking without confirmation
      onToggleComplete(task.id, false)
    }
  }

  const handleConfirmComplete = () => {
    onToggleComplete(task.id, true)
    setShowConfirmation(false)
  }

  const handleCancelComplete = () => {
    setShowConfirmation(false)
  }

  return (
    <>
      <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 border transition-all duration-300 ${
        getPriorityBackgroundColor(task.priority)
      } ${
        isCompleted 
          ? 'bg-gray-100 border-gray-200' 
          : isLocked 
            ? 'border-yellow-500/30 opacity-60' 
            : 'hover:shadow-md'
      } ${isLocked ? 'border-yellow-500/30' : ''}`}>
        {/* Row 1: Status bar - Priority, Step Number, Lock Icon, FAA Badge */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          {/* Left Group: Priority & Step Number */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className={`text-xs sm:text-sm font-bold uppercase tracking-wide ${getPriorityTextColor(task.priority)}`}>
              {task.priority}
            </span>
            
            {showSequentialOrder && (
              <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-medium text-blue-300">
                {sequentialOrder}
              </div>
            )}
          </div>
          
          {/* Right Group: Lock Icon & FAA Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isLocked && (
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            )}
            
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 flex-shrink-0" />
              <span className="hidden xs:inline">FAA Required</span>
              <span className="xs:hidden">FAA</span>
            </span>
          </div>
        </div>

        {/* Row 2: Task title and checkbox */}
        <div className="flex items-center justify-between mt-2 mb-2 sm:mb-3">
          <h3 className={`text-sm sm:text-base font-semibold leading-tight break-words flex-1 pr-2 sm:pr-4 ${
            isCompleted 
              ? 'text-gray-500' 
              : isLocked 
                ? 'text-gray-400' 
                : 'text-gray-900'
          }`}>
            {task.title}
          </h3>
          
          <button
            onClick={handleToggleClick}
            className={`transition-colors flex-shrink-0 ${
              isLocked || !canComplete
                ? 'text-gray-500 cursor-not-allowed' 
                : 'text-gray-600 hover:text-blue-600 cursor-pointer'
            } min-h-[44px] min-w-[44px] flex items-center justify-center`}
            disabled={isLocked || !canComplete}
          >
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Row 3: Alerts/Warnings */}
        {isLocked && (
          <div className="mt-1 mb-1">
            <span className="block text-xs sm:text-sm text-yellow-400">
              Complete previous tasks first
            </span>
          </div>
        )}

        {/* Row 4: Details/Description */}
        {task.description && (
          <div className="mt-2">
            <p className={`text-xs sm:text-sm leading-relaxed whitespace-normal break-words ${
              isCompleted 
                ? 'text-gray-400' 
                : isLocked 
                  ? 'text-gray-500' 
                  : 'text-gray-500'
            }`}>
              {task.description}
            </p>
          </div>
        )}
        </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        title="Confirm Task Completion"
        message={`Are you sure you want to mark '${task.title}' as complete? This action cannot be undone.`}
        onConfirm={handleConfirmComplete}
        onCancel={handleCancelComplete}
        confirmText="Yes, Complete"
        cancelText="Cancel"
      />
    </>
  )
}
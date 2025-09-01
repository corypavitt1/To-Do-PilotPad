import React from 'react'
import { Calendar, Trash2, Edit3, CheckCircle, Circle, Lock } from 'lucide-react'
import { Database } from '../lib/supabase'

type Task = Database['public']['Tables']['tasks']['Row']

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string, completed: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  isLocked?: boolean
  showSequentialOrder?: boolean
  sequentialOrder?: number
}

export function TaskCard({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  isLocked = false,
  showSequentialOrder = false,
  sequentialOrder 
}: TaskCardProps) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 border transition-all duration-300 ${
      getPriorityBackgroundColor(task.priority)
    } ${
      task.completed 
        ? 'opacity-60' 
        : 'hover:shadow-md'
    } ${isLocked ? 'border-yellow-500/30' : ''}`}>
      {/* Row 1: Status bar - Priority, Step Number, Checkbox */}
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
        
        {/* Right Group: Checkbox/Lock */}
        <button
          onClick={() => !isLocked && onToggleComplete(task.id, !task.completed)}
          className={`transition-colors ${
            isLocked 
              ? 'text-gray-500 cursor-not-allowed' 
              : 'text-gray-600 hover:text-blue-600 cursor-pointer'
          } min-h-[44px] min-w-[44px] flex items-center justify-center`}
          disabled={isLocked}
        >
          {isLocked ? (
            <Lock className="w-5 h-5 text-yellow-400" />
          ) : task.completed ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Row 2: Task title and action buttons */}
      <div className="flex items-start justify-between mt-2 mb-2 sm:mb-3">
        <div className="flex-1 pr-2 sm:pr-4">
          <h3 className={`text-sm sm:text-base font-semibold leading-tight break-words ${
            task.completed 
              ? 'text-gray-500' 
              : isLocked 
                ? 'text-gray-400' 
                : 'text-gray-900'
          }`}>
            {task.title}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isLocked 
                ? 'text-gray-500 cursor-not-allowed' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
            } min-h-[44px] min-w-[44px] flex items-center justify-center`}
            disabled={isLocked}
          >
            <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Row 3: Alerts/Warnings row */}
      {isLocked && (
        <div className="mt-1 mb-1">
          <span className="block text-xs sm:text-sm text-yellow-400">
            Locked - complete previous tasks first
          </span>
        </div>
      )}

      {/* Row 4: Details row */}
      {(task.description || task.scheduled_for) && (
        <div className="mt-2 space-y-2 sm:space-y-3">
          {task.description && (
            <p className={`text-xs sm:text-sm leading-relaxed whitespace-normal break-words ${
              task.completed 
                ? 'text-gray-400' 
                : isLocked 
                  ? 'text-gray-500' 
                  : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}
          
          {task.scheduled_for && (
            <div className={`flex items-center text-xs sm:text-sm ${isLocked ? 'text-gray-500' : 'text-gray-600'}`}>
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{formatDate(task.scheduled_for)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
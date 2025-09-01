import React, { useState, useEffect } from 'react'
import { X, Calendar } from 'lucide-react'
import { Database } from '../lib/supabase'
import { useCategories } from '../hooks/useCategories'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']

interface TaskFormProps {
  task?: Task | null
  onSubmit: (task: Omit<TaskInsert, 'created_by'>) => void
  onClose: () => void
}

export function TaskForm({ task, onSubmit, onClose }: TaskFormProps) {
  const { categories } = useCategories()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [scheduledFor, setScheduledFor] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
      setScheduledFor(task.scheduled_for ? new Date(task.scheduled_for).toISOString().slice(0, 16) : '')
      setCategoryId(task.category_id || '')
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const taskData: Omit<TaskInsert, 'created_by'> = {
      title,
      description: description || null,
      priority,
      scheduled_for: scheduledFor ? new Date(scheduledFor).toISOString() : null,
      category_id: categoryId || null,
      order_in_category: categoryId ? 1 : null, // Will be updated by the backend logic
    }

    if (task) {
      taskData.id = task.id
    }

    onSubmit(taskData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-800 text-sm sm:text-base font-medium mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="e.g., Renew FAA medical certificate"
            />
          </div>

          <div>
            <label className="block text-gray-800 text-sm sm:text-base font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
              placeholder="Additional details..."
            />
          </div>

          <div>
            <label className="block text-gray-800 text-sm sm:text-base font-medium mb-2">
              Category (Optional)
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            >
              <option value="" className="bg-white">No Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id} className="bg-white">
                  {category.name} {category.sequential ? '(Sequential)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-800 text-sm sm:text-base font-medium mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            >
              <option value="Low" className="bg-white">🟢 Low</option>
              <option value="Medium" className="bg-white">🟡 Medium</option>
              <option value="High" className="bg-white">🔴 High</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-800 text-sm sm:text-base font-medium mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Scheduled For (Optional)
            </label>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
          </div>

          <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-3 sm:space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg sm:rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-100 transition-all duration-200 min-h-[44px] text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-lg sm:rounded-xl bg-white text-blue-900 font-semibold hover:bg-blue-50 transition-all duration-200 min-h-[44px] text-base"
            >
              {task ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
import React, { useState, useEffect } from 'react'
import { X, Folder } from 'lucide-react'
import { Database } from '../lib/supabase'

type Category = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']

interface CategoryFormProps {
  category?: Category | null
  onSubmit: (category: Omit<CategoryInsert, 'created_by'>) => void
  onClose: () => void
}

export function CategoryForm({ category, onSubmit, onClose }: CategoryFormProps) {
  const [name, setName] = useState('')
  const [sequential, setSequential] = useState(false)

  useEffect(() => {
    if (category) {
      setName(category.name)
      setSequential(category.sequential)
    }
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const categoryData: Omit<CategoryInsert, 'created_by'> = {
      name,
      sequential,
    }

    if (category) {
      categoryData.id = category.id
    }

    onSubmit(categoryData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            {category ? 'Edit Category' : 'New Category'}
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
              <Folder className="w-4 h-4 inline mr-1" />
              Category Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="e.g., Pre-Flight, Taxi, Takeoff"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="sequential"
              checked={sequential}
              onChange={(e) => setSequential(e.target.checked)}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="sequential" className="text-gray-800 text-sm sm:text-base">
              <span className="font-medium">Sequential Checklist</span>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed">
                Tasks must be completed in order.
              </p>
            </label>
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
              {category ? 'Update' : 'Create'} Category
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { supabase, Database } from '../lib/supabase'
import { useAuth } from './useAuth'

type FAACategory = Database['public']['Tables']['faa_categories']['Row']
type FAATask = Database['public']['Tables']['faa_tasks']['Row']
type UserFAATask = Database['public']['Tables']['user_faa_tasks']['Row']
type FAATaskInsert = Database['public']['Tables']['faa_tasks']['Insert']
type FAATaskUpdate = Database['public']['Tables']['faa_tasks']['Update']

export interface FAATaskWithProgress extends FAATask {
  user_progress?: UserFAATask
}

export interface FAACategoryWithTasks extends FAACategory {
  faa_tasks: FAATaskWithProgress[]
}

export function useFAACategories() {
  const [faaCategories, setFAACategories] = useState<FAACategoryWithTasks[]>([])
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()

  const fetchFAACategories = async () => {
    if (!user) return

    setLoading(true)
    
    // Fetch FAA categories with their tasks
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('faa_categories')
      .select(`
        *,
        faa_tasks (*)
      `)
      .order('order', { ascending: true })

    if (categoriesError) {
      console.error('Error fetching FAA categories:', categoriesError)
      setLoading(false)
      return
    }

    // Fetch user progress for all FAA tasks
    const { data: progressData, error: progressError } = await supabase
      .from('user_faa_tasks')
      .select('*')
      .eq('user_id', user.id)

    if (progressError) {
      console.error('Error fetching user FAA progress:', progressError)
    }

    // Combine categories with tasks and user progress
    const categoriesWithProgress = categoriesData.map(category => ({
      ...category,
      faa_tasks: category.faa_tasks
        .sort((a, b) => a.order_in_category - b.order_in_category)
        .map(task => ({
          ...task,
          user_progress: progressData?.find(p => p.faa_task_id === task.id)
        }))
    }))

    setFAACategories(categoriesWithProgress)
    setLoading(false)
  }

  useEffect(() => {
    fetchFAACategories()
  }, [user])

  const toggleFAATaskComplete = async (faaTaskId: string, completed: boolean) => {
    if (!user) return { error: new Error('User not authenticated') }

    const completedAt = completed ? new Date().toISOString() : null

    // Check if user progress record exists
    const { data: existingProgress } = await supabase
      .from('user_faa_tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('faa_task_id', faaTaskId)
      .maybeSingle()

    if (existingProgress) {
      // Update existing record
      const { error } = await supabase
        .from('user_faa_tasks')
        .update({ 
          completed, 
          completed_at: completedAt 
        })
        .eq('id', existingProgress.id)

      if (!error) {
        await fetchFAACategories()
      }
      return { error }
    } else {
      // Create new record
      const { error } = await supabase
        .from('user_faa_tasks')
        .insert([{
          user_id: user.id,
          faa_task_id: faaTaskId,
          completed,
          completed_at: completedAt
        }])

      if (!error) {
        await fetchFAACategories()
      }
      return { error }
    }
  }

  // Admin functions
  const createFAATask = async (task: Omit<FAATaskInsert, 'id' | 'created_at'>) => {
    if (!user || profile?.role !== 'admin') {
      return { error: new Error('Admin access required') }
    }

    const { data, error } = await supabase
      .from('faa_tasks')
      .insert([task])
      .select()
      .single()

    if (!error) {
      await fetchFAACategories()
    }

    return { data, error }
  }

  const updateFAATask = async (id: string, updates: FAATaskUpdate) => {
    if (!user || profile?.role !== 'admin') {
      return { error: new Error('Admin access required') }
    }

    const { data, error } = await supabase
      .from('faa_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error) {
      await fetchFAACategories()
    }

    return { data, error }
  }

  const deleteFAATask = async (id: string) => {
    if (!user || profile?.role !== 'admin') {
      return { error: new Error('Admin access required') }
    }

    const { error } = await supabase
      .from('faa_tasks')
      .delete()
      .eq('id', id)

    if (!error) {
      await fetchFAACategories()
    }

    return { error }
  }

  // Get current flight status based on completed FAA categories
  const getFlightStatus = () => {
    const taxiCategory = faaCategories.find(cat => cat.name === 'Taxi Approval')
    const takeoffCategory = faaCategories.find(cat => cat.name === 'Takeoff Approval')
    const landingCategory = faaCategories.find(cat => cat.name === 'Landing Approval')

    const isCategoryComplete = (category?: FAACategoryWithTasks) => {
      if (!category) return false
      return category.faa_tasks.every(task => task.user_progress?.completed)
    }

    if (isCategoryComplete(landingCategory)) {
      return 'Landed'
    } else if (isCategoryComplete(takeoffCategory)) {
      return 'Airborne'
    } else if (isCategoryComplete(taxiCategory)) {
      return 'Taxiing'
    } else {
      return 'Pre-Flight'
    }
  }

  return {
    faaCategories,
    loading,
    toggleFAATaskComplete,
    createFAATask,
    updateFAATask,
    deleteFAATask,
    getFlightStatus,
    refetch: fetchFAACategories,
  }
}
import { useState, useEffect } from 'react'
import { supabase, Database } from '../lib/supabase'
import { useAuth } from './useAuth'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']
type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchTasks = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('created_by', user.id)
      .order('category_id', { ascending: true, nullsFirst: false })
      .order('order_in_category', { ascending: true, nullsFirst: false })
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [user])

  const createTask = async (task: Omit<TaskInsert, 'created_by'>) => {
    if (!user) return { error: new Error('User not authenticated') }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, created_by: user.id }])
      .select()
      .single()

    if (!error && data) {
      setTasks(prev => [data, ...prev])
    }

    return { data, error }
  }

  const updateTask = async (id: string, updates: TaskUpdate) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setTasks(prev => prev.map(task => task.id === id ? data : task))
    }

    return { data, error }
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (!error) {
      setTasks(prev => prev.filter(task => task.id !== id))
    }

    return { error }
  }

  const toggleComplete = async (id: string, completed: boolean) => {
    return updateTask(id, { completed })
  }

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    refetch: fetchTasks,
  }
}
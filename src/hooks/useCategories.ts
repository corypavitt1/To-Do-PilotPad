import { useState, useEffect } from 'react'
import { supabase, Database } from '../lib/supabase'
import { useAuth } from './useAuth'

type Category = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchCategories = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
    } else {
      setCategories(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [user])

  const createCategory = async (category: Omit<CategoryInsert, 'created_by'>) => {
    if (!user) return { error: new Error('User not authenticated') }

    const { data, error } = await supabase
      .from('categories')
      .insert([{ ...category, created_by: user.id }])
      .select()
      .single()

    if (!error && data) {
      setCategories(prev => [...prev, data])
    }

    return { data, error }
  }

  const updateCategory = async (id: string, updates: CategoryUpdate) => {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setCategories(prev => prev.map(cat => cat.id === id ? data : cat))
    }

    return { data, error }
  }

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (!error) {
      setCategories(prev => prev.filter(cat => cat.id !== id))
    }

    return { error }
  }

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  }
}
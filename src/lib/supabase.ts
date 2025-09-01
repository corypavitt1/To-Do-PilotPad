import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          sequential: boolean
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          sequential?: boolean
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          sequential?: boolean
          created_by?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string
          timezone: string
          created_at: string
          role: string
        }
        Insert: {
          id: string
          name?: string | null
          email: string
          timezone?: string
          created_at?: string
          role?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          timezone?: string
          created_at?: string
          role?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          priority: 'Low' | 'Medium' | 'High'
          completed: boolean
          scheduled_for: string | null
          created_at: string
          updated_at: string
          created_by: string
          category_id: string | null
          order_in_category: number | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          priority?: 'Low' | 'Medium' | 'High'
          completed?: boolean
          scheduled_for?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
          category_id?: string | null
          order_in_category?: number | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          priority?: 'Low' | 'Medium' | 'High'
          completed?: boolean
          scheduled_for?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
          category_id?: string | null
          order_in_category?: number | null
        }
      }
      faa_categories: {
        Row: {
          id: string
          name: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      faa_tasks: {
        Row: {
          id: string
          faa_category_id: string
          title: string
          description: string | null
          priority: 'Low' | 'Medium' | 'High'
          order_in_category: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          faa_category_id: string
          title: string
          description?: string | null
          priority?: 'Low' | 'Medium' | 'High'
          order_in_category: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          faa_category_id?: string
          title?: string
          description?: string | null
          priority?: 'Low' | 'Medium' | 'High'
          order_in_category?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_faa_tasks: {
        Row: {
          id: string
          user_id: string
          faa_task_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          faa_task_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          faa_task_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
    }
  }
}
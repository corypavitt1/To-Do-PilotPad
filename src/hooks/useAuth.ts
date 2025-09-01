import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Database } from '../lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      console.log('Starting Supabase profile query...')
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      console.log('Supabase profile query completed')

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      if (data) {
        console.log('Profile fetched successfully:', data)
        setProfile(data)
      } else {
        console.warn('No profile data returned for user:', userId)
      }
    } catch (err) {
      console.error('Unexpected error in fetchProfile:', err)
    }
  }

  const fetchProfileWithTimeout = async (userId: string, timeoutMs: number = 5000) => {
    return Promise.race([
      fetchProfile(userId),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), timeoutMs)
      )
    ])
  }

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setUser(null)
          setProfile(null)
          return
        }

        console.log('Session retrieved:', session ? 'User logged in' : 'No user session')
        setUser(session?.user ?? null)
        
        if (session?.user) {
          try {
            await fetchProfileWithTimeout(session.user.id, 5000)
          } catch (err) {
            console.warn('Profile fetch failed or timed out:', err)
            console.log('Continuing without profile data...')
          }
        }
      } catch (err) {
        console.error('Unexpected error during auth initialization:', err)
        setUser(null)
        setProfile(null)
      } finally {
        console.log('Auth initialization complete, setting loading to false')
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          console.log('Auth state changed:', _event, session ? 'User logged in' : 'User logged out')
          setUser(session?.user ?? null)
          
          if (session?.user) {
            try {
              await fetchProfileWithTimeout(session.user.id, 5000)
            } catch (err) {
              console.warn('Profile fetch failed or timed out during auth state change:', err)
              console.log('Continuing without profile data...')
            }
          } else {
            setProfile(null)
          }
        } catch (err) {
          console.error('Error handling auth state change:', err)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        }
      }
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    })
    return { error }
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  }
}
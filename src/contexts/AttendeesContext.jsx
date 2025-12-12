import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'
import { useLoading } from './LoadingContext'
import * as attendeesApi from '../services/attendeesApi'

const AttendeesContext = createContext()

export function AttendeesProvider({ children }) {
  const [attendees, setAttendees] = useState([])
  const [loading, setLoading] = useState(true)
  const { setLoading: setApiLoading } = useLoading()

  // Fetch all attendees
  const fetchAttendees = useCallback(async () => {
    try {
      setLoading(true)
      const data = await attendeesApi.getAttendees()
      setAttendees(data)
    } catch (error) {
      console.error('Error fetching attendees:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchAttendees()
  }, [fetchAttendees])

  // Set up real-time subscription (if available) or polling fallback
  useEffect(() => {
    let pollInterval
    
    try {
      // Try to set up real-time subscription
      const channel = supabase
        .channel('attendees-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'attendees',
          },
          async (payload) => {
            console.log('Real-time update:', payload)
            // Refetch to get the latest data
            await fetchAttendees()
          }
        )
        .subscribe()

      // If subscription fails, fall back to polling
      channel.on('error', () => {
        console.log('Real-time not available, using polling instead')
        // Poll every 3 seconds
        pollInterval = setInterval(() => {
          fetchAttendees()
        }, 3000)
      })

      return () => {
        supabase.removeChannel(channel)
        if (pollInterval) clearInterval(pollInterval)
      }
    } catch (error) {
      console.log('Real-time not available, using polling instead')
      // Poll every 3 seconds as fallback
      pollInterval = setInterval(() => {
        fetchAttendees()
      }, 3000)

      return () => {
        if (pollInterval) clearInterval(pollInterval)
      }
    }
  }, [fetchAttendees])

  // Create attendee
  const createAttendee = useCallback(
    async (attendeeData) => {
      const loadingKey = `create-${Date.now()}`
      try {
        setApiLoading(loadingKey, true)
        const newAttendee = await attendeesApi.createAttendee(attendeeData)
        // Real-time will update the list automatically
        return newAttendee
      } catch (error) {
        console.error('Error creating attendee:', error)
        throw error
      } finally {
        setApiLoading(loadingKey, false)
      }
    },
    [setApiLoading]
  )

  // Update attendee
  const updateAttendee = useCallback(
    async (id, attendeeData) => {
      const loadingKey = `update-${id}`
      try {
        setApiLoading(loadingKey, true)
        const updated = await attendeesApi.updateAttendee(id, attendeeData)
        // Real-time will update the list automatically
        return updated
      } catch (error) {
        console.error('Error updating attendee:', error)
        throw error
      } finally {
        setApiLoading(loadingKey, false)
      }
    },
    [setApiLoading]
  )

  // Delete attendee
  const deleteAttendee = useCallback(
    async (id) => {
      const loadingKey = `delete-${id}`
      try {
        setApiLoading(loadingKey, true)
        await attendeesApi.deleteAttendee(id)
        // Real-time will update the list automatically
      } catch (error) {
        console.error('Error deleting attendee:', error)
        throw error
      } finally {
        setApiLoading(loadingKey, false)
      }
    },
    [setApiLoading]
  )

  // Toggle check-in
  const toggleCheckIn = useCallback(
    async (id) => {
      const loadingKey = `checkin-${id}`
      try {
        setApiLoading(loadingKey, true)
        const updated = await attendeesApi.toggleCheckIn(id)
        // Real-time will update the list automatically
        return updated
      } catch (error) {
        console.error('Error toggling check-in:', error)
        throw error
      } finally {
        setApiLoading(loadingKey, false)
      }
    },
    [setApiLoading]
  )

  // Toggle badge
  const toggleBadge = useCallback(
    async (id) => {
      const loadingKey = `badge-${id}`
      try {
        setApiLoading(loadingKey, true)
        const updated = await attendeesApi.toggleBadge(id)
        // Real-time will update the list automatically
        return updated
      } catch (error) {
        console.error('Error toggling badge:', error)
        throw error
      } finally {
        setApiLoading(loadingKey, false)
      }
    },
    [setApiLoading]
  )

  // Toggle drink
  const toggleDrink = useCallback(
    async (id) => {
      const loadingKey = `drink-${id}`
      try {
        setApiLoading(loadingKey, true)
        const updated = await attendeesApi.toggleDrink(id)
        // Real-time will update the list automatically
        return updated
      } catch (error) {
        console.error('Error toggling drink:', error)
        throw error
      } finally {
        setApiLoading(loadingKey, false)
      }
    },
    [setApiLoading]
  )

  const value = {
    attendees,
    loading,
    createAttendee,
    updateAttendee,
    deleteAttendee,
    toggleCheckIn,
    toggleBadge,
    toggleDrink,
    refreshAttendees: fetchAttendees,
  }

  return <AttendeesContext.Provider value={value}>{children}</AttendeesContext.Provider>
}

export function useAttendees() {
  const context = useContext(AttendeesContext)
  if (!context) {
    throw new Error('useAttendees must be used within AttendeesProvider')
  }
  return context
}


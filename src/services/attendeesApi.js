// API service functions for attendees
// For local development: calls Supabase directly
// For production: calls Vercel serverless functions

import { supabase } from './supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const USE_DIRECT_SUPABASE = import.meta.env.DEV || import.meta.env.VITE_USE_DIRECT_SUPABASE === 'true'

// Convert snake_case from database to camelCase for frontend
function toCamelCase(data) {
  if (Array.isArray(data)) {
    return data.map(toCamelCase)
  }
  if (data && typeof data === 'object') {
    const camelData = {}
    for (const key in data) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      camelData[camelKey] = data[key]
    }
    return camelData
  }
  return data
}

// Helper function for API calls (uses serverless functions in production)
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  if (options.body) {
    config.body = JSON.stringify(options.body)
  }

  try {
    const response = await fetch(url, config)
    
    let data = null
    
    // Try to parse JSON, but handle empty responses gracefully
    try {
      const text = await response.text()
      if (text && text.trim()) {
        data = JSON.parse(text)
      }
    } catch (parseError) {
      // If parsing fails and response is not ok, provide better error
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}. Response was not valid JSON.`)
      }
      // If response is ok but can't parse, log warning but continue
      console.warn('Response was not JSON but status is OK:', parseError)
    }

    if (!response.ok) {
      const errorMessage = data?.error || `API error: ${response.status} ${response.statusText}`
      throw new Error(errorMessage)
    }

    // If no data and response is ok, return empty object for successful requests
    return data || {}
  } catch (error) {
    console.error('API call error:', error)
    // If it's already an Error with a message, rethrow it
    if (error instanceof Error) {
      throw error
    }
    // Otherwise wrap it
    throw new Error(error.message || 'Unknown API error')
  }
}

// Get all attendees
export async function getAttendees() {
  if (USE_DIRECT_SUPABASE) {
    const { data, error } = await supabase
      .from('attendees')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return toCamelCase(data)
  }
  return apiCall('/attendees')
}

// Get single attendee
export async function getAttendee(id) {
  if (USE_DIRECT_SUPABASE) {
    const { data, error } = await supabase
      .from('attendees')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  }
  return apiCall(`/attendees/${id}`)
}

// Create new attendee (walk-in)
export async function createAttendee(attendeeData) {
  if (USE_DIRECT_SUPABASE) {
    const now = new Date().toISOString()
    // Convert camelCase to snake_case for database
    const dataToInsert = {
      first_name: attendeeData.firstName,
      last_name: attendeeData.lastName,
      email: attendeeData.email,
      registration_type: attendeeData.registrationType,
      drink_type: attendeeData.drinkType,
      checked_in: attendeeData.checkedIn || false,
      received_badge: false,
      received_drink: false,
      created_at: now,
      updated_at: now,
      is_deleted: false,
    }
    
    if (attendeeData.checkedIn) {
      dataToInsert.checked_in_at = now
    }
    
    const { data, error } = await supabase
      .from('attendees')
      .insert([dataToInsert])
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  }
  return apiCall('/attendees', {
    method: 'POST',
    body: attendeeData,
  })
}

// Update attendee (full update)
export async function updateAttendee(id, attendeeData) {
  if (USE_DIRECT_SUPABASE) {
    const { data, error } = await supabase
      .from('attendees')
      .update({
        first_name: attendeeData.firstName,
        last_name: attendeeData.lastName,
        email: attendeeData.email,
        registration_type: attendeeData.registrationType,
        drink_type: attendeeData.drinkType,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  }
  return apiCall(`/attendees/${id}`, {
    method: 'PUT',
    body: attendeeData,
  })
}

// Delete attendee (soft delete)
export async function deleteAttendee(id) {
  if (USE_DIRECT_SUPABASE) {
    const { data, error } = await supabase
      .from('attendees')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  }
  return apiCall(`/attendees/${id}`, {
    method: 'DELETE',
  })
}

// Toggle check-in status
export async function toggleCheckIn(id) {
  if (USE_DIRECT_SUPABASE) {
    // Get current attendee
    const { data: attendee, error: fetchError } = await supabase
      .from('attendees')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single()
    
    if (fetchError) throw fetchError
    
    const now = new Date().toISOString()
    const isCheckingIn = !attendee.checked_in
    
    const updateData = {
      checked_in: isCheckingIn,
      updated_at: now,
    }
    
    if (isCheckingIn) {
      updateData.checked_in_at = now
    } else {
      updateData.checked_in_at = null
      updateData.received_badge = false
      updateData.received_drink = false
      updateData.badge_received_at = null
      updateData.drink_received_at = null
    }
    
    const { data, error } = await supabase
      .from('attendees')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  }
  return apiCall(`/attendees/${id}/checkin`, {
    method: 'PATCH',
  })
}

// Toggle badge status
export async function toggleBadge(id) {
  if (USE_DIRECT_SUPABASE) {
    // Get current attendee
    const { data: attendee, error: fetchError } = await supabase
      .from('attendees')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single()
    
    if (fetchError) throw fetchError
    
    if (!attendee.checked_in) {
      throw new Error('Attendee must be checked in to receive a badge')
    }
    
    const now = new Date().toISOString()
    const isGivingBadge = !attendee.received_badge
    
    const updateData = {
      received_badge: isGivingBadge,
      updated_at: now,
    }
    
    if (isGivingBadge) {
      updateData.badge_received_at = now
    } else {
      updateData.badge_received_at = null
    }
    
    const { data, error } = await supabase
      .from('attendees')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  }
  return apiCall(`/attendees/${id}/badge`, {
    method: 'PATCH',
  })
}

// Toggle drink status
export async function toggleDrink(id) {
  if (USE_DIRECT_SUPABASE) {
    // Get current attendee
    const { data: attendee, error: fetchError } = await supabase
      .from('attendees')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single()
    
    if (fetchError) throw fetchError
    
    if (!attendee.checked_in) {
      throw new Error('Attendee must be checked in to receive a drink')
    }
    
    const now = new Date().toISOString()
    const isGivingDrink = !attendee.received_drink
    
    const updateData = {
      received_drink: isGivingDrink,
      updated_at: now,
    }
    
    if (isGivingDrink) {
      updateData.drink_received_at = now
    } else {
      updateData.drink_received_at = null
    }
    
    const { data, error } = await supabase
      .from('attendees')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  }
  return apiCall(`/attendees/${id}/drink`, {
    method: 'PATCH',
  })
}


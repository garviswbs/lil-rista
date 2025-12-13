import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables:', {
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasViteSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  })
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

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

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      // Get all attendees (excluding soft-deleted)
      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })

      if (error) throw error

      return res.status(200).json(toCamelCase(data))
    }

    if (req.method === 'POST') {
      // Create new attendee
      const { firstName, lastName, email, registrationType, drinkType, checkedIn } = req.body

      // Validation
      if (!firstName || !lastName || !email || !registrationType || !drinkType) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const now = new Date().toISOString()
      // Convert camelCase to snake_case for database
      const attendeeData = {
        first_name: firstName,
        last_name: lastName,
        email,
        registration_type: registrationType,
        drink_type: drinkType,
        checked_in: checkedIn || false,
        received_badge: false,
        received_drink: false,
        created_at: now,
        updated_at: now,
        is_deleted: false,
      }

      // Set check-in timestamp if checking in
      if (checkedIn) {
        attendeeData.checked_in_at = now
      }

      const { data, error } = await supabase
        .from('attendees')
        .insert([attendeeData])
        .select()
        .single()

      if (error) throw error

      return res.status(201).json(toCamelCase(data))
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API error:', error)
    console.error('Error details:', {
      message: error.message,
      supabaseUrl: supabaseUrl ? 'Set' : 'Missing',
      supabaseServiceKey: supabaseServiceKey ? 'Set' : 'Missing',
    })
    return res.status(500).json({ 
      error: error.message || 'Internal server error'
    })
  }
}


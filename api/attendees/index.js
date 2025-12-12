import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

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
        .eq('isDeleted', false)
        .order('createdAt', { ascending: true })

      if (error) throw error

      return res.status(200).json(data)
    }

    if (req.method === 'POST') {
      // Create new attendee
      const { firstName, lastName, email, registrationType, drinkType, checkedIn } = req.body

      // Validation
      if (!firstName || !lastName || !email || !registrationType || !drinkType) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const now = new Date().toISOString()
      const attendeeData = {
        firstName,
        lastName,
        email,
        registrationType,
        drinkType,
        checkedIn: checkedIn || false,
        receivedBadge: false,
        receivedDrink: false,
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
      }

      // Set check-in timestamp if checking in
      if (checkedIn) {
        attendeeData.checkedInAt = now
      }

      const { data, error } = await supabase
        .from('attendees')
        .insert([attendeeData])
        .select()
        .single()

      if (error) throw error

      return res.status(201).json(data)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}


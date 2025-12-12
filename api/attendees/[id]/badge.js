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
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Missing attendee ID' })
  }

  try {
    if (req.method === 'PATCH') {
      // Get current attendee
      const { data: attendee, error: fetchError } = await supabase
        .from('attendees')
        .select('*')
        .eq('id', id)
        .eq('isDeleted', false)
        .single()

      if (fetchError) throw fetchError
      if (!attendee) {
        return res.status(404).json({ error: 'Attendee not found' })
      }

      // Validation: Must be checked in to receive badge
      if (!attendee.checkedIn) {
        return res.status(400).json({ error: 'Attendee must be checked in to receive a badge' })
      }

      const now = new Date().toISOString()
      const isGivingBadge = !attendee.receivedBadge

      const updateData = {
        receivedBadge: isGivingBadge,
        updatedAt: now,
      }

      if (isGivingBadge) {
        updateData.badgeReceivedAt = now
      } else {
        updateData.badgeReceivedAt = null
      }

      const { data, error } = await supabase
        .from('attendees')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return res.status(200).json(data)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}


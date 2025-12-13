import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/badge.js:33',message:'[id]/badge.js handler called',data:{method:req.method,url:req.url,query:req.query},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
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
        .eq('is_deleted', false)
        .single()

      if (fetchError) throw fetchError
      if (!attendee) {
        return res.status(404).json({ error: 'Attendee not found' })
      }

      // Validation: Must be checked in to receive badge
      if (!attendee.checked_in) {
        return res.status(400).json({ error: 'Attendee must be checked in to receive a badge' })
      }

      const now = new Date().toISOString()
      const isGivingBadge = !attendee.received_badge

      // Convert camelCase to snake_case for database
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

      return res.status(200).json(toCamelCase(data))
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}


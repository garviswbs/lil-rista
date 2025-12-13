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
      // #region agent log
      // fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/index.js:33',message:'GET /api/attendees - querying database',data:{method:'GET'},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      // Get all attendees (excluding soft-deleted)
      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })

      // #region agent log
      if (error) {
        fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/index.js:42',message:'GET /api/attendees - database error',data:{error:error.message,code:error.code},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      } else {
        fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/index.js:44',message:'GET /api/attendees - query successful',data:{count:data?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      }
      // #endregion
      if (error) throw error

      return res.status(200).json(toCamelCase(data))
    }

    if (req.method === 'POST') {
      // #region agent log
      // fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/index.js:50',message:'POST /api/attendees - received request',data:{hasBody:!!req.body},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
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

      // #region agent log
      // fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/index.js:75',message:'POST /api/attendees - inserting data',data:{keys:Object.keys(attendeeData)},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const { data, error } = await supabase
        .from('attendees')
        .insert([attendeeData])
        .select()
        .single()

      // #region agent log
      if (error) {
        fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/index.js:82',message:'POST /api/attendees - insert error',data:{error:error.message,code:error.code},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      } else {
        fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/index.js:84',message:'POST /api/attendees - insert successful',data:{id:data?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      }
      // #endregion
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


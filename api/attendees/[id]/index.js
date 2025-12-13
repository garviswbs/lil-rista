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
  console.log(JSON.stringify({location:'api/attendees/[id]/index.js:33',message:'api/attendees/[id]/index.js handler called',data:{method:req.method,url:req.url,queryId:req.query?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'}));
  // #endregion
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { id } = req.query

  if (!id) {
    // #region agent log
    console.log(JSON.stringify({location:'api/attendees/[id]/index.js:46',message:'api/attendees/[id]/index.js missing ID',data:{method:req.method,query:req.query},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'}));
    // #endregion
    return res.status(400).json({ error: 'Missing attendee ID' })
  }

  try {
    if (req.method === 'GET') {
      // Get single attendee
      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .eq('id', id)
        .eq('is_deleted', false)
        .single()

      if (error) throw error

      if (!data) {
        return res.status(404).json({ error: 'Attendee not found' })
      }

      return res.status(200).json(toCamelCase(data))
    }

    if (req.method === 'PUT') {
      // #region agent log
      console.log(JSON.stringify({location:'api/attendees/[id]/index.js:68',message:'PUT handler in [id]/index.js called',data:{id,hasBody:!!req.body,bodyKeys:req.body?Object.keys(req.body):[]},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'}));
      // #endregion
      // Update attendee (full update)
      const { firstName, lastName, email, registrationType, drinkType } = req.body

      // Validation
      if (!firstName || !lastName || !email || !registrationType || !drinkType) {
        // #region agent log
        console.log(JSON.stringify({location:'api/attendees/[id]/index.js:73',message:'PUT validation failed',data:{hasFirstName:!!firstName,hasLastName:!!lastName,hasEmail:!!email,hasRegistrationType:!!registrationType,hasDrinkType:!!drinkType},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'}));
        // #endregion
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Convert camelCase to snake_case for database
      const updateData = {
        first_name: firstName,
        last_name: lastName,
        email,
        registration_type: registrationType,
        drink_type: drinkType,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('attendees')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // #region agent log
      console.log(JSON.stringify({location:'api/attendees/[id]/index.js:95',message:'PUT handler successful',data:{id,updated:!!data},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'}));
      // #endregion
      return res.status(200).json(toCamelCase(data))
    }

    if (req.method === 'DELETE') {
      // Soft delete attendee
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

      return res.status(200).json(toCamelCase(data))
    }

    // #region agent log
    console.log(JSON.stringify({location:'api/attendees/[id]/index.js:117',message:'api/attendees/[id]/index.js returning 405',data:{method:req.method,id},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'}));
    // #endregion
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}


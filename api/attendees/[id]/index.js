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
  fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/index.js:33',message:'handler - entry',data:{method:req.method,query:req.query,hasBody:!!req.body,url:req.url},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/index.js:40',message:'handler - OPTIONS request',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    return res.status(200).end()
  }

  const { id } = req.query

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/index.js:45',message:'handler - extracted id',data:{id,hasId:!!id},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  if (!id) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/index.js:48',message:'handler - missing id error',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return res.status(400).json({ error: 'Missing attendee ID' })
  }

  try {
    if (req.method === 'GET') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/index.js:50',message:'handler - GET method',data:{id},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
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
      fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/index.js:68',message:'handler - PUT method entry',data:{id,hasBody:!!req.body,bodyKeys:req.body?Object.keys(req.body):[]},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      // Update attendee (full update)
      const { firstName, lastName, email, registrationType, drinkType } = req.body

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/index.js:72',message:'handler - PUT extracted fields',data:{hasFirstName:!!firstName,hasLastName:!!lastName,hasEmail:!!email,hasRegistrationType:!!registrationType,hasDrinkType:!!drinkType},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'E'})}).catch(()=>{});
      // #endregion

      // Validation
      if (!firstName || !lastName || !email || !registrationType || !drinkType) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/index.js:76',message:'handler - PUT validation failed',data:{missingFields:{firstName:!firstName,lastName:!lastName,email:!email,registrationType:!registrationType,drinkType:!drinkType}},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'E'})}).catch(()=>{});
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

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/index.js:87',message:'handler - PUT before supabase update',data:{updateKeys:Object.keys(updateData)},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const { data, error } = await supabase
        .from('attendees')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      // #region agent log
      if (error) {
        fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/index.js:94',message:'handler - PUT supabase error',data:{error:error.message,code:error.code},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'D'})}).catch(()=>{});
      } else {
        fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/index.js:96',message:'handler - PUT supabase success',data:{hasData:!!data,dataId:data?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      }
      // #endregion

      if (error) throw error

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/index.js:100',message:'handler - PUT before response',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
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
    fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/index.js:117',message:'handler - method not allowed',data:{method:req.method},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d9c66d5-6008-4f87-99a2-68bf46bb9175',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/attendees/[id]/index.js:120',message:'handler - catch error',data:{error:error.message,errorType:error.constructor.name,hasSupabaseUrl:!!supabaseUrl,hasServiceKey:!!supabaseServiceKey},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    console.error('API error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}


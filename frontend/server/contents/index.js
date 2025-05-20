import { getQuery, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const supabase = useSupabaseServerClient(event)
  const method  = event.node.req.method
  const q       = getQuery(event)

  // GET /api/contents?sortBy=created_at&order=desc
  if (method === 'GET') {
    const sortBy = q.sortBy || 'created_at'
    const order  = (q.order === 'asc') ? { ascending: true } : { ascending: false }
    const { data, error } = await supabase
      .from('contents')
      .select(`id,title,description,image_url,created_at,
               (select count(*) from likes where likes.content_id = contents.id) as like_count,
               (select json_agg(row_to_json(c)) from comments c where c.content_id = contents.id) as comments`)
      .order(sortBy, order)
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    return data
  }

  // POST /api/contents
  if (method === 'POST') {
    const body = await readBody(event)
    const { title, description, image_url } = body
    const payload = { title, description, image_url, created_at: new Date() }
    const { data, error } = await supabase
      .from('contents')
      .insert(payload)
      .select('*')
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    return data[0]
  }

  // 其他方法不允许
  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
```  
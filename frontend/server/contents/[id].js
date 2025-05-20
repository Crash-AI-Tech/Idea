import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const supabase = useSupabaseServerClient(event)
  const method  = event.node.req.method
  const { id }  = event.context.params

  // GET /api/contents/:id
  if (method === 'GET') {
    const { data, error } = await supabase
      .from('contents')
      .select(`id,title,description,image_url,created_at,
               (select count(*) from likes where likes.content_id = contents.id) as like_count,
               (select json_agg(row_to_json(c)) from comments c where c.content_id = contents.id) as comments`)
      .eq('id', id)
      .single()
    if (error) throw createError({ statusCode: 404, statusMessage: 'Not Found' })
    return data
  }

  // PUT /api/contents/:id
  if (method === 'PUT') {
    const body = await readBody(event)
    const { title, description, image_url } = body
    const { data, error } = await supabase
      .from('contents')
      .update({ title, description, image_url })
      .eq('id', id)
      .select('*')
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    return data[0]
  }

  // DELETE /api/contents/:id
  if (method === 'DELETE') {
    const { error } = await supabase.from('contents').delete().eq('id', id)
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    return { id, deleted: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})

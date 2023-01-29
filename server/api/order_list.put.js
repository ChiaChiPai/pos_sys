import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { id, count, modified_at } = await readBody(event)
  const { data, error } = await client
    .from('order_list')
    .update({ count, modified_at })
    .eq('id', id)
  return { data, error }
})


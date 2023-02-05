import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const payload = await readBody(event)
  const { data } = await client
    .from('order_list')
    .insert(payload)
  return data
})


import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { user_id, order_id, discount, is_checkout } = await readBody(event)
  const { data } = await client
    .from('order_overview')
    .insert([
      { user_id, order_id, discount, is_checkout }
    ])
    .select('order_id')
  return { data }
})


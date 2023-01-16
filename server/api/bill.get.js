import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { data } = await client
    .from('order_overview')
    .select(`
      order_id,
      discount,
      is_checkout,
      order_list(name, price, count)
    `)
  return data
})
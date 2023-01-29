import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { startTime, endTime } = getQuery(event)
  const { data } = await client
    .from('order_overview')
    .select(`
      order_id,
      discount,
      is_checkout,
      created_at,
      order_list(name, price, count, id)
    `)
    .gte('created_at', startTime)
    .lte('created_at', endTime)
  return data
})
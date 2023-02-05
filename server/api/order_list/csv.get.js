import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { startTime, endTime } = getQuery(event)
  const { data } = await client
    .from('order_list')
    .select(`
      order_id,
      created_at,
      name,
      order_overview(discount),
      count,
      price
    `)
    .gte('created_at', startTime)
    .lte('created_at', endTime)
  return data
})


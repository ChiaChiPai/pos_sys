import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { startTime, endTime, page, pageSize } = getQuery(event)
  const { data } = await client
    .from('order_list')
    .select(`
      order_id,
      name,
      price,
      count,
      created_at,
      order_overview(discount)
    `)
    .gte('created_at', startTime)
    .lte('created_at', endTime)
    .range(page*pageSize, ((page+1)*pageSize) - 1)
  return data
})


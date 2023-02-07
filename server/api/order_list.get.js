import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { startTime, endTime, page, pageSize, userId } = getQuery(event)
  const { data } = await client
    .from('order_list')
    .select(`
      order_id,
      name,
      price,
      count,
      created_at,
      order_overview!inner(user_id, discount)
    `)
    .filter('order_overview.user_id', 'eq', userId)
    .gte('created_at', startTime)
    .lte('created_at', endTime)
    .range(page*pageSize, ((page+1)*pageSize) - 1)
  return data
})


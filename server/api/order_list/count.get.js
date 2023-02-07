import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { startTime, endTime, userId } = getQuery(event)
  const { count } = await client
    .from('order_list')
    .select(`
      *,
      order_overview!inner(user_id)
    `, { count: 'exact', head: true })
    .filter('order_overview.user_id', 'eq', userId)
    .gte('created_at', startTime)
    .lte('created_at', endTime)
  return count
})


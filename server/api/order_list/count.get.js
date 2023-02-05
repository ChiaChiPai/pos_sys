import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { startTime, endTime } = getQuery(event)
  const { count } = await client
    .from('order_list')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startTime)
    .lte('created_at', endTime)
  return count
})


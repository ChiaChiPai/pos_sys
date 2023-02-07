import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { startTime, endTime, userId } = getQuery(event)
  const { data } = await client
    .from('order_overview')
    .select(`
      order_id,
      discount,
      is_checkout,
      created_at,
      user_id,
      order_list(name, price, count, id)
    `)
    .gte('created_at', startTime)
    .lte('created_at', endTime)
    .eq('user_id', userId)

  return data
})
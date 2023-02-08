import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { startTime, endTime, userId, isCheckout } = getQuery(event)
  const { data } = await client
    .from('order_list')
    .select(`
      order_id,
      created_at,
      name,
      order_overview!inner(discount, user_id, is_checkout),
      count,
      price
    `)
    .filter('order_overview.user_id', 'eq', userId)
    .filter('order_overview.is_checkout', 'eq', isCheckout)
    .gte('created_at', startTime)
    .lte('created_at', endTime)
  return data
})


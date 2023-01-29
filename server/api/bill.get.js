import { serverSupabaseClient } from '#supabase/server'
import { useStartOfDay, useEndOfDay } from '~~/composables/dayjs'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { data } = await client
    .from('order_overview')
    .select(`
      order_id,
      discount,
      is_checkout,
      created_at,
      order_list(name, price, count, id)
    `)
    .gte('created_at', useStartOfDay())
    .lte('created_at', useEndOfDay())
  return data
})
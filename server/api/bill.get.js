import { serverSupabaseClient } from '#supabase/server'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

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
    .gte('created_at', dayjs().startOf('day').utc().format())
    .lte('created_at', dayjs().endOf('day').utc().format())
  return data
})
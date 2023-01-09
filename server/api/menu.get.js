/* eslint-disable no-undef */
import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const query = getQuery(event)
  const { data } = await client
    .from('menu')
    .select('name, price, is_sold_out, type')
    .eq('user_id', query.id)
  return data
})
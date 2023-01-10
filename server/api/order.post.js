/* eslint-disable no-undef */
import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { user_id, order_id } = await readBody(event)
  const { data, error } = await client
    .from('order_list')
    .insert([
      { user_id, order_id }
    ])
    .select('user_id,order_id')
  return { data, error }
})


/* eslint-disable no-undef */
import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { user_id, order_id, discount, isCheckOut } = await readBody(event)
  const { data, error } = await client
    .from('order_overview')
    .insert([
      { user_id, order_id, discount, isCheckOut }
    ])
    .select('order_id')
  return { data, error }
})


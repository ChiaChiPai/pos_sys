/* eslint-disable no-undef */
import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const payload = await readBody(event)
  const { data, error } = await client
    .from('order_list')
    .insert(payload)
  return { data, error }
})

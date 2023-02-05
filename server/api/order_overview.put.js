import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { is_checkout, order_id } = await readBody(event)
  const { data } = await client
    .from('order_overview')
    .update(
      { 'is_checkout': is_checkout }
    )
    .eq('order_id', order_id)
  return { data }
})


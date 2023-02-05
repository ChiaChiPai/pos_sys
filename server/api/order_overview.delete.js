import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { order_id } = await readBody(event)
  const { data } = await client
    .from('order_overview')
    .delete()
    .eq('order_id', order_id)
  return { data }
})


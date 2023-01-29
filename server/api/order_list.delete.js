import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { id } = await readBody(event)
  const { data, error } = await client
    .from('order_list')
    .delete()
    .eq('id', id)
  return { data, error }
})


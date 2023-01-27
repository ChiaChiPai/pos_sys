import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { id, count } = await readBody(event)
  console.log('put', id, count)
  const { data, error } = await client
    .from('order_list')
    .update({ count })
    .eq('id', id)
  return { data, error }
})


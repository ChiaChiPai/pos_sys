import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const query = getQuery(event)
  const { data } = await client
    .from('menu')
    .select('id, name, price, type')
    .eq('user_id', query.id)
  return data
})
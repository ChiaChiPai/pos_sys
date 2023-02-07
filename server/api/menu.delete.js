import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async(event) => {
  const client = serverSupabaseClient(event)
  const { id } = await readBody(event)
  const { data } = await client
    .from('menu')
    .delete()
    .eq('id', id)
  return data
})
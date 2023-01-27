/* eslint-disable no-undef */
const getUserInfo = async() => {
  const { data: userInfo } = await useFetch(
    '/api/user',
    {
      method: 'get',
      headers: useRequestHeaders(['cookie'])
    }
  )
  useSetUserInfo(userInfo)
}

export default defineNuxtRouteMiddleware(async(to) => {
  const user = useSupabaseUser()

  if(user.value && to.path === '/login')
    navigateTo('/')
  else if(!user.value && to.path !== '/login')
    navigateTo('/login')
  else if(user.value)
    useSetUserInfo(user.value)

})
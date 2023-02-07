/* eslint-disable no-undef */
export default defineNuxtRouteMiddleware(async(to) => {
  const user = useSupabaseUser()

  if(user.value && to.path === '/login')
    navigateTo('/')
  else if(!user.value && to.path !== '/login')
    navigateTo('/login')
  else if(user.value)
    useSetUserInfo(user.value)

})
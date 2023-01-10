/* eslint-disable no-undef */
import { useUserStore } from '~/stores/auth'

const getUserInfo = async() => {
  const store = useUserStore()
  const { data: user } = await useFetch(
    '/api/user',
    {
      method: 'get',
      headers: useRequestHeaders(['cookie'])
    }
  )
  store.$patch({
    userInfo: user
  })
}
export default defineNuxtRouteMiddleware(async(to) => {
  const user = useSupabaseUser()
  if(!user.value && to.path !== '/login') {
    navigateTo('/login')
  }
  else if(user.value && to.path === '/login') {
    navigateTo('/')
    await getUserInfo()
  }
  else {
    await getUserInfo()
  }
})
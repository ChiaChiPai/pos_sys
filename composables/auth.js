import { useUserStore } from '~/stores/auth'

export function useSetUserInfo(userInfo) {
  const store = useUserStore()
  store.$patch({
    userInfo
  })
}
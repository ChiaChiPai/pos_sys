import pkg from 'lodash'
const { groupBy } = pkg

async function getMenuInfo({ userId }) {
  const { data, error: { value: error }, refresh, pending } = await useFetch(
    '/api/menu',
    {
      method: 'get',
      headers: useRequestHeaders(['cookie']),
      params: {
        id: userId
      }
    }
  )

  if(error)
    useErrorHandler({ msg: '發生錯誤: 拿取菜單資訊錯誤', error })

  return { data, refresh, pending }
}

async function postMenuItem({ payload }) {
  const { data, error: { value: error }, refresh, pending } = await useFetch(
    '/api/menu',
    {
      method: 'post',
      headers: useRequestHeaders(['cookie']),
      body: payload
    }
  )

  if(error)
    useErrorHandler({ msg: '發生錯誤: 新增菜單品項', error })

  return { data, refresh, pending }
}

async function deleteMenuItem({ id }) {
  const { data, error: { value: error }, refresh, pending } = await useFetch(
    '/api/menu',
    {
      method: 'delete',
      headers: useRequestHeaders(['cookie']),
      body: {
        id
      }
    }
  )

  if(error)
    useErrorHandler({ msg: '發生錯誤: 新增菜單品項', error })

  return { data, refresh, pending }
}

export async function useGetMenuInfo({ userId }) {
  const { data: menus, refresh, pending } = await getMenuInfo({ userId })
  const groupMenus = groupBy(menus.value, 'type')
  Object.keys(groupMenus).forEach(key => {
    groupMenus[key] = groupMenus[key].map((item, idx) => ({ ...item, count: 1, id: idx + 1 }))
  })

  return { data: groupMenus, refresh, pending }
}

export async function useGetMenuSettingInfo({ userId }) {
  const { data, refresh, pending } = await getMenuInfo({ userId })
  return { data, refresh, pending }
}

export async function usePostMenuItem({ payload }) {
  await postMenuItem({ payload })
}

export async function useDeleteMenuItem({ id }) {
  await deleteMenuItem({ id })
}
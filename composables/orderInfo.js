import { useUserStore } from '~/stores/auth'

const store = useUserStore()
const { userInfo } = store

async function getOrderInfo() {
  const { data, error: { value: error }, refresh, pending } = await useFetch(
    '/api/bill',
    {
      method: 'get',
      headers: useRequestHeaders(['cookie'])
    }
  )

  if(error)
    useErrorHandler({ msg: '發生錯誤: 拿取訂單資訊錯誤', error })

  return { data, refresh, pending }
}

async function postOrder({ discountRate, isCheckout: is_checkout }) {
  const {
    data: { value: { data: response, error } }
  } = await useFetch(
    '/api/order_overview',
    {
      method: 'post',
      headers: useRequestHeaders(['cookie']),
      body: {
        user_id: userInfo.id,
        order_id: Date.now(),
        discount: discountRate >= 1 ? 1 : discountRate,
        is_checkout
      }
    }
  )

  if(error)
    useErrorHandler({ msg: '發生錯誤: 拿取訂單編號', error })

  return { response }
}

async function postOrderList({ orderList, orderID: order_id }) {
  const {
    data: { value: { error } }
  } = await useFetch(
    '/api/order_list',
    {
      method: 'post',
      headers: useRequestHeaders(['cookie']),
      body: orderList.map(({ name, price, count }) => ({
        order_id,
        name,
        price,
        count
      }))
    }
  )

  if(error)
    useErrorHandler({ msg: '發生錯誤: 送出訂單', error })
}

async function updateOrder({ orderID: order_id, isCheckout: is_checkout }) {
  const {
    data: { value: { error } }
  } = await useFetch(
    '/api/order_overview',
    {
      method: 'put',
      headers: useRequestHeaders(['cookie']),
      body: {
        order_id,
        is_checkout
      }
    }
  )

  if(error)
    useErrorHandler({ msg: '發生錯誤: 確認訂單', error })
}

async function updateOrderItem({ id, count, modifiedAt: modified_at }) {
  const {
    data: { value: { error } }
  } = await useFetch(
    '/api/order_list',
    {
      method: 'put',
      headers: useRequestHeaders(['cookie']),
      body: {
        id,
        count,
        modified_at
      }
    }
  )

  if(error)
    useErrorHandler({ msg: '發生錯誤: 修改訂單', error })
}


async function deleteOrder({ orderID: order_id }) {
  const {
    data: { value: { error } }
  } = await useFetch(
    '/api/order_overview',
    {
      method: 'delete',
      headers: useRequestHeaders(['cookie']),
      body: {
        order_id
      }
    }
  )

  if(error)
    useErrorHandler({ msg: '發生錯誤: 刪除訂單', error })
}

async function deleteOrderItem({ id }) {
  const {
    data: { value: { error } }
  } = await useFetch(
    '/api/order_list',
    {
      method: 'delete',
      headers: useRequestHeaders(['cookie']),
      body: {
        id
      }
    }
  )

  if(error)
    useErrorHandler({ msg: '發生錯誤: 刪除單一品項', error })
}

export async function useGetOrderInfo() {
  const { data, refresh, pending } = await getOrderInfo()
  const filerBillData = data.value.filter(data => data.order_list.length === 0)
  if(filerBillData.length > 0) {
    filerBillData.forEach(async(data) =>
      await useDeleteOrder({ orderID: data.order_id }))
  }
  return { data, refresh, pending }
}

export async function usePostOrderInfo({ discountRate, isCheckout, orderList }) {
  const { response } = await postOrder({ discountRate, isCheckout })
  await postOrderList({ orderList, orderID: response[0].order_id })
}

export async function useUpdateOrder({ orderID, isCheckout }) {
  await updateOrder({ orderID, isCheckout })
}

export async function useUpdateOrderItem({ id, count, modifiedAt }) {
  await updateOrderItem({ id, count, modifiedAt })
}

export async function useDeleteOrder({ orderID }) {
  await deleteOrder({ orderID })
}

export async function useDeleteOrderItem({ id }) {
  await deleteOrderItem({ id })
}
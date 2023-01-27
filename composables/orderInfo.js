import { useUserStore } from '~/stores/auth'

const store = useUserStore()
const { userInfo } = store

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

async function updateOrderItem({ id, count }) {
  const {
    data: { value: { error } }
  } = await useFetch(
    '/api/order_list',
    {
      method: 'put',
      headers: useRequestHeaders(['cookie']),
      body: {
        id,
        count
      }
    }
  )

  if(error)
    useErrorHandler({ msg: '發生錯誤: 修改訂單', error })
}



export async function usePostOrderInfo({ discountRate, isCheckout, orderList }) {
  const { response } = await postOrder({ discountRate, isCheckout })
  await postOrderList({ orderList, orderID: response[0].order_id })
}

export async function useUpdateOrder({ orderID, isCheckout }) {
  await updateOrder({ orderID, isCheckout })
}

export async function useUpdateOrderItem({ id, count }) {
  console.log(1, id, count)
  await updateOrderItem({ id, count })
}
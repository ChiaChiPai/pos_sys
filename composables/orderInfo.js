import { useUserStore } from '~/stores/auth'

const store = useUserStore()
const { userInfo } = store

async function getOrderInfo({ startTime, endTime, userId }) {
  const { data, error: { value: error }, refresh, pending } = await useFetch(
    '/api/bill',
    {
      method: 'get',
      headers: useRequestHeaders(['cookie']),
      query: { startTime, endTime, userId }
    }
  )

  if(error)
    useErrorHandler({ msg: '發生錯誤: 拿取訂單資訊錯誤', error })

  return { data, refresh, pending }
}

async function getBillHistory({ startTime, endTime, page = 0 }) {
  const { data: { value: count } } = await useFetch(
    '/api/order_list/count',
    {
      method: 'get',
      headers: useRequestHeaders(['cookie']),
      query: { startTime, endTime, userId: userInfo.id }
    }
  )
  const pageSize = useLocalStorage('pageSize')
  const totalPages = Math.floor(count / +pageSize.value) + 1
  const { data: list, error: { value: error }, refresh, pending } = await useFetch(
    '/api/order_list',
    {
      method: 'get',
      headers: useRequestHeaders(['cookie']),
      query: { startTime, endTime, page, pageSize, userId: userInfo.id }
    }
  )
  if(error)
    useErrorHandler({ msg: '發生錯誤: 拿取帳務資訊錯誤', error })

  return { data: { list, totalPages }, refresh, pending }
}

function buildData(data) {

  return new Promise((resolve, reject) => {

    // 最後所有的資料會存在這
    const arrayData = []

    // 取 data 的第一個 Object 的 key 當表頭
    const arrayTitle = Object.keys(data[0])
    arrayData.push(arrayTitle)

    // 取出每一個 Object 裡的 value，push 進新的 Array 裡
    Array.prototype.forEach.call(data, d => {
      const items = []
      Array.prototype.forEach.call(arrayTitle, title => {
        const item = d[title] || '無'
        items.push(item)
      })
      arrayData.push(items)
    })

    resolve(arrayData)
  })

}

async function getBillHistoryCsv({ startTime, endTime }) {
  const { data, error: { value: error }, pending } = await useFetch(
    '/api/order_list/csv',
    {
      method: 'get',
      headers: useRequestHeaders(['cookie']),
      query: { startTime, endTime, userId: userInfo.id }
    }
  )
  const formatData = await buildData(
    data.value.map(({ order_id, created_at, name, count, order_overview, price }) => ({
      order_id,
      created_at: useFormatDateTime(created_at),
      name,
      count,
      discount: order_overview.discount,
      price
    }))
  )
  if(error)
    useErrorHandler({ msg: '發生錯誤: 匯出 csv 錯誤', error })

  return { data: formatData, pending }
}

async function postOrder({ discountRate, isCheckout: is_checkout }) {
  const {
    data: { value: { data: response } }, error: { value: error }
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
    error: { value: error }
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
    error: { value: error }
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
    error: { value: error }
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
    error: { value: error }
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
    error: { value: error }
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

export async function useGetOrderInfo({ startTime, endTime, userId }) {
  const { data, refresh, pending } = await getOrderInfo({ startTime, endTime, userId })
  const filerBillData = data.value.filter(data => data.order_list.length === 0)
  if(filerBillData.length > 0) {
    filerBillData.forEach(async(data) =>
      await useDeleteOrder({ orderID: data.order_id }))
  }
  return { data, refresh, pending }
}

function billHistoryDTO(data) {
  return data.map(({ name, price, count, order_id, created_at, order_overview }) => ({
    name,
    price,
    count,
    order_id,
    created_at: useFormatDateTime(created_at),
    discount: order_overview.discount
  }))
}

export async function useGetBillHistory({ startTime, endTime, page }) {
  const { data: { list, totalPages }, refresh, pending } = await getBillHistory({ startTime, endTime, page })
  return { data: { list: billHistoryDTO(list.value), totalPages }, refresh, pending }
}

export async function useGetBillHistoryCsv({ startTime, endTime }) {
  const { data, pending } = await getBillHistoryCsv({ startTime, endTime })
  return { data, pending }
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
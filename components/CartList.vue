<script setup>
import { ElMessage } from 'element-plus'
import { useUserStore } from '~/stores/auth'

const emit = defineEmits(['changeOrderCount', 'clearOrderList'])

const props = defineProps(
  {
    orderList: {
      type: Array,
      default: () => []
    }
  }
)

const options = [
  {
    value: '0.95',
    label: '0.95'
  },
  {
    value: '0.9',
    label: '0.9'
  },
  {
    value: '0.85',
    label: '0.85'
  },
  {
    value: '0.8',
    label: '0.8'
  }
]
const discountRate = ref(null)
const discountedTotal = ref(null)

const total = computed(() =>
  props.orderList
    ?.reduce((pre, cur) => pre + (cur.price * cur.count), 0)
)

const applyDiscount = () => {
  if(discountRate.value > 1) {
    ElMessage.error('想賠錢嗎？輸入小於 1 的數字!!')
    return
  }
  discountedTotal.value = total.value * (discountRate ? discountRate.value : 1)
}

const store = useUserStore()
const { userInfo } = store

const resetCartStatus = () => {
  emit('clearOrderList')
  discountRate.value = null
  discountedTotal.value = null
}

const checkOut = async({ isCheckOut }) => {
  const {
    data: { value: { data: response } },
    error: { value: order_overview_error }
  } = await useFetch(
    '/api/order_overview',
    {
      method: 'post',
      headers: useRequestHeaders(['cookie']),
      body: {
        user_id: userInfo.id,
        order_id: Date.now(),
        discount: discountedTotal.value ? parseFloat(discountRate.value) : 1,
        isCheckOut
      }
    }
  )

  if(order_overview_error)
    throw createError(order_overview_error)

  const {
    error: { value: order_list_error }
  } = await useFetch(
    '/api/order_list',
    {
      method: 'post',
      headers: useRequestHeaders(['cookie']),
      body: props.orderList.map(({ name, price, count }) => ({
        order_id: response[0].order_id,
        name,
        price,
        count
      }))
    }
  )

  if(order_list_error)
    throw createError(order_list_error)

  resetCartStatus()
}

</script>

<template>
  <div class="pointer-events-none fixed inset-y-0 right-0 z-10 flex max-w-full pl-10">
    <div class="pointer-events-auto w-screen max-w-sm">
      <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
        <div class="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
          <div class="mt-8">
            <div class="flow-root">
              <ul
                role="list"
                class="-my-6 divide-y divide-gray-200"
              >
                <li
                  v-for="order in props.orderList"
                  :key="order.name"
                  class="flex py-6"
                >
                  <div class="ml-4 flex flex-1 flex-col">
                    <div>
                      <div class="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href="#">{{ order.name }}</a>
                        </h3>
                        <p class="ml-4">
                          ${{ order.price }}
                        </p>
                      </div>
                      <p class="mt-1 text-sm text-gray-500">
                        {{ order.type }}
                      </p>
                    </div>
                    <div class="flex flex-1 items-end justify-between text-sm">
                      <el-input-number
                        :model-value="order.count"
                        :min="1"
                        @change="(changedCount) => emit('changeOrderCount', { name: order.name, changedCount })"
                      />

                      <div class="flex">
                        <button
                          type="button"
                          class="font-medium text-[#f00]"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
          <div class="mb-2 flex items-center justify-between text-base font-medium text-gray-900">
            <p class="mr-auto">
              折扣
            </p>
            <client-only>
              <el-select
                v-model="discountRate"
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder="請選擇"
                class="w-[40%]"
                :disabled="!props.orderList?.length"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </client-only>
            <el-button
              type="warning"
              plain
              :disabled="!discountRate"
              @click="applyDiscount"
            >
              套用
            </el-button>
          </div>
          <div class="flex justify-between text-base font-medium text-gray-900">
            <p class="">
              總共
            </p>
            <del v-if="discountedTotal">${{ total }}</del>
            <p
              v-else
              class="text-xl"
            >
              ${{ total ? total : 0 }}
            </p>
          </div>
          <div
            v-show="discountedTotal"
            class="flex justify-between font-medium text-gray-900"
          >
            <p>折扣後</p>
            <p class="text-xl text-red-700 ">
              ${{ discountedTotal }}
            </p>
          </div>
          <div class="mt-3">
            <el-button
              type="warning"
              class="w-full"
              size="large"
              :disabled="!props.orderList?.length"
              @click="checkOut({ isCheckOut: false })"
            >
              加入待結帳清單
            </el-button>
          </div>
          <div class="mt-5">
            <el-button
              type="danger"
              class="w-full"
              size="large"
              :disabled="!props.orderList?.length"
              @click="checkOut({ isCheckOut: true })"
            >
              立即結帳
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style>

</style>
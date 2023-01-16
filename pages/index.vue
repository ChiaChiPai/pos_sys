<script setup>
import { groupBy } from 'lodash'
import { useUserStore } from '~/stores/auth'

const tableData = ref({})
const isShowCartList = ref(false)

const cartTotal = computed(() => exist_order_list.value ? exist_order_list.value.length : 0)

const exist_order_list = useSessionStorage(
  'order_list',
  null,
  {
    serializer: {
      read: (v) => v ? JSON.parse(v) : null,
      write: (v) => JSON.stringify(v)
    }
  }
)

const store = useUserStore()
const { userInfo } = store

const { data: menus } = await useFetch(
  '/api/menu',
  {
    method: 'get',
    headers: useRequestHeaders(['cookie']),
    params: {
      id: userInfo.id
    }
  }
)

const groupMenus = groupBy(menus.value, 'type')
Object.keys(groupMenus).forEach(key => {
  groupMenus[key] = groupMenus[key].map((item, idx) => ({ ...item, count: 1, id: idx + 1 }))
})
tableData.value = groupMenus

const addToCart = async({ name, count, price, type }) => {
  const mergeArray = (origin, income) => {
    const isExist = origin.find(item => item.name === income.name)
    if(isExist) {
      return origin
        .map(item => (
          item.name === income.name ?
            {
              ...item,
              count: item.count + income.count
            } : item
        ))
    }
    else {
      return [...origin, income]
    }
  }

  exist_order_list.value ?
    exist_order_list.value = mergeArray(exist_order_list.value, { name, count, price, type }) :
    exist_order_list.value = [{ name, count, price, type }]
}

const changeOrderCount = ({ name, changedCount }) => {
  exist_order_list.value = exist_order_list.value
    .map(order => {
      if(order.name === name) {
        return {
          ...order,
          count: changedCount
        }
      }
      else {
        return order
      }
    })
}

const clearOrderList = () => {
  console.log('clear order')
  exist_order_list.value = null
}

const showCarlist = () => {
  isShowCartList.value= true
}
const hideCarlist = () => {
  isShowCartList.value= false
}
</script>

<template>
  <div>
    <div class="relative h-screen">
      <el-tabs
        v-model="Object.keys(tableData)[0]"
        type="card"
      >
        <el-tab-pane
          v-for="(menu, idx) in tableData"
          :key="idx"
          :label="idx.toUpperCase()"
          :name="idx"
        >
          <OrderTable
            :table-data="menu"
            @add-to-cart="addToCart"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <template
        v-if="isShowCartList"
      >
        <div
          class="fixed top-0 left-0 z-10 h-screen w-screen bg-[rgba(0,0,0,0.3)]"
          @click="hideCarlist"
        />
        <CartList
          :class="{'right-0': isShowCartList, '-right-full':!isShowCartList }"
          :order-list="exist_order_list"
          @change-order-count="changeOrderCount"
          @clear-order-list="clearOrderList"
        />
      </template>
    </div>
    <ShopCart
      :total="cartTotal"
      @click="showCarlist"
    />
  </div>
</template>


<style lang="postcss">

</style>
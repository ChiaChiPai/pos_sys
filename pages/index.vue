<script setup>
import { groupBy } from 'lodash'
import { useUserStore } from '~/stores/auth'

const tableData = ref({})
const isShowCartList = ref(false)


const store = useUserStore()
const { userInfo } = await store

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

const client = useSupabaseClient()

const addToCart = async() => {
  // const { data, error } = await useFetch(
  //   '/api/order',
  //   {
  //     method: 'post',
  //     headers: useRequestHeaders(['cookie']),
  //     body: {
  //       user_id: userInfo.id,
  //       order_id: Date.now()
  //     }
  //   }
  // )
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
      <div
        v-if="isShowCartList"
        class="fixed top-0 left-0 z-10 h-screen w-screen bg-[rgba(0,0,0,0.3)]"
        @click="hideCarlist"
      />
      <CartList
        :class="{'right-0': isShowCartList, '-right-full':!isShowCartList }"
      />
    </div>
    <ShopCart
      :total="11"
      @click="showCarlist"
    />
  </div>
</template>


<style lang="postcss">

</style>
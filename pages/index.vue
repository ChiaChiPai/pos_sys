<script setup>
import { groupBy } from 'lodash'
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { data: menus } = await supabase
  .from('menu')
  .select('name, price, is_sold_out, type')
  .eq('user_id', user.value.id)

const tableData = ref({})

const groupMenus = groupBy(menus, 'type')
Object.keys(groupMenus).forEach(key => {
  groupMenus[key] = groupMenus[key].map((item, idx) => ({ ...item, count: 1, id: idx + 1 }))
})
tableData.value = groupMenus

const isShowCartList = ref(false)
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
          <OrderTable :table-data="menu" />
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
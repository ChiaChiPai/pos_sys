<script setup>
const tableData = ref({
  snack: [
    {
      id: '1',
      name: '原味司康',
      price: 200,
      count: 0,
      soldOut: true
    },
    {
      id: '2',
      name: '原味司康',
      price: 200,
      count: 0,
      soldOut: true
    },
    {
      id: '3',
      name: '原味司康',
      price: 200,
      count: 0,
      soldOut: true
    },
    {
      id: '4',
      name: '原味司康',
      price: 200,
      count: 0,
      soldOut: false
    },
    {
      id: '5',
      name: '鮮奶油',
      price: 50,
      discount: 1,
      count: 10,
      soldOut: false
    }
  ],
  drink: [
    {
      id: '1',
      name: '飲料1',
      price: 200,
      count: 0,
      soldOut: true
    },
    {
      id: '2',
      name: '飲料2',
      price: 200,
      count: 0,
      soldOut: true
    },
    {
      id: '3',
      name: '飲料3',
      price: 200,
      count: 0,
      soldOut: true
    }
  ]
})

const tabMap = {
  snack: '點心',
  drink: '飲料'
}
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
          :label="tabMap[idx]"
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
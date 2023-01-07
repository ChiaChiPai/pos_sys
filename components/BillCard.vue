<script setup>
import { property } from 'lodash'

const props = defineProps({
  billData: {
    type: Array,
    required: true,
    default: () => []
  }
})

const summaryMethod = ({ columns, data }) => {
  const sum = []
  columns.forEach((column, index) => {
    if(index === 0) {
      sum[index] = '總計'
      return
    }
    if(column.property === 'count') {
      const total = data.reduce((pre, cur) => pre+cur.count, 0)
      sum[index] = total
    }
    if(column.property === 'price') {
      const total = data.reduce((pre, cur) => pre + (cur.price * cur.count), 0)
      sum[index] = total
    }
  })
  return sum
}
</script>

<template>
  <el-card
    v-for="bill in props.billData"
    :key="bill.id"
    class="mb-8"
  >
    <div>
      <client-only>
        <el-table
          :data="bill"
          stripe
          size="large"
          row-class-name="text-lg"
          :show-summary="true"
          :summary-method="summaryMethod"
        >
          <el-table-column
            prop="id"
            label="編號"
            min-width="60"
          />
          <el-table-column
            prop="name"
            label="品項"
            min-width="120"
          />
          <el-table-column
            prop="count"
            label="數量"
          />
          <el-table-column
            prop="price"
            label="價錢"
          />
        </el-table>
      </client-only>
      <div class="mt-5 flex justify-end">
        <el-button
          class="w-full"
          size="large"
          type="warning"
        >
          結帳
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<style lang="postcss">
.el-table__footer {
  @apply text-lg
}
</style>
<script setup>
const props = defineProps({
  billData: {
    type: Array,
    required: true,
    default: () => []
  },
  refresh: {
    type: Function,
    required: true
  }
})

const billData = computed(() => {
  return props.billData
    .map(item => ({
      ...item,
      order_list: item.order_list
        .map((order, index) => ({
          ...order, id: index+1,
          discount: item.discount
        }))
    }))
})

const summaryMethod = ({ columns, data }) => {
  const discount = data[0].discount
  return columns.reduce((sum, column, index) => {
    if(column.property === 'id')
      sum[index] = '總計'

    if(column.property === 'count') {
      const total = data.reduce((pre, cur) => pre + cur.count, 0)
      sum[index] = total
    }
    if(column.property === 'price') {
      const total = data.reduce((pre, cur) => pre + (cur.price * cur.count), 0)
      sum[index] = total
    }
    if(column.property === 'discount') {
      const total = data.reduce((pre, cur) => pre + (cur.price * cur.count), 0)
      sum[index] = Math.round(total * discount)
    }
    return sum
  }, [])
}

const spanMethod = ({ rowIndex, columnIndex }) => {
  if(columnIndex === 4) {
    if (rowIndex % 100 === 0) {
      return {
        rowspan: 100,
        colspan: 1
      }
    }
    else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

const checkOut = async({ orderID }) => {
  await useUpdateOrder({ isCheckout: true, orderID })
}
</script>

<template>
  <el-card
    v-for="(billList, index) in billData"
    :key="index"
    class="mb-8"
  >
    <div>
      <client-only>
        <el-table
          :data="billList.order_list"
          stripe
          size="large"
          :border="true"
          row-class-name="text-lg"
          :show-summary="true"
          :summary-method="summaryMethod"
          :span-method="(info) => spanMethod(info)"
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
          <el-table-column
            prop="discount"
            label="折扣"
          >
            <template #default="scope">
              <div>
                {{ +scope.row.discount >= 1 ? '無' : scope.row.discount }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </client-only>
      <div class="mt-5 flex justify-end">
        <el-button
          size="large"
          @click="props.refresh"
        >
          修改
        </el-button>
        <el-button
          size="large"
          class="mr-auto"
          type="danger"
          plain
          @click="props.refresh"
        >
          刪除
        </el-button>
        <el-button
          size="large"
          type="warning"
          :disabled="billList.is_checkout"
          @click="checkOut({ orderID: billList.order_id })"
        >
          - - 結帳 - -
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
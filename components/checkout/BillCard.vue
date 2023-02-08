<script setup>
import { useModalStore } from '~~/stores/modal'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  billData: {
    type: Array,
    required: true,
    default: () => []
  },
  refresh: {
    type: Function,
    required: true
  },
  pending: {
    type: Boolean,
    required: true
  }
})

const billData = computed(() => {
  const billList = props.billData
    .map(item => ({
      ...item,
      order_list: item.order_list
        .map((order, index) => ({
          ...order,
          sid: index + 1,
          discount: item.discount
        }))
        .sort((a, b) => a.id - b.id)
    }))

  return new Array(0)
    .concat(...billList.filter(bill => !bill.is_checkout).sort((a, b) => b.order_id - a.order_id))
    .concat(...billList.filter(bill => bill.is_checkout).sort((a, b) => b.order_id - a.order_id))
})

const summaryMethod = ({ columns, data }) => {
  const discount = data[0].discount
  return columns.reduce((sum, column, index) => {
    if(column.property === 'sid')
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
  try {
    await ElMessageBox.confirm(
      '確定要結帳嗎？',
      'Warning',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await useFullScreenLoading([
      async() => await useUpdateOrder({ isCheckout: true, orderID }),
      async() => await props.refresh()
    ])
  }
  catch (e) {}
}

const handleEdit = async(info) => {
  const dialog = useModalStore()
  dialog.changeEditInfo(info)
}

const handleDelete = async({ id }) => {
  try {
    await ElMessageBox.confirm(
      '確定要刪除這筆資料嗎？',
      'Warning',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await useFullScreenLoading([
      async() => await useDeleteOrderItem({ id }),
      async() => await props.refresh(),
      () => ElMessage({
        type: 'success',
        message: 'Delete completed'
      })
    ])
  }
  catch(e) {}
}
</script>

<template>
  <client-only>
    <el-card
      v-for="(billList, index) in billData"
      :key="index"
      class="mb-8"
    >
      <div>
        <div class="mb-2 flex justify-between text-xs text-gray-400">
          <h6>單號: {{ billList.order_id }}</h6>
          <p>{{ useFormatDateTime(billList.created_at) }}</p>
        </div>

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
            prop="sid"
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
            label="原價"
          />
          <el-table-column
            prop="discount"
            label="折扣後"
            width="80"
          >
            <template #default="scope">
              <div>
                {{ +scope.row.discount >= 1 ? '無' : scope.row.discount }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="Operations"
            width="220"
          >
            <template #default="scope">
              <el-button
                size="large"
                :disabled="billList.is_checkout"
                @click="handleEdit(scope.row)"
              >
                修改
              </el-button>
              <el-button
                size="large"
                type="danger"
                :disabled="billList.is_checkout"
                @click="handleDelete(scope.row)"
              >
                刪除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-5 flex justify-end">
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
  </client-only>
</template>

<style lang="postcss">
.el-table__footer {
  @apply text-lg
}
</style>
<script setup>
import dayjs from 'dayjs'

const isCheckoutOption = [
  {
    value: true,
    label: '已結帳'
  },
  {
    value: false,
    label: '未結帳'
  }
]
const ruleFormRef = ref(null)
const form = reactive({
  isCheckout: ref(true),
  dateTimeRange: ref([])
})
const rules = reactive({
  isCheckout: [
    {
      required: true,
      message: '請確實輸入',
      trigger: 'change'
    }
  ],
  dateTimeRange: [
    {
      required: true,
      message: '請確實輸入',
      trigger: 'change'
    }
  ]
})
const billHistoryResult = ref([])
const shortcuts = [
  {
    text: 'Last Month',
    value: () => {
      return [dayjs().month(dayjs().month()-1).startOf('month'), dayjs().month(dayjs().month()-1).endOf('month')]
    }
  },
  {
    text: 'Last Week',
    value: () => {
      return [dayjs().subtract(7, 'day').startOf('week'), dayjs().subtract(7, 'day').endOf('week')]
    }
  },
  {
    text: 'This Month',
    value: () => {
      return [dayjs().startOf('month'), dayjs()]
    }
  },
  {
    text: 'This Week',
    value: () => {
      return [dayjs().startOf('week'), dayjs()]
    }
  },
  {
    text: 'Yesterday',
    value: () => {
      return [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')]
    }
  },
  {
    text: 'Today',
    value: () => {
      return [dayjs().startOf('day'), dayjs()]
    }
  }
]
const allPage = ref(1)
const currentPage = ref(1)
const localPageSize = useLocalStorage('pageSize', null,
  {
    serializer: {
      read: (v) => v ? parseInt(v, 10) : null,
      write: (v) => parseInt(v, 10)
    }
  }
)
const pageSize = localPageSize.value ? localPageSize : ref(25)

const summaryMethod = ({ columns, data }) => {
  if(data.length === 0) return 0
  return columns.reduce((sum, column, index) => {
    if(column.property === 'order_id')
      sum[index] = '總計'
    if(column.property === 'count') {
      const total = data.reduce((pre, cur) => pre + cur.count, 0)
      sum[index] = total
    }
    if(column.property === 'price') {
      const total = data.reduce((pre, cur) => pre + (cur.price * cur.count * cur.discount), 0)
      sum[index] = Math.round(total)
    }
    return sum
  }, [])
}

const handleSizeChange = (value) => {
  localPageSize.value = value
  pageSize.value = value
}

const searchThroughDateAndTime = async(page = 0) => {
  const { data } = await useGetBillHistory(
    {
      startTime: useFormatTime(form.dateTimeRange[0]),
      endTime: useFormatTime(form.dateTimeRange[1]),
      page,
      isCheckout: form.isCheckout
    }
  )
  const { list, totalPages } = data
  allPage.value = totalPages
  billHistoryResult.value = list
}

const search = async(formEl) => {
  useHandleSubmit({ formEl, callback: () => searchThroughDateAndTime(0) })
}

const downloadCsv = async() => {
  const { data } = await useGetBillHistoryCsv({
    startTime: useFormatTime(form.dateTimeRange[0]),
    endTime: useFormatTime(form.dateTimeRange[1]),
    isCheckout: form.isCheckout
  })
  let csvContent = ''
  Array.prototype.forEach.call(data, d => {
    const dataString = `${d.join(',')}\n`
    csvContent += dataString
  })
  const link = document.createElement('a')
  link.setAttribute('href', `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURI(csvContent)}`)
  link.setAttribute('download', `${useFormatDate(form.dateTimeRange[0])}-${useFormatDate(form.dateTimeRange[1])}`)
  link.click()
}

const searchAndExport = async(formEl) => {
  useHandleSubmit({ formEl, callback: downloadCsv })
}

</script>

<template>
  <div>
    <client-only>
      <el-card class="mb-3">
        <div class="mb-2 text-xl">
          <span>歷史帳款查詢</span>
        </div>
        <el-form
          ref="ruleFormRef"
          :model="form"
          :rules="rules"
          class="flex justify-items-stretch"
        >
          <el-form-item prop="isCheckout">
            <el-select v-model="form.isCheckout">
              <el-option
                v-for="item in isCheckoutOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="flex-1"
            prop="dateTimeRange"
          >
            <el-date-picker
              v-model="form.dateTimeRange"
              type="datetimerange"
              :shortcuts="shortcuts"
              range-separator="到"
              start-placeholder="開始時間"
              end-placeholder="結束時間"
              class="mr-5"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="search(ruleFormRef)"
            >
              查詢
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchAndExport(ruleFormRef)">
              匯出全部
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-table
        :data="billHistoryResult"
        stripe
        class="mb-2"
        :show-summary="true"
        :summary-method="summaryMethod"
      >
        <el-table-column
          type="index"
          width="50"
          :index="v => (currentPage-1)*pageSize + v + 1"
        />
        <el-table-column
          prop="order_id"
          label="ID"
        />
        <el-table-column
          prop="created_at"
          label="建立時間"
          width="180"
        />
        <el-table-column
          prop="isCheckout"
          label="狀態"
        />
        <el-table-column
          prop="name"
          label="品項"
        />
        <el-table-column
          prop="discount"
          label="折扣"
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
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[25, 50, 100, 5000]"
        layout="sizes, prev, pager, next, jumper"
        :page-count="allPage"
        @size-change="(value) => handleSizeChange(value)"
        @current-change="(page) => searchThroughDateAndTime(page - 1)"
      />
    </client-only>
  </div>
</template>

<style lang="postcss">
.el-pagination__sizes {
  @apply mr-auto
}
.el-pagination__jump {
  @apply ml-auto
}
</style>
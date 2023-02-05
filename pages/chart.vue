<script setup>
const dateTimeRange = ref('')
const billHistoryResult = ref([])
const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - (3600 * 1000 * 24 * 7))
      return [start, end]
    }
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - (3600 * 1000 * 24 * 30))
      return [start, end]
    }
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - (3600 * 1000 * 24 * 90))
      return [start, end]
    }
  }
]
const allPage = ref(1)
const currentPage = ref(1)
const pageSize = useLocalStorage('pageSize', null,
  {
    serializer: {
      read: (v) => v ? parseInt(v, 10) : null,
      write: (v) => parseInt(v, 10)
    }
  }
)

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

const searchThroughDateAndTime = async(page = 0) => {
  const { data } = await useGetBillHistory(
    {
      startTime: useFormatTime(dateTimeRange.value[0]),
      endTime: useFormatTime(dateTimeRange.value[1]),
      page
    }
  )
  const { list, totalPages } = data
  allPage.value = totalPages
  billHistoryResult.value = list
}

const handleSizeChange = (value) => {
  pageSize.value = value
}

const downloadCsv = async() => {
  const { data } = await useGetBillHistoryCsv({
    startTime: useFormatTime(dateTimeRange.value[0]),
    endTime: useFormatTime(dateTimeRange.value[1])
  })
  console.log('csv', data)
  let csvContent = ''
  Array.prototype.forEach.call(data, d => {
    const dataString = `${d.join(',')}\n`
    csvContent += dataString
  })
  const link = document.createElement('a')
  link.setAttribute('href', `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURI(csvContent)}`)
  link.setAttribute('download', `${useFormatDate(dateTimeRange.value[0])}-${useFormatDate(dateTimeRange.value[1])}`)
  link.click()
}

</script>

<template>
  <div>
    <client-only>
      <el-card class="mb-3">
        <div class="mb-2 text-xl">
          <span>歷史帳款查詢</span>
        </div>
        <div class="flex">
          <el-date-picker
            v-model="dateTimeRange"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="到"
            start-placeholder="開始時間"
            end-placeholder="結束時間"
            class="mr-5"
          />
          <el-button
            type="primary"
            @click="searchThroughDateAndTime(0)"
          >
            查詢
          </el-button>
          <el-button @click="downloadCsv">
            匯出全部
          </el-button>
        </div>
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
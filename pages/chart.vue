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
const searchThroughDateAndTime = async() => {
  const { data, pending } = await useGetBillHistory(
    {
      startTime: useFormatTime(dateTimeRange.value[0]),
      endTime: useFormatTime(dateTimeRange.value[1])
    }
  )
  billHistoryResult.value = data
}

</script>

<template>
  <div class="">
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
          @click="searchThroughDateAndTime"
        >
          查詢
        </el-button>
      </div>
    </el-card>
    <el-table
      :data="billHistoryResult"
      stripe
    >
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
        prop="count"
        label="數量"
      />
      <el-table-column
        prop="discount"
        label="折扣"
      />
      <el-table-column
        prop="price"
        label="價錢"
      />
    </el-table>
  </div>
</template>

<style lang="postcss">
</style>
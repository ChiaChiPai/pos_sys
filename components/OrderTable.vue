<script setup>
const props = defineProps(
  {
    'tableData': {
      type: Object,
      default: () => {}
    }
  }
)

const canNotAddToCart = (info) => info.soldOut || info.count === 0

const addToCart = (info) => {
  console.log(info)
}
</script>

<template>
  <div>
    <el-table
      :data="props.tableData"
      stripe
      size="large"
      style="width: 100%"
      row-class-name="text-lg"
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
        prop="price"
        label="價錢"
      />
      <el-table-column
        label="數量"
        width="250"
      >
        <template #default="slot">
          <el-input-number
            v-model="slot.row.count"
            :disabled="slot.row.soldOut"
            :min="1"
            size="large"
          />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="動作"
      >
        <template #default="slot">
          <el-button
            :disabled="canNotAddToCart(slot.row)"
            size="large"
            type="warning"
            plain
            @click="addToCart(slot.row)"
          >
            加入
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="設定"
      >
        <template #default="slot">
          <el-switch
            v-model="slot.row.is_sold_out"
            class="ml-2"
            width="60"
            inline-prompt
            style="--el-switch-on-color: #F00"
            active-text="售罄"
            inactive-text="充足"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="postcss">
</style>
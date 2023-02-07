<script setup>
const emit = defineEmits(['addToCart'])
const props = defineProps(
  {
    'tableData': {
      type: Object,
      default: () => {}
    }
  }
)
</script>

<template>
  <client-only>
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
            size="large"
            type="warning"
            plain
            @click="emit('addToCart', slot.row)"
          >
            加入
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </client-only>
</template>

<style lang="postcss">
</style>
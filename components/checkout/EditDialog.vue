<script setup>
import { cloneDeep } from 'lodash'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true
  },
  dialogInfo: {
    type: Array,
    default: () => {}
  },
  pending: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['hideDialogVisible', 'editConfirm'])
const cloneDialogInfo = computed(() => cloneDeep(props.dialogInfo))
</script>

<template>
  <client-only>
    <el-dialog
      :model-value="isDialogVisible"
      title="修改單一品項資訊"
    >
      <client-only>
        <el-table
          :data="cloneDialogInfo"
        >
          <el-table-column
            prop="name"
            label="品項"
          />
          <el-table-column
            label="數量"
          >
            <template #default="slot">
              <el-input-number
                v-model="slot.row.count"
                :min="1"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="價錢"
            min-width="40"
          />
        </el-table>
      </client-only>
      <template #footer>
        <span>
          <el-button @click="emit('hideDialogVisible')">取消</el-button>
          <el-button
            type="primary"
            :loading="pending"
            @click="emit('editConfirm', ...cloneDialogInfo)"
          >
            確認
          </el-button>
        </span>
      </template>
    </el-dialog>
  </client-only>
</template>

<style lang="postcss">
</style>
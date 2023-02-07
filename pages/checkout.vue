<script setup>
import { useModalStore } from '~~/stores/modal'

const user = useSupabaseUser()
const { data, refresh, pending } = await useGetOrderInfo({ startTime: useStartOfDay(), endTime: useEndOfDay(), userId: user.value.id })
const billData = computed(() => data.value.filter(item => item.order_list.length > 0))

const isDialogVisible = ref(false)
let dialogInfo = reactive([])
const dialog = useModalStore()

watch(
  () => dialog.editInfo,
  (info) => {
    if (Object.keys(info).length > 0) {
      isDialogVisible.value = true
      dialogInfo = [info]
    }
  }
)

const hideDialogVisible = () => {
  isDialogVisible.value = false
  dialog.resetEditInfo()
}

const editConfirm = async({ id, count }) => {
  const modifiedAt = useCurrentTime()
  await useUpdateOrderItem({ id, count, modifiedAt })
  await refresh()
  isDialogVisible.value = false
}


</script>

<template>
  <div>
    <CheckoutBillCard
      v-if="billData.length > 0"
      :bill-data="billData"
      :refresh="refresh"
      :pending="pending"
    />
    <h2
      v-else
      class="text-center text-gray-400"
    >
      今日還沒有出單資料喔！！
    </h2>
    <CheckoutEditDialog
      :is-dialog-visible="isDialogVisible"
      :dialog-info="dialogInfo"
      :pending="pending"
      @hide-dialog-visible="hideDialogVisible()"
      @edit-confirm="(editInfo) => editConfirm(editInfo)"
    />
  </div>
</template>

<style lang="postcss">
</style>
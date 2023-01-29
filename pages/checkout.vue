<script setup>
import { useModalStore } from '~~/stores/modal'

const { data, refresh, pending } = await useGetOrderInfo()
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
      :bill-data="billData"
      :refresh="refresh"
      :pending="pending"
    />
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
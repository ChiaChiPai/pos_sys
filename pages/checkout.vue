<script setup>
import { useModalStore } from '~~/stores/modal'

const { data: billData, refresh, pending } = await useFetch(
  '/api/bill',
  {
    method: 'get',
    headers: useRequestHeaders(['cookie'])
  }
)

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
  await useUpdateOrderItem({ id, count })
  await refresh()
  isDialogVisible.value = false
}


</script>

<template>
  <div>
    <CheckoutBillCard
      :bill-data="billData"
      :refresh="refresh"
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
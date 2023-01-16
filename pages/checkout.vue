<script setup>
const { data: billData, refresh } = await useFetch(
  '/api/bill',
  {
    method: 'get',
    headers: useRequestHeaders(['cookie'])
  }
)
</script>

<template>
  <BillCard
    :bill-data="billData"
    :refresh="refresh"
  />
</template>

<style lang="postcss">
</style>
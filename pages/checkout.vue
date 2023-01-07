<script setup>
const billData = [
  [
    {
      id: '1',
      name: '原味司康',
      price: 200,
      count: 1
    },
    {
      id: '2',
      name: '抹茶司康',
      price: 200,
      count: 1
    },
    {
      id: '3',
      name: '飲料1',
      price: 200,
      count: 2
    },
    {
      id: '4',
      name: '鮮奶油',
      price: 50,
      count: 2
    }
  ],
  [
    {
      id: '1',
      name: '飲料1',
      price: 200,
      count: 2
    },
    {
      id: '2',
      name: '抹茶司康',
      price: 200,
      count: 1
    }
  ]
]
</script>

<template>
  <BillCard :bill-data="billData" />
</template>

<style lang="postcss">
</style>
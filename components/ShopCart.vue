<script setup>
const props = defineProps({
  total: {
    type: Number,
    default: 0
  }
})

</script>

<template>
  <div
    class="fixed right-10 bottom-5 cursor-pointer"
  >
    <el-badge
      :value="props.total"
      :max="99"
    >
      <el-icon
        size="60"
        color="#848484"
      >
        <ShoppingCartFull />
      </el-icon>
    </el-badge>
  </div>
</template>

<style lang="postcss">
</style>
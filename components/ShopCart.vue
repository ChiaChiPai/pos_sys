<script setup>
const props = defineProps({
  total: {
    type: Number,
    required: true
  }
})

</script>

<template>
  <div
    class="fixed right-10 bottom-5 cursor-pointer"
  >
    <el-badge
      :value="props.total"
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
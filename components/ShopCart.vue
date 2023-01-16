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
    <client-only>
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
    </client-only>
  </div>
</template>
<script setup>
defineEmits(['signOut'])
const isCollapse = ref(true)
const handleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<template>
  <div class="absolute z-10">
    <client-only>
      <el-menu
        class="flex h-screen w-[200px] flex-col justify-center"
        :collapse="isCollapse"
      >
        <div
          class="absolute top-2 right-2"
          @click="handleCollapse"
        >
          <el-icon
            v-if="isCollapse"
            :size="25"
          >
            <Expand />
          </el-icon>
          <el-icon
            v-else
            :size="25"
            color="#409EFC"
          >
            <Fold />
          </el-icon>
        </div>
        <div>
          <router-link to="/">
            <el-menu-item index="1">
              <el-icon :size="25">
                <KnifeFork />
              </el-icon>
              <template #title>
                點餐
              </template>
            </el-menu-item>
          </router-link>
          <router-link to="/checkout">
            <el-menu-item index="2">
              <el-icon :size="25">
                <Money />
              </el-icon>
              <template #title>
                帳單
              </template>
            </el-menu-item>
          </router-link>
          <router-link to="/setting">
            <el-menu-item index="3">
              <el-icon :size="25">
                <Setting />
              </el-icon>
              <template #title>
                菜單設定
              </template>
            </el-menu-item>
          </router-link>
          <router-link to="/chart">
            <el-menu-item index="4">
              <el-icon :size="25">
                <DataAnalysis />
              </el-icon>
              <template #title>
                報表
              </template>
            </el-menu-item>
          </router-link>
          <el-menu-item
            index="5"
            @click="$emit('signOut')"
          >
            <el-icon :size="25">
              <Van />
            </el-icon>
            <template #title>
              登出
            </template>
          </el-menu-item>
        </div>
      </el-menu>
    </client-only>
  </div>
</template>

<style lang="postcss">

</style>
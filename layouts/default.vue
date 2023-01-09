<script setup>
const client = useSupabaseAuthClient()
const router = useRouter()
const signOut = async() => {
  try {
    const { error } = await client.auth.signOut()
    if (error) throw error
    router.push({
      name: 'login'
    })
  }
  catch (error) {
    alert(error.message)
  }
}

</script>

<template>
  <div>
    <el-container>
      <el-aside width="65px">
        <MainMenu @sign-out="signOut" />
      </el-aside>
      <el-main><slot /></el-main>
    </el-container>
  </div>
</template>

<style lang="postcss">
</style>
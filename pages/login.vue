<script setup>
definePageMeta({
  layout: false
})
const client = useSupabaseAuthClient()
const router = useRouter()

const loading = ref(false)
const signUp = ref({
  email: '',
  password: ''
})
const signIn = ref({
  email: '',
  password: ''
})
const handleSignIn = async() => {
  try {
    const { error } = await client.auth.signInWithPassword({ email: signIn.value.email, password: signIn.value.password })
    if (error) throw error
    router.push('/')
  }
  catch (error) {
    alert(error.error_description || error.message)
  }
  finally {
    loading.value = false
  }
}
const handleSignUp = async() => {
  try {
    const { error } = await client.auth.signUp({ email: signUp.value.email, password: signUp.value.password })
    if (error) throw error
    router.push('/')
  }
  catch (error) {
    alert(error.error_description || error.message)
  }
  finally {
    loading.value = false
  }
}
const activeName = ref('signIn')
</script>

<template>
  <el-tabs
    v-model="activeName"
    type="border-card"
    stretch="true"
    class="absolute left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="登入"
      name="signIn"
    >
      <el-form
        label-width="100px"
        :model="signIn"
      >
        <el-form-item label="Email">
          <el-input
            v-model="signIn.email"
            type="email"
          />
        </el-form-item>
        <el-form-item label="Password">
          <el-input
            v-model="signIn.password"
            type="password"
          />
        </el-form-item>
        <div class="flex justify-end">
          <el-button
            type="warning"
            @click="handleSignIn"
          >
            登入
          </el-button>
        </div>
      </el-form>
    </el-tab-pane>
    <el-tab-pane
      label="註冊"
      name="signUp"
    >
      <el-form
        label-width="100px"
        :model="signUp"
      >
        <el-form-item label="Email">
          <el-input
            v-model="signUp.email"
            type="email"
          />
        </el-form-item>
        <el-form-item label="Password">
          <el-input
            v-model="signUp.password"
            type="password"
          />
        </el-form-item>
        <div class="flex justify-end">
          <el-button
            type="warning"
            @click="handleSignUp"
          >
            註冊
          </el-button>
        </div>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
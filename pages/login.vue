<script setup>
import { ElMessage } from 'element-plus'

definePageMeta({
  layout: false
})
const client = useSupabaseAuthClient()
const router = useRouter()

const loading = ref(false)
const signInRef = ref(null)
const signUpRef = ref(null)
const signIn = ref({
  email: '',
  password: ''
})
const signUp = ref({
  email: '',
  password: ''
})
const rules = reactive({
  email: [
    { required: true, message: '請輸入 email', trigger: 'blur' },
    { pattern: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, trigger: 'blur', message: '請輸入正確的 email 格式' }
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z0-9]).{6,}$/, trigger: 'blur', message: '請輸入至少六位數的密碼' }
  ]
})

const handleSubmit = async(formEl, callback) => {
  try {
    await formEl.validate()
    loading.value = true
    const { error, action } = await callback()
    if (error)
      ElMessage.error(error.message)
    else
      action()
  }
  catch (error) {
    throw createError(error)
  }
  finally {
    loading.value = false
  }
}
const postSignIn = async() => {
  const { data: { user }, error } = await client.auth.signInWithPassword({
    email: signIn.value.email,
    password: signIn.value.password
  })

  await new Promise(resolve => setTimeout(resolve, 1000))
  return new Promise(resolve => resolve({
    error,
    action: () => {
      useSetUserInfo(user)
      router.push({
        name: 'index'
      })
    }
  }))
}

const postSignUp = async() => {
  const { error } = await client.auth.signUp({
    email: signUp.value.email,
    password: signUp.value.password
  })
  return new Promise(resolve => resolve({
    error,
    action: () => {
      ElMessage({
        message: '請先到註冊信箱驗證帳號',
        type: 'info'
      })
      signUp.value.email = ''
      signUp.value.password = ''
    }
  }))
}

const handleSignIn = (formEl) => {
  handleSubmit(formEl, postSignIn)
}

const handleSignUp = (formEl) => {
  handleSubmit(formEl, postSignUp)
}

</script>

<template>
  <div>
    <h1 class="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 text-xl text-[#eb920d]">
      奶油時光 POS 系統
    </h1>
    <el-tabs
      :model-value="'signIn'"
      type="border-card"
      :stretch="true"
      class="absolute left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 sm:w-4/5 md:w-1/2"
    >
      <el-tab-pane
        label="登入"
        name="signIn"
      >
        <el-form
          ref="signInRef"
          label-width="100px"
          :model="signIn"
          :rules="rules"
        >
          <el-form-item
            prop="email"
            label="Email"
          >
            <el-input
              v-model="signIn.email"
              type="email"
              autocomplete
            />
          </el-form-item>
          <el-form-item
            prop="password"
            label="Password"
          >
            <el-input
              v-model="signIn.password"
              type="password"
            />
          </el-form-item>
          <div class="flex justify-end">
            <el-button
              type="warning"
              :loading="loading"
              native-type="submit"
              @click="handleSignIn(signInRef)"
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
          ref="signUpRef"
          label-width="100px"
          :model="signUp"
          :rules="rules"
        >
          <el-form-item
            prop="email"
            label="Email"
          >
            <el-input
              v-model="signUp.email"

              type="email"
            />
          </el-form-item>
          <el-form-item
            prop="password"
            label="Password"
          >
            <el-input
              v-model="signUp.password"
              type="password"
            />
          </el-form-item>
          <div class="flex justify-end">
            <el-button
              type="warning"
              :loading="loading"
              native-type="submit"
              @click="handleSignUp(signUpRef)"
            >
              註冊
            </el-button>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
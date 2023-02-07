<script setup>
import { useUserStore } from '~/stores/auth'

const store = useUserStore()
const { userInfo } = store
const { data, refresh: refreshTable } = await useGetMenuSettingInfo({ userId: userInfo.id })
const tableData = data
const ruleFormRef = ref(null)
const form = reactive({
  type: '',
  name: '',
  price: ''
})
const rules = reactive({
  type: [
    {
      required: true,
      message: '請確實輸入',
      trigger: 'change'
    }
  ],
  name: [
    {
      required: true,
      message: '請確實輸入',
      trigger: 'change'
    }
  ],
  price: [
    {
      required: true,
      message: '請確實輸入',
      trigger: 'change'
    }
  ]
})

const handleSubmit = async({ formEl, callback }) => {
  try {
    if(formEl)
      await formEl.validate()
    await useFullScreenLoading([callback])
  }
  catch (error) {
    throw createError(error)
  }
}

const postMenuItem = async() => {
  await usePostMenuItem({ payload: { ...form, user_id: userInfo.id } })
  refreshTable()
}

const deleteMenuItem = async({ id }) => {
  await useDeleteMenuItem({ id })
  refreshTable()
}

const addItem = async(formEl) => {
  handleSubmit({ formEl, callback: postMenuItem })
}

const deleteItem = async({ id }) => {
  const callback = () => deleteMenuItem({ id })
  handleSubmit({ callback })
}
</script>

<template>
  <div>
    <h1>菜單設定</h1>
    <client-only>
      <el-table
        :data="tableData"
        stripe
        size="large"
        style="width: 100%"
        row-class-name="text-lg"
        class="mb-5"
      >
        <el-table-column
          type="index"
          width="80"
          :index="v => v+1"
        />
        <el-table-column
          prop="type"
          label="類型"
        />
        <el-table-column
          prop="name"
          label="品項"
        />
        <el-table-column
          prop="price"
          label="價錢"
        />
        <el-table-column
          fixed="right"
          label="動作"
        >
          <template #default="slot">
            <el-button
              size="large"
              type="warning"
              plain
              @click="deleteItem(slot.row)"
            >
              刪除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        class="flex justify-end"
      >
        <div class="w-1/5" />
        <el-form-item
          prop="type"
          class="mr-2 w-full"
        >
          <el-input
            v-model="form.type"
            size="large"
            type="text"
            placeholder="輸入類別"
          />
        </el-form-item>
        <el-form-item
          prop="name"
          class="mr-2 w-full"
        >
          <el-input
            v-model="form.name"
            size="large"
            type="text"
            placeholder="輸入品項名稱"
          />
        </el-form-item>
        <el-form-item
          prop="price"
          class="mr-2 w-full"
        >
          <el-input
            v-model="form.price"
            size="large"
            type="number"
            placeholder="輸入價格"
          />
        </el-form-item>
        <el-form-item class="w-full">
          <el-button
            type="primary"
            size="large"
            @click="addItem(ruleFormRef)"
          >
            新增品項
          </el-button>
        </el-form-item>
      </el-form>
    </client-only>
  </div>
</template>

<style lang="postcss">
</style>
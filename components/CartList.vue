<script setup>
const value = ref([])
const options = [
  {
    value: '1',
    label: '不套用'
  },
  {
    value: '9',
    label: '9'
  },
  {
    value: '8',
    label: '8'
  },
  {
    value: '7',
    label: '7'
  }
]
</script>

<template>
  <div class="pointer-events-none fixed inset-y-0 right-0 z-10 flex max-w-full pl-10">
    <div class="pointer-events-auto w-screen max-w-md">
      <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
        <div class="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
          <div class="mt-8">
            <div class="flow-root">
              <ul
                role="list"
                class="-my-6 divide-y divide-gray-200"
              >
                <li class="flex py-6">
                  <div class="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src="https://imageproxy.icook.network/resize?background=255%2C255%2C255&nocrop=true&stripmeta=true&type=auto&url=http%3A%2F%2Ftokyo-kitchen.icook.tw.s3.amazonaws.com%2Fuploads%2Frecipe%2Fcover%2F387949%2F94857079956dc181.jpg&width=1080"
                      alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                      class="h-full w-full object-cover object-center"
                    >
                  </div>

                  <div class="ml-4 flex flex-1 flex-col">
                    <div>
                      <div class="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href="#">原味司康</a>
                        </h3>
                        <p class="ml-4">
                          $90
                        </p>
                      </div>
                      <p class="mt-1 text-sm text-gray-500">
                        甜點
                      </p>
                    </div>
                    <div class="flex flex-1 items-end justify-between text-sm">
                      <el-input-number
                        :min="1"
                      />

                      <div class="flex">
                        <button
                          type="button"
                          class="font-medium text-[#f00]"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="flex py-6">
                  <div class="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src="https://imageproxy.icook.network/resize?background=255%2C255%2C255&nocrop=true&stripmeta=true&type=auto&url=http%3A%2F%2Ftokyo-kitchen.icook.tw.s3.amazonaws.com%2Fuploads%2Frecipe%2Fcover%2F387949%2F94857079956dc181.jpg&width=1080"
                      alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                      class="h-full w-full object-cover object-center"
                    >
                  </div>

                  <div class="ml-4 flex flex-1 flex-col">
                    <div>
                      <div class="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href="#">藍莓司康</a>
                        </h3>
                        <p class="ml-4">
                          $90
                        </p>
                      </div>
                      <p class="mt-1 text-sm text-gray-500">
                        甜點
                      </p>
                    </div>
                    <div class="flex flex-1 items-end justify-between text-sm">
                      <el-input-number
                        :min="1"
                      />

                      <div class="flex">
                        <button
                          type="button"
                          class="font-medium text-[#f00]"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>
                </li>

                <!-- More products... -->
              </ul>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
          <div class="mb-2 flex items-center justify-between text-base font-medium text-gray-900">
            <p>折扣</p>
            <client-only>
              <el-select
                v-model="value"
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder="請選擇"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </client-only>
          </div>
          <div class="flex justify-between text-base font-medium text-gray-900">
            <p>總共</p>
            <p>$262.00</p>
          </div>
          <div class="mt-6">
            <el-button
              type="warning"
              class="w-full"
              size="large"
            >
              確認
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style>

</style>
/* global defineNuxtPlugin */
import ElementPlus, { ID_INJECTION_KEY } from 'element-plus'
import tw from 'element-plus/es/locale/lang/zh-tw'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'



export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus, {
    locale: tw
  })
  nuxtApp.vueApp.provide(ID_INJECTION_KEY, {
    prefix: Math.floor(Math.random() * 10000),
    current: 0
  })
  for (const [key, component] of Object.entries(ElementPlusIconsVue))
    nuxtApp.vueApp.component(key, component)
})

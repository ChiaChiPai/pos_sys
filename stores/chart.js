import { defineStore } from 'pinia'

export const useChartStore = defineStore('chart', {
  state: () => {
    return {
      pageSize: 25
    }
  }
})
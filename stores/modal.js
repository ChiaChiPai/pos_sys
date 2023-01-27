import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => {
    return {
      editInfo: {}
    }
  },
  actions: {
    changeEditInfo(info) {
      this.editInfo = info
    },
    resetEditInfo() {
      this.editInfo = {}
    }
  }
})
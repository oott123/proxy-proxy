import {
  getStateFromStroage,
  saveStateToStorage
} from '../../general/storage.jsm'
import Vue from '../../../lib/vue.jsm'

export async function init(vueOptions = {}) {
  const state = await getStateFromStroage()
  let modified = false
  const options = Object.assign(
    {
      el: '#app',
      data: state,
      methods: {}
    },
    vueOptions
  )
  options.methods.saveState = function() {
    if (!modified) {
      modified = true
      browser.runtime.connect() // notify if closed
    }
    saveStateToStorage(this.$data)
  }
  const vm = new Vue(options)
  Object.keys(state).forEach(key => {
    vm.$watch(
      key,
      function() {
        this.saveState()
      },
      { deep: true }
    )
  })
}

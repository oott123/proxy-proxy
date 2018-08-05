import {
  getStateFromStroage,
  saveLocalStateToStorage
} from '../../general/storage.jsm'
import Vue from '../../../lib/vue.jsm'

async function init() {
  const state = await getStateFromStroage()
  let modified = false
  const options = {
    el: '#app',
    data: state,
    methods: {
      openSettings() {
        browser.tabs.create({
          active: true,
          url: 'settings.html'
        })
        window.close()
      }
    }
  }
  options.methods.saveState = function() {
    if (!modified) {
      modified = true
      browser.runtime.connect() // notify if closed
    }
    saveLocalStateToStorage(this.$data)
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

init().catch(console.error)

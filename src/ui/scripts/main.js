import {
  getStateFromStroage,
  saveStateToStorage
} from '../../general/storage.jsm'
import Vue from '../../../lib/vue.jsm'
;(async function() {
  const state = await getStateFromStroage()
  console.log(state)
  const vm = new Vue({
    el: '#app',
    data: state,
    methods: {
      saveState() {
        saveStateToStorage(this.$data)
      }
    }
  })
  Object.keys(state).forEach(key => {
    vm.$watch(
      key,
      function() {
        this.saveState()
      },
      { deep: true }
    )
  })
  await browser.runtime.connect() // notify if closed
})()

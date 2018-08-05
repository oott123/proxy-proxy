import Vue from '../../../lib/vue.jsm'
import { getDefaultState } from '../../general/storage.jsm'

async function init() {
  const state = getDefaultState()
  const options = {
    el: '#app',
    data: {
      ui: {
        currentTab: 'scenes',
        tabs: {
          scenes: '情景模式',
          rulesets: '规则组',
          proxies: '代理服务器'
        }
      },
      ...state
    },
    methods: {}
  }
  const vm = new Vue(options)
  Object.keys(state).forEach(key => {
    vm.$watch(key, function() {}, { deep: true })
  })
  window.vm = vm
}

init().catch(console.error)

import Vue from '../../../lib/vue.jsm'
import { getDefaultState } from '../../general/defaultState.jsm'

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
        },
        currentRulesetIndex: 0
      },
      ...state
    },
    methods: {
      moveUp(name, index) {
        return move(this[name], index, -1)
      },
      moveDown(name, index) {
        return move(this[name], index, 1)
      },
      remove(name, index) {
        return this[name].splice(index, 1)[0]
      },
      moveUpRuleset() {
        const v = this.moveUp('rulesets', this.ui.currentRulesetIndex)
        this.ui.currentRulesetIndex = this.rulesets.indexOf(v)
      },
      moveDownRuleset() {
        const v = this.moveDown('rulesets', this.ui.currentRulesetIndex)
        this.ui.currentRulesetIndex = this.rulesets.indexOf(v)
      },
      removeRuleset() {
        if (this.ui.currentRulesetIndex === this.rulesets.length - 1) {
          alert('别删了，留一个吧，全删了有 bug 懒得修')
          return
        }
        this.remove('rulesets', this.ui.currentRulesetIndex)
        if (this.ui.currentRulesetIndex > this.rulesets.length - 1) {
          this.ui.currentRulesetIndex = 0
        }
      }
    },
    computed: {
      uiCurrentRuleset() {
        return this.rulesets[this.ui.currentRulesetIndex]
      }
    }
  }
  const vm = new Vue(options)
  Object.keys(state).forEach(key => {
    vm.$watch(key, function() {}, { deep: true })
  })
  window.vm = vm
}

function move(arr, key, step) {
  const value = arr.splice(key, 1)[0]
  arr.splice(key + step, 0, value)
  return value
}

init().catch(console.error)

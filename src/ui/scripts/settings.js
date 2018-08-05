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
      },
      addScene(e) {
        if (!this.proxies[0]) {
          return alert('没有代理啊，先建一个代理吧')
        }
        const name = getName(e)
        const proxy = this.proxies[0].name
        const proxies = this.rulesets.reduce((p, c) => {
          p[c.name] = proxy
          return p
        }, {})
        this.scenes.push({
          name,
          displayName: '新建场景',
          proxies
        })
      },
      addRuleset(e) {
        const name = getName(e)
        this.rulesets.push({
          name,
          other: false,
          displayName: '新建规则',
          imports: []
        })
        this.ui.currentRulesetIndex = this.rulesets.length - 1
      },
      addProxy(e) {
        const name = getName(e)
        this.proxies.push({
          name,
          displayName: '新建代理',
          config: {
            type: 'direct',
            host: '',
            port: '',
            username: '',
            password: '',
            proxyDNS: false
          }
        })
      },
      addRuleFile() {
        this.uiCurrentRuleset.imports.push({
          type: 'host',
          url: ''
        })
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

function getName({ altKey }) {
  let name = Math.random()
    .toString(36)
    .slice(2)
  if (altKey) {
    name = prompt('输入唯一标识符(此乃隐藏设置，按 Alt 点击才可触发)', name)
  }
  return name
}

init().catch(console.error)

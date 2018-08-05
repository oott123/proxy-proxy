import Vue from '../../../lib/vue.jsm'
import {
  saveStateToStorage,
  saveLocalStateToStorage,
  getStateFromStroage
} from '../../general/storage.jsm'

async function init() {
  const state = await getStateFromStroage()
  const options = {
    el: '#app',
    data: {
      ui: {
        modified: false,
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
        if (this.rulesets.length <= 1) {
          alert('别删了，留一个吧，全删了有 bug 懒得修')
          return
        }
        const rulesetName = this.uiCurrentRuleset.name
        delete this.currentRules[rulesetName]
        for (const scene of this.scenes) {
          delete scene.proxies[rulesetName]
        }
        this.remove('rulesets', this.ui.currentRulesetIndex)
        if (this.ui.currentRulesetIndex > this.rulesets.length - 1) {
          this.ui.currentRulesetIndex = 0
        }
      },
      removeProxy(index) {
        const proxyName = this.proxies[index].name
        for (const scene of this.scenes) {
          if (Object.values(scene.proxies).indexOf(proxyName) > -1) {
            return alert(
              `情景模式 ${
                scene.displayName
              } 正在使用该代理，请先取消该代理的选择再删除`
            )
          }
        }
        if (Object.values(this.currentRules).indexOf(proxyName) > -1) {
          return alert(
            '当前的工作规则正在使用该代理，请先在弹出菜单中取消该代理的选择再删除'
          )
        }
        return this.remove('proxies', index)
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
        if (!this.proxies[0]) {
          return alert('没有代理啊，先建一个代理吧')
        }
        const name = getName(e)
        this.rulesets.push({
          name,
          other: false,
          displayName: '新建规则',
          imports: []
        })
        const proxy = this.proxies[0].name
        this.$set(this.currentRules, name, proxy)
        for (const scene of this.scenes) {
          this.$set(scene.proxies, name, proxy)
        }
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
      },
      undoChanges() {
        if (confirm('真的要撤销修改吗？')) {
          this.ui.modified = false
          this.$nextTick(function() {
            location.reload()
          })
        }
      },
      async saveChanges() {
        await saveStateToStorage(this.$data)
        await saveLocalStateToStorage(this.$data)
        const port = await browser.runtime.connect()
        port.disconnect()
        this.ui.modified = false
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
    vm.$watch(
      key,
      function() {
        if (this.ui.modified === false) {
          this.ui.modified = true
        }
      },
      { deep: true }
    )
  })
  window.vm = vm
  window.addEventListener('beforeunload', function(e) {
    if (vm.ui.modified) {
      e.preventDefault()
      return '你还有未保存的修改，真的要关闭吗？'
    }
  })
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
    name = prompt(
      '输入唯一标识符\n此乃隐藏设置，按 Alt 点击才可触发，标识不查重，请自重',
      name
    )
  }
  return name
}

init().catch(console.error)

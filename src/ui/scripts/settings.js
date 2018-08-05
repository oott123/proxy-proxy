import Vue from '../../../lib/vue.jsm'

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

export function getDefaultState() {
  return {
    scenes: [
      {
        name: 'whitelist',
        displayName: '白名单',
        proxies: {
          'mainland-china': 'direct',
          'simple-proxy': 'proxy',
          other: 'proxy'
        }
      }
    ],
    rulesets: [
      {
        name: 'mainland-china',
        displayName: '中国大陆',
        type: 'normal',
        proxy: 'direct',
        imports: {
          host: [
            '/src/assets/cnDomains.txt',
            '/src/assets/cdn.txt',
            '/src/assets/myCnDomains.txt'
          ],
          regexp: ['/src/assets/directRegexps.txt'],
          ip: ['/src/assets/chnroutes.txt', '/src/assets/directroutes.txt']
        }
      },
      {
        name: 'simple-proxy',
        displayName: '国外知名网站',
        type: 'normal',
        proxy: 'proxy',
        imports: {
          host: ['/src/assets/simpleProxy.txt']
        }
      },
      { name: 'other', displayName: '其它', type: 'other', proxy: 'proxy' }
    ],
    proxies: [
      { name: 'direct', displayName: '直连', config: { type: 'direct' } },
      {
        name: 'proxy',
        displayName: '代理',
        config: { type: 'socks', host: '127.0.0.1', port: '1080' }
      }
    ],
    config: {}
  }
}

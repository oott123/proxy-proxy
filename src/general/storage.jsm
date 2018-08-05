const storage = browser.storage.sync

export async function getStateFromStroage(items) {
  const defaultState = getDefaultState()
  const state = Object.assign(
    {},
    defaultState,
    await storage.get(items || Object.keys(defaultState))
  )
  return state
}

export async function saveStateToStorage({
  scenes,
  rulesets,
  proxies,
  config
}) {
  return storage.set({ scenes, rulesets, proxies, config })
}

export function getDefaultState() {
  return {
    scenes: [],
    rulesets: [
      {
        name: '中国大陆',
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
        name: '知名国外网站',
        type: 'normal',
        proxy: 'proxy',
        imports: {
          host: ['/src/assets/simpleProxy.txt']
        }
      },
      { name: '其它', type: 'other', proxy: 'proxy' }
    ],
    proxies: [
      { name: 'direct', config: { type: 'direct' } },
      {
        name: 'proxy',
        config: { type: 'socks', host: '127.0.0.1', port: '1080' }
      }
    ],
    config: {}
  }
}

const localKeys = Object.keys(getDefaultLocalState())
const syncKeys = Object.keys(getDefaultSyncState())

export async function getStateFromStroage(items) {
  const defaultState = getDefaultState()
  if (!items) {
    items = localKeys.concat(syncKeys)
  }
  const localKeysToRead = []
  const syncKeysToRead = []
  for (const item of items) {
    if (localKeys.indexOf(item) >= 0) {
      localKeysToRead.push(item)
    }
    if (syncKeys.indexOf(item) >= 0) {
      syncKeysToRead.push(item)
    }
  }
  const state = Object.assign(
    {},
    defaultState,
    await browser.storage.local.get(localKeysToRead),
    await browser.storage.sync.get(syncKeysToRead)
  )
  return state
}

export async function saveStateToStorage({
  scenes,
  rulesets,
  proxies,
  config
}) {
  return browser.storage.sync.set({ scenes, rulesets, proxies, config })
}

export async function saveLocalStateToStorage({ currentRules }) {
  return browser.storage.local.set({ currentRules })
}

function getDefaultSyncState() {
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
        imports: {
          host: ['/src/assets/simpleProxy.txt']
        }
      },
      { name: 'other', displayName: '其它', type: 'other' }
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

function getDefaultLocalState() {
  return {
    currentRules: {
      'mainland-china': 'direct',
      'simple-proxy': 'proxy',
      other: 'proxy'
    }
  }
}

export function getDefaultState() {
  return Object.assign({}, getDefaultLocalState(), getDefaultSyncState())
}

export function getDefaultSyncState() {
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
      },
      {
        name: 'blacklist',
        displayName: '黑名单',
        proxies: {
          'mainland-china': 'direct',
          'simple-proxy': 'proxy',
          other: 'direct'
        }
      },
      {
        name: 'direct',
        displayName: '直连',
        proxies: {
          'mainland-china': 'direct',
          'simple-proxy': 'direct',
          other: 'direct'
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

export function getDefaultLocalState() {
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

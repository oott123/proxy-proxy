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
        other: false,
        displayName: '中国大陆',
        imports: [
          { type: 'host', url: '/src/assets/cnDomains.txt' },
          { type: 'host', url: '/src/assets/cdn.txt' },
          { type: 'host', url: '/src/assets/myCnDomains.txt' },
          { type: 'regexp', url: '/src/assets/directRegexps.txt' },
          { type: 'ip', url: '/src/assets/chnroutes.txt' },
          { type: 'ip', url: '/src/assets/directroutes.txt' }
        ]
      },
      {
        name: 'simple-proxy',
        other: false,
        displayName: '国外知名网站',
        imports: [{ type: 'host', url: '/src/assets/simpleProxy.txt' }]
      },
      { name: 'other', displayName: '其它', other: true }
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

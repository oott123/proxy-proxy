import BloomFilter from '../../lib/bloomfilter.jsm'

export default class Ruleset {
  constructor(key) {
    this.key = key
    this.ipset = new window.FutoIn.ipset.IPSet()
    this.rules = {
      host: new BloomFilter(512 * 1024, 16),
      regexps: [],
      ip: {
        add: x => this.ipset.add(x, 'yes'),
        remove: x => this.ipset.remove(x, 'yes'),
        match: x => !!this.ipset.match(x)
      }
    }
    this.debug = window.debug(`pproxy:prcs:ruleset:${key}`)
  }
  test(url) {
    if (!(url instanceof URL)) {
      url = new URL(url)
    }
    // this.debug(`testing hostname ${url.hostname}`)
    if (this.rules.host.test(url.hostname)) {
      this.debug('test passed using hostname')
      return true
    }
    if (url.host !== url.hostname) {
      // this.debug(`testing host ${url.host}`)
      if (this.rules.host.test(url.host)) {
        this.debug('test passed using host')
        return true
      }
    }
    const domainParts = url.hostname.split('.')
    let host = domainParts.pop()
    let part
    while ((part = domainParts.pop())) {
      // this.debug(`testing hostpart ${host}`)
      if (this.rules.host.test(host)) {
        this.debug(`test passed using hostpart, rule: ${host}`)
        return true
      }
      host = `${part}.${host}` // 最后一个测试不到。不要紧，它一开始就被测试过了。
    }
    for (const reg of this.rules.regexps) {
      // this.debug(`testing regex ${reg}`)
      if (url.origin.match(reg)) {
        this.debug(`test passed using regex, rule: ${reg}`)
        return true
      }
    }
    this.debug('test failed')
    return false
  }
  async testIP(url) {
    if (!(url instanceof URL)) {
      url = new URL(url)
    }
    this.debug(`resolving ${url.hostname}`)
    const resolve = await browser.dns.resolve(url.hostname)
    const addresses = resolve.addresses
    this.debug(`resolved ${url.hostname}: ${addresses.join(', ')}`)
    let matches = 0
    for (const address of addresses) {
      this.debug(`checking ${address} in ipset`)
      if (this.rules.ip.match(address)) {
        this.debug(`${address} is in the ipset`)
        matches++
      } else {
        this.debug(`${address} is not in the ipset`)
      }
      break // 加速一下。毕竟请求那么多地址也没用……判断一次要 3ms 呢，也不便宜了！
    }
    return matches
  }
  addHost(host) {
    this.rules.host.add(host)
  }
  addRegexp(regex) {
    if (!(regex instanceof RegExp)) {
      regex = new RegExp(regex, 'i')
    }
    this.rules.regexps.push(regex)
  }
  addIP(ip) {
    this.rules.ip.add(ip)
  }
}

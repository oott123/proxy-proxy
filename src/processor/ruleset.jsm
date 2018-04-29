import BloomFilter from '../../lib/bloomfilter.jsm'

export default class Ruleset {
  constructor(key) {
    this.key = key
    this.rules = {
      host: new BloomFilter(512 * 1024, 16),
      tld: new BloomFilter(128 * 1024, 16),
      origin: new BloomFilter(128 * 1024, 16),
      regexps: []
    }
    this.debug = window.debug(`pproxy:prcs:ruleset:${key}`)
  }
  test(url) {
    window.rules = this.rules
    if (!(url instanceof URL)) {
      url = new URL(url)
    }
    this.debug(`testing ${url.origin}`)
    // this.debug(`testing origin ${url.origin}`)
    if (this.rules.origin.test(url.origin)) {
      this.debug('test passed using origin')
      return true
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
  addHost(host) {
    this.rules.host.add(host)
  }
}

import { initRules, getRuleset, clearRulesets } from './rules.jsm'

let debug = window.debug('pproxy:prcs:shouldproxy')
let rulesets = []

export async function init() {
  const config = await initRules()
  const rulsetConfigList = config.rulesets.slice(0)
  // 确保“其它”规则排在最后面
  // rulsetConfigList.sort(function(a, b) {
  //   if (a.type === 'other') {
  //     return 1
  //   }
  //   if (b.type === 'other') {
  //     return -1
  //   }
  //   return 0
  // })
  for (const rulsetConfig of rulsetConfigList) {
    rulesets.push(getRuleset(rulsetConfig.name))
  }
}

export async function destroy() {
  clearRulesets()
  rulesets = []
}

export async function shouldUseProxy(url, checkIP = false) {
  debug(rulesets)
  for (const ruleset of rulesets) {
    url = new URL(url)
    debug(`testing rules in ${ruleset.key} for ${url}`)
    if (ruleset.test(url)) {
      debug(`hit url in ${ruleset.key}`)
      return ruleset.proxy.config
    }
    if (checkIP) {
      if (ruleset.testIP(url)) {
        debug(`hit IP in ${ruleset.key}`)
        return ruleset.proxy.config
      }
    }
  }
  return false
  // const directRules = getRuleset('direct')
  // url = new URL(url)
  // debug(`testing direct rules for url ${url}`)
  // if (directRules.test(url)) {
  //   debug(`${url} = direct, using domain or url`)
  //   return false
  // }
  // debug(`testing chnroutes for url ${url}`)
  // const addresses = await directRules.testIP(url)
  // if (addresses < 1) {
  //   debug(`${url} = direct, using chnroutes`)
  //   return false
  // }
  // debug(`${url} = proxy`)
  // return true
}

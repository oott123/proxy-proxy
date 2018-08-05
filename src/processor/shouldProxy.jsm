import { initRules, getRuleset, clearRulesets } from './rules.jsm'

let debug = window.debug('pproxy:prcs:shouldproxy')
let rulesets = []

export async function init() {
  const config = await initRules()
  const rulsetConfigList = config.rulesets.slice(0)
  for (const rulsetConfig of rulsetConfigList) {
    rulesets.push(getRuleset(rulsetConfig.name))
  }
}

export async function destroy() {
  clearRulesets()
  rulesets = []
}

export async function getProxyForUrl(url, checkIP = false) {
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
}

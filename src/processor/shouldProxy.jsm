import { initRules, getRuleset, clearRulesets } from './rules.jsm'
import { getStateFromStroage } from '../general/storage.jsm'

let debug = window.debug('pproxy:prcs:shouldproxy')
let rulesets = []
let currentRules = {}
let proxies = {}

export async function init() {
  const config = await initRules()
  const rulsetConfigList = config.rulesets.slice(0)
  for (const rulsetConfig of rulsetConfigList) {
    rulesets.push(getRuleset(rulsetConfig.name))
  }
  const _config = await getStateFromStroage(['currentRules', 'proxies'])
  currentRules = _config.currentRules
  for (const proxy of _config.proxies) {
    proxies[proxy.name] = proxy
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
    if (ruleset.config.other) {
      debug(`${ruleset.key} is other, using this`)
      return getConfigForRuleset(ruleset)
    }
    if (ruleset.test(url)) {
      debug(`hit url in ${ruleset.key}`)
      return getConfigForRuleset(ruleset)
    }
    if (checkIP) {
      if (await ruleset.testIP(url)) {
        debug(`hit IP in ${ruleset.key}`)
        return getConfigForRuleset(ruleset)
      }
    }
  }
  return false
}

function getConfigForRuleset({ key }) {
  const proxyName = currentRules[key]
  const proxy = proxies[proxyName]
  if (proxy) {
    return proxy.config
  }
}

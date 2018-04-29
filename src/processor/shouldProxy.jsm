import { initRules, getRuleset } from './rules.jsm'

let debug = window.debug('pproxy:prcs:shouldproxy')

export async function init() {
  await initRules()
}

export function shouldUseProxy(url) {
  const directRules = getRuleset('direct')
  debug(`testing direct rules for url ${url}`)
  if (directRules.test(url)) {
    debug(`${url} = direct`)
    return false
  }
  debug(`${url} = proxy`)
  return true
}

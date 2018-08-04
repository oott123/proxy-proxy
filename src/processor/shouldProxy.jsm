import { initRules, getRuleset } from './rules.jsm'

let debug = window.debug('pproxy:prcs:shouldproxy')

export async function init() {
  await initRules()
}

export async function shouldUseProxy(url, checkIP = false) {
  const directRules = getRuleset('direct')
  url = new URL(url)
  debug(`testing direct rules for url ${url}`)
  if (directRules.test(url)) {
    debug(`${url} = direct, using domain or url`)
    return false
  }
  debug(`testing chnroutes for url ${url}`)
  const addresses = await directRules.testIP(url)
  if (addresses < 1) {
    debug(`${url} = direct, using chnroutes`)
    return false
  }
  debug(`${url} = proxy`)
  return true
}

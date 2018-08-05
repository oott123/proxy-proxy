import * as rules from '../processor/rules.jsm'
import { getProxyForUrl } from '../processor/shouldProxy.jsm'

export function addGlobalVars() {
  window.rules = rules
  window.getProxyForUrl = async (x, y) => {
    const proxy = await getProxyForUrl(x, y)
    console.log(x, proxy)
  }
}

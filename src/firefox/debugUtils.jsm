import * as rules from '../processor/rules.jsm'
import { shouldUseProxy } from '../processor/shouldProxy.jsm'

export function addGlobalVars() {
  window.rules = rules
  window.shouldUseProxy = shouldUseProxy
}

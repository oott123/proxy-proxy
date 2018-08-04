import { shouldUseProxy } from '../processor/shouldProxy.jsm'

let debug = window.debug('pproxy:prcs:onrequest')

export async function onRequest(requestInfo) {
  debug('gotting request', requestInfo)
  const useProxy = await shouldUseProxyByRequest(requestInfo)
  if (useProxy) {
    debug('using proxy (COST)')
    return useProxy
  } else {
    debug('using direct (COST)')
    return { type: 'direct' }
  }
}

async function shouldUseProxyByRequest(requestInfo) {
  if (requestInfo.documentUrl) {
    if (!(await shouldUseProxy(requestInfo.documentUrl))) {
      return false
    }
  }
  return shouldUseProxy(requestInfo.url, true)
}

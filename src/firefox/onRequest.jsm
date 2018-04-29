import { shouldUseProxy } from '../processor/shouldProxy.jsm'

let debug = window.debug('pproxy:prcs:onrequest')

export function onRequest(requestInfo) {
  debug('gotting request', requestInfo)
  const useProxy = shouldUseProxyByRequest(requestInfo)
  if (useProxy) {
    debug('using proxy  (COST)')
    return { type: 'socks', host: '127.0.0.1', port: '23001' }
  } else {
    debug('using direct (COST)')
    return { type: 'direct' }
  }
}

function shouldUseProxyByRequest(requestInfo) {
  if (requestInfo.documentUrl) {
    if (!shouldUseProxy(requestInfo.documentUrl)) {
      return false
    }
  }
  return shouldUseProxy(requestInfo.url)
}

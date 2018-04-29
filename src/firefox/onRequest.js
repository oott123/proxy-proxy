import { shouldUseProxy } from '../processor/shouldProxy.js'

let debug = window.debug('pproxy:prcs:onrequest')

export function onRequest(requestInfo) {
  debug('gotting request', requestInfo)
  const useProxy = shouldUseProxy(requestInfo.url)
  if (useProxy) {
    debug('using socks proxy')
    return { type: 'socks', host: '127.0.0.1', port: '23001' }
  } else {
    debug('using direct')
    return { type: 'direct' }
  }
}

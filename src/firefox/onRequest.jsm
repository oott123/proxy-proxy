import { getProxyForUrl } from '../processor/shouldProxy.jsm'

let debug = window.debug('pproxy:prcs:onrequest')

export async function onRequest(requestInfo) {
  const startTime = performance.now()
  debug('gotting request', requestInfo)
  const useProxy = await shouldUseProxyByRequest(requestInfo)
  const cost = performance.now() - startTime
  if (useProxy) {
    debug(`using proxy ${useProxy.type} cost: ${cost}ms`)
    return useProxy
  } else {
    debug(`failed to match all rules, use direct cost: ${cost} ms`)
    return { type: 'direct' }
  }
}

async function shouldUseProxyByRequest(requestInfo) {
  if (requestInfo.documentUrl) {
    if (!(await getProxyForUrl(requestInfo.documentUrl))) {
      return false
    }
  }
  return getProxyForUrl(requestInfo.url, true)
}

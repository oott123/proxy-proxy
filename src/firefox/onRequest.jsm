import { getProxyForUrl } from '../processor/shouldProxy.jsm'

let debug = window.debug('pproxy:prcs:onrequest')

async function _onRequest(requestInfo) {
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

export async function onRequest(requestInfo) {
  try {
    return await _onRequest(requestInfo)
  } catch (e) {
    console.error('onRequest execute failed!')
    console.error(e)
  }
}

async function shouldUseProxyByRequest(requestInfo) {
  // if (requestInfo.documentUrl) {
  //   if (!(await getProxyForUrl(requestInfo.documentUrl))) {
  //     return false
  //   }
  // }
  return getProxyForUrl(requestInfo.url, true)
}

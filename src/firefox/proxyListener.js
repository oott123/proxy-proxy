import { onRequest } from './onRequest.js'
import { init } from '../processor/shouldProxy.js'

let debug = window.debug('pproxy:fx:proxylisenter')

async function initLisenter() {
  await init()
  browser.proxy.onRequest.addListener(onRequest, {
    urls: ['<all_urls>']
  })
}
initLisenter()
  .then(() => {
    debug('setted up proxy listener')
  })
  .catch(err => {
    console.error('Proxy-Proxy init error: please report details below')
    console.error(err)
  })

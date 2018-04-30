import { onRequest } from './onRequest.jsm'
import { init } from '../processor/shouldProxy.jsm'
import { addGlobalVars } from './debugUtils.jsm'

let debug = window.debug('pproxy:fx:proxylisenter')

async function initLisenter() {
  await init()
  browser.proxy.onRequest.addListener(onRequest, {
    urls: ['<all_urls>']
  })
}

addGlobalVars()

initLisenter()
  .then(() => {
    debug('setted up proxy listener')
  })
  .catch(err => {
    console.error('Proxy-Proxy init error: please report details below')
    console.error(err)
  })

import { onRequest } from './onRequest.jsm'
import { init, destroy } from '../processor/shouldProxy.jsm'
import { addGlobalVars } from './debugUtils.jsm'

let debug = window.debug('pproxy:fx:proxylisenter')

async function initLisenter() {
  await init()
  browser.proxy.onRequest.addListener(onRequest, {
    urls: ['<all_urls>']
  })
  browser.runtime.onConnect.addListener(onConnect)
}

async function onConnect(port) {
  debug('popup window is open')
  port.onDisconnect.addListener(async function() {
    debug('popup window now closed, reloading config')
    browser.proxy.onRequest.removeListener(onRequest)
    browser.runtime.onConnect.removeListener(onConnect)
    await destroy()
    await initLisenter()
    debug('config reloaded')
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

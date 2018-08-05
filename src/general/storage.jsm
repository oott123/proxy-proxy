import {
  getDefaultLocalState,
  getDefaultSyncState,
  getDefaultState
} from './defaultState.jsm'

const localKeys = Object.keys(getDefaultLocalState())
const syncKeys = Object.keys(getDefaultSyncState())

export async function getStateFromStroage(items) {
  const defaultState = getDefaultState()
  if (!items) {
    items = localKeys.concat(syncKeys)
  }
  const localKeysToRead = []
  const syncKeysToRead = []
  for (const item of items) {
    if (localKeys.indexOf(item) >= 0) {
      localKeysToRead.push(item)
    }
    if (syncKeys.indexOf(item) >= 0) {
      syncKeysToRead.push(item)
    }
  }
  const state = Object.assign(
    {},
    defaultState,
    await browser.storage.local.get(localKeysToRead),
    await browser.storage.sync.get(syncKeysToRead)
  )
  return state
}

export async function saveStateToStorage({
  scenes,
  rulesets,
  proxies,
  config
}) {
  const toSave = { scenes, rulesets, proxies, config }
  return browser.storage.sync.set(JSON.parse(JSON.stringify(toSave)))
}

export async function saveLocalStateToStorage({ currentRules }) {
  return browser.storage.local.set({
    currentRules: JSON.parse(JSON.stringify(currentRules))
  })
}

import Ruleset from './ruleset.jsm'

let RULES = new Map()
let debug = window.debug('pproxy:prcs:rules')

async function ensureRuleset(key) {
  if (!RULES.has(key)) {
    RULES.set(key, newRuleset(key))
  }
  return RULES.get(key)
}

export function getRuleset(key) {
  if (!RULES.has(key)) {
    throw new Error(`Ruleset ${key} not found!`)
  }
  return RULES.get(key)
}

function newRuleset(key) {
  return new Ruleset(key)
}

async function loadTxt(path, ruleName) {
  debug(`loading ${path} to ${ruleName}`)
  const res = await fetch(path)
  const text = await res.text()
  const list = text.split('\n').filter(s => !!s)
  debug(`importing ${list.length} items ...`)
  const directRules = await ensureRuleset(ruleName)
  for (const host of list) {
    directRules.addHost(host)
  }
  debug('imported.')
}

async function loadFiles() {
  await loadTxt('/src/assets/cnDomains.txt', 'direct')
  await loadTxt('/src/assets/cdn.txt', 'direct')
  await loadTxt('/src/assets/myCnDomains.txt', 'direct')
  await loadTxt('/src/assets/simpleProxy.txt', 'proxy')
}

export async function initRules() {
  await loadFiles()
  // await ensureRuleset('proxy')
}

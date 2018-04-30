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

async function readLines(path) {
  const res = await fetch(path)
  const text = await res.text()
  const list = text.split('\n').filter(s => !!s)
  return list
}

async function loadHostfileToRuleset(path, ruleName) {
  debug(`loading hostfile ${path} to ${ruleName}`)
  const list = await readLines(path)
  debug(`importing ${list.length} items ...`)
  const ruleset = await ensureRuleset(ruleName)
  for (const host of list) {
    ruleset.addHost(host)
  }
  debug('imported.')
}

async function loadRegexpfileToRuleset(path, ruleName) {
  debug(`loading regexp file ${path} to ${ruleName}`)
  const list = await readLines(path)
  debug(`importing ${list.length} items ...`)
  const ruleset = await ensureRuleset(ruleName)
  for (const host of list) {
    ruleset.addRegexp(host)
  }
  debug('imported.')
}

async function loadFiles() {
  await loadHostfileToRuleset('/src/assets/cnDomains.txt', 'direct')
  await loadHostfileToRuleset('/src/assets/cdn.txt', 'direct')
  await loadHostfileToRuleset('/src/assets/myCnDomains.txt', 'direct')
  await loadHostfileToRuleset('/src/assets/simpleProxy.txt', 'proxy')
  await loadRegexpfileToRuleset('/src/assets/directRegexps.txt', 'direct')
}

export async function initRules() {
  await loadFiles()
}

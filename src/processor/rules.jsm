import Ruleset from './ruleset.jsm'
import { getStateFromStroage } from '../general/storage.jsm'

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

export function clearRulesets() {
  RULES.clear()
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

async function loadHostFileToRuleset(path, ruleName) {
  debug(`loading hostfile ${path} to ${ruleName}`)
  const list = await readLines(path)
  debug(`importing ${list.length} items ...`)
  const ruleset = await ensureRuleset(ruleName)
  for (const host of list) {
    ruleset.addHost(host)
  }
  debug('imported.')
}

async function loadRegexpFileToRuleset(path, ruleName) {
  debug(`loading regexp file ${path} to ${ruleName}`)
  const list = await readLines(path)
  debug(`importing ${list.length} items ...`)
  const ruleset = await ensureRuleset(ruleName)
  for (const host of list) {
    ruleset.addRegexp(host)
  }
  debug('imported.')
}

async function loadIPFileToRuleset(path, ruleName) {
  debug(`loading ip file ${path} to ${ruleName}`)
  const list = await readLines(path)
  debug(`importing ${list.length} items ...`)
  const ruleset = await ensureRuleset(ruleName)
  for (const ip of list) {
    ruleset.addIP(ip)
  }
  debug('imported.')
}

const typeMap = {
  host: 'addHost',
  regexp: 'addRegexp',
  ip: 'addIP'
}

async function loadIntoRuleset(path, ruleName, type) {
  debug(`loading ${type} file ${path} to ${ruleName}`)
  const list = await readLines(path)
  debug(`importing ${list.length} items ...`)
  const ruleset = await ensureRuleset(ruleName)
  for (const rule of list) {
    ruleset[typeMap[type]](rule)
  }
  debug('imported.')
}

async function loadFiles() {
  await loadHostFileToRuleset('/src/assets/cnDomains.txt', 'direct')
  await loadHostFileToRuleset('/src/assets/cdn.txt', 'direct')
  await loadHostFileToRuleset('/src/assets/myCnDomains.txt', 'direct')
  await loadHostFileToRuleset('/src/assets/simpleProxy.txt', 'proxy')
  await loadRegexpFileToRuleset('/src/assets/directRegexps.txt', 'direct')
  await loadIPFileToRuleset('/src/assets/chnroutes.txt', 'direct')
  await loadIPFileToRuleset('/src/assets/directroutes.txt', 'direct')
}

async function loadFromStorage({ rulesets, proxies }) {
  for (const rulesetConfig of rulesets) {
    if (rulesetConfig.imports) {
      for (const type of Object.keys(rulesetConfig.imports)) {
        for (const file of rulesetConfig.imports[type]) {
          await loadIntoRuleset(file, rulesetConfig.name, type)
        }
      }
    }
    const ruleset = await ensureRuleset(rulesetConfig.name)
    ruleset.proxy = proxies.find(x => x.name === rulesetConfig.proxy)
  }
}

export async function initRules() {
  // await loadFiles()
  const { rulesets, proxies } = await getStateFromStroage([
    'rulesets',
    'proxies'
  ])
  await loadFromStorage({ rulesets, proxies })
  return { rulesets, proxies }
}

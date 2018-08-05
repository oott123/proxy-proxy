#!/usr/bin/env node
const version = process.argv[2]
if (!version) {
  console.log(`Usage: ./version.js <version>`)
  process.exit(2)
}

const simpleGit = require('simple-git/promise')(__dirname)

async function start() {
  const status = await simpleGit.status()
  if (status.files.length > 0) {
    console.error('working dir is not clean')
    process.exit(1)
  }
  const old = require('./manifest.json')
  const pkg = require('./package.json')
  old.version = pkg.version = version
  const fs = require('fs')
  fs.writeFileSync('./manifest.json', JSON.stringify(old, null, 2))
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
  await simpleGit.add('./manifest.json')
  await simpleGit.add('./package.json')
  await simpleGit.commit('bump version to ' + version)
  await simpleGit.addTag(`v${version}`)
  console.log(version)
}

start().catch(e => {
  console.error(e)
  process.exit(3)
})

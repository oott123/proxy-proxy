const old = require('./manifest.json')
const pkg = require('./package.json')
old.version = pkg.version
const fs = require('fs')
fs.writeFileSync('./manifest.json', JSON.stringify(old, null, 2))

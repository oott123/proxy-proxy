const glob = require('glob')
const crypto = require('crypto')
const fs = require('fs')

const xpis = glob.sync('web-ext-artifacts/proxy_proxy-*-an+fx.xpi')
const updates = []
const manifest = {
  addons: {
    'pproxy@oott123.com': {
      updates
    }
  }
}

async function genUpdate() {
  for (const xpiName of xpis) {
    const versionName = xpiName.match(
      /web-ext-artifacts\/proxy_proxy-(.*)-an\+fx\.xpi/
    )[1]
    const sha512 = crypto.createHash('sha512')
    const file = fs.readFileSync(xpiName)
    sha512.update(file)
    const hashHex = sha512.digest('hex')
    updates.push({
      version: versionName,
      update_link: `https://dl.bintray.com/oott123/proxy-proxy/xpi/proxy_proxy-${versionName}-an+fx.xpi`,
      update_hash: `sha512:${hashHex}`
    })
  }
}

genUpdate()
  .catch(err => console.error(err))
  .then(() => {
    const contents = JSON.stringify(manifest, null, 2)
    fs.writeFileSync('web-ext-artifacts/update-manifest.json', contents)
  })

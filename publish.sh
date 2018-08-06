#!/bin/bash
set -xe
node bintray.js
CURRENT_VERSION=`cat manifest.json | jq -r '.version'`
CURRENT_FILENAME="proxy_proxy-${CURRENT_VERSION}-an+fx.xpi"
jfrog bt u web-ext-artifacts/$CURRENT_FILENAME oott123/proxy-proxy/xpi/publish /xpi/
# publish version on upload so these files are always accessable
jfrog bt u --override --publish web-ext-artifacts/$CURRENT_FILENAME oott123/proxy-proxy/xpi/publish /xpi/proxy_proxy-latest-an+fx.xpi
jfrog bt u --override --publish web-ext-artifacts/update-manifest.json oott123/proxy-proxy/xpi/publish /xpi/

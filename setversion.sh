#!/usr/bin/bash
export VERSION=`git describe --long --tags --dirty --always`
echo exports._version = \'$VERSION\'\;  > src/version.js
echo VERSION=$VERSION


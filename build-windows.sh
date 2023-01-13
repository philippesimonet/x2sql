#!/usr/bin/bash
export `./setversion.sh`
echo $VERSION
pkg -C gzip --target node16-win-x64 -o dist/x2sql-$VERSION.exe src/x2sql.js




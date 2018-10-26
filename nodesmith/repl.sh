#!/bin/bash
set -e

DIRNAME=$(dirname "$0")

if [ -z "$1" ]; then
  echo "missing endpoint argument. Usage: node-wrapper.sh"
  exit -1
fi

node -i --no-warnings --experimental-repl-await -e "$(< ${DIRNAME}/start_repl.js)" - "$1" "${DIRNAME}"
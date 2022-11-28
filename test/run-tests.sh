#!/usr/bin/env bash
cd "$( dirname "$0" )" || exit 1

../bin/ts2ucode ./fixtures/project ./out/project

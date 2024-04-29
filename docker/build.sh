#!/bin/bash
export FEIKONGWANG_VERSION=0.0.2
echo "#########################################################################"
echo "feikongwang version: ${FEIKONGWANG_VERSION}"
echo "#########################################################################"

docker-compose build --no-cache \
    --build-arg ARCH=amd64 \
    --build-arg NODE_VERSION=14 \
    --build-arg OS=alpine3.12 \
    --build-arg BUILD_DATE="$(date +"%Y-%m-%dT%H:%M:%SZ")"

docker tag steedos/steedos-apps-feikongwang:latest steedos/steedos-apps-feikongwang:${FEIKONGWANG_VERSION}
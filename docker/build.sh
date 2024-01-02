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

docker tag steedos/feikongwang:latest steedos/feikongwang:${FEIKONGWANG_VERSION}
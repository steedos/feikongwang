#!/bin/bash
export APPS_VERSION=2.6.0
echo "#########################################################################"
echo "steedos apps version: ${APPS_VERSION}"
echo "#########################################################################"

docker-compose build --no-cache \
    --build-arg ARCH=amd64 \
    --build-arg NODE_VERSION=14 \
    --build-arg OS=alpine3.12 \
    --build-arg BUILD_DATE="$(date +"%Y-%m-%dT%H:%M:%SZ")"

docker tag steedos/steedos-apps:latest steedos/steedos-apps:${APPS_VERSION}
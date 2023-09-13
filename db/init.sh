#!/usr/bin/env bash

current_dir=$(dirname $BASH_SOURCE)
cd $current_dir

DEV_CONTAINER_NAME="tsexpress"

docker \
  run \
  -d \
  --name $DEV_CONTAINER_NAME \
  -p 3306:3306 \
  -v "$(pwd)"/scripts/:/docker-entrypoint-initdb.d/ \
  -e MYSQL_ROOT_PASSWORD=1234 \
  -e MYSQL_USER=tsexpress \
  -e MYSQL_PASSWORD=1234 \
  -e MYSQL_DATABASE=tsexpress \
  -e LANG=C.UTF-8 \
  mariadb:latest \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_unicode_ci

docker logs -f $DEV_CONTAINER_NAME

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
  -e MYSQL_ROOT_PASSWORD=dev_root_passwd \
  -e MYSQL_USER=dev_user \
  -e MYSQL_PASSWORD=dev_passwd \
  -e MYSQL_DATABASE=dev_db \
  -e LANG=C.UTF-8 \
  mariadb:latest \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_unicode_ci

docker logs -f $DEV_CONTAINER_NAME

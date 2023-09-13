#!/usr/bin/env bash

current_dir=$(dirname $BASH_SOURCE)
cd $current_dir

DEV_CONTAINER_NAME="tsexpress"

docker run \
  --detach \
  --env MYSQL_ROOT_PASSWORD=1234 \
  --env MYSQL_USER=tsexpress \
  --env MYSQL_PASSWORD=1234 \
  --env MYSQL_DATABASE=tsexpress \
  --name tsexpress \
  --publish 3306:3306 \
  mariadb:latest \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_unicode_ci

docker logs -f $DEV_CONTAINER_NAME

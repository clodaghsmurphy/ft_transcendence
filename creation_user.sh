#!/bin/bash

echo -e "\033[32m\n--- Lancement de docker-compose ---\n\033[0m"
docker-compose up --build -d

echo -e "\033[32m\n--- Sleep 15 pour attendre la DB ---\n\033[0m"
echo Waiting...
sleep 15

echo -e "\033[32m\n--- Creation des users ---\n\033[0m"
curl -H 'Content-Type: application/json' \
      -d '{ "name":"adben-mc","avatar": "./media/adben-mc"}' \
      -X POST localhost:3042/user/create

echo 

curl -H 'Content-Type: application/json' \
      -d '{ "name":"clmurphy","avatar": "./media/clmurphy"}' \
      -X POST localhost:3042/user/create

echo

curl -H 'Content-Type: application/json' \
      -d '{ "name":"nguiard","avatar": "./media/nguaird"}' \
      -X POST localhost:3042/user/create

echo

curl -H 'Content-Type: application/json' \
      -d '{ "name":"ple-lez","avatar": "./media/ple-lez"}' \
      -X POST localhost:3042/user/create

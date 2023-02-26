# This is a script to generate test data into the DB

curl -H 'Content-Type: application/json' \
	-d '{ "name": "clmurphy", "avatar": "media/clmurphy.jpg" }' \
	-X POST \
	localhost:3042/user/create

curl -H 'Content-Type: application/json' \
	-d '{ "name": "nguiard", "avatar": "media/nguiard.jpg" }' \
	-X POST \
	localhost:3042/user/create

curl -H 'Content-Type: application/json' \
	-d '{ "name": "adben-mc", "avatar": "media/adben-mc.jpg" }' \
	-X POST \
	localhost:3042/user/create

curl -H 'Content-Type: application/json' \
	-d '{ "name": "ple-lez", "avatar": "media/ple-lez.jpg" }' \
	-X POST \
	localhost:3042/user/create


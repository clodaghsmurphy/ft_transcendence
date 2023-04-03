# This is a script to generate test data into the DB

echo "Creating Users\n"

curl -H 'Content-Type: application/json' \
	-d '{ "name": "clmurphy", "avatar": "", "id" :  94551 }' \
	-X POST \
	localhost:3042/user/create

echo

curl -H 'Content-Type: application/json' \
	-d '{ "name": "nguiard", "avatar": "https://cdn.intra.42.fr/users/606bb15cacede67bb022361cda169a81/nguiard.jpg",  "id" : 94596 }' \
	-X POST \
	localhost:3042/user/create

echo

curl -H 'Content-Type: application/json' \
	-d '{ "name": "adben-mc", "avatar": "https://cdn.intra.42.fr/users/40c3eed0c4a3287945f4dcbb038b155b/adben-mc.jpg", "id" : 3 }' \
	-X POST \
	localhost:3042/user/create

echo

curl -H 'Content-Type: application/json' \
	-d '{ "name": "ple-lez", "avatar": "https://cdn.intra.42.fr/users/6b552059f5c71d3f8e5b66c086e17aea/ple-lez.jpg", "id" : 4  }' \
	-X POST \
	localhost:3042/user/create

echo "\n\nUpdating Users\n"

curl -H 'Content-Type: application/json' \
	-d '{"name": "adben-mc", "id" : 1, "avatar": "https://cdn.intra.42.fr/users/de7e6b8845aea12744adeaeefb48dbc8/small_adben-mc.jpg", "blocked_users": [2], "friend_users": [4], "channels": ["Transcendence", "Illuminatis"], "connected": false, "in_game": false, "game_id": -1, "last_games": [ { "has_won": "true", "opponnent": 2, "score": ["10", "6"] }, { "has_won": "true", "opponnent": 3, "score": ["10", "4"] } ]}' \
	-X POST \
	localhost:3042/user/update

echo

curl -H 'Content-Type: application/json' \
	-d '{"name":"clmurphy", "id" : 2, "avatar":"https://cdn.intra.42.fr/users/6700ab6b3b9c0b82eb76e0ae301023b7/small_clmurphy.jpg","blocked_users":[],"friend_users":[],"channels":["Transcendence"],"connected":true,"in_game":true,"game_id":2,"last_games":[{"has_won":false,"opponnent":3,"score":[0,10]}]}' \
	-X POST \
	localhost:3042/user/update

echo

curl -H 'Content-Type: application/json' \
	-d '{"name":"nguiard", "id" : 3, "avatar":"https://cdn.intra.42.fr/users/2a54f27654e8ff846ba033f7ba41caf5/small_nguiard.jpg","blocked_users":[3],"friend_users":[4,1],"channels":["Illuminatis"],"connected":true,"in_game":true,"game_id":2,"last_games":[{"has_won":true,"opponnent": 2,"score":[10,0]},{"has_won":false,"opponnent": 1,"score":[4,10]}]}'  \
	-X POST \
	localhost:3042/user/update

echo

curl -H 'Content-Type: application/json' \
	-d '{"name":"ple-lez", "id" : 4, "avatar":"https://cdn.intra.42.fr/users/c19e015d4f1c6493cf5e0ad37d293f4b/small_ple-lez.jpg","blocked_users":[],"friend_users":[2,1,3],"channels":[],"connected":true,"in_game":false,"game_id":-1,"last_games":[]}'  \
	-X POST \
	localhost:3042/user/update

echo "\n\nCreating Channels\n"

curl -H 'Content-Type: application/json' \
	-d '{ "name": "chan", "owner_id": 4, "users_ids": [3] }' \
	-X POST \
	localhost:3042/channel/create

echo

curl -H 'Content-Type: application/json' \
	-d '{ "name": "supergroupe", "owner_id": 1, "users_ids": [2], "password": "yolo" }' \
	-X POST \
	localhost:3042/channel/create

echo "\n\nJoining Channels\n"

curl -H 'Content-Type: application/json' \
	-d '{ "name": "chan", "user_id": 94596 }' \
	-X POST \
	localhost:3042/channel/join

echo

curl -H 'Content-Type: application/json' \
	-d '{ "name": "supergroupe", "user_id": 3 }' \
	-X POST \
	localhost:3042/channel/join

echo

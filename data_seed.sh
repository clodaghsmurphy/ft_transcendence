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

echo "\nupdating"

curl -H 'Content-Type: application/json' \
	-d '{"name": "adben-mc", "avatar": "./media/adben-mc.jpg", "blocked_users": ["nguiard"], "friend_users": ["ple-lez"], "channels": ["Transcendence", "Illuminatis"], "connected": false, "in_game": false, "game_id": -1, "last_games": [ { "has_won": "true", "opponnent": "clmurphy", "score": ["10", "6"] }, { "has_won": "true", "opponnent": "nguiard", "score": ["10", "4"] } ]}' \
	-X POST \
	localhost:3042/user/update

curl -H 'Content-Type: application/json' \
	-d '{"name":"clmurphy","avatar":"./media/clmurphy.jpg","blocked_users":[],"friend_users":[],"channels":["Transcendence"],"connected":true,"in_game":true,"game_id":2,"last_games":[{"has_won":false,"opponnent":"nguiard","score":[0,10]}]}' \
	-X POST \
	localhost:3042/user/update

curl -H 'Content-Type: application/json' \
	-d '{"name":"nguiard","avatar":"./media/nguiard.jpg","blocked_users":["adben-mc"],"friend_users":["ple-lez","clmurphy"],"channels":["Illuminatis"],"connected":true,"in_game":true,"game_id":2,"last_games":[{"has_won":true,"opponnent":"clmurphy","score":[10,0]},{"has_won":false,"opponnent":"adben-mc","score":[4,10]}]}'  \
	-X POST \
	localhost:3042/user/update

curl -H 'Content-Type: application/json' \
	-d '{"name":"ple-lez","avatar":"./media/ple-lez.jpg","blocked_users":[],"friend_users":["nguiard","clmurphy","adben-mc"],"channels":[],"connected":true,"in_game":false,"game_id":-1,"last_games":[]}'  \
	-X POST \
	localhost:3042/user/update

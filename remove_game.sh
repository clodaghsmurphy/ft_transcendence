# This is a script to generate test data into the DB

echo "Removing game $1\n"

curl -H 'Content-Type: application/json' \
	-d "{ \"id\": $1} " \
	-X POST \
	localhost:3042/game/remove

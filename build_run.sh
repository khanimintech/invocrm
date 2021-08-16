set -e

# here should be source code pulling/update

docker-compose build
docker-compose down


docker-compose run --rm  web ./manage.py migrate
docker-compose up &>>server.log &

sleep 9


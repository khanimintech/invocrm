#!/bin/bash

set -e
cd invocrmjs
#if  [ ! -d "node_modules" ] || [ "$REBUILD_FRONT" == "1" ]; then

npm install xlsx &&\
  npm run build
#fi

npx gulp &&\
 cp build/index.html ../templates/index.html &&\
 cp -r build/static/media ../static/
cd ..

python manage.py runserver 0.0.0.0:8000
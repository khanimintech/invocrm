#!/bin/bash
cd invocrmjs &&\
 npx gulp &&\
 cp build/index.html ../templates/index.html &&\
 cp -r build/static/media ../static/
cd ..

python manage.py runserver 0.0.0.0:8000
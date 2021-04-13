FROM python:3.9

ENV PYTHONUNBUFFERED 1
ENV WORKDIR /app
WORKDIR ${WORKDIR}
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

CMD python manage.py runserver 0.0.0.0:8003


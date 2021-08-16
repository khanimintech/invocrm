FROM python:3.9

ENV PYTHONUNBUFFERED 1
ENV WORKDIR /app
WORKDIR ${WORKDIR}
RUN apt update
RUN apt install npm -y
RUN npm install -g n
RUN n 10.19.0
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

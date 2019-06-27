FROM node:8.16.0-alpine

RUN mkdir /app
COPY . /app/

EXPOSE 5000

CMD [ "node", "/app/dist/index.js" ]

FROM node:12.14.1-stretch-slim

WORKDIR /app

COPY .  /app
RUN cd /app && yarn && yarn run build

EXPOSE 3000
CMD ["yarn",  "start"]

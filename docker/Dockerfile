FROM node:14-slim

RUN apt-get update || : && apt-get install -y \
    python \
    curl \
    build-essential
    
# RUN npm install -g typescript ts-node

WORKDIR /app

COPY ../package.json .
COPY ../lerna.json .
COPY ../steedos.config.js .
COPY ../steedos-packages-hr ./steedos-packages-hr
COPY ../steedos-packages-oa ./steedos-packages-oa
COPY ../steedos-packages-pm ./steedos-packages-pm

RUN yarn --production && yarn cache clean

CMD ["yarn", "dev"]
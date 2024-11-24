FROM node:21-alpine as production

RUN apk add --no-cache \
    python3 \
    build-base \
    make \
    g++ \
    imagemagick \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev


# Add dependencies to get Bun working on Alpine
#RUN apk --no-cache add ca-certificates wget
#RUN wget https://raw.githubusercontent.com/athalonis/docker-alpine-rpi-glibc-builder/master/glibc-2.26-r1.apk
#RUN apk add --allow-untrusted --force-overwrite glibc-2.26-r1.apk
#RUN rm glibc-2.26-r1.apk
# Install Bun
#RUN npm install -g bun

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/app

COPY ./package.json .

RUN yarn


COPY ./applets applets
COPY ./public public
COPY ./routes routes
COPY ./views views
COPY ./app.js .
COPY ./babel-plugin-jsx-to-json.js .
COPY ./config.json .
COPY ./server-side-rendering.js .


CMD ["npm","run","pm2"]
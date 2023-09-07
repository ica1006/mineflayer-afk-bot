FROM node:18

ENV IP "LOCALHOST"
ENV PORT "25565"
ENV USERNAME "username"
ENV PASSWORD "passowrd"

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["nmp", "start ${IP} ${PORT} ${USERNAME} ${PASSWORD}"]
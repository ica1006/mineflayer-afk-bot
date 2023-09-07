FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

ARG IP
ARG PORT
ARG USERNAME
ARG PASSWORD

CMD ["nmp", "start", IP, PORT, USERNAME, PASSWORD]
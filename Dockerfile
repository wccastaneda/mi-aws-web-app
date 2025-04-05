FROM node:16-alpine

ENV AWS_DEFAULT_REGION=us-east-1
ENV AWS_ACCESS_KEY_ID=test
ENV AWS_SECRET_ACCESS_KEY=test

# Instalar Python3 y pip para poder instalar AWS CLI
RUN apk add --no-cache bash python3 py3-pip
RUN pip3 install awscli

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
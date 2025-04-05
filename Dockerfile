FROM node:16-alpine

# Instalar Python3 y pip
RUN apk add --no-cache python3 py3-pip

# Instalar AWS CLI (versión 1)
RUN pip3 install awscli

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
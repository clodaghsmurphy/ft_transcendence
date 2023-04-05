FROM node:18-buster

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN mkdir -p uploads

RUN npm ci --force

COPY . ./

EXPOSE 3000

CMD ["npm", "start"]

FROM node:18-buster

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

EXPOSE 3042

CMD ["npm", "run", "start"]

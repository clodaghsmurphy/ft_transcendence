FROM node:19-alpine3.16 as builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY . .

RUN npm install
RUN npm install tsc -g
RUN tsc
RUN npm install react-scripts@3.4.1 -g 


EXPOSE 3000

CMD ["npm", "start"]
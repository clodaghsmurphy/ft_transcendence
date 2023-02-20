FROM node:18-buster

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY . .

RUN npm install
RUN npm install react-scripts@3.4.1 -g 
RUN npm install @types/reach__router --save-dev
RUN npm install --save-dev @types/query-string


EXPOSE 3000

CMD ["npm", "start"]

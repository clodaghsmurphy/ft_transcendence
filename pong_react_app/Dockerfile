FROM node:18-buster

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
#COPY script_front.sh /app/script_front.sh
#RUN mkdir /app/public
#COPY src /app/public
#COPY . /app

RUN pwd

RUN npm install
RUN npm install react-scripts@3.4.1 -g 
RUN npm install @types/reach__router --save-dev
RUN npm install --save-dev @types/query-string
RUN npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
RUN npm install --save-dev @types/uuid

COPY . ./

EXPOSE 3000

CMD ["npm", "start"]

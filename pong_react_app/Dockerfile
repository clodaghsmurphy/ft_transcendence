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
RUN npm install @types/reach__router --save-dev  --force
RUN npm install --save-dev @types/query-string --force
RUN npm install @mui/material @emotion/react @emotion/styled @mui/icons-material --force
RUN npm install --save-dev @types/uuid --force
RUN npm install react-icons --force
RUN npm install axios --save --force
RUN npm install crypto-browserify --force
RUN npm install reactjs-popup --save --force
RUN npm install react-bootstrap bootstrap --force
RUN npm install bootstrap jquery @popperjs/core --force



COPY . ./

EXPOSE 3000

CMD ["npm", "start"]

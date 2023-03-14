FROM node:18-buster

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir -p prisma/migrations prisma/migrations/init
RUN npx prisma generate
RUN npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/init/migration.sql
RUN npm install --save @nestjs/passport passport passport-local
RUN npm install passport-42
RUN  npm i express-session
RUN npm install --save @nestjs/jwt passport-jwt
RUN npm install --save-dev @types/passport-jwt
RUN npm install passport-jwt
RUN npm i -D @types/express-session
RUN npm install  --save-dev @types/otplib
RUN npm install qrcode --save

EXPOSE 3042

CMD ["bash", "entrypoint.sh"]

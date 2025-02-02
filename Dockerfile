FROM node:18

WORKDIR /usr/src/app

COPY . . 

WORKDIR /usr/src/app/my-shop-frontend
RUN npm i
RUN npm run build 

WORKDIR /usr/src/app/my-shop-backend
RUN npm i 

EXPOSE 3001

CMD [ "node", "index.js" ]
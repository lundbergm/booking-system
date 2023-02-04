FROM node:18-alpine
WORKDIR /home/app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY db.sqlite .
COPY .env.defaults .
COPY src /home/app/src

RUN npm ci 
RUN npm run build

USER 1000:1000

CMD ["node", "dist/index.js"]

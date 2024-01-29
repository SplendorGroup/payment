FROM node:20-alpine

WORKDIR /app

COPY --chown=node:node . .

USER node

RUN npm install --force

RUN npm prune --production

RUN npx prisma generate

RUN npm run build

RUN find /app -type f -exec chmod a-w {} +

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

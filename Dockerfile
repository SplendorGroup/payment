FROM node:20-alpine

WORKDIR /app

COPY --chown=node:node . .

RUN npm install --force

RUN npm prune --production

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

FROM node:20-alpine

WORKDIR /app

COPY --chown=root:root --chmod=644 ./src /src
COPY --chown=root:root --chmod=644 ./prisma /prisma
COPY --chown=root:root --chmod=644 ./package.json /package.json

RUN npm install --force

RUN npm prune --production

RUN npx prisma generate

RUN npm run build

RUN find /app -type f -exec chmod a-w {} +

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

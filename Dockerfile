FROM node:20.13.1-alpine3.20 AS runtime
WORKDIR /app

COPY . .

RUN npm install
#RUN npm start

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
#CMD node ./dist/server/entry.mjs
CMD ["npm", "start"]
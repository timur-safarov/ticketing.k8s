# docker build -t jgslahrb/client .
FROM node:alpine

WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]
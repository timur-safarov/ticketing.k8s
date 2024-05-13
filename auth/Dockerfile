# docker build -t jgslahrb/blog-auth .
# docker run 7e8d5597cdba22ec591d05ab28657c06fb7ba7ea6b58f2af0884873001e5e928
# docker login
# docker push jgslahrb/blog-auth

FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]
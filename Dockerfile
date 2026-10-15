FROM node:24-alpine
WORKDIR /app
COPY package.json server.js ./
COPY public ./public
ENV NODE_ENV=production
EXPOSE 8092
CMD ["node", "server.js"]

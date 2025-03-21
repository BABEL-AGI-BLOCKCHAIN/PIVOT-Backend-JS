FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 5000

# CMD ["node", "src/index.js"]

CMD sh -c "npx prisma migrate deploy && npx prisma generate && npm run dev"
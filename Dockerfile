FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 5000

CMD sh -c "npx prisma migrate deploy && npx prisma generate && npm run dev"

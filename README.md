This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, change the .env.example to .env and set the variables and then run the development server:

setup postgres in your machine and then

To connect to pg server
```bash
npx prisma migrate dev --name init --skip-seed
npx prisma db push
```
```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:5000) with your browser to see the result.
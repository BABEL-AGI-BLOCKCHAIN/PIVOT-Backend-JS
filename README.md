This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, change the .env.example to .env and set the variables and then run the development server:

Without Docker

To connect to pg server
```bash
npx prisma migrate dev --name init --skip-seed
npx prisma db push
```
```bash
npm i
npm run dev
```


With Docker

```bash
docker compose build
docker compose up -d
```

To connect the pgsql server 
```bash
npx prisma generate
npx prisma migrate dev --name init --skip-seed
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
Open [http://localhost:8080](http://localhost:8080) with your browser to see the adminer for your db. Choose pgSQL and enter your details.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

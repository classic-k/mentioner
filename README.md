This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Telegram Bot That send notification to group members via mention
Set Up a Bot via BOT FATHER
Add BOT to telegram group as admin
Set the env variable for BOT_TOKEN, OWNER and DB_URI
BOT_TOKEN is provided by BOT Father after Bot setup
OWNER is the telegram account user ID
DB_URI is a mongo DB database URI
For the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
For the production server:

Deploy on vercel

Set the bot webhook url as

https://api.telegram.org/bot<BOT_TOKEN>/setwebhook?url=<APP URL>/bot

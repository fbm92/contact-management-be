# SETUP PROJECT

create  .env file

```
DATABASE_URL="mysql://root:@Aulian120819@localhost:3306/db_restful_api"

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run build
npm run start
node dist/main

```
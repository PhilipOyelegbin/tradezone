# Tradezone API

The API will serve as the backend engine for a digital storefront and facilitate essential e-commerce operations such as product management, user authentication, order processing, and payment integration.

---

## Requirements

- Nodejs v24
- Postmark account
- Cloudflare account
- PostgreSQL database
- Redis
- Paystack account

---

## Installed Packages

**Main**

- Env variable: @nestjs/config
- Hashing: argon2
- Security: csrf-csrf
- Documentation: @nestjs/swagger
- Database: typeorm, pg, reflect-metadata
- Validator: class-validator, class-transformer
- Authentication: @nestjs/passport passport @nestjs/jwt passport-jwt
- Rate limit: @nestjs/throttler
- Cache: @nestjs/cache-manager cache-manager @keyv/redis
- Mailing system: postmark
- File upload: @types/multer
- File storage: @aws-sdk/client-s3

**Dev**

- Authentication: @types/passport-jwt
- Database: @nestjs/typeorm

---

## Setup Instructions

1. Install the required packages using the command `pnpm install`.

2. Create your **.env** file with appropriate secret variables using the **.env.example** file.

3. Run the application in dev mode using the command `pnpm run start:dev`.

> The application will be available via the url (http://localhost:<your_env_port>)

**Webhook Setup**
To setup your webhook for the local backend application, run the commands below.

```bash
cd ..   # change directory to the root folder
pnpm run proxy
```

---

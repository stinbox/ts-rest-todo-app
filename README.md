# Todo App

## Stack

- ts-rest
- better-auth
- Drizzle ORM
- Turborepo
- daisyUI

## Setup

依存関係をインストールする。

```sh
pnpm install
```

`server/.env.example` をコピーして `server/.env` を作成する。

```sh
cp server/.env.example server/.env
```

Drizzle ORM のマイグレーションを実行する。

```sh
cd server
pnpm run db:push
```

## Start Server

Dev Server

```sh
pnpm run dev
```

http://localhost:3000 でサーバーが起動する。

Production Server

```sh
pnpm run build
pnpm run preview
```

http://localhost:3000 でサーバーが起動する。

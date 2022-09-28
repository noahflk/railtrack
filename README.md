<h1 align="center">
  railtrack 🛤
</h1>

<p align="center">
  Web app to track your train journeys in and around Switzerland 
</p>

---

<p align="center">
  <a href="https://github.com/noahflk/railtrack">
    <img src="https://raw.githubusercontent.com/noahflk/railtrack/main/public/images/screenshot-marketing.png" alt="Railtrack Logo">
  </a>

  <h3 align="center">Railtrack</h3>

  <p align="center">
    Track your train journeys in and around Switzerland 
    <br />
    <a href="https://railtrack.vercel.app"><strong>Try it out »</strong></a>
  </p>
</p>

# Track your train journeys in and around Switzerland

Railtrack allows you to keep track of your journeys with public transport in and around Switzerland. Journey data comes from the [Swiss public transport API](https://transport.opendata.ch). Railtrack will give you an overview and statistics about your past journeys.

# Development

## Built With

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [tRPC](https://trpc.io/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [Tailwind](https://tailwindcss.com/)

## Local setup

After cloning the repository, install the dependencies.

```bash
npm install
```

Set up the local environment variables with your personal Supabase and Mapbox tokens. You must create the database schema in Supabase.

```bash
cp .env-example .env.local
# now edit the .env.local file
```

Push the schema to the database

```bash
npx prisma db push
```

Run the app locally

```bash
npm run dev
```

## License

`railtrack` is available under the AGPL-3.0 license. See the [LICENSE](LICENSE.md) file for more info.

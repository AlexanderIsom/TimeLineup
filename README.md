## Time Lineup

TimeLineup is a event planning application built with [Next.js](https://nextjs.org/) as a means to explore authentication, route protection, data fetching in intervals, data fetching on the client and server with [TanStack Query](https://tanstack.com/query/latest) and [Supabase](https://supabase.com/)'s postgres database (making use of row level security policies) and [Tailwind CSS](https://tailwindcss.com/) for styling and finally state management with [Zustand](https://github.com/pmndrs/zustand).

A live version of the application can be found at [timelineup.com](https://timelineup.com/)

## prerequisites

This repo is desinged to work with supabase running in docker locally or hosted on supabase, you will need to install the [supabase cli](https://supabase.com/docs/guides/cli/getting-started) if you havent already and if you choose to run supabase locally you will need to make sure [docker](https://www.docker.com/) is installed and running. The instructions listed below are for running supabase locally in docker.

## setup

use a package manager of your choice to install the project dependencies

```bash
pnpm i
```

setup the docker conatainer and supabase docker container with the predefined schema by running the following command

```bash
supabase start
```

because supabase is pre configured theres no need to run the supabase init command.

once supabase has setup the console will outout a list of addresses for supabase, copy the anon key adn the api url for use in the .env file

stop the supabase docker container

```bash
supabase stop
```

before running the dev server you will need to create a `.env` file in the root of the project with the following variables

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY= *enter your supabase anon key here*
NEXT_PUBLIC_SUPABASE_URL= *enter your supabase api url here*

SUPABASE_AUTH_GOOGLE_CLIENT_ID = [replace with google client id]
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET = [replace with google secret]

SUPABASE_AUTH_GITHUB_CLIENT_ID= [replace with github client id]
SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET = [replace with github secret]

SUPABASE_AUTH_DISCORD_CLIENT_ID = [replace with discord client id]
SUPABASE_AUTH_EXTERNAL_DISCORD_SECRET = [replace with discord secret]
```

paste the values you previously copied from the supabase console into the .env file

supabase is setup with 3 auth providers, google, github and discord. You can use any of these to login to the app but you will need to setup their oauth on their own sites and add them to the .env file with the matching variable. make sure when setting up each oauth that the redirect uri is set to the supabase "_api url_/auth/v1/callback"

once your chosen oauth provider is setup and added to the .env file, re-start the supabase docker conatiner to enable auth with the .env values

```bash
supabase start
```

you can now run the dev server with

```bash
pnpm dev
```

open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

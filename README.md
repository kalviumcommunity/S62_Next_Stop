Next Stop: Travel Planner 

Project Overview

    Next Stop: Travel Planner is a personalized travel wishlist application that allows users to organize and track the destinations they would like to visit. The app helps users discover, save, and manage their favorite places in a simple and interactive interface.

Key Features

    Add Places: Users can select places to visit and add them to their favorites or a dedicated travel list.

    Read Reviews: The application allows users to read reviews shared by visitors about different places.

    Update Places & Reviews: Users can add new places to their list and update existing places or reviews.

    Delete Unpopular Places: Users can remove places that they no longer want to visit or haven’t interacted with in a while.

    Mark as Visited: Users can mark places they have visited to track their travel experiences.

    Revisit List: Users can create a revisit list for places they’ve already visited or want to visit again in the future.

Happy coding.


render deploy link  https://s62-next-stop.onrender.com/ping

Frontend deploy link - https://nextstops.netlify.app/

## Running locally

**Backend** (Express + MongoDB), port 8080

```bash
cd backend
cp .env.example .env      # set DB_URI (MongoDB connection string) and JWT_SECRET
npm install
npm run seed              # optional: adds 3 sample places
npm run dev
```

**Client** (React + Vite + Tailwind), port 5173

```bash
cd client
cp .env.example .env      # VITE_API_URL=http://localhost:8080/api
npm install
npm run dev
```

## Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/places` | All places. `?tab=wishlist`, `visited`, `revisit`, `favorites` |
| `/places/:id` | Place details and reviews |
| `/addEntity`, `/updateEntity/:id` | Add / edit a place |
| `/signup`, `/login` | Account |

## API

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/places?status=&q=&favorite=true` | List places |
| GET | `/api/places/:id` | One place |
| POST | `/api/places` (or `/api/new-places`) | Create `{ name, location, description?, imageUrl?, status?, favorite? }` |
| PUT | `/api/places/:id` | Update; `status` is `wishlist` / `visited` / `revisit` |
| DELETE | `/api/places/:id` | Delete place and its reviews |
| POST | `/api/places/:id/reviews` | Add review `{ author, rating 1-5, comment }` |
| PUT / DELETE | `/api/places/:id/reviews/:reviewId` | Edit / delete review |
| POST | `/api/auth/signup`, `/api/auth/login` | Account; login returns a JWT |


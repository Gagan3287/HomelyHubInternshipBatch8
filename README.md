# HomelyHub — AI-Powered Stay Booking Platform

A full-stack MERN application to **search, book and list stays**, with AI built in for
property descriptions and day-wise trip planning.

Built as the internship project for **Emertxe / WSA — MERN Stack Development (Cohort WMSI26_008)**.

---

## Features

| Area | What it does |
|---|---|
| **Authentication** | Signup / Login / Logout using JWT stored in an httpOnly cookie |
| **Forgot Password** | Emailed reset link; only the *hash* of the token is stored, expires in 10 minutes |
| **Search + Filters** | City, price, property type, room type, amenities, guests — with pagination (12 per page) |
| **Date Availability** | Properties already booked for the chosen dates are hidden from results |
| **Property Details** | Photo gallery, amenities, Leaflet map, check-in / check-out times |
| **Booking & Payment** | Create order → verify → confirmed, with dates blocked on the property |
| **My Bookings** | List of all trips plus a per-booking details page |
| **List Your Property** | Owners upload photos to ImageKit and AI writes the description |
| **AI Trip Planner** | Destination + budget + days + interests → day-wise plan + matching stays |

---

## Tech Stack

**Frontend** — React 18 (Vite), Redux Toolkit, React Router, Axios, Ant Design, Leaflet, TanStack Form
**Backend** — Node.js, Express, MongoDB + Mongoose, JWT, bcrypt, Nodemailer + Mailgen
**AI & Services** — Groq SDK (LLM), ImageKit (image hosting)

---

## Project Structure

```
HomelyHub/
├── backend/
│   ├── src/
│   │   ├── Models/          # User, Property, Booking schemas
│   │   ├── controllers/     # auth, property, booking, trip
│   │   ├── routes/          # userRoutes, propertyRouter, bookingRouter, tripRouter
│   │   ├── ai/              # Groq client, description writer, trip planner
│   │   ├── utils/           # db, token, mail, ImageKit, APIFeatures
│   │   └── index.js         # Express entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/assets/       # images, logo, avatar
│   ├── src/
│   │   ├── components/      # home, user, propertyListing, accomodation,
│   │   │                    # myBookings, payment, aiTripPlanner
│   │   ├── store/           # Redux: Property, PropertyDetails, User,
│   │   │                    # Booking, Payment, Accomodation
│   │   ├── ai/              # frontend calls to the AI endpoints
│   │   ├── css/
│   │   ├── utils/axios.js   # central axios instance (withCredentials)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── database/
│   └── properties.seed.json # 31 sample properties for MongoDB import
└── docs/
    └── HomelyHub_Project_Presentation.pdf
```

---

## Getting Started

### Prerequisites
Node.js 18+, npm, and a MongoDB Atlas account.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # then fill in your own values
npm run dev              # starts on http://localhost:8080
```

Fill in `.env`:

| Variable | Where to get it |
|---|---|
| `MONGO_URI` | MongoDB Atlas → Connect → Drivers |
| `JWT_SECRET` | any long random string |
| `MAILTRAP_SMTP_*` | mailtrap.io → Sandbox → SMTP settings |
| `IMAGEKIT_*` | imagekit.io → Developer options → API keys |
| `GROQ_API_KEY` | console.groq.com → API keys |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev              # starts on http://localhost:5173
```

Vite proxies every `/api` request to `http://localhost:8080`, so no extra config is needed.

### 3. Seed sample properties (optional)

```bash
mongoimport --uri "<YOUR_MONGO_URI>" \
  --collection properties \
  --jsonArray --file database/properties.seed.json
```

---

## API Endpoints

Base URL: `/api/v1/rent`

### User — `/user`
| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/signup` | — | Register |
| POST | `/login` | — | Log in, sets JWT cookie |
| GET | `/logout` | — | Clear cookie |
| GET | `/me` | ✅ | Current logged-in user |
| PATCH | `/updateMe` | ✅ | Update profile |
| PATCH | `/updateMyPassword` | ✅ | Change password |
| POST | `/forgotPassword` | — | Email a reset link |
| PATCH | `/resetPassword/:token` | — | Set a new password |
| POST | `/generateDescription` | ✅ | AI property description |
| POST | `/newAccommodation` | ✅ | Create a listing |
| GET | `/myAccommodation` | ✅ | Owner's listings |

### Listings — `/listing`
| Method | Route | Purpose |
|---|---|---|
| GET | `/` | Search + filter + paginate |
| GET | `/:id` | One property |

### Bookings — `/user/booking`
| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/` | ✅ | My bookings |
| GET | `/:bookingId` | ✅ | Booking details |
| POST | `/create-order` | ✅ | Start payment |
| POST | `/verify-payment` | ✅ | Confirm + block dates |

### Trip — `/trip`
| Method | Route | Purpose |
|---|---|---|
| POST | `/` | AI day-wise trip plan |

---

## Engineering Notes

- **Double booking** is prevented by pushing the booked range into `property.currentBookings`
  and treating an overlap as `existing.start < myCheckout && existing.end > myCheckin`.
- **Passwords** are hashed with bcrypt in a Mongoose pre-save hook and hidden using `select: false`.
- **Reset tokens** are stored hashed, never in plain text, and expire after 10 minutes.
- **Old JWTs stop working** after a password change, via a `passwordChangedAt` check.
- **Images** live on ImageKit; MongoDB stores only the URL and file id.
- **AI output** is constrained by a strict system prompt and a JSON-only response format,
  so it never invents amenities that were not supplied.
- **Cross-origin cookies** work because CORS runs with `credentials: true` and the axios
  instance sets `withCredentials: true`.

---

## Future Scope

Real Razorpay payment integration, reviews and ratings, and an admin dashboard.

---

## Author

**Gagan Chandra Tej Vengala** — SR University
Internship Cohort WMSI26_008, Emertxe Information Technologies

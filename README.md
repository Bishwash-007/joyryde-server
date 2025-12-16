# Joyride Backend

Node.js + Express + MongoDB backend for ride-sharing with JWT, Clerk OAuth, Stripe payments, SMTP OTP, and GeoJSON search. Uses ES modules and Vitest for tests.

## Quick start

1. Install deps: `npm install`
2. Copy env: `cp .env.example .env` and fill values.
3. Run dev: `npm run dev`
4. Run tests: `npm test`

## Environment

See [.env.example](.env.example) for all required keys:

- Mongo: `MONGODB_URI`
- Auth: `JWT_SECRET`, `JWT_REFRESH_SECRET`
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- Stripe: `STRIPE_SECRET_KEY`
- Clerk: `CLERK_API_KEY`, `CLERK_SECRET`
- Cloudinary: `CLOUDINARY_*`
- Google Maps: `GOOGLE_MAPS_API_KEY`

## Key integrations

- **Clerk OAuth**: Call `/api/auth/login` after obtaining Clerk session; map `clerkId` in `User`. Token verification stub in `src/config/clerk.js`.
- **JWT access/refresh**: 15m access, 30d refresh with rotation and hashing in `RefreshToken` collection.
- **OTP email**: `/api/auth/otp/request` sends 6-digit code via Nodemailer SMTP; verify with `/api/auth/otp/verify`.
- **Stripe**: `/api/riders/rides/:id/pay` creates PaymentIntent and `Payment` record; client confirms with `intentClientSecret`.
- **Multer uploads**: `PATCH /api/users/:id/avatar` accepts `multipart/form-data` with field `file` and stores to Cloudinary.
- **Socket.io**: join rooms via `joinRide` (rideId), emit `bid:place` or `chat:message`; server rebroadcasts to `ride:{rideId}` room.
- **Cloudinary**: Configured in `src/config/cloudinary.js` for uploads (use in controllers as needed).
- **Google Maps**: Geocoding helper in `src/config/googleMaps.js` for address → coords.
- **Biometric stub**: `/api/auth/biometric` accepts `userId`, `deviceId` and returns JWTs; add device attestation before production.

## API routes (prefix `/api`)

- **Auth**: POST `/auth/signup`, `/auth/login`, `/auth/otp/request`, `/auth/otp/verify`, `/auth/refresh`, `/auth/logout`, `/auth/biometric`
- **Users**: GET `/users/:id`, PATCH `/users/:id`, GET `/users` (nearby)
- **Drivers**: POST `/drivers/ride`, GET `/drivers/rides`, PATCH `/drivers/ride/:id`
- **Riders**: GET `/riders/rides`, POST `/riders/rides/:id/bid`, POST `/riders/rides/:id/pay`, POST `/riders/rides/:id/review`
- **Admin**: GET `/admin/dashboard`, PATCH `/admin/kyc/:userId`, GET `/admin/reports`

## Sample requests

```bash
# Signup
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"a@b.com","password":"Password1!","role":"rider"}'

# Email OTP request
curl -X POST http://localhost:4000/api/auth/otp/request -d '{"email":"a@b.com"}' -H "Content-Type: application/json"

# Create ride (driver JWT required)
curl -X POST http://localhost:4000/api/drivers/ride \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"origin":{"coordinates":[-73.9,40.7]},"destination":{"coordinates":[-73.8,40.6]},"seatsAvailable":3,"price":25}'
```

## Testing

- Unit tests live in `/tests` and use Vitest with lightweight mocks (no DB needed). Run `npm test`.

## Docker

```
docker build -t joyride-backend .
docker run -p 4000:4000 --env-file .env joyride-backend
```

## Notes

- Routes are protected via `requireAuth` and role checks where needed.
- Validation uses Zod in `src/validators`.
- Errors standardize to JSON `{ error: { message, details } }` with real HTTP codes.
- GeoJSON fields support `2dsphere` queries for nearby rides/users.

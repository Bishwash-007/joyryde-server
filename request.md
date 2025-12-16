# API cURL Examples

Base URL: `http://localhost:4000/api`
Replace `<TOKEN>` with a valid Bearer JWT, `<REFRESH>` with refresh token, and IDs as needed.

## Auth
- Signup
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password1!","role":"rider"}'
```
- Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password1!"}'
```
- OTP request
```bash
curl -X POST http://localhost:4000/api/auth/otp/request \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```
- OTP verify (login)
```bash
curl -X POST http://localhost:4000/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","code":"123456"}'
```
- Refresh token
```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<REFRESH>"}'
```
- Logout
```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<REFRESH>"}'
```
- Biometric stub
```bash
curl -X POST http://localhost:4000/api/auth/biometric \
  -H "Content-Type: application/json" \
  -d '{"userId":"<USER_ID>","deviceId":"device-123"}'
```

## Users
- Get user
```bash
curl -X GET http://localhost:4000/api/users/<USER_ID> \
  -H "Authorization: Bearer <TOKEN>"
```
- Update user
```bash
curl -X PATCH http://localhost:4000/api/users/<USER_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890"}'
```
- Upload avatar
```bash
curl -X PATCH http://localhost:4000/api/users/<USER_ID>/avatar \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@/path/to/avatar.jpg"
```
- Upload KYC document
```bash
curl -X PATCH http://localhost:4000/api/users/<USER_ID>/kyc \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@/path/to/document.pdf"
```
- Nearby users
```bash
curl -G http://localhost:4000/api/users \
  -H "Authorization: Bearer <TOKEN>" \
  --data-urlencode "lng=-73.9" \
  --data-urlencode "lat=40.7" \
  --data-urlencode "radiusKm=5"
```

## Drivers
- Create ride
```bash
curl -X POST http://localhost:4000/api/drivers/ride \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"origin":{"coordinates":[-73.9,40.7]},"destination":{"coordinates":[-73.8,40.6]},"seatsAvailable":3,"price":25}'
```
- List driver rides
```bash
curl -X GET http://localhost:4000/api/drivers/rides \
  -H "Authorization: Bearer <TOKEN>"
```
- Update ride
```bash
curl -X PATCH http://localhost:4000/api/drivers/ride/<RIDE_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
```

## Riders
- List available rides
```bash
curl -G http://localhost:4000/api/riders/rides \
  -H "Authorization: Bearer <TOKEN>" \
  --data-urlencode "lng=-73.9" \
  --data-urlencode "lat=40.7" \
  --data-urlencode "radiusKm=10"
```
- Place bid
```bash
curl -X POST http://localhost:4000/api/riders/rides/<RIDE_ID>/bid \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"offerPrice":22}'
```
- Pay for ride
```bash
curl -X POST http://localhost:4000/api/riders/rides/<RIDE_ID>/pay \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"paymentMethodId":"pm_123"}'
```
- Leave review
```bash
curl -X POST http://localhost:4000/api/riders/rides/<RIDE_ID>/review \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"rating":5,"comment":"Great ride"}'
```

## Admin
- Dashboard stats
```bash
curl -X GET http://localhost:4000/api/admin/dashboard \
  -H "Authorization: Bearer <TOKEN>"
```
- KYC update
```bash
curl -X PATCH http://localhost:4000/api/admin/kyc/<USER_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved","notes":"Verified"}'
```
- Reports
```bash
curl -X GET http://localhost:4000/api/admin/reports \
  -H "Authorization: Bearer <TOKEN>"
```

## Uploads
- Upload ride photo
```bash
curl -X POST http://localhost:4000/api/uploads/ride \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@/path/to/ride-photo.jpg"
```
- Upload vehicle photo
```bash
curl -X POST http://localhost:4000/api/uploads/vehicle \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@/path/to/vehicle-photo.jpg"
```

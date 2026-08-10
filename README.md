# Employee Attendance & Leave Management

End-to-end mobile application built with **React Native (Expo + TypeScript)** and a **Node.js/Express + MongoDB** REST API.

## Features
- Email/password login with JWT
- Dashboard with employee identity, today's attendance, and leave balance
- GPS check-in/check-out with duplicate check-in prevention
- Offline attendance queue with automatic synchronization
- Leave request validation
- Attendance history filters: 7 days, 30 days, and custom range
- Profile update for phone number and profile picture URL
- Clean folder organization, validation, loading states, and centralized error handling

## Project structure
```
employee-attendance-fullstack/
  mobile/   Expo React Native application
  server/   Express REST API
  postman/  API collection
```

## Prerequisites
- Node.js 20+
- npm 10+
- MongoDB Community Server or MongoDB Atlas
- Expo Go on a phone, or Android Studio/iOS Simulator

## 1. Start the backend
```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```
The API runs at `http://localhost:5000`.

Demo credentials:
- Email: `employee@company.com`
- Password: `Password123`

## 2. Configure the mobile app
```bash
cd mobile
cp .env.example .env
npm install
npx expo start
```

Set `EXPO_PUBLIC_API_URL` in `mobile/.env`:
- iOS Simulator: `http://localhost:5000/api`
- Android Emulator: `http://10.0.2.2:5000/api`
- Physical phone: `http://YOUR_COMPUTER_LAN_IP:5000/api`

Your phone and computer must be on the same Wi-Fi network.

## Main commands
### Server
- `npm run dev` – development server
- `npm run build` – TypeScript build
- `npm start` – run compiled server
- `npm run seed` – create/update demo employee

### Mobile
- `npm start` – Expo development server
- `npm run android` – Android
- `npm run ios` – iOS
- `npm run typecheck` – TypeScript check

## Notes
The project stores a profile picture as a URL for a portable demo. In production, use signed uploads to S3, Cloudinary, or another file store. GPS permission is requested only when checking in or checking out.

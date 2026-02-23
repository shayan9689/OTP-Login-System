# OTP Login System

OTP-based authentication with Node.js/Express backend and React (Vite) frontend. No database or JWT; OTP is stored in memory and expires after 60 seconds.

## Project structure

```
OTP-Login-System/
├── server/                 # Backend (Node.js + Express)
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── routes/
│   │   └── authRoutes.js
│   ├── controllers/
│   │   └── authController.js
│   └── utils/
│       ├── otpStore.js
│       ├── generateOTP.js
│       ├── emailService.js
│       └── validators.js
├── client/                 # Frontend (React + Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/
│       │   └── authApi.js
│       ├── components/
│       │   ├── EmailForm.jsx
│       │   ├── OTPInput.jsx
│       │   └── OTPForm.jsx
│       └── pages/
│           ├── LoginPage.jsx
│           └── LoginPage.css
└── README.md
```

## Prerequisites

- Node.js 18+
- Gmail account with [App Password](https://support.google.com/accounts/answer/185833) (2FA must be enabled)

## Installation

### 1. Backend

```bash
cd server
npm install
```

Copy environment file and set your Gmail credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_gmail_app_password
PORT=5000
```
Do **not** use your normal Gmail password; use an App Password from Google Account → Security → App passwords.

### 2. Frontend

```bash
cd client
npm install
```

For production builds against a different API URL, create `client/.env` (or `.env.production`):

```
VITE_API_URL=http://your-api-host:5000
```

## How to run

### Development (recommended)

**Terminal 1 – backend**

```bash
cd server
npm start
```

Server runs at `http://localhost:5000`.

**Terminal 2 – frontend**

```bash
cd client
npm run dev
```

App runs at `http://localhost:3000` and proxies `/api` to the backend.

### Production

**Backend**

```bash
cd server
npm start
```

**Frontend (build + serve)**

```bash
cd client
npm run build
npm run preview
```

Or serve the `client/dist` folder with any static host. Set `VITE_API_URL` to your backend URL before building if it is not same-origin.

## Deploy on Vercel

The **client** folder can be deployed to [Vercel](https://vercel.com) with the API running as serverless functions on the same project.

1. **Import project**
   - Go to [vercel.com](https://vercel.com) → Add New → Project.
   - Import your Git repository (`OTP-Login-System`).

2. **Configure build**
   - **Root Directory:** set to `client` (so Vercel builds the Vite app and uses `client/api` as API routes).
   - Leave **Framework Preset** as Vite (auto-detected).
   - Build and output are automatic.

3. **Environment variables** (Project → Settings → Environment Variables)
   - **RESEND_API_KEY** – Your [Resend](https://resend.com) API key (for sending OTP emails over HTTPS). Create one at [resend.com/api-keys](https://resend.com/api-keys).

4. **Vercel KV (OTP storage)**
   - In the Vercel project: Storage tab → Create Database → choose **KV** (or connect **Upstash Redis** from the Integrations marketplace).
   - Link the store to your project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically. OTPs are stored in KV with a 60-second TTL.

5. **Deploy**
   - Click Deploy. The app will be at `https://your-project.vercel.app`.  
   - Send OTP and Verify use `/api/send-otp` and `/api/verify-otp` on the same domain.

**Note:** For local development you still run the **server** (Node/Express) and the **client** (Vite) as described above. The Vercel deployment uses only the `client` folder (frontend + serverless API).

## API

| Method | Endpoint      | Body                          | Description        |
|--------|---------------|--------------------------------|--------------------|
| POST   | `/send-otp`   | `{ "email": "user@example.com" }` | Send 6-digit OTP to email |
| POST   | `/verify-otp`| `{ "email": "...", "otp": "123456" }` | Verify OTP and complete login |

- OTP length: 6 digits  
- OTP expiry: 60 seconds  
- OTP is not returned in API responses; it is only sent by email.

## Features

- **Backend:** Express, dotenv, cors, nodemailer, crypto; in-memory OTP store; input validation; proper status codes and error handling.
- **Frontend:** React (functional components + hooks), email step → OTP step → success; 6 separate OTP inputs with auto-focus and backspace; 60s countdown; verify disabled when expired; loading and error states; centered card layout; responsive.

## Security notes

- Do not commit `.env` or real credentials.
- OTP is removed from memory after successful verification or expiry.
- Validate and sanitize all inputs; this app uses basic validation as specified.

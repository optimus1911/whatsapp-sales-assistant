# WhatsApp Sales Assistant

## Run the original project

1. Copy `backend/.env.example` to `.env` in the project root and fill in the values.
2. Start MongoDB and make sure `MONGODB_URI` points to the intended database.
3. From the project root, install dependencies and start the backend:

```bash
npm install
cd backend
npm install
npm start
```

4. In another terminal, from the project root, start the frontend if needed:

```bash
npm run dev
```

The backend health check is `http://localhost:5000/health` and the WhatsApp webhook is `https://<public-host>/api/whatsapp/webhook`.

## WhatsApp configuration

Set `WHATSAPP_API_URL`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, and `WHATSAPP_VERIFY_TOKEN` in the root `.env`. Also set `MONGODB_URI` and `GEMINI_API_KEY`.

In Meta WhatsApp configuration, use the public webhook URL above and the same verify token. Subscribe the webhook to incoming messages. Send a text message from a phone that is allowed by the WhatsApp Business test configuration; the backend stores the message, generates the original Gemini response, and sends it back through WhatsApp.

Real delivery requires valid Meta credentials, a public HTTPS webhook URL, MongoDB, and Gemini access.

## Frontend

The frontend is built with React and Vite.
Run `npm run dev` from the project root to start the frontend development server.

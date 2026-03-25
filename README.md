# bhumiart - Arjun Ecommerce

A full-stack ecommerce application for Lippan Art (Bhumi Art).

## Project Structure
- `client/`: React/Vite frontend
- `server/`: Node.js/Express backend

## Deployment on Render

This repository includes a `render.yaml` file that simplifies deployment for both the frontend and backend.

### Automatic Setup (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Blueprint**.
3. Connect this GitHub repository.
4. Render will automatically detect `render.yaml` and configure both services:
   - `bhumiart-server`: Express Backend.
   - `bhumiart-client`: React/Vite Frontend.

### Manual Setup (If preferred)
#### Client (Static Site)
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**: `VITE_API_BASE_URL` (Set to your backend URL)

#### Server (Web Service)
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: `MONGODB_URI`, `PORT`, `JWT_SECRET`

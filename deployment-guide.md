# Nexus CRM Deployment Guide

## 1. Vercel Frontend Deployment
1. Install Vercel CLI: `npm install -g vercel`.
2. Run `vercel` in the project root.
3. When prompted, select your settings for React/Vite.
4. Set environment variables in Vercel Dashboard:
   - `VITE_API_URL`: Your backend URL (e.g., your Render backend URL)

## 2. Render Backend Deployment
1. Create a Repository for backend on GitHub (or use monorepo setting).
2. On Render, create a new "Web Service".
3. Point to the root directory, set:
   - Build Command: `npm install && npm run build`
   - Start Command: `node server.js` (you may need a build step if using TS server).
4. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas URI.
   - `JWT_SECRET`: A secure random string.
   - `NODE_ENV`: `production`.

## 3. MongoDB Atlas
1. Create an account on MongoDB Atlas.
2. Create a cluster.
3. Get the connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/yourdb?retryWrites=true&w=majority`.
4. Whitelist your Vercel IP (or allow all IPs `0.0.0.0/0` for development).

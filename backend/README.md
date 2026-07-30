# Hanan Data Backend

This is the Node.js backend for the Hanan Data VTU platform, providing APIs for the React Admin Panel and Flutter Customer App.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and update the values.
   ```bash
   cp .env.example .env
   ```
3. Seed the database with mock data:
   ```bash
   node seed/seed.js
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Endpoints

A complete Postman collection is available in the root folder (`HananData-API.postman_collection.json`) to test all available endpoints.

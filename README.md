# Meme Platform API

A Node.js/Express-based meme sharing and bidding platform with real-time features, AI-generated captions, and social voting functionality.

## Features

- **Meme Management**: Create, view, and manage memes with titles, images, and tags
- **Bidding System**: Users can bid credits on memes with real-time updates
- **Voting System**: Upvote/downvote memes with live vote counts
- **Leaderboard**: Top 10 memes ranked by upvotes
- **AI Captions**: Generate funny captions using Google's Gemini AI
- **Database Integration**: Supabase for data persistence

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **AI Service**: Google Gemini 1.5 Flash
- **Real-time**: WebSocket/Socket.io
- **Authentication**: User-based system with owner_id tracking

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd meme-platform
```
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```
4. Start the server:
```bash
npm run start
```

## API Endpoints
- **POST**: /api/memes
- **GET**: /api/memes
- **POST**: /api/memes/:id/vote
- **POST**: /api/memes/:id/bid
- **GET**: /api/memes/leaderboard
- **POST**: /api/memes/:id/caption

## AI Caption Generation
The platform uses Google's Gemini AI to generate funny, contextual captions:
- **Smart Prompting**: Uses meme tags to generate relevant captions.
- **Short & Sweet**: Maximum 10 words per caption for impact.
- **Caching**: Caches generated captions to reduce API calls.
- **Fallback Handling**: Graceful error handling with default captions.

## Error Handling
The API includes comprehensive error handling:
- **400 Bad Request**: Missing required fields
- **404 Not Found**: Meme not found
- **500 Internal Server Error**: Database or AI service errors

## Project Structure
```bash
├── controllers/
│   └── memeController.js    # Main business logic
├── routes/
│   └── memeRoutes.js        # API route definitions
├── services/
│   └── gemini.js            # AI caption service
├── socket/
│   └── index.js             # WebSocket handlers
└── supabase.js              # Database configuration
```

## Running in Development
```bash
npm run start
```

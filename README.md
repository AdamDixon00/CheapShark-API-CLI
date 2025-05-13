# CheapShark-API-CLI

A Node.js Express API server that interacts with the CheapShark API and uses MongoDB Atlas to store search keywords and game selections. The server provides endpoints to search for games, retrieve the cheapest deals, and view search history.

## Features
- Search for games using the CheapShark API
- Retrieve the cheapest deal for a specific game
- Store and retrieve search keywords and selection history in MongoDB Atlas

## Prerequisites
- Node.js (v18 or higher recommended)
- npm
- A MongoDB Atlas account and cluster

## Setup
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd CheapShark-API-CLI
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DB_USER=your_mongodb_user
   DB_PASSWORD=your_mongodb_password
   DB_URL=your_mongodb_url (e.g. cluster0.xxxxx.mongodb.net)
   DB_NAME=your_database_name
   ```

## Running the Server
Start the server with:
```bash
npm start
```
The server will run on port `8888` by default (or the port specified in the `PORT` environment variable).

## API Endpoints

### 1. Search for Games
**GET /games?keyword=your_search_term**
- Returns a list of games matching the keyword.
- Example:
  ```bash
  curl "http://localhost:8888/games?keyword=portal"
  ```
- Response:
  ```json
  [
    { "display": "Portal 2", "identifier": "105" },
    ...
  ]
  ```

### 2. Get Cheapest Deal for a Game
**GET /games/:gameId**
- Returns the cheapest deal for the specified game ID.
- Example:
  ```bash
  curl "http://localhost:8888/games/105"
  ```
- Response:
  ```json
  {
    "name": "Portal 2",
    "gameId": "105",
    "price": "1.99",
    "store": "Steam",
    "dealID": "xyz123"
  }
  ```

### 3. View Search History
**GET /history?type=keywords**
- Returns all previously searched keywords.
- Example:
  ```bash
  curl "http://localhost:8888/history?type=keywords"
  ```

**GET /history?type=selections**
- Returns all previously selected games (by ID).
- Example:
  ```bash
  curl "http://localhost:8888/history?type=selections"
  ```

## Development
- To run the server with auto-reload (using nodemon):
  ```bash
  npm run dev
  ```

## License
MIT

# Trading Economics Data Comparison App

A full-stack application for comparing economic indicators between countries using the Trading Economics API.

## Features

- Compare key economic indicators between two countries
- Interactive charts using Chart.js
- Real-time data from Trading Economics API
- Responsive React-based UI built with Vite
- RESTful Express backend

## Tech Stack

### Frontend
- React
- Vite
- Chart.js
- Axios

### Backend
- Node.js
- Express
- Trading Economics API Client

## Installation

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

## Configuration

Create a `.env` file in the server directory:

```env
TE_API_KEY=your_trading_economics_api_key
```

## Running the Application

```bash
# Start frontend (development)
cd client
npm run dev

# Start backend
cd server
npm start
```

## API Integration

The backend uses the Trading Economics API to fetch economic data:

```javascript
const tradingeconomics = require('tradingeconomics');
tradingeconomics.login(process.env.TE_API_KEY);
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

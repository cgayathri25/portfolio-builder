# MERN Portfolio Builder

An interactive, full-stack web application that allows users to create, customize, and publish professional portfolios. Users can choose themes, manage sections with drag-and-drop functionality, and save their data to the cloud.

## Tech Stack
- **Frontend:** React.js, dnd-kit (Drag & Drop), Axios
- **Backend:** Node.js, Express.js, EJS (View Engine)
- **Database:** MongoDB Atlas
- **Styling:** CSS3

## Architecture
This project uses a **decoupled architecture**:
* **Client (Port 3000):** A React SPA that handles user input and UI state.
* **Server (Port 8000):** A Node/Express API that connects the frontend to the database.
* **Database:** A cloud-hosted MongoDB cluster for persistent storage.

## Project Structure
PORTFOLIO-BUILDER/
├── backend/                  # Server-side logic
│   ├── models/               # Mongoose data schemas (Portfolio.js)
│   ├── routes/               # API endpoint definitions
│   ├── views/                # EJS templates for public rendering
│   ├── .env                  # Environment variables (Database credentials)
│   ├── server.js             # Main server entry point
│   └── package.json          # Backend dependencies
├── frontend/                 # Client-side logic
│   ├── public/               # Static assets (index.html)
│   ├── src/
│   │   ├── components/       # UI Components (Editor/SortableSection.js)
│   │   ├── styles/           # CSS styling (App.css)
│   │   ├── utils/            # Logic helpers (downloadHandler.js)
│   │   ├── api.js            # Axios configuration for backend communication
│   │   ├── App.js            # Main React component
│   │   └── index.js          # React entry point
│   └── package.json          # Frontend dependencies
├── .gitignore                # Files excluded from Version Control
└── README.md                 # Project documentation

## Key Features
- **Drag-and-Drop Editor:** Move sections around seamlessly.
- **Theme Support:** Switch between custom CSS themes like Midnight Onyx.
- **Persistence:** Save your work and access it later via unique URLs.
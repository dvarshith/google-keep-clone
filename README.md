# Google Keep Clone (PERN Stack)

A **Google Keep**-inspired note-taking application built using the **PERN** stack:
- **PostgreSQL**: Database for storing notes
- **Express**: Server framework for handling API routes
- **React**: Front-end UI for creating/viewing/editing notes
- **Node.js**: Runtime environment for running JavaScript on the server side

This clone allows users to create, read, update, and delete notes, closely mirroring key features of Google Keep.

<br/>

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation & Setup](#installation--setup)
5. [Usage](#usage)
6. [Project Structure](#project-structure)
7. [Contributing](#contributing)
8. [License](#license)
9. [Contact](#contact)

<br/>

## Overview
This **Google Keep Clone** is a full-stack web app that showcases how to build a note-taking application with the **PERN** stack. Users can:
- Add new notes (with titles and content)
- Edit existing notes
- Delete notes

<br/>

## Features
- **Create Notes**: Title + content fields
- **Edit Notes**: Update existing note content
- **Delete Notes**: Remove unwanted notes
- **Responsive UI**: Works on both desktop and mobile
- **Authentication**: Bcrypt based and Google Single Sign-On (SSO)

<br/>

## Tech Stack
1. **PostgreSQL**  
   - Relational database for storing note data
2. **Express**  
   - HTTP server framework running on Node.js
3. **React**  
   - Front-end library for building the user interface
4. **Node.js**  
   - JavaScript runtime for server-side logic

<br/>

## Installation & Setup
1. **Clone the Repository**
   ```
   git clone https://github.com/dvarshith/google-keep-clone.git
   cd google-keep-clone
   ```
2. **Create a PostgreSQL Database**
   - Install PostgreSQL.
   - Create a database.
   - Note your Postgres credentials (host, user, password, port).
3. **Backend Setup**
   - Go to the backend folder.
     ```
     cd server
     npm install
     ```
   - Create a `.env` file to store Postgres credentials and any other environment variables:
     ```
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=keep_clone_db
     SERVER_PORT=5000
     ```
   - Initialize your database schema.
   - Start the server:
     ```
     npm run dev
     ```
     By default, the server will run on http://localhost:5000.
4. **Frontend Setup**
   - In another terminal, go to the React front-end folder:
     ```
     cd client
     npm install
     ```
   - Start the React app:
     ```
     npm start
     ```
     The app opens at http://localhost:5173 by default.

<br/>

## Usage
1. **Open the Frontend**: Go to http://localhost:5173.
2. **Create a Note**: Click “Add Note” and fill in title and content.
3. **Edit a Note**: Select a note, modify text, and save.
4. **Delete a Note**: Click the delete icon to remove it from the list.
5. **Database**: Check your PostgreSQL `keep_clone_db` to see note records appear or change.

<br/>

## Project Structure
```
google-keep-clone/
├── server/                 # Express + Node backend
│   ├── db.sql              # Postgres connection/config
│   |── package.json        # backend dependencies
|   └── server.js           # backend code
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Note components, etc.
│   │   ├── pages/          # Routes for handling authentication.
│   │   └── index.js        # index javascript file for frontend using React
│   ├── public/
│   ├── resources/
│   ├── index.html
│   |── package.json
│   └── vite.config.js
├── README.md
├── LICENSE
└── .gitignore
```

<br/>

## Contributing
1. Fork this repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request on GitHub

</br>

## License
This project is released under the `MIT License`. That means you’re free to use, modify, and distribute the code, but you do so at your own risk.

</br>

## Contact
Author: Varshith Dupati </br>
GitHub: @dvarshith </br>
Email: dvarshith942@gmail.com </br>
Issues: Please open an issue on this repo if you have questions or find bugs. </br>

<br/>

Note: This project is for educational/demonstration purposes. It is not affiliated with or endorsed by Google in any way.

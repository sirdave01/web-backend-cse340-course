// learning how to import express and build a web server side that listens to HTTP

import express from 'express';

import { fileURLToPath } from 'url';

import path from 'path';

// after the .env file is created we'll modify the server.js file to use the environment
// variables instead of hardcoding the values

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

const PORT = process.env.PORT || 3000;

// creating the __filename and __dirname variables to be used in the server.js file to get
// the current file name and directory name

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

app.listen(PORT, () => {

    console.log(`Server is running at http://127.0.0.1:${PORT}`);

    console.log(`Environment: ${NODE_ENV}`);
});

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

/**
  * Routes
  */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/home.html'));
});

app.get('/organizations', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/organizations.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/projects.html'));
});
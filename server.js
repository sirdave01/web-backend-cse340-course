// learning how to import express and build a web server side that listens to HTTP

import express from 'express';

import { fileURLToPath } from 'url';

import path from 'path';

import { testConnection } from './src/models/db.js';

import { getAllOrganizations } from './src/models/organizations.js';

// after the .env file is created we'll modify the server.js file to use the environment
// variables instead of hardcoding the values

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

const PORT = process.env.PORT || 3000;

// creating the __filename and __dirname variables to be used in the server.js file to get
// the current file name and directory name

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating Engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

/**
  * Routes
  */

// dynamically populating the page titles

app.get('/', (req, res) => {

    const title = 'Home';

    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {

    const organizations = await getAllOrganizations();

    // console.log('Retrieved organizations:', organizations);

    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
    
});

app.get('/projects', (req, res) => {

    const title = 'Service Projects';

    res.render('projects', { title });
});

app.get('/categories', (req, res) => {

    const title = 'Service Categories';

    res.render('categories', { title });
});

app.listen(PORT, async () => {

  try {

    await testConnection();

    console.log(`Server is running at http://127.0.0.1:${PORT}`);

    console.log(`Environment: ${NODE_ENV}`);

  } catch (error) {

    console.error('Error connecting to the database:', error);

  }

});

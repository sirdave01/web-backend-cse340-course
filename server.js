// learning how to import express and build a web server side that listens to HTTP

import express from 'express';

import { fileURLToPath } from 'url';

import path from 'path';

import { testConnection } from './src/models/db.js';

import { getAllOrganizations } from './src/models/organizations.js';

import { getAllProjects } from './src/models/projects.js';

import { getAllCategories } from './src/models/categories.js';

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

// adding the middleware come after the view engine and views configuration
// because the middleware needs to be set up before the routes are defined,
// and the view engine and views configuration need to be set up before the middleware
// is defined. This is because the middleware will be used to serve static files and handle
// requests, while the view engine and views configuration will be used to render the
// templates for the routes. If the middleware is defined before the view engine and views
// configuration, it may not work properly because it may not have access to the necessary resources.

app.use((req, res, next) => {
  
  if (NODE_ENV === 'development') {

    console.log(`${req.method} ${req.url}`);

  }

  next(); //pass control to the next middleware function or route handler

});

// middleware function to make NODE_ENV available in all EJS templates

app.use((req, res, next) => {

  res.locals.NODE_ENV = NODE_ENV;

  next();
  
});




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

app.get('/projects', async (req, res) => {

  const projects = await getAllProjects();
  
  // console.log('Retrieved projects:', projects);

    const title = 'Service Projects';

    res.render('projects', { title, projects });
});

app.get('/categories', async (req, res) => {

  const categories = await getAllCategories();

  // console.log('Retrieved categories:', categories);

    const title = 'Service Categories';

    res.render('categories', { title, categories });
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

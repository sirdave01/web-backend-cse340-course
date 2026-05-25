// importing all the route controllers functions from the controllers directory for all the pages

import express from 'express';

import { showHomePage } from './controllers/index.js';

import { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm } from './controllers/organizations.js';

import { showProjectsPage, showProjectDetailsPage, showUpcomingProjectsPage } from './controllers/projects.js';

import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

// create the router function to get the pages

const router = express.Router();

// middleware function to make the current year available in all EJS templates

// main routes
router.get('/', showHomePage);

// organizations routes
router.get('/organizations', showOrganizationsPage);
router.get('/organizations/:id', showOrganizationDetailsPage);

// new organization form route
router.get('/new-organization', showNewOrganizationForm);

// POST route for processing the new organization form submission
router.post('/new-organization', processNewOrganizationForm); 

// projects routes
router.get('/projects', showProjectsPage);
router.get('/projects/upcoming', showUpcomingProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// categories routes
router.get('/categories', showCategoriesPage);  
router.get('/categories/:id', showCategoryDetailsPage);

router.get('/test-error', testErrorPage);

export default router;



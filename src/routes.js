// importing all the route controllers functions from the controllers directory for all the pages

import express from 'express';

import { showHomePage } from './controllers/index.js';

import { showOrganizationsPage } from './controllers/organizations.js';

import { showProjectsPage } from './controllers/projects.js';

import { showCategoriesPage } from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

// create the router function to get the pages

const router = express.Router();

// middleware function to make the current year available in all EJS templates

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);

router.get('/projects', showProjectsPage);

router.get('/categories', showCategoriesPage);

router.get('/test-error', testErrorPage);

export default router;



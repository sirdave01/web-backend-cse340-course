// importing all the route controllers functions from the controllers directory for all the pages

import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm,
    organizationValidation, showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';

import {
    showProjectsPage, showProjectDetailsPage, showUpcomingProjectsPage,
    showNewProjectForm, processNewProjectForm, projectValidation,
    showEditProjectForm, processEditProjectForm,
    addVolunteer, removeVolunteer, getUserVolunteeredProjectsController, showVolunteerPage
} from './controllers/projects.js';

import {
    showCategoriesPage, showCategoryDetailsPage,
    showAssignCategoriesForm, processAssignCategoriesForm, 
    showNewCategoryForm, processNewCategoryForm,
    showEditCategoryForm, processEditCategoryForm,
    categoryValidation
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

import {
    showUserRegistrationForm, processUserRegistrationForm,
    userValidation, processLoginForm, processLogout,
    showLoginForm, requireLogin, showDashboard, requireRole, showUsers
} from './controllers/users.js';

// create the router function to get the pages

const router = express.Router();

// middleware function to make the current year available in all EJS templates

// main routes
router.get('/', showHomePage);

// organizations routes
router.get('/organizations', showOrganizationsPage);
router.get('/organizations/:id', showOrganizationDetailsPage);

// Route to display the edit organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);

// new organization form route
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// projects routes
router.get('/projects', showProjectsPage);
router.get('/projects/upcoming', showUpcomingProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Route for new project page
router.get('/new-project', requireRole('admin'), showNewProjectForm);
// Route to handle new project form submission
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

// Route for editing a project
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
// Route to handle the edit project form submission
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// categories routes
router.get('/categories', showCategoriesPage);  
router.get('/categories/:id', showCategoryDetailsPage);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// Routes to handle the new category form
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);

// Routes to handle the edit category form
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

// user registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', userValidation, processUserRegistrationForm, );

// user login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);

// user logout route
router.get('/logout', processLogout);

// router for the user dashboard page, which requires the user to be logged in to access it
router.get('/dashboard', requireLogin, getUserVolunteeredProjectsController, showDashboard);

// router for the users page, which requires the user to be logged in and have the admin role to access it
router.get('/users', requireLogin, requireRole('admin'), showUsers);

// ====================== VOLUNTEER ROUTES ======================

// Volunteer for a project (must be logged in)
router.post('/projects/:id/volunteer', requireLogin, addVolunteer);

// Remove yourself as a volunteer (must be logged in)
router.post('/projects/:id/volunteer/remove', requireLogin, removeVolunteer);

router.get('/projects/:id/volunteer', requireLogin, showVolunteerPage);

router.get('/test-error', testErrorPage);

export default router;



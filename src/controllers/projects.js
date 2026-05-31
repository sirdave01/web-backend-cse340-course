// importing the db handler for projects page

import { getAllProjects, getUpcomingProjects, getProjectDetails, createProject } from '../models/projects.js';

import { getCategoriesByProjectId } from '../models/categories.js';

import { getAllOrganizations } from '../models/organizations.js';

// Defining controller functions for the projects page called showProjectsPage

const showProjectsPage = async (req, res) => {

  // Implementation for showing projects page

    const projects = await getAllProjects();

    const title = 'Service Projects';

    res.render('projects', { title, projects });
    
};

// show upcoming projects page

const showUpcomingProjectsPage = async (req, res) => {

    const number_of_projects = 5; // You can adjust this number as needed

    const upcomingProjects = await getUpcomingProjects(number_of_projects);

    const title = 'Upcoming Service Projects';

    res.render('upcoming-projects', { title, upcomingProjects });

};

// show project details page

const showProjectDetailsPage = async (req, res) => {

    const { id } = req.params;

    console.log(`🔍 Looking for project with ID: ${id}`);

    const project = await getProjectDetails(id);

    const categories = await getCategoriesByProjectId(id);

    console.log(`Project found:`, project);

    if (!project) {
        return res.status(404).render('error', { message: 'Project not found' });
    }

    const title = project.title;

    res.render('project', { title, project, categories });

};

// showNewProjectForm. This function should do the following:
// Call the getAllOrganizations model function to get a list of all organizations from the database.
// Render the new-project view, passing in the page title and the list of organizations to populate the dropdown menu.

const showNewProjectForm = async (req, res) => {

    const organizations = await getAllOrganizations();

    const title = 'Create New Project';

    res.render('new-project', { title, organizations });

};


// processNewProjectForm. This function should do the following:
// Extract the project data (organizationId, title, description, location, date) from the form submission using req.body.
// Call the createProject model function you created in the previous step, passing all of the necessary parameters.
// After the insertion is complete, set a success flash message.
// Redirect the user back to the main service project list page.

const processNewProjectForm = async (req, res) => {

    const { organizationId, title, description, location, date } = req.body;

    try {

        await createProject(organizationId, title, description, location, date);

        req.flash('success', 'Project created successfully!');

        res.redirect('/projects');

    } catch (error) {

        console.error('Error creating project:', error);

        req.flash('error', 'Failed to create project. Please try again.');

        res.redirect('/projects/new');

    }

};


export { showProjectsPage, showUpcomingProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm };

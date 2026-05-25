// importing the db handler for projects page

import { getAllProjects, getUpcomingProjects, getProjectDetails } from '../models/projects.js';

import { getcategoriesByProjectId } from '../models/categories.js';

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

    const project = await getProjectDetails(id);

    const categories = await getcategoriesByProjectId(id);

    if (!project) {
        return res.status(404).render('error', { message: 'Project not found' });
    }

    const title = project.title;

    res.render('project-details', { title, project, categories });

};

export { showProjectsPage, showUpcomingProjectsPage, showProjectDetailsPage };

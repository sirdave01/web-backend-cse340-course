// importing the db handler for projects page

import { getAllProjects } from '../models/projects.js';

// Defining controller functions for the projects page called showProjectsPage

const showProjectsPage = async (req, res) => {

  // Implementation for showing projects page

    const projects = await getAllProjects();
  
  // console.log('Retrieved projects:', projects);

    const title = 'Service Projects';

    res.render('projects', { title, projects });
    
};

// Create a new function getUpcomingProjects(number_of_projects) 
// that will retrieve the next number_of_projects upcoming service projects from the database

const getUpcomingProjects = async (number_of_projects) => {
  // Implementation for retrieving upcoming projects
};

export { showProjectsPage, getUpcomingProjects };

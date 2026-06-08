// this file queries the database for all projects and renders
// the projects page with the retrieved data.

import db from './db.js';

const getAllProjects = async () => {

    const query = `

        SELECT

        p.project_id,

        p.title,

        p.description,

        p.location,

        p.project_date AS date,

        o.name AS organization_name

        FROM projects p
        JOIN organizations o ON p.organization_id = o.organization_id
        ORDER BY p.project_date DESC;
    `;

    const result = await db.query(query);

    return result.rows;

};

// creating a new function for retrieving service projects associated with an organization in it
    
const getProjectsByOrganizationId = async (organizationId) => {

    const query = `

        SELECT

            p.project_id,

            p.title,

            p.description,

            p.location,

            p.project_date AS date

        FROM projects p

        WHERE p.organization_id = $1
        
        ORDER BY p.project_date DESC;

    `;

    const queryParams = [organizationId];

    const result = await db.query(query, queryParams);

    return result.rows;

};

// Create a new function getUpcomingProjects(number_of_projects) 
// that will retrieve the next number_of_projects upcoming service projects from the database

const getUpcomingProjects = async (number_of_projects) => {

    // Implementation for retrieving upcoming projects
    
    const query = `

        SELECT
            p.project_id,

            p.title,

            p.description,

            p.location,

            p.project_date AS date,

            o.name AS organization_name
        
        FROM projects p
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
    `;

    const result = await db.query(query, [number_of_projects]);

    return result.rows;

};

// Create a new function getProjectDetails(id) that will retrieve a single service project by its ID

const getProjectDetails = async (id) => {

    // Implementation for retrieving project details
    
    const query = `

        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date AS date,
            p.organization_id,
            o.name AS organization_name
        FROM projects p
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1
    `;

    const result = await db.query(query, [id]);

    return result.rows[0] || null;

};

// This createProject function will accept the following parameters:
// title, description, location, date, and organizationId.

const createProject = async (title, description, location, date, organizationId) => { 

    // the function will execute an SQL INSERT statement to add a new
    // record to the projects table in the database using the provided parameters
    
    const query = `
        INSERT INTO projects (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id
    `;

    const queryParams = [title, description, location, date, organizationId];

    const result = await db.query(query, queryParams);

    // check if the insert was successful and return the new project ID

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    // check if the process.env is true in the ENABLE_SQL_LOGGING

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    // return the result of the query, which includes the new project ID

    return result.rows[0].project_id;
};

const updateProject = async (projectId, title, description, location, date) => {

    const query = `
      UPDATE projects
      SET title = $1, description = $2, location = $3, project_date = $4
      WHERE project_id = $5
      RETURNING project_id
    `;

    const queryParams = [title, description, location, date, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

// adding the volunteer function that uses two parameters

const volunteerForProject = async (user_id, project_id) => { 
    const query = `
        INSERT INTO volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING volunteer_id;
    `;

    const result = await db.query(query, [user_id, project_id]);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`User ${user_id} volunteered for project ${project_id}`);
    }

    // Return true if inserted, false if already existed
    return result.rows.length > 0;
};


//adding a function that lets volunteers remove thenselves from a project

const removeVolunteerFromProject = async (user_id, project_id) => {
    const query = `
        DELETE FROM volunteers
        WHERE user_id = $1 AND project_id = $2
        RETURNING volunteer_id;
    `;

    const result = await db.query(query, [user_id, project_id]);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`User ${user_id} removed from project ${project_id}`);
    }

    return result.rows.length > 0;   // return whether anything was deleted
};


//check if user has already volunteered for a project

const hasUserVolunteeredForProject = async (user_id, project_id) => {

    const query = `
        SELECT volunteer_id
        FROM volunteers
        WHERE user_id = $1 AND project_id = $2
        LIMIT 1
    `;

    const queryParams = [user_id, project_id];

    const result = await db.query(query, queryParams);

    return result.rows.length > 0;

 };


//pull up and display all projects a user volunteered for

const getUserVolunteeredProjects = async (user_id) => {

    const query = `

        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date AS date,
            p.organization_id,
            o.name AS organization_name
        FROM projects p
        JOIN volunteers v ON p.project_id = v.project_id
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE v.user_id = $1
        ORDER BY p.project_date ASC;
    `;

    const result = await db.query(query, [user_id]);

    return result.rows;

};

export {
    getAllProjects, getProjectsByOrganizationId, getUpcomingProjects,
    getProjectDetails, createProject, updateProject, volunteerForProject,
    removeVolunteerFromProject, hasUserVolunteeredForProject,
    getUserVolunteeredProjects
};
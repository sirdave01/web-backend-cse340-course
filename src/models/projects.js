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
            o.name AS organization_name
        FROM projects p
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1
    `;

    const result = await db.query(query, [id]);

    return result.rows[0] || null;

};

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails };
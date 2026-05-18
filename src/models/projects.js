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

export { getAllProjects, getProjectsByOrganizationId };
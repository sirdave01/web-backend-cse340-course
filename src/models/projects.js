// this file queries the database for all projects and renders
// the projects page with the retrieved data.

import db from './db.js';

const getAllProjects = async () => {

    const query = `
        SELECT project_id, organization_id, title, description, location, project_date
        FROM projects;
    `;

    const result = await db.query(query);

    return result.rows;

};

export { getAllProjects };
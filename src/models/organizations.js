// this file queries the database for all organizations and renders
// the organizations page with the retrieved data.

import db from './db.js';

const getAllOrganizations = async () => {
    
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
    FROM organizations;
    `;

    const result = await db.query(query);

    return result.rows;

};

export { getAllOrganizations };
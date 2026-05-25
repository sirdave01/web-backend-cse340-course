// this file queries the database for all organizations and renders
// the organizations page with the retrieved data.

import db from './db.js';

const getAllOrganizations = async () => {
    
    const query = `

        SELECT

            organization_id,

            name,

            description,

            contact_email,

            logo_filename

        FROM organizations;

    `;

    const result = await db.query(query);

    return result.rows;

};

// creating the new function that will get the organization's details by its id from the database

const getOrganizationDetails = async (organizationId) => {

    const query = `

        SELECT

            organization_id,

            name,

            description,

            contact_email,

            logo_filename

        FROM organizations

        WHERE organization_id = $1;

    `;

    const result = await db.query(query, [organizationId]);

    return result.rows[0] || null;

};

export { getAllOrganizations, getOrganizationDetails };
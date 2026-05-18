// importing the db handler for organizations page

import { getAllOrganizations } from '../models/organizations.js';

// Defining controller functions for the homepage called showOrganizationsPage

const showOrganizationsPage = async (req, res) => {

    // Implementation for showing organizations page
    
    const organizations = await getAllOrganizations();

    // console.log('Retrieved organizations:', organizations);

    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });

};

export { showOrganizationsPage };
// importing the db handler for organizations page

import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

// Defining controller functions for the homepage called showOrganizationsPage

const showOrganizationsPage = async (req, res) => {

    // Implementation for showing organizations page
    
    const organizations = await getAllOrganizations();

    // console.log('Retrieved organizations:', organizations);

    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });

};

// adding a new controller function for showing the details of an organization when its
//  name is clicked on the organizations page

const showOrganizationDetailsPage = async (req, res) => {

    const organizationId = req.params.id;

    const organization = await getOrganizationDetails(organizationId);

    const projects = await getProjectsByOrganizationId(organizationId);

    const title = 'Organization Details';

    res.render('organization', { title, getOrganizationDetails, projects });

};

export { showOrganizationsPage, showOrganizationDetailsPage };
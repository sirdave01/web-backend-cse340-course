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

    const { id } = req.params;
    
    console.log(`🔍 [ORG] Looking for organization ID: ${id}`);

    const organization = await getOrganizationDetails(id);
    const projects = await getProjectsByOrganizationId(id);

    console.log(`✅ [ORG] Organization found:`, organization ? 'YES' : 'NO');
    if (organization) {
        console.log(`   Name: ${organization.name}`);
    }

    if (!organization) {
        console.log(`❌ [ORG] Organization ID ${id} NOT found`);
        return res.status(404).render('error', { 
            message: `Organization with ID ${id} not found` 
        });
    }

    const title = organization.name || 'Organization Details';

    res.render('organization', { title, organization, projects });
};

const showNewOrganizationForm = (req, res) => {

    const title = 'Add New Organization';

    res.render('new-organization', { title });

};

// new controller for processing the POST form submission

const processNewOrganizationForm = async (req, res) => {

    const { name, description, contactEmail } = req.body;

    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);

    res.redirect(`/organization/${organizationId}`);

};

export { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm };
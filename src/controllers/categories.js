// importing the db handler for categories page

import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

// Defining controller functions for the homepage called showCategoriesPage

const showCategoriesPage = async (req, res) => {
    
  // Implementation for showing categories page
  
    const categories = await getAllCategories();

  // console.log('Retrieved categories:', categories);

    const title = 'Service Categories';

    res.render('categories', { title, categories });
    
};

/**
 * show single category details page
 */

const showCategoryDetailsPage = async (req, res) => {

  const { id } = req.params;
  
  const category = await getCategoryById(id);

  const projects = await getProjectsByCategoryId(id);

  /**
  * checking if the category exists, if not render an error page with a 404 status code and a message "Category not found"
  */

  if (!category) {
        return res.status(404).render('error', { 
            message: 'Category not found' 
        });
    }

    const title = category.category_name;

    res.render('category', { 
        title, 
        category, 
        projects 
    });

};
 
// Create a new function showAssignCategoriesForm.
// Get the projectId from the request parameters.
// This function should retrieve the project details using the existing getProjectDetails model function.
// (You will likely need to add this to your list of imports from the project model file).
// It should also retrieve all categories using the existing getAllCategories model function.
// Additionally, it should retrieve the categories currently assigned to the project using the existing
// getCategoriesByServiceProjectId model function. (You will likely need to add this to your list of imports
// from the categories model file.)
// It should set the title variable to be, "Assign Categories to Project"
// Finally, it should render a view assign-categories (to be created in the next step)
// and pass the project details, all categories, and the assigned categories to the view.

const showAssignCategoriesForm = async (req, res) => { 

  const { projectId } = req.params.projectId;

  const project = await getProjectDetails(projectId);

  const categories = await getAllCategories();

  const assignedCategories = await getCategoriesByServiceProjectId(projectId);

  const title = 'Assign Categories to Project';

  res.render('assign-categories', { 
    title, 
    project, 
    categories, 
    assignedCategories 
  });
  
};


// Create a new function processAssignCategoriesForm.
// Get the projectId from the request parameters.
// Get the selected category IDs from the request body.
// (Assume the form field name is categories and it will be an array of selected category IDs.)
// This function should call the updateCategoryAssignments model function you created in the previous step,
// passing in the projectId and the array of selected category IDs. (You will likely need to add this to your
// list of imports from the categories model file.)
// Set a success flash message.
// Redirect the user back to the project details page /project/{projectId}.

const processAssignCategoriesForm = async (req, res) => { };


export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm };

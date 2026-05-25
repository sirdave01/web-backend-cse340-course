// importing the db handler for categories page

import { getAllCategories, getCategoriesByProjectId, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

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

  const categoryId = req.params;
  
  const category = await getCategoryById(categoryId);

  const projects = await getProjectsByCategoryId(categoryId);

  /**
  * checking if the category exists, if not render an error page with a 404 status code and a message "Category not found"
  */

  if (!category) {
        return res.status(404).render('error', { 
            message: 'Category not found' 
        });
    }

    const title = category.category_name;

    res.render('category-details', { 
        title, 
        category, 
        projects 
    });

 };

export { showCategoriesPage, showCategoryDetailsPage };

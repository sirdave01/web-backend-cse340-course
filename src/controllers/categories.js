// importing the db handler for categories page

import { getAllCategories } from '../models/categories.js';

// Defining controller functions for the homepage called showCategoriesPage

const showCategoriesPage = async (req, res) => {
    
  // Implementation for showing categories page
  
    const categories = await getAllCategories();

  // console.log('Retrieved categories:', categories);

    const title = 'Service Categories';

    res.render('categories', { title, categories });
    
};

export { showCategoriesPage };

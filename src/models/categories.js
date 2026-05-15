// this file queries the database for all categories with projects count
//  and renders the categories page with the retrieved data.

import db from './db.js';

/**
 * Get all categories
 * @returns {Promise<Array>} Array of category objects
 */

const getAllCategories = async () => {

    const query = `
        SELECT 
            category_id,
            name AS category_name
        FROM categories
        ORDER BY name ASC;
    `;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching all categories:', error);
        throw new Error('Failed to retrieve categories from database');
    }

};

/**
 * Get a single category by ID
 * @param {number} categoryId 
 * @returns {Promise<Object|null>}
 */

const getCategoryById = async (categoryId) => {
    const query = `
        SELECT 
            category_id,
            name AS category_name
        FROM categories
        WHERE category_id = $1;
    `;

    try {
        const result = await db.query(query, [categoryId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error(`Error fetching category ${categoryId}:`, error);
        throw new Error('Failed to retrieve category');
    }

};

/**
 * Get all categories with the number of projects in each
 * Useful for categories page / dashboard
 * @returns {Promise<Array>}
 */

const getCategoriesWithCount = async () => {
    const query = `
        SELECT 
            c.category_id,
            c.name AS category_name,
            COUNT(pc.project_id) AS project_count
        FROM categories c
        LEFT JOIN project_categories pc ON c.category_id = pc.category_id
        GROUP BY c.category_id, c.name
        ORDER BY c.name ASC;
    `;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching categories with count:', error);
        throw new Error('Failed to retrieve categories with project count');
    }
    
};

export { 
    getAllCategories, 
    getCategoryById, 
    getCategoriesWithCount 
};
import db from './db.js';

// create a function to insert a new user into the database.

const createUser = async (name, email, password_hash) => {

    const default_role = 'user';

    const query = `
        
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE name = $4))
        RETURNING user_id;
    `;

    const queryParams = [name, email, password_hash, default_role];

    const result = await db.query(query, queryParams);

    // check if the results is valid

    if (result.rows.length === 0) {
        throw new Error('user creation failed');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated category with ID:', result.rows[0].category_id);
    }

    return result.rows[0].user_id;
};

export { createUser };
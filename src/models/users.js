import db from './db.js';

const getUserByEmail = async (email) => {
    const query = 'SELECT user_id FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
};

// create a function to insert a new user into the database 
// and verify the same user has not been created before.

const createUser = async (name, email, password_hash) => {

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        throw new Error('Email already in use');
    }

    const default_role = 'user';

    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE roles.role_name = $4))
        RETURNING user_id;
    `;

    const queryParams = [name, email, password_hash, default_role];

    const result = await db.query(query, queryParams);

    // check if the results is valid

    if (result.rows.length === 0) {
        throw new Error('user creation failed');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

export { createUser };
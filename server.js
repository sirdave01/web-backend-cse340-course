// learning how to import express and build a web server side that listens to HTTP

import express from 'express';

// after the .env file is created we'll modify the server.js file to use the environment
// variables instead of hardcoding the values

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const app = express();

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.listen(PORT, () => {

    console.log(`Server is running at http://127.0.0.1:${PORT}`);

    console.log(`Environment: ${NODE_ENV}`);
});
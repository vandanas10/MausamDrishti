const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3300;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(cors());


// MySQL Connection
const db = mysql.createConnection({
    host: process.env.my_host,
    user: process.env.my_user,
    password: process.env.my_password,
    database: process.env.my_database
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL Database');
});

// API endpoint to handle form submission
app.post('/submit', (req, res) => {
    const { name, email, subject, message } = req.body;

    const query = 'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, subject, message], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Message sent successfully!' });
    });
});

// API endpoint to retrieve all submitted messages
app.get('/feedback', (req, res) => {
    const query = 'SELECT * FROM contacts ORDER BY id DESC'; // Retrieve feedback messages

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results); // Send feedback data as JSON to the frontend
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


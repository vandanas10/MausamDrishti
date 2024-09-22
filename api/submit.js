import mysql from 'mysql2';
import Cors from 'cors';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.my_host,
  user: process.env.my_user,
  password: process.env.my_password,
  database: process.env.my_database
});

// Helper function to initialize middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;

    const query = 'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, subject, message], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'Message sent successfully!' });
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

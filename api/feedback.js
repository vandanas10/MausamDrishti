import mysql from 'mysql2';
import Cors from 'cors';

const cors = Cors({
  methods: ['GET'],
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

  if (req.method === 'GET') {
    const query = 'SELECT * FROM contacts ORDER BY id DESC'; // Retrieve feedback messages

    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results); // Send feedback data as JSON to the frontend
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

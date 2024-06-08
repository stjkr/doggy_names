import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  try {
    // Connect to the database
    const client = await pool.connect();

    // Execute the queries
    const breedResult = await client.query('SELECT breed FROM dog_breeds');
    const colorResult = await client.query('SELECT color FROM dog_colors');

    // Get the rows from the query results
    const breeds = breedResult.rows;
    const colors = colorResult.rows;

    // Release the client
    client.release();

    // Return the results as a JSON response
    return res.status(200).json({
      breeds,
      colors,
    });
  } catch (error) {
    console.error('Error executing query', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

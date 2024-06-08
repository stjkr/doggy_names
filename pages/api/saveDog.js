import pg from 'pg';

// Configure the PostgreSQL client
const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(request, response) {
  try {
    const client = await pool.connect();

    const { name, breed, color } = request.body;

    // Check if name is provided
    if (!name) {
      await client.end();
      return response.status(400).json({ error: 'Name is required' });
    }

    // Insert into name_breed table
    const savedBreed = await client.query('INSERT INTO name_breed (name, breed) VALUES ($1, $2) RETURNING *', [name, breed]);

    // Insert into name_color table
    const savedColor = await client.query('INSERT INTO name_color (name, color) VALUES ($1, $2) RETURNING *', [name, color]);
    const result = { breed: savedBreed.rows, color: savedColor.rows };
    await client.end();

    // Return the saved data
    return response.status(200).json(result);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}

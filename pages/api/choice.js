import { Client } from 'pg';

export default async function handler(request, response) {
  try {
    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await client.connect();

    const nameQuery = 'SELECT * FROM dog_names ORDER BY RANDOM() LIMIT 1';
    const breedQuery = 'SELECT * FROM dog_breeds ORDER BY RANDOM() LIMIT 3';
    const colorQuery = 'SELECT * FROM dog_colors ORDER BY RANDOM() LIMIT 3';

    const nameResult = await client.query(nameQuery);
    const breedResult = await client.query(breedQuery);
    const colorResult = await client.query(colorQuery);

    await client.end();

    return response.status(200).json({
      name: nameResult.rows,
      breeds: breedResult.rows,
      color: colorResult.rows,
    });
  } catch (error) {
    console.error('Error executing SQL query:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}

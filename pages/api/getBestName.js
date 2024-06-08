import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  const { breed, color, gender } = req.query;

  if (!breed && !color) {
    return res.status(400).json({ error: 'Breed or color is required' });
  }

  try {
    const client = await pool.connect();

    // Query to find the top 3 names for the given breed
    const breedQuery = `
      SELECT name, COUNT(*) AS count
      FROM name_breed
      WHERE breed = $1
      GROUP BY name
      ORDER BY count DESC
      LIMIT 3;
    `;

    // Query to find the top 3 names for the given color
    const colorQuery = `
      SELECT name, COUNT(*) AS count
      FROM name_color
      WHERE color = $1
      GROUP BY name
      ORDER BY count DESC
      LIMIT 3;
    `;

    const breedResult = await client.query(breedQuery, [breed]);
    const colorResult = await client.query(colorQuery, [color]);

    const topBreedNames = breedResult.rows;
    const topColorNames = colorResult.rows;

    // Function to filter names by gender
    const filterNamesByGender = async (names, gender) => {
      if (!gender || gender === 'U') return names;

      const genderQuery = `
        SELECT name
        FROM dog_names
        WHERE sex = $1 AND name = ANY($2::text[])
      `;

      const genderResult = await client.query(genderQuery, [gender, names.map(n => n.name)]);
      const filteredNames = genderResult.rows.map(row => row.name);

      // If no names found for the specific gender, try to find unisex names
      if (filteredNames.length === 0 && gender !== 'U') {
        const unisexResult = await client.query(genderQuery, ['U', names.map(n => n.name)]);
        return unisexResult.rows.map(row => row.name);
      }

      return filteredNames;
    };

    const breedNamesFiltered = await filterNamesByGender(topBreedNames, gender);
    const colorNamesFiltered = await filterNamesByGender(topColorNames, gender);

    let finalName = null;

    if (breedNamesFiltered.length >= 2) {
      finalName = breedNamesFiltered[0];
    } else if (colorNamesFiltered.length >= 2) {
      finalName = colorNamesFiltered[0];
    } else {
      const combinedResults = [...breedNamesFiltered, ...colorNamesFiltered];
      combinedResults.sort((a, b) => b.count - a.count);
      finalName = combinedResults[0];
    }

    client.release();

    return res.status(200).json({
      topBreedNames: breedNamesFiltered,
      topColorNames: colorNamesFiltered,
      finalName,
    });
  } catch (error) {
    console.error('Error executing query', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

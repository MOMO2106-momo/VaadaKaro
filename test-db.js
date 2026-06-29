const { Client } = require('pg');

async function testConnection() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/postgres';
  console.log(`Testing connection using: ${connectionString.replace(/:([^:@]+)@/, ':****@')}`);
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('SUCCESS: Connection established.');
    
    const res = await client.query('SELECT datname FROM pg_database');
    console.log('DATABASES FOUND:');
    res.rows.forEach(row => console.log(` - ${row.datname}`));
    
    await client.end();
    return;
  } catch (err) {
    console.log(`FAILURE: ${err.message}`);
  }
}

testConnection();

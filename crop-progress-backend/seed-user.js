const bcrypt = require('bcrypt');
const db = require('./db');

async function createDummyAgent() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('agent123', 12);

    // Insert dummy agent user
    const result = await db.query(
      `INSERT INTO users (username, email, password, users_role, phone_number) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING 
       RETURNING *`,
      [
        'agent1',
        'agent1@test.com',
        hashedPassword,
        'field_agent',
        '+1234567890'
      ]
    );

    if (result.rows.length > 0) {
      console.log('✅ Dummy agent created successfully:');
      console.log('Email: agent1@test.com');
      console.log('Password: agent123');
      console.log('Role: field_agent');
      console.log('User ID:', result.rows[0].user_id);
    } else {
      console.log('ℹ️ Agent user already exists');
      console.log('Email: agent1@test.com');
      console.log('Password: agent123');
    }

    // Also create a dummy admin
    const adminResult = await db.query(
      `INSERT INTO users (username, email, password, users_role, phone_number) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING 
       RETURNING *`,
      [
        'admin1',
        'admin1@test.com',
        await bcrypt.hash('admin123', 12),
        'admin',
        '+0987654321'
      ]
    );

    if (adminResult.rows.length > 0) {
      console.log('\n✅ Dummy admin created successfully:');
      console.log('Email: admin1@test.com');
      console.log('Password: admin123');
      console.log('Role: admin');
      console.log('User ID:', adminResult.rows[0].user_id);
    } else {
      console.log('\nℹ️ Admin user already exists');
      console.log('Email: admin1@test.com');
      console.log('Password: admin123');
    }

  } catch (error) {
    console.error('Error creating dummy users:', error);
  } finally {
    await db.end();
  }
}

createDummyAgent();

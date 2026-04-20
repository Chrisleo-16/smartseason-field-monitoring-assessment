const db = require('./db');

async function createDummyFields() {
  try {
    // Create some dummy fields for testing
    const dummyFields = [
      {
        field_name: 'Corn Field North',
        field_location: 'North Farm Section A',
        crop_type: 'Corn',
        planting_date: '2024-03-15',
        harvesting_date: '2024-08-15',
        user_id: 2, // Agent user ID
        insights: 'Corn is growing well, good germination rate observed',
        status_description: 'Healthy growth stage',
        current_stage: 'Growing'
      },
      {
        field_name: 'Wheat Field East',
        field_location: 'East Farm Section B',
        crop_type: 'Wheat',
        planting_date: '2024-02-20',
        harvesting_date: '2024-07-20',
        user_id: 2, // Agent user ID
        insights: 'Wheat showing good signs of development',
        status_description: 'Early growth phase',
        current_stage: 'Planted'
      },
      {
        field_name: 'Tomato Greenhouse 1',
        field_location: 'Greenhouse Complex A',
        crop_type: 'Tomatoes',
        planting_date: '2024-01-10',
        harvesting_date: '2024-04-10',
        user_id: 2, // Agent user ID
        insights: 'Tomatoes are ready for harvest',
        status_description: 'Mature and ready',
        current_stage: 'Ready'
      }
    ];

    for (const field of dummyFields) {
      const computed_status = calculateComputedStatus(field.current_stage, field.harvesting_date);
      
      await db.query(
        `INSERT INTO field_management 
         (field_name, field_location, crop_type, planting_date, harvesting_date, user_id, insights, status_description, current_stage, computed_status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
         ON CONFLICT DO NOTHING`,
        [
          field.field_name,
          field.field_location,
          field.crop_type,
          field.planting_date,
          field.harvesting_date,
          field.user_id,
          field.insights,
          field.status_description,
          field.current_stage,
          computed_status
        ]
      );
      
      console.log(`✅ Created field: ${field.field_name}`);
    }

    console.log('\n🎉 Dummy fields created successfully!');
    console.log('Login as agent1@test.com (password: agent123) to view assigned fields');
    console.log('Login as admin1@test.com (password: admin123) to manage all fields');

  } catch (error) {
    console.error('Error creating dummy fields:', error);
  } finally {
    await db.end();
  }
}

// Helper function to calculate status (copied from field-management.js)
function calculateComputedStatus(stage, harvestingDateStr) {
  if (stage === 'Harvested') return 'Completed';
  
  if (harvestingDateStr) {
    const harvestDate = new Date(harvestingDateStr);
    const today = new Date();
    if (today > harvestDate) return 'At Risk';
  }
  
  return 'Active';
}

createDummyFields();

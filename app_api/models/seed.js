const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Trip = require('./travlr');

const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;

const tripsPath = path.join(__dirname, '..', 'data', 'trips.json');

const seedDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log(`Connected to ${dbURI}`);

    const trips = JSON.parse(fs.readFileSync(tripsPath, 'utf8'));

    await Trip.deleteMany({});
    console.log('Existing trips deleted');

    await Trip.insertMany(trips);
    console.log(`${trips.length} trips inserted successfully`);
  } catch (error) {
    console.error('Database seed error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedDB();

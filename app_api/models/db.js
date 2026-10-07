const mongoose = require('mongoose');

const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;

const connect = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log(`Mongoose connected to ${dbURI}`);
  } catch (error) {
    console.error('Mongoose connection error:', error);
  }
};

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', (error) => {
  console.log(`Mongoose connection error: ${error}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

const gracefulShutdown = async (message) => {
  await mongoose.connection.close();
  console.log(`Mongoose disconnected through ${message}`);
};

// Nodemon restart
process.once('SIGUSR2', async () => {
  await gracefulShutdown('nodemon restart');
  process.kill(process.pid, 'SIGUSR2');
});

// Application termination
process.on('SIGINT', async () => {
  await gracefulShutdown('app termination');
  process.exit(0);
});

// Container termination
process.on('SIGTERM', async () => {
  await gracefulShutdown('app shutdown');
  process.exit(0);
});

// Make initial connection to database
connect();

// Import Mongoose schema
require('./travlr');

require('./user');
module.exports = mongoose;

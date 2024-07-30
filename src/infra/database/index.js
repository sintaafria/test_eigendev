const mongoose = require('mongoose');
const { dbUsername, dbPassword, dbHost, dbName, dbAuthSource } = require('../../config/database');

const connectDB = async () => {
  try {
    const database_url = `mongodb://${dbUsername ? `${dbUsername}:${dbPassword}@` : ""}${dbHost}/${dbName}?authSource=${dbAuthSource}`
    await mongoose.connect(database_url);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
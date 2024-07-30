const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require('./src/infra/database');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

connectDB()

app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
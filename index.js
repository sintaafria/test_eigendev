const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require('./src/infra/database');
const libraryRoutes = require('./src/app/routes/LibraryRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

connectDB()

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
	res.send("<h1>Eigen Dev Test</h1>");
});
app.use('/api', libraryRoutes);

app.use(function(req, res) {
    console.log(res.status)
    res.status(404);
    res.json({ error: 'Not found' });
  });

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
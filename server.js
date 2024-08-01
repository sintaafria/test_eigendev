const express = require('express');
const cors = require("cors");
const libraryRoutes = require('./src/app/routes/LibraryRoutes');
const swagger = require('./src/swagger');

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
	res.send("<h1>Eigen Dev Test</h1>");
});
app.use('/api', libraryRoutes);

swagger(app)

app.use(async function(req, res) {
  res.status(404);
  res.json({ error: 'Not found' });
});

module.exports = app;
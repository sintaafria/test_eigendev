const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require('./src/infra/database');
const libraryRoutes = require('./src/app/routes/LibraryRoutes');
const swagger = require('./src/swagger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB()

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
	res.send("<h1>Eigen Dev Test</h1>");
});
app.use('/api', libraryRoutes);

swagger(app)

app.use(function(req, res) {
    res.status(404);
    res.json({ error: 'Not found' });
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`Swagger available at http://localhost: ${PORT}/api-docs`)
});